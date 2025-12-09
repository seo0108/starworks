package kr.or.ddit.vo;

import java.time.LocalDateTime;
import java.util.Date;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.EqualsAndHashCode.Include;
/**
 *
 * @author 장어진
 * @since 2025. 9. 24.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 24.     	장어진	          최초 생성
 *  2025. 9. 27.     	장어진	          LocalDate -> LocalDateTime으로 수정
 *  2025. 10. 15. 		김주민			  LocalDateTime -> Date 수정 그리고 필드 추가
 *
 * </pre>
 */
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MessengerRoomVO {

	@Include
	@NotBlank
	private String msgrId;

	@NotBlank
	private String msgrNm;
	private Date crtDt;
	private String delYn;

	private String partnerFilePath;
	private String partnerDeptNm; //부서명
    private String partnerJbgdNm; //직급명


	private String lastMsgCont; // 최신 메시지 내용
	private Date lastMsgDt; // 최신 메시지 발송 시간

    private int unreadCount; // 읽지 않은 메시지 수
    private Integer memberCount; //참여자 수

    private int participantCount;
}
