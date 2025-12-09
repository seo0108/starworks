package kr.or.ddit.approval.bookmark.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.approval.bookmark.service.CustomLineBookmarkService;
import kr.or.ddit.vo.CustomLineBookmarkVO;
import lombok.RequiredArgsConstructor;

/**
 *
 * @author 윤서현
 * @since 2025. 9. 26.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 26.     	윤서현	          최초 생성
 *  2025.10. 1.			임가영			보완 주석 추가
 * </pre>
 */
@RestController
@RequestMapping("/rest/approval-customline")
@RequiredArgsConstructor
public class CustomLineBookmarkRestController {

	private final CustomLineBookmarkService service;

	/**
	 * 결재선 즐겨찾기 목록 조회. RestController
	 * @return
	 */
	@GetMapping
	public List<CustomLineBookmarkVO> readCustomLineBookmarkList(Principal principal) {
	    String userId = principal.getName(); // 로그인된 사용자 ID
	    return service.readCustomLineBookmarkList(userId);
	}

	/**
	 * 결재선 즐겨찾기 등록. RestController
	 * @param voList
	 * @return
	 */
	@PostMapping
	public boolean createCustomLineBookmark(
		@RequestBody List<CustomLineBookmarkVO> voList
	) {
		//** insert 쿼리에서 에서 APPR_ATRZ_YN(전결권 여부) 넣을 필요 없음
		 for (CustomLineBookmarkVO vo : voList) {
			 service.createCustomLineBookmark(vo);
		}
		 return true;
	}

	/**
	 * 결재선 즐겨찾기 삭제. RestController
	 * @param cstmLineBmSqn
	 * @return
	 */
//	@DeleteMapping("/{cstmLineBmSqn}")
//	public boolean removeCustomLineBookmark(
//		@PathVariable String cstmLineBmSqn
//	) {
//		return service.removeCustomLineBookmark(cstmLineBmSqn);
//	}


	/**
	 * 결재선 즐겨찾기 삭제. RestController
	 * @param cstmLineBmNm
	 * @return
	 */
	@DeleteMapping("/{cstmLineBmNm}")
	public boolean removeCustomLineBookmark(
			@PathVariable String cstmLineBmNm
			) {
		return service.removeCustomLineBookmark(cstmLineBmNm);
	}


}
