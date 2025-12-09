package kr.or.ddit.vo;

import java.util.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;
import kr.or.ddit.comm.file.FileAttachable;
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
 *  2025. 9. 24.     	장어진	          최초 생성
 *  2025. 9. 27.     	장어진	          LocalDate -> LocalDateTime으로 수정
 *	2025. 9. 30.		임가영			파일 업로드를 위한 필드와 setter 메소드 추가
 *	2025. 10. 14.		김주민			채팅 기능 구현을 위한 userNm,userImgFileId 추가
 * </pre>
 */
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MessengerContentVO implements FileAttachable {

	@Include
	@NotBlank
	private String msgContId;

	@NotBlank
	private String userId;

	@NotBlank
	private String msgrId;
	private String readYn;
	private String contents;
	private Date sendDt;
	private String delYn;
	private String msgFileId;

	// MyBatis 쿼리 결과(u.USER_NM)를 담기 위한 필드
	private String userNm;

	private int unreadCount; // 안 읽은 사람 수를 담을 필드

	// 사용자 프로필 이미지를 위한 필드
	private String userImgFileId;
	private String userFilePath;
	private String jbgdNm; //직급 필드
	private String deptNm; //부서 필드

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
		this.msgFileId = fileId;
	}
}
