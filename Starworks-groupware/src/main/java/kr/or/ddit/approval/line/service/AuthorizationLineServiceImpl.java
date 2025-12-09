package kr.or.ddit.approval.line.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import kr.or.ddit.comm.file.service.impl.FileUploadServiceImpl;
import kr.or.ddit.menu.atrz.service.NewMenuAtrzService;
import kr.or.ddit.mybatis.mapper.AuthorizationDocumentMapper;
import kr.or.ddit.mybatis.mapper.AuthorizationLineMapper;
import kr.or.ddit.mybatis.mapper.VactionMapper;
import kr.or.ddit.vo.AuthorizationDocumentVO;
import kr.or.ddit.vo.AuthorizationLineVO;
import kr.or.ddit.vo.NewMenuAtrzVO;
import kr.or.ddit.vo.VactionVO;
import kr.or.ddit.websocket.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author 윤서현
 * @since 2025. 9. 25.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 25.     	윤서현	         최초 생성
 *  2025. 10. 3.		임가영			 최종 승인 완료되면 pdf 변환 후 DB 에 저장하는 로직 추가
 *  2025. 10. 5. 		홍현택			 결재문서 열람 처리 (미열람 -> 미처리)
 *  2025. 10. 10. 		홍현택			 반려 처리 processRejection 메서드 추가
 *  2025. 10. 10.		임가영			 알림 발송 로직 추가
 * </pre>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthorizationLineServiceImpl implements AuthorizationLineService{

	private final AuthorizationLineMapper mapper;
	private final AuthorizationDocumentMapper docmapper;
	private final NotificationServiceImpl notificationService;
	private final NewMenuAtrzService newMenuAtrzService;
	private final VactionMapper vactionMapper;


	// pdf 파일 변환 후 S3 저장소에 저장 + DB에 저장하기 위한 서비스 (가영추가)
	private final FileUploadServiceImpl fileUploadService;

	@Override
	public boolean createAuthorizationLine(AuthorizationLineVO authLine) {
		return mapper.insertAuthLine(authLine) > 0;
	}

	/**
     * 문서ID로 결재선 전체 조회
     */
    @Override
    public List<AuthorizationLineVO> readAuthorizationLineList(String atrzDocId) {
        return mapper.selectAuthorizationLineList(atrzDocId);
    }


    //=========================신제품 등록 기안서일 경우 NEW_MENU_ATRZ에 자동 insert=========================
    private void autoInsertNewMenuFromHtml(AuthorizationDocumentVO doc) {
        try {
            if (!"ATRZDOC104".equals(doc.getAtrzDocTmplId())) return; // 신제품 등록 기안서만 대상

            String html = doc.getHtmlData();

            NewMenuAtrzVO newMenu = new NewMenuAtrzVO();
            newMenu.setAtrzDocId(doc.getAtrzDocId());
            newMenu.setMenuNm(extractBetween(html, "메뉴명", "카테고리"));
            newMenu.setCategoryNm(extractBetween(html, "카테고리", "출시 예정일"));
            newMenu.setStandardCd(extractBetween(html, "규격", "판매가"));

            // 출시예정일 처리
            String releaseYmd = extractBetween(html, "출시 예정일", "규격");
            if (releaseYmd != null && !releaseYmd.trim().isEmpty()) {
                try {
                    DateTimeFormatter formatter = releaseYmd.contains("/")
                            ? DateTimeFormatter.ofPattern("yyyy/MM/dd")
                            : DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    newMenu.setReleaseYmd(LocalDate.parse(releaseYmd.trim(), formatter));
                } catch (Exception e) {
                    log.warn("출시예정일 파싱 실패 [{}]: {}", releaseYmd, e.getMessage());
                    newMenu.setReleaseYmd(null);
                }
            } else {
                log.info("출시예정일이 비어있음 → null 저장");
                newMenu.setReleaseYmd(null);
            }

            try {
                newMenu.setPriceAmt(Integer.parseInt(extractBetween(html, "판매가", "원가율").replaceAll("[^0-9]", "")));
                newMenu.setCostRatioAmt(Integer.parseInt(extractBetween(html, "원가율", "원재료").replaceAll("[^0-9]", "")));
            } catch (NumberFormatException e) {
                log.warn("가격/원가율 변환 실패: {}", e.getMessage());
            }

            newMenu.setIngredientContent(extractBetween(html, "원재료 및 레시피", "마케팅"));
            newMenu.setMarketingContent(extractBetween(html, "마케팅 및 운영 계획", "</table>"));

            newMenuAtrzService.createNewMenuAtrz(newMenu);

        } catch (Exception e) {
            log.error("[자동등록 실패] 문서ID={}, 예외={}", doc.getAtrzDocId(), e.getMessage());
        }
    }
  //=================신제품 등록 기안서일 경우 NEW_MENU_ATRZ에 자동 insert 끝=======================



  //=========================휴가신청서 기안서일 경우 VACATION 테이블에 자동 insert=========================

    private void autoInsertVacationFromHtml(AuthorizationDocumentVO doc) {
        try {
            if (!"ATRZDOC101".equals(doc.getAtrzDocTmplId())) return; // 휴가신청서 템플릿 ID 확인

            String html = doc.getHtmlData();
            VactionVO vac = new VactionVO();

            //문서ID, 사용자ID 매핑
            vac.setAtrzDocId(doc.getAtrzDocId());
            vac.setVactUserId(doc.getAtrzUserId());

            // ====================== 1️ 휴가 종류 ======================
            String vactType = extractInputValue(html, "휴가종류");
            vac.setVactCd(mapVacationCode(vactType)); // 연차/반차/병가 등 코드 매핑용

            // ====================== 2️ 휴가기간 ======================
            String startDate = extractDateValue(html, 1); // 첫 번째 input[type=date] 시작일
            String endDate   = extractDateValue(html, 2); // 두 번째 input[type=date] 종료일

            //yyyy-MM-dd 포맷으로 문자열 → LocalDate 파싱
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            vac.setVactBgngDt(LocalDateTime.of(LocalDate.parse(startDate, dateFormatter), LocalTime.of(9, 0)));
            vac.setVactEndDt(LocalDateTime.of(LocalDate.parse(endDate, dateFormatter), LocalTime.of(18, 0)));

            // ====================== 3️ 사용일수 ======================
            String useDays = extractInputValue(html, "휴가 사용일").replaceAll("[^0-9]", ""); //숫자만 남기기
            vac.setUseVactCnt(useDays.isEmpty() ? 1 : Integer.parseInt(useDays));

            // ====================== 4️ 휴가사유 ======================
            vac.setVactExpln(extractInputValue(html, "휴가사유"));
            vac.setAllday("N");

            vactionMapper.insertVaction(vac);
            log.info("휴가신청서 자동등록 완료: {}", vac);

        } catch (Exception e) {
            log.error("[휴가신청 자동등록 실패] 문서ID={}, 예외={}", doc.getAtrzDocId(), e.getMessage());
        }
    }

    // ==================== 보조 함수들 ====================

    /** 라벨 텍스트(예: "휴가종류") 근처의 input 값 추출 */
    private String extractInputValue(String html, String label) {
        // "휴가종류"와 가장 가까운 input 태그 value 또는 내부 텍스트 추출
        Pattern pattern = Pattern.compile(label + ".*?<input[^>]*value=\"([^\"]*)\"[^>]*>", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(html);
        if (matcher.find()) return matcher.group(1).trim();

        // value 속성이 없는 경우 innerText 기반
        pattern = Pattern.compile(label + ".*?<input[^>]*>(.*?)</input>", Pattern.DOTALL);
        matcher = pattern.matcher(html);
        if (matcher.find()) return matcher.group(1).trim();


        pattern = Pattern.compile(label + ".*?<span[^>]*class=\"changeInput\"[^>]*>(.*?)</span>", Pattern.DOTALL);
        matcher = pattern.matcher(html);
        if(matcher.find()) return matcher.group(1).trim();


        return "";
    }

    /** n번째 날짜(span/changeInput) 값 추출 */
    private String extractDateValue(String html, int index) {
        // <span class="changeInput">2025-11-04</span> 형식 추출(정규식으로 글자를 뽑아냄)
        Pattern pattern = Pattern.compile("<span[^>]*class=\"changeInput\"[^>]*>([0-9]{4}-[0-9]{2}-[0-9]{2})</span>");
        Matcher matcher = pattern.matcher(html);
        int count = 0;
        while (matcher.find()) {
            count++;
            if (count == index) {
                return matcher.group(1).trim();
            }
        }
        return "";
    }


    /** 휴가 종류 → 코드 매핑 */
    private String mapVacationCode(String name) {
        if (name == null || name.isBlank()) return "E101"; // 기본값: 연차

        name = name.trim();

        if (name.contains("연차")) return "E101";
        if (name.contains("반차")) return "E102";
        if (name.contains("공가")) return "E103";
        if (name.contains("무급")) return "E104";
        if (name.contains("병가")) return "E105";
        if (name.contains("특별")) return "E106";

        return "E101"; // 기본값: 연차
    }


  //=========================휴가신청서 기안서일 경우 VACATION 테이블에 자동 insert 끝=========================







    // ===============================결재 승인 메서드==============================================


    /**
     * 현재 로그인 사용자의 미처리 결재 라인 1건 조회
     * - 조건: ATRZ_APPR_STTS = A301(미열람), A302(미처리)
     * - 본인 차례(가장 앞 순번) 1건만 조회
     */
    @Override
    public AuthorizationLineVO readPendingLineForUser(String docId, String userId) {
        return mapper.selectPendingLineForUser(docId, userId);
    }
	/**
	 * 선행 단계 중 미처리 라인 수 조회
	 * - 현재 라인의 앞 순번들 중 A301/A302가 몇 건 남아있는지 확인
	 * - 0이면 선행 결재 완료 → 내 차례
	 */
    @Override
    public int readPreviousUnapprovedCount(String docId, int lineSeq) {
        return mapper.selectPreviousUnapprovedCount(docId, lineSeq);
    }

    /**
     * 승인 처리 (A401)
     * - 결재자의 행위: 승인(A401)
     * - 결재자 상태: 처리완료(A303), 처리일시(SYSDATE), 의견/서명 업데이트
     * @return true = 정상 승인 처리됨, false = 이미 처리된 라인
     * @Transactional은 롤백 보장하기 위해...
     */
    @Override
    @Transactional
    public boolean modifyApproveLine(String docId, int lineSqn, String opinion, String signFileId) {
        int updated = mapper.updateApproveLine(docId, lineSqn, opinion, signFileId);

        return updated == 1; // 0 이면 이미 처리되었을 가능성
    }


    /**
     * 이후에 남아있는 미처리 라인 존재 여부 확인
     * - 조건: 현재 순번 이후 ATRZ_APPR_STTS(결재자상태) = A301(미열람)/A302(미처리)
     * - 다음 결재 차례가 존재하는지 판단할 때 사용
     */
    @Override
    public boolean readHasNextPending(String docId, int currentSeq) {
        // mapper는 int 반환(0/1 또는 count), 서비스는 boolean으로..
        return mapper.existsNextPending(docId, currentSeq) > 0;
    }


    /**
     * 문서 상태 코드 갱신
     * - AUTHORIZATION_DOCUMENT.CRNT_ATRZ_STEP_CD 업데이트
     * - 서비스 레이어에서 승인/반려/회수/최종승인 등 상태를 결정 후 호출
     */
    @Override
    public void modifyDocumentStatus(String docId, String stepCode) {
        mapper.updateDocumentStatus(docId, stepCode);
    }

    /**
     * 승인 처리 + 문서 상태 자동 갱신
     * - existsNextPending > 0 이면 A203(결재 중), 아니면 A206(최종승인)
     * - 코드값은 DB(COMMON_CODE)에 이미 존재하므로 별도 상수/Enum 없이 직접 사용
     */
    @Override
    @Transactional
    public String modifyApproveAndUpdateStatus(String docId, int lineSqn, int currentSeq, String opinion, String signFileId, String htmlData) {

        // 1) 현재 라인 승인 처리
        int updated = mapper.updateApproveLine(docId, lineSqn, opinion, signFileId);
        if (updated != 1) {
            throw new IllegalStateException("이미 처리되었거나 승인할 수 없는 상태의 결재 라인입니다.");
        }
        // 도장 찍힌 후 htmlData 업데이트 (가영 추가)
        AuthorizationDocumentVO authorizationDocument = new AuthorizationDocumentVO();
        authorizationDocument.setAtrzDocId(docId);
        authorizationDocument.setHtmlData(htmlData);

        docmapper.updateAuthorizationDocument(authorizationDocument);
        //////////////////////////////////////////////////

        // 2) +1로 다음 순번의 결재라인 조회
        AuthorizationLineVO nextLine = mapper.selectNextLineBySeq(docId, currentSeq);

        // 3) 다음 결재라인 존재 여부에 따라 분기
        if (nextLine != null) {
            // 다음 라인이 존재하면, 해당 라인 상태를 '미열람'으로 변경 (null일 때만)
            if (nextLine.getAtrzApprStts() == null) {
                mapper.updateLineStatusToUnread(nextLine.getAtrzDocId(), nextLine.getAtrzLineSqn());

                // ================ '새 결재 요청이 있습니다.' 알림 발송 (가영 추가) ================
                Map<String, Object> payload = new HashMap<>();
                payload.put("receiverId", nextLine.getAtrzApprUserId());
                payload.put("senderId", "system");
                payload.put("alarmCode", "APPROVAL_01");
                payload.put("pk", docId);

                notificationService.sendNotification(payload);
                // =======================================================================
            }

            // 문서 상태를 '결재 중'으로 변경
            mapper.updateDocumentStatus(docId, "A203");

            return "A203";
        } else {
        	AuthorizationDocumentVO vo = docmapper.selectAuthDocument(docId, null );
        	log.info("🟡 자동등록 검사용 템플릿 ID: {}", vo.getAtrzDocTmplId());
            // 다음 라인이 없으면 '최종 승인'
        	mapper.updateDocumentStatus(docId, "A206");

        	//신제품 등록 기안서일 경우 NEW_MENU_ATRZ에 자동 insert
        	autoInsertNewMenuFromHtml(vo);
        	//휴가신청서 등록시 자동 insert
        	autoInsertVacationFromHtml(vo);


            // ================ '결재가 승인되었습니다.' 알림 발송 ================
            Map<String, Object> payload = new HashMap<>();
            payload.put("receiverId", vo.getAtrzUserId());
            payload.put("senderId", "system");
            payload.put("alarmCode", "APPROVAL_02");
            payload.put("pk", docId);

            notificationService.sendNotification(payload);
            // ===========================================================

            // 최종 승인 후 pdf 변환
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // Authentication 객체 가져오기
            AuthorizationDocumentVO adVO = docmapper.selectAuthDocument(docId, authentication.getName());
            fileUploadService.savePdfS3(adVO);
            return "A206";
        }
    }
    /**
     * 전결 처리
     * - 본인 라인 : 전결(A403) + 처리완료(A303)
     * - 이후 라인 : 승인(A401) + 처리완료(A303)
     * - 문서 상태 : 최종승인(A206)
     */
    @Override
    @Transactional
    public void delegateApproval(AuthorizationLineVO line, String htmlData) {
        if (line == null
            || line.getAtrzDocId() == null
            || line.getAtrzApprUserId() == null
            || line.getAtrzLineSqn() == null) {
            throw new IllegalArgumentException("전결 처리 파라미터가 올바르지 않습니다.");
        }

        // 1) 본인 라인 전결(A403) + 처리완료(A303)

        int updatedSelf = mapper.updateLineForDelegation(line);
        if (updatedSelf == 0) {
            // WHERE ATRZ_STTS = 'A302' 조건 맞지 않을시
            throw new IllegalStateException("전결 처리할 수 있는 라인이 없습니다.");
        }

        // 도장 찍힌 후 htmlData 업데이트 (가영 추가)
        AuthorizationDocumentVO authorizationDocument = new AuthorizationDocumentVO();
        authorizationDocument.setAtrzDocId(line.getAtrzDocId());
        authorizationDocument.setHtmlData(htmlData);

        docmapper.updateAuthorizationDocument(authorizationDocument);
        //////////////////////////////////////////////////

        log.debug("delegateApproval: 본인 라인 전결 처리 = {}", updatedSelf);

        // 2) 이후 라인 승인(A401) + 처리완료(A303)
        int updatedNext = mapper.updateSubsequentLinesAsDelegated(
                line.getAtrzDocId(),
                line.getAtrzLineSqn()
        );
        log.debug("delegateApproval: 이후 라인 승인 처리 = {}", updatedNext);

        // 3) 문서 상태 최종승인(A206)
        int docUpd = docmapper.updateDocumentStatus(line.getAtrzDocId(), "A206");

      	//신제품 등록 기안서일 경우 NEW_MENU_ATRZ에 자동 insert
        AuthorizationDocumentVO doc = docmapper.selectAuthDocument(line.getAtrzDocId(), null);
    	autoInsertNewMenuFromHtml(doc);
    	//휴가신청 기안서일경우
    	autoInsertVacationFromHtml(doc);

        // ========================== '결재가 승인되었습니다.' 알림 발송 (가영 추가) ============================
        AuthorizationDocumentVO nodifyAdVO = docmapper.selectAuthDocument(line.getAtrzDocId(), null);
        Map<String, Object> payload = new HashMap<>();
        payload.put("receiverId", nodifyAdVO.getAtrzUserId());
        payload.put("senderId", "system");
        payload.put("alarmCode", "APPROVAL_02");
        payload.put("pk", nodifyAdVO.getAtrzDocId());

        notificationService.sendNotification(payload);
        // ===========================================================================================

        // 최종 승인 후 pdf 변환
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // Authentication 객체 가져오기
        AuthorizationDocumentVO adVO = docmapper.selectAuthDocument(line.getAtrzDocId(), authentication.getName());
        fileUploadService.savePdfS3(adVO);
        log.debug("delegateApproval: 문서 상태 최종승인 처리 = {}", docUpd);
    }

    // 결재문서 열람 처리 (미열람 -> 미처리)
    @Override
    public boolean markAsRead(String docId, int lineSqn) {
        int updated = mapper.updateLineStatusToUnprocessed(docId, lineSqn);
        return updated == 1;
    }

	@Override
	@Transactional
	public void processRejection(String docId, int lineSqn, String opinion) {
		// 1. 결재선 상태를 '반려'로 변경
		int updated = mapper.updateRejectLine(docId, lineSqn, opinion);
        if (updated != 1) {
            throw new IllegalStateException("이미 처리되었거나 반려할 수 없는 상태의 결재 라인입니다.");
        }

        // ================ '결재가 반려되었습니다.' 알림 발송 (가영 추가) ================
        AuthorizationDocumentVO nodifyAdVO = docmapper.selectAuthDocument(docId, null);
        Map<String, Object> payload = new HashMap<>();
        payload.put("receiverId", nodifyAdVO.getAtrzUserId());
        payload.put("senderId", "system");
        payload.put("alarmCode", "APPROVAL_03");
        payload.put("pk", docId);

        notificationService.sendNotification(payload);
        // =====================================================================

		// 2. 문서 전체 상태를 '반려'로 변경
		docmapper.updateDocumentStatus(docId, "A204");
	}


	private String extractBetween(String html, String startkey, String endkey) {
		if(html == null) return "";
		int start = html.indexOf(startkey);
		if (start == -1) return "";
		int spanStart = html.indexOf("<span" ,start);
		int spanEnd = html.indexOf("</span>",spanStart);
		if(spanStart == -1 || spanEnd == -1) return"";
		return html.substring(spanStart, spanEnd)
								.replaceAll(".*>", "")
								.trim();
	}


}