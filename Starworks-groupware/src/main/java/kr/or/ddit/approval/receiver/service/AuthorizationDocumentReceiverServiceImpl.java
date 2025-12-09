package kr.or.ddit.approval.receiver.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.ddit.comm.exception.EntityNotFoundException;
import kr.or.ddit.mybatis.mapper.AuthorizationDocumentReceiverMapper;
import kr.or.ddit.vo.AuthorizationDocumentReceiverVO;
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
public class AuthorizationDocumentReceiverServiceImpl implements AuthorizationDocumentReceiverService{

	private final AuthorizationDocumentReceiverMapper mapper;

	@Override
	public boolean createAuthDocumentReceiver(AuthorizationDocumentReceiverVO authDocumentReceiver) {
		return mapper.insertAuthDocumentReceiver(authDocumentReceiver) > 0;
	}

	@Override
	public List<AuthorizationDocumentReceiverVO> readAuthDocumentReceiverList() {
		return mapper.selectAuthDocumentReceiverList();
	}

	@Override
	public AuthorizationDocumentReceiverVO readAuthDocumentReceiver(String atrzRcvrId) {
		AuthorizationDocumentReceiverVO authDocumentReceiver = mapper.selectAuthDocumentReceiver(atrzRcvrId);
		if(authDocumentReceiver == null) {
			throw new EntityNotFoundException(authDocumentReceiver);
		}
		return authDocumentReceiver;
	}
	
	
	
}
