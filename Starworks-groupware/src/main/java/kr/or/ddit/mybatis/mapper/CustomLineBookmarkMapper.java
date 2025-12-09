package kr.or.ddit.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

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
@Mapper
public interface CustomLineBookmarkMapper {

	/**
	 * 결재선 즐겨찾기 등록
	 * @param custLineBookmark
	 * @return
	 */
	public int insertCustomLineBookmark(CustomLineBookmarkVO custLineBookmark);
	/**
	 * 결재선 즐겨찾기 목록 조회
	 * @return
	 */
	public List<CustomLineBookmarkVO> selectCustomLineBookmarkList(String userId);
	/**
	 * 결재선 즐겨찾기 삭제
	 * @param cstmLineBmSqn
	 * @return
	 */
	public int deleteCustomLineBookmark(String cstmLineBmSqn);
	
}
