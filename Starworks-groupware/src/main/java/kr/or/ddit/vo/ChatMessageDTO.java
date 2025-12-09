package kr.or.ddit.vo;

import java.util.Date;

import lombok.Data;

/**
 * WebSocket 실시간 전송용 DTO
 * (기존 MessengerContentVO는 DB용, 이건 WebSocket 통신용)
 * @author 김주민
 * @since 2025. 10. 14.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 10. 14.     	김주민	          최초 생성
 *
 * </pre>
 */
@Data
public class ChatMessageDTO {
	private String msgContId; //메시지ID
	private String msgrId; //대화방 ID
	private String userId; //보낸 사람 ID
	private String userNm; //보낸 사람 이름
	private String contents; //메시지 내용
	private Date sendDt; //전송시간
	private MessageType type; //메시지 타입
	private String userImgFileId; //보낸 사람 프로필 이미지
	private int unreadCount;
	private String userFilePath; //클라이언트에서 사용하는 파일 경로
	private String jbgdNm; //직급
	private String deptNm; //부서

	public enum MessageType {
		CHAT,	//일반 채팅
		JOIN,	//입장 "OOO 님이 입장했습니다."
		LEAVE,	//퇴장 "OOO 님이 퇴장했습니다."
		FILE	//파일 첨부
	}

	public ChatMessageDTO() {
		this.sendDt = new Date();
		this.type = MessageType.CHAT;
	}

}
