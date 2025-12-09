package kr.or.ddit.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.FileDetailVO;

/**
 * 
 * @author 장어진
 * @since 2025. 9. 25.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 25.     	장어진	          최초 생성
 *  2025. 9. 26.     	장어진	          주석 내용 추가
 *  2025.10. 10.     	장어진	          파일 삭제 메소드 추가 (soft delete)
 *
 * </pre>
 */
@Mapper
public interface FileDetailMapper {
	/**
	 * 파일 상세 목록 조회
	 * @return 조회 결과 없으면 list.size() == 0
	 */
	public List<FileDetailVO> selectFileDetailList(String fileId);
	
	/**
	 * 파일 상세 단건 조회
	 * @param fileId : File ID
	 * @param fileSeq : File 순번 (파일 ID 내 몇 번째 파일인지)
	 * @return 조회 결과 없을 시 null
	 */
	public FileDetailVO selectFileDetail(Integer fileSeq);
	
	/**
	 * S3 다운로드용 파일 상세 단건 조회
	 * @param saveName
	 * @return saveFileNm 에 해당하는 파일 상세 정보 
	 */
	public FileDetailVO selectFileDetailS3(String saveFileNm);
	
	/**
	 * 파일 상세 추가
	 * @param fd : File Detail VO 객체
	 * @return 성공 시 1, 실패 시 0
	 */
	public int insertFileDetail(FileDetailVO fdVO);
	
	/**
	 * 파일 상세 삭제 (파일 ID 내 여러 파일 중 하나 삭제)
	 * @param fd : File Detail VO 객체
	 * @return 성공 시 1, 실패 시 0
	 */
	public int deleteFileDetail(String fileId, Integer fileSeq);
	
	/**
	 * 파일 상세 복구 (파일 ID 내 여러 파일 중 하나 복구)
	 * @param fd : File Detail VO 객체
	 * @return 성공 시 1, 실패 시 0
	 */
	public int restoreFileDetail(FileDetailVO fdVO);
}
