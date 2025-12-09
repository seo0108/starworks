package kr.or.ddit.approval.receiver.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.approval.receiver.service.AuthorizationDocumentReceiverService;
import kr.or.ddit.vo.AuthorizationDocumentReceiverVO;
import lombok.RequiredArgsConstructor;

/**
 * 
 * @author 임가영
 * @since 2025. 9. 26.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 26.     	임가영	       최초 생성
 *
 * </pre>
 */
@RestController
@RequestMapping("/rest/approval-receiver")
@RequiredArgsConstructor
public class AuthorizationDocumentReceiverRestController {
	
	private final AuthorizationDocumentReceiverService service;
	
	/**
	 * 전자결재 수신자 기안서 목록조회. RestController
	 * @return
	 */
	@GetMapping
	public List<AuthorizationDocumentReceiverVO> readAuthDocumentReceiverList() {
		return service.readAuthDocumentReceiverList();
	}
	
	/**
	 * 전자결재 수신자 기안서 상세조회. RestController
	 * @param atrzRcvrId 수신자 id
	 * @return
	 */
	@GetMapping("/{atrzRcvrId}")
	public AuthorizationDocumentReceiverVO readAuthDocumentReceiver(@PathVariable String atrzRcvrId) {
		return service.readAuthDocumentReceiver(atrzRcvrId);
	}

}
