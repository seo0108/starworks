package kr.or.ddit.approval.bookmark.service;

import java.util.List;

import kr.or.ddit.vo.CustomLineBookmarkVO;

/**
 *
 * @author 윤서현
 * @since 2025. 9. 25.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 25.     	윤서현	          최초 생성
 *
 * </pre>
 */
public interface CustomLineBookmarkService {

	/**
	 * 결재선 즐겨찾기 등록
	 * @param custLineBookmark
	 * @return
	 */
	public boolean createCustomLineBookmark(CustomLineBookmarkVO custLineBookmark);
	/**
	 * 결재선 즐겨찾기 목록 조회
	 * @return
	 */
	public List<CustomLineBookmarkVO> readCustomLineBookmarkList(String userId);
	/**
	 * 결재선 즐겨찾기 삭제
	 * @param cstmLineBmSqn
	 * @return
	 */
	//public boolean removeCustomLineBookmark(String cstmLineBmSqn);
	public boolean removeCustomLineBookmark(String cstmLineBmNm);
}
