package kr.or.ddit.mybatis.mapper;

import org.apache.ibatis.annotations.Mapper;

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
@Mapper
public interface MyPageMapper {

	int updateUserInfo(UsersVO user);
}
