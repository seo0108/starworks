package kr.or.ddit.mypage.service;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.vo.UsersVO;

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
public interface MyPageService {

	void updateUserInfo(String userId, UsersVO updatedUser, MultipartFile fileList);
}
