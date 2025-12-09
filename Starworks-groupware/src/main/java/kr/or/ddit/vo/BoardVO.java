package kr.or.ddit.vo;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;
import kr.or.ddit.comm.file.FileAttachable;
import kr.or.ddit.comm.validate.UpdateGroup;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.EqualsAndHashCode.Include;
import lombok.ToString;
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
 *  2025. 9. 24.     	장어진	        최초 생성
 *  2025. 9. 26.		임가영			UpdateGroup 추가.
 *  2025. 9. 26. 		홍현택			Inner join 위한 UsersVO users 추가
 *  2025. 9. 27.		임가영			Multipart 데이터를 담을 수 있는 필드 추가 (추후 List 고민)
 *  									FileDetailVO List 를 담을 수 있는 필드 추가
 *  2025. 9. 27.     	장어진	        LocalDate -> LocalDateTime으로 수정
 *  2025.10. 16.		홍현택			fixedYn 고정 여부 추가 (DB 컬럼 반영)
 *
 *
 * </pre>
 */
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class BoardVO implements FileAttachable {

	@Include
	@NotBlank(groups = UpdateGroup.class)
	private String pstId;

	@NotBlank
	private String bbsCtgrCd;

	@NotBlank
	private String pstTtl;
	@NotBlank
	private String contents;
	private Integer viewCnt;

	@NotBlank(groups = UpdateGroup.class)
	private String crtUserId;
	private String delYn;
	private LocalDateTime frstCrtDt;
	private LocalDateTime lastChgDt;
	private String lastChgUserId;
	private String pstFileId;
	private String fixedYn; //  고정 여부 (Y/N) 현택 추가

	private UsersVO users;

	private String userNm;   // 작성자 이름
	private String jbgdNm;   // 직급명
	private String deptNm;   // 부서명

	// 파일 업로드를 위한..
	@JsonIgnore
	@ToString.Exclude
	private List<MultipartFile> fileList;

	@Override
	public List<MultipartFile> getFileList() {
		return this.fileList;
	}

	@Override
	public void setFileId(String fileId) {
		this.pstFileId = fileId;
	}

	public Date getFrstCrtDtAsUtilDate() {
		if (frstCrtDt == null) {
			return null;
		}
		return Date.from(frstCrtDt.atZone(ZoneId.systemDefault()).toInstant());
	}

}
