package kr.or.ddit.approval.temp.service;

import java.util.List;

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
public interface AuthorizationTempService {

	/** 전자결재 임시저장에서 목록 조회
	 * @return
	 */
	public List<AuthorizationTempVO> readAuthTempList();
	
	/** 전자결재 임시저장에서 상세조회
	 * @param atrzTempSqn
	 */
	public AuthorizationTempVO readAuthTemp(String atrzTempSqn);
	
	/**
	 * 기안문 임시저장
	 * @param authLine
	 * @return
	 */
	public boolean createAuthorizationTemp(AuthorizationTempVO authTemp);
	
	/**
	 * 기안문 임시저장 결재시 삭제
	 * @param atrzTempSqn
	 */
	public int deleteAuthTemp(String atrzTempSqn);
	
}
