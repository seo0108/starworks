package kr.or.ddit.board.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.board.community.service.BoardService;
import kr.or.ddit.vo.BoardVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author 임가영
 * @since 2025. 9. 26.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자              수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 26.     	임가영	        최초 생성
 *  2025. 9. 27.		임가영			updateViewCnt(조회수 증가) 메소드 추가
 *
 * </pre>
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class BoardRestController {

	private final BoardService service;

	////////////////////////////////공지사항 ////////////////////////////////
	/**
	 * 공지사항 다건 조회 non-paging 추가해야함
	 * @return
	 */
	@GetMapping("/rest/board-notice")
	public List<BoardVO> readNoticeListNonPaging() {
		return service.readNoticeList(null);
	}


	@GetMapping("/rest/board-notice/dashBoard")
	public List<BoardVO> readNotice(){
		return service.readNotices();
	}

	////////////////////////////////자유게시판 ////////////////////////////////
	/**
	 * 사내 커뮤니티 전체 조회. RestController
	 * @return
	 */
//	@GetMapping("/rest/board-community")
//	public List<BoardVO> readCommunityListNonPaging() {
//		return service.readCommunityListNonPaging();
//	}

	/**
	 * 사내 커뮤니티 카테고리 조회. RestController
	 * @param BbsCtgrCd 카테고리 공통 코드.
	 * F102	동호회
	 * F103 경조사
	 * F104	사내활동
	 * F105	건의사항
	 * F106 기타
	 * @return 조회 결과 없으면 list.size() == 0.
	 */
//	@GetMapping("/rest/board-community/{bbsCtgrCd}")
//	public List<BoardVO> readcommunityListCategoryNonPaging(@PathVariable String bbsCtgrCd) {
//		return service.readcommunityListCategoryNonPaging(bbsCtgrCd);
//	}

	/**
	 * 게시글 단건 조회
	 * @param pstId
	 * @return 조회 결과 없으면 EntityNotFoundException 발생
	 */
//	@GetMapping("/rest/board/{pstId}")
//	public BoardVO readBoard(@PathVariable String pstId) {
//		return service.readBoard(pstId);
//	}

	////////////////////////////////////////////////////////////////////////
	/**
	 * 조회수 증가
	 * @param pstId 게시물 Id
	 * @return
	 */
	@PutMapping("/rest/board-vct/{pstId}")
	public void modifyViewCnt(@PathVariable String pstId) {
		int cnt = service.modifyViewCnt(pstId);
		if(cnt<1) {

		}
	}
}
