package kr.or.ddit.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.AuthorizationTempVO;

/**
 * 
 * @author 윤서현
 * @since 2025. 10. 6.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 10. 6.     	윤서현	          최초 생성
 *
 * </pre>
 */
@Mapper
public interface AuthorizationTempMapper {

	/**
	 * 전자결재 임시저장에서 목록 조회
	 * @return
	 */
	public List<AuthorizationTempVO> selectAuthTempList(String loginId);
	
	/** 전자결재 임시저장에서 상세조회
	 * @param atrzTempSqn
	 */
	public AuthorizationTempVO selectAuthTemp(@Param("atrzTempSqn") String atrzTempSqn);
	
	/** 전자결재 임시저장함에 저장
	 * @param authTemp
	 */
	public int insertAuthorizationTemp(AuthorizationTempVO authTemp);
	
	/** 전자결재 임시저장함에서 결재시 삭제
	 * @param atrzTempSqn
	 */
	public int deleteAuthTemp(String atrzTempSqn);
	
}
