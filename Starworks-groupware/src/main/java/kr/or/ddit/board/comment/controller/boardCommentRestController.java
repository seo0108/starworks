package kr.or.ddit.board.comment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import kr.or.ddit.board.comment.service.BoardCommentService;
import kr.or.ddit.comm.validate.InsertGroupNotDefault;
import kr.or.ddit.vo.BoardCommentVO;
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
 *   수정일      			수정자            수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 26.     	임가영	        최초 생성
 *  2025. 9. 30.		임가영			removeComment(댓글 삭제) 메소드 추가
 * </pre>
 */
@RestController
@RequestMapping("/rest/board-comment/{pstId}")
@RequiredArgsConstructor
public class boardCommentRestController {

	private final BoardCommentService service;
	
	/**
	 * 게시물 하나에 대한 모든 댓글 조회. RestController
	 * @param pstId 게시물 Id
	 * @return 조회 결과 없으면 list.size() == 0.
	 */
	@GetMapping
	public List<BoardCommentVO> readBoardCommentList(@PathVariable String pstId) {
		return service.readBoardCommentList(pstId);
	}
	
	/**
	 * 게시물에 대댓글 작성
	 * @param boardComment 작성 내용이 들어있는 vo
	 * @param pstId 게시물 Id
	 * @return 성공 여부가 담긴 Map
	 */
	@PostMapping
	public Map<String, Object> createBoardComment(
			@Validated(InsertGroupNotDefault.class) @RequestBody BoardCommentVO boardComment,
			@PathVariable String pstId,
			@RequestParam(required = false) Integer upCmntSqn,
			Authentication authentication
	) {
		boardComment.setUpCmntSqn(upCmntSqn);
		boardComment.setCrtUserId(authentication.getName());
		boolean success = service.createBoardComment(boardComment);
		
		// 등록한 대댓글 정보 가져오기
		boardComment = service.readBoardReplyDetail(boardComment);
		
		Map<String, Object> respMap = new HashMap<>();
		respMap.put("success", success);
		respMap.put("boardComment", boardComment);
		return respMap;
	}
	
	/**
	 * 게시물 댓글, 대댓글 삭제
	 * @param pstId 게시물 Id
	 * @param cmntSqn 해당 댓글 cmntSqn
	 * @return 성공 여부와 삭제한 데이터 정보를 담은 vo
	 */
	@DeleteMapping
	public Map<String, Object> removeBoardComment(
		@PathVariable String pstId,
		@RequestParam(required = true) Integer cmntSqn
	){
		boolean success = service.removeBoardComment(cmntSqn);
		
		// 삭제한 대댓글 정보 가져오기
		BoardCommentVO boardComment = new BoardCommentVO();
		boardComment.setCmntSqn(cmntSqn);
		boardComment = service.readBoardCommentDetail(boardComment);
		
		Map<String, Object> respMap = new HashMap<>();
		respMap.put("success", success);
		respMap.put("boardComment", boardComment);
		return respMap;
	}
}
