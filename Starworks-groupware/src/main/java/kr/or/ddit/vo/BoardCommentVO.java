package kr.or.ddit.vo;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import kr.or.ddit.comm.validate.InsertGroupNotDefault;
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
 *	2025. 9. 29.		임가영			  users 필드 추가 / 검증 그룹 추가
 *
 * </pre>
 */
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class BoardCommentVO {

	@NotBlank(groups = InsertGroupNotDefault.class)
	private String pstId;

	@Include
	@NotBlank
	private int cmntSqn;

	private Integer upCmntSqn;

	@NotBlank(groups = InsertGroupNotDefault.class)
	private String contents;
	private String delYn;

	@NotBlank
	private String crtUserId;
	private LocalDateTime frstCrtDt;
	private LocalDateTime lastChgDt;
	private String lastChgUserId;

	private UsersVO users;

	private String filePath;

	public java.util.Date getFrstCrtDtAsUtilDate() {
		if (frstCrtDt == null) {
			return null;
		}
		return java.util.Date.from(frstCrtDt.atZone(java.time.ZoneId.systemDefault()).toInstant());
	}
}
