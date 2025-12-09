package kr.or.ddit.vo;

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
 *
 * </pre>
 */
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CustomLineBookmarkVO {

	@Include
	@NotBlank
	private Integer cstmLineBmSqn;

	@NotBlank
	private String userId;
	private String cstmLineBmNm;
	private Integer atrzLineSeq;
	private String atrzApprId;
	private String apprAtrzYn;

	private String userNm;
	private String deptNm;
	private String jbgdNm;

	private String filePath;
}
