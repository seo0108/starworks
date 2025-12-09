package kr.or.ddit.approval.bookmark.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.mybatis.mapper.CustomLineBookmarkMapper;
import kr.or.ddit.vo.CustomLineBookmarkVO;
import lombok.RequiredArgsConstructor;

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
@Service
@RequiredArgsConstructor
@Transactional
public class CustomLineBookmarkServiceImpl implements CustomLineBookmarkService{

	private final CustomLineBookmarkMapper mapper;

	@Override
	public boolean createCustomLineBookmark(CustomLineBookmarkVO custLineBookmark) {
		return mapper.insertCustomLineBookmark(custLineBookmark) > 0;
	}

	@Override
	public List<CustomLineBookmarkVO> readCustomLineBookmarkList(String userId) {
		return mapper.selectCustomLineBookmarkList(userId);
	}

	/*
	 * @Override public boolean removeCustomLineBookmark(String cstmLineBmSqn) {
	 * return mapper.deleteCustomLineBookmark(cstmLineBmSqn) > 0; }
	 */
	@Override
	public boolean removeCustomLineBookmark(String cstmLineBmNm) {
		return mapper.deleteCustomLineBookmark(cstmLineBmNm) > 0;
	}

}
