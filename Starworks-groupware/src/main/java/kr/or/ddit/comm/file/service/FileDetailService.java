package kr.or.ddit.comm.file.service;

import java.util.List;
import java.util.Map;

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
 *   수정일      			수정자           		수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 25.     	장어진	          최초 생성
 *  2025. 9. 26.     	장어진	          주석 내용 추가
 *  2025. 9. 30.		임가영			readFileDetailS3 메소드 추가
 * </pre>
 */
public interface FileDetailService {
	
	/**
	 * 파일 상세 목록 조회.
	 * @return 조회 결과 없으면 list.size() == 0
	 */
	public List<FileDetailVO> readFileDetailList(String fileId);
	
	/**
	 * 파일 상세 단건 조회.
	 * @param fileId : File ID
	 * @param fileSeq : File 순번 (파일 ID 내 몇 번째 파일인지)
	 * @return 조회 결과 없으면 EntityNotFoundException
	 */
	public FileDetailVO readFileDetail(Integer fileSeq);
	
	/**
	 * S3 다운로드를 위해 파일 상세 단건 조회. (키생성)
	 * @param fileSeq
	 * @return 폴더명 / 파일이름 추출한 key 와 원본 파일명이 들어있는 map
	 */
	public Map<String, Object> readFileDetailS3(String saveName);
	
	/**
	 * 파일 상세 추가
	 * @param fd : File Detail VO 객체
	 * @return 성공 시 true, 실패 시 false
	 */
	public boolean createFileDetail(FileDetailVO fd);
	
	/**
	 * 파일 상세 삭제 (soft delete)
	 * @param fileId : 파일 ID
	 * @param fileSeq : 파일 시퀀스 
	 * @return 성공 시 true, 실패 시 false
	 */
	public boolean removeFileDetail(String fileId, Integer fileSeq);
}
