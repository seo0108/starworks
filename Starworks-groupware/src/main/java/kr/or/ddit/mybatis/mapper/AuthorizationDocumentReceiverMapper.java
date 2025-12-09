package kr.or.ddit.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.AuthorizationDocumentReceiverVO;

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
public interface AuthorizationDocumentReceiverMapper {
	
	/**
	 * 전자결재 수신자 열람여부 등록 
	 * @param AuthDocumentRec
	 * @return
	 */
	public int insertAuthDocumentReceiver(AuthorizationDocumentReceiverVO AuthDocumentRec);
	/**
	 * 전자결재 수신자 기안서 목록조회
	 * @return
	 */
	public List<AuthorizationDocumentReceiverVO> selectAuthDocumentReceiverList();
	/**
	 * 전자결재 수신사 기안서 상세조회
	 * @param atrzRcvrId
	 * @return
	 */
	public AuthorizationDocumentReceiverVO selectAuthDocumentReceiver(String atrzRcvrId);
}
