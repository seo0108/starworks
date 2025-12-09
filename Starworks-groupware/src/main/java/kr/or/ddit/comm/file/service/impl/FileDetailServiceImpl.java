package kr.or.ddit.comm.file.service.impl;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import kr.or.ddit.comm.exception.EntityNotFoundException;
import kr.or.ddit.comm.file.service.FileDetailService;
import kr.or.ddit.mybatis.mapper.FileDetailMapper;
import kr.or.ddit.vo.FileDetailVO;
import lombok.RequiredArgsConstructor;
/**
 * 
 * @author 장어진
 * @since 2025. 9. 26.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 26.     	장어진	          최초 생성
 *	2025. 9. 30.		임가영			readFileDetailS3 구현체 추가
 * </pre>
 */
@Service
@RequiredArgsConstructor
public class FileDetailServiceImpl implements FileDetailService{
	
	private final FileDetailMapper mapper;
	
	@Override
	public List<FileDetailVO> readFileDetailList(String fileId) {
		return mapper.selectFileDetailList(fileId);
	}

	@Override
	public FileDetailVO readFileDetail(Integer fileSeq) {
		FileDetailVO vo = mapper.selectFileDetail(fileSeq);
		if (vo == null) {
			Map<String, Integer> fileDetail = new HashMap<String, Integer>();
			fileDetail.put("fileSeq", fileSeq);
			throw new EntityNotFoundException(fileDetail);
		}
		return vo;
	}

	@Override
	public boolean createFileDetail(FileDetailVO fd) {
		return mapper.insertFileDetail(fd) > 0;
	}

	/**
	 * S3 다운로드용 파일 단건 조회 (키 생성)
	 */
	@Override
	public Map<String, Object> readFileDetailS3(String saveFileNm) {
		FileDetailVO fileDetail = mapper.selectFileDetailS3(saveFileNm);
		String filePath = fileDetail.getFilePath();
		
		URI uri = URI.create(filePath); // URI 객체 생성
		
		String path = uri.getPath(); // 경로 추출 (amazonaws.com/ 이후부터)
		
		String keyString = path.startsWith("/") ? path.substring(1) : path;
		
		Map<String, Object> respMap = new HashMap<>();
		respMap.put("key", keyString);
		respMap.put("orgnFileNm", fileDetail.getOrgnFileNm());
		
		return respMap;
	}

	@Override
	public boolean removeFileDetail(String fileId, Integer fileSeq) {
		return mapper.deleteFileDetail(fileId, fileSeq) > 0;
	}	
}
