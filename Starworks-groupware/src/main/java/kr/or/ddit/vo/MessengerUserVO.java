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
 *
 * </pre>
 */
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MessengerUserVO {

	@Include
	@NotBlank
	private String userId; //사용자 ID

	@Include
	@NotBlank
	private String msgrId; //대화방 ID

	@NotBlank
	private Date joinDt; //참여 시각
	private String leftDt; //나간 시각
}
