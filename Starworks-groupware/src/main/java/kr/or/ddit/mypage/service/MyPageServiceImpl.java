package kr.or.ddit.mypage.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.comm.file.FileFolderType;
import kr.or.ddit.comm.file.service.impl.FileUploadServiceImpl;
import kr.or.ddit.mybatis.mapper.MyPageMapper;
import kr.or.ddit.vo.UsersVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author 윤서현
 * @since 2025. 10. 14.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 10. 14.     	윤서현	          최초 생성
 *
 * </pre>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MyPageServiceImpl implements MyPageService{

	private final MyPageMapper mapper;
	private final FileUploadServiceImpl fileService;

	/**
	 * 마이페이지 정보 수정
	 */
	@Override
	public void updateUserInfo(String userId, UsersVO updatedUser, MultipartFile fileList) {
		// 여기에서 userId 또 세팅하는 이유는?
		updatedUser.setUserId(userId);

		// 사용자 프로필 업데이트 진행
		if (fileList != null && !fileList.isEmpty()) {
		    updatedUser.setFileList(List.of(fileList));
		    fileService.saveFileS3(updatedUser, FileFolderType.PROFILE.toString());
		    updatedUser.setUserImgFileId(updatedUser.getUserImgFileId()); // 기존 fileId 그대로 유지
		}
		// 사용자 정보 업데이트 진행
	    int updateRows = mapper.updateUserInfo(updatedUser);

	    log.info("사용자 정보 업데이트 완료 (수정된 행 수: {})", updateRows);
	}

}
