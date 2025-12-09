package kr.or.ddit.websocket.service.impl;

import java.util.Map;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import kr.or.ddit.alarm.log.service.AlarmLogService;
import kr.or.ddit.alarm.template.service.AlarmTemplateService;
import kr.or.ddit.mybatis.mapper.AuthorizationDocumentMapper;
import kr.or.ddit.mybatis.mapper.BoardMapper;
import kr.or.ddit.mybatis.mapper.EmailContentMapper;
import kr.or.ddit.mybatis.mapper.MainTaskMapper;
import kr.or.ddit.mybatis.mapper.ProjectMapper;
import kr.or.ddit.vo.AlarmLogVO;
import kr.or.ddit.vo.AlarmTemplateVO;
import kr.or.ddit.vo.AuthorizationDocumentVO;
import kr.or.ddit.vo.BoardVO;
import kr.or.ddit.vo.EmailContentVO;
import kr.or.ddit.vo.MainTaskVO;
import kr.or.ddit.vo.ProjectVO;
import kr.or.ddit.websocket.dto.NotificationTemplate;
import lombok.RequiredArgsConstructor;

/**
 * 알림 전송 서비스
 * @author 임가영
 * @since 2025. 10. 7.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 10. 7.     	임가영	       최초 생성
 *
 * </pre>
 */
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl {

	private final SimpMessagingTemplate messagingTemplate;
	private final AlarmLogService alarmLogService;
	private final AlarmTemplateService alarmTemplateService;
	private final AuthorizationDocumentMapper approvalMapper;
	private final ProjectMapper projMapper;
	private final MainTaskMapper taskMapper;
	private final BoardMapper boardMapper;
	private final EmailContentMapper emailmapper;

	public void sendNotification(Map<String, Object> payload) {
	    String receiverId = (String) payload.get("receiverId"); // 수신자
	    String senderId = (String) payload.get("senderId"); // 발신자
	    String alarmCode = (String) payload.get("alarmCode"); // 알림 템플릿 코드
	    String customMessage = (String) payload.get("customMessage"); // 알림 커스텀 메시지
	    String pk = (String) payload.get("pk");

	    String template;
	    String finalMessage;
	    String alarmCategory;
	    String relatedUrl;

	    if (alarmCode != null && !alarmCode.isEmpty()) {
	    	// db에서 알림 템플릿 찾기
	    	AlarmTemplateVO alarmTemplate = alarmTemplateService.readAlarmTemplate(alarmCode);
	    	template = alarmTemplate.getAlarmMessage();
	    	alarmCategory = alarmTemplate.getAlarmCategory();
	    	relatedUrl = alarmTemplate.getRelatedUrl();

	    	finalMessage = finalMessage(alarmTemplate, senderId, pk);
	    	relatedUrl = relatedUrl(alarmTemplate, senderId, pk);
	    } else {
	    	finalMessage = customMessage;
	    	template = "새로운 알림이 도착했습니다.";
	    	alarmCategory = null;
	    	relatedUrl = "#";
	    }

	    // 알림 로그 DB insert
	    AlarmLogVO alarmLog = new AlarmLogVO();
	    alarmLog.setReceiverId(receiverId);
	    alarmLog.setSenderId(senderId);
	    alarmLog.setAlarmCode(alarmCode);
	    alarmLog.setAlarmMessage(finalMessage);
	    alarmLog.setAlarmCategory(alarmCategory);
	    alarmLog.setRelatedUrl(relatedUrl);
	    alarmLogService.createAlarmLog(alarmLog);

		messagingTemplate.convertAndSend(
			"/topic/notify/" + receiverId,
			new NotificationTemplate(receiverId, senderId, alarmCode, template, finalMessage, alarmCategory, relatedUrl)
			// 수신자Id, 발신자Id, 알림코드, 템플릿(toastify용), 진짜메시지, 알림카테고리(icon용), 바로가기Url
		);
	}

	/**
	 * 최종 알림 내용 결정
	 * @param alarmTemplate 알림 템플릿 정보
	 * @param senderId 발신자 Id
	 * @param pk 알림 대상 pk
	 * @return
	 */
	private String finalMessage(AlarmTemplateVO alarmTemplate, String senderId, String pk) {
		String finalMessage = "";
		String template = alarmTemplate.getAlarmMessage();
		String alarmCode = alarmTemplate.getAlarmCode();

		if(alarmCode.contains("APPROVAL")) {
			// [결재문서제목] 결재가 승인되었습니다.
			// [결재문서제목] 결재가 반려되었습니다.
			AuthorizationDocumentVO adVO = approvalMapper.selectAuthDocument(pk, senderId);
			finalMessage = template + "<br/><p class=\"notification-subtitle text-sm\">" + adVO.getAtrzDocTtl() + "</p>";

		} else if (alarmCode.contains("PROJ")) {
			// [프로젝트이름] 프로젝트의 새 업무가 배정되었습니다.
			ProjectVO pVO = projMapper.selectProject(pk);
			finalMessage = template + "<br/><p class=\"notification-subtitle text-sm\">" + pVO.getBizNm() + "</p>";

		} else if (alarmCode.contains("TASK")) {
			// [업무이름] 마감일이 다가옵니다.
			// [업무이름] 업무에 코멘트가 달렸습니다.
			MainTaskVO mtVO = taskMapper.selectMainTask(pk);
			finalMessage = template + "<br/><p class=\"notification-subtitle text-sm\">" + mtVO.getTaskNm() + "</p>";

		} else if (alarmCode.contains("BOARD")) {
			// [게시물제목] 게시글에 새 댓글이 작성되었습니다.
			// [게시물제목] 게시글에 답글이 달렸습니다.
			BoardVO bVO = boardMapper.selectBoard(pk);
			finalMessage = template + "<br/><p class=\"notification-subtitle text-sm\">" + bVO.getPstTtl() + "</p>";

		} else if (alarmCode.contains("MAIL")) {
			// [메일제목] 메일이 도착했습니다.
			EmailContentVO emVO =emailmapper.selectEmailContent(pk);
			finalMessage = template + "<br/><p class=\"notification-subtitle text-sm\">" + emVO.getSubject() + "</p>";
		}

		return finalMessage;
	}

	/**
	 * 알림 바로가기 Url
	 * @param alarmTemplate 알림 템플릿 정보
	 * @param senderId 발신자 Id
	 * @param pk 알림 대상 pk
	 * @return
	 */
	private String relatedUrl(AlarmTemplateVO alarmTemplate, String senderId, String pk) {
		String relatedUrl = alarmTemplate.getRelatedUrl();
		String alarmCode = alarmTemplate.getAlarmCode();

		if(alarmCode.contains("APPROVAL")) {
			AuthorizationDocumentVO adVO = approvalMapper.selectAuthDocument(pk, senderId);
				relatedUrl = relatedUrl + "/detail/" + adVO.getAtrzDocId();

		} else if (alarmCode.contains("PROJ")) {
			ProjectVO pVO = projMapper.selectProject(pk);
			relatedUrl = relatedUrl + "/" + pVO.getBizId();

		} else if(alarmCode.contains("TASK")) {
			MainTaskVO mtVO = taskMapper.selectMainTask(pk);
			relatedUrl = relatedUrl + "/" + mtVO.getBizId();

		} else if (alarmCode.contains("BOARD")) {
			BoardVO bVO = boardMapper.selectBoard(pk);
			relatedUrl = relatedUrl + "/" + bVO.getPstId();

		} else if (alarmCode.contains("MAIL")) {
			EmailContentVO emVO = emailmapper.selectEmailContent(pk);
			relatedUrl = relatedUrl + "/detail/" + emVO.getEmailContId();
		}

		return relatedUrl;
	}
}
