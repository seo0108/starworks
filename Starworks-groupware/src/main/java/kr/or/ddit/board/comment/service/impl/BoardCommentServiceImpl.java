package kr.or.ddit.board.comment.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import kr.or.ddit.board.comment.service.BoardCommentService;
import kr.or.ddit.mybatis.mapper.BoardCommentMapper;
import kr.or.ddit.mybatis.mapper.BoardMapper;
import kr.or.ddit.vo.BoardCommentVO;
import kr.or.ddit.vo.BoardVO;
import kr.or.ddit.websocket.service.impl.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author 임가영
 * @since 2025. 9. 25.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           		수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 25.     	임가영	       		최초 생성
 *	2025. 9. 26.		임가영				readBoardCommentTotalCount() (댓글 수) 구현체 생성 / readBoardCommentDetail() (댓글 상세조회) 메소드 추가
 *	2025. 9. 30.		임가영				readBoardCommentDetail() / readBoardReplyDetail() 구현체 분리
 * </pre>
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class BoardCommentServiceImpl implements BoardCommentService {

	private final BoardCommentMapper mapper;
	@Autowired
	private NotificationServiceImpl notificationService;
	@Autowired
	private BoardMapper boardMapper;

	@Override
	public int readBoardCommentTotalCount(BoardCommentVO boardComment) {
		return mapper.selectBoardCommentTotalCount(boardComment);
	}

	@Override
	public List<BoardCommentVO> readBoardCommentList(String pstId) {
		List<BoardCommentVO> list = mapper.selectBoardCommentList(pstId);
        for (BoardCommentVO c : list) {
            log.info("[댓글번호: {}] 작성자: {}, filePath: {}",
                     c.getCmntSqn(), c.getUsers().getUserNm(), c.getFilePath());
        }
		return mapper.selectBoardCommentList(pstId);
	}

	/**
	 * 댓글 하나에 대한 상세 정보 조회
	 * @param boardCommentVO 댓글 sqn 을 담은 vo
	 * @return 조회 결과 없으면 null
	 */
	@Override
	public BoardCommentVO readBoardCommentDetail(BoardCommentVO boardCommentVO) {
		return mapper.selectBoardCommentDetail(boardCommentVO);
	}

	/**
	 * 대댓글 하나에 대한 상세 정보 조회
	 * @param boardCommentVO 게시물 Id 와 상위 댓글 sqn 을 담은 vo
	 * @return 조회 결과 없으면 null
	 */
	@Override
	public BoardCommentVO readBoardReplyDetail(BoardCommentVO boardCommentVO) {
		return mapper.selectBoardReplyDetail(boardCommentVO);
	}


	@Override
	public boolean createBoardComment(BoardCommentVO boardComment) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String senderId = authentication.getName();
		String receiverId = null;
		String alarmCode = null;

		if (boardComment.getUpCmntSqn() == null) {
			// 댓글이면
			BoardVO board = boardMapper.selectBoard(boardComment.getPstId());
			receiverId = board.getCrtUserId();
			alarmCode = "BOARD_01";

		} else {
			// 대댓글이면
			BoardCommentVO boardUpComment = new BoardCommentVO();
			boardUpComment.setCmntSqn(boardComment.getUpCmntSqn());
			boardUpComment = mapper.selectBoardCommentDetail(boardUpComment);
			receiverId = boardUpComment.getCrtUserId();
			alarmCode = "BOARD_02";
		}

		// 원본 작성자와 댓글 작성자가 같지 않으면 알림 발송
		if (!receiverId.equals(senderId)) {
			Map<String, Object> payload = new HashMap<>();
			payload.put("receiverId", receiverId);
			payload.put("senderId", senderId);
			payload.put("alarmCode", alarmCode);
			payload.put("pk", boardComment.getPstId());

			notificationService.sendNotification(payload);
		}

		return mapper.insertBoardComment(boardComment) > 0;
	}

	@Override
	public boolean modifyBoardComment(BoardCommentVO boardComment) {
		return mapper.updateBoardComment(boardComment) > 0;
	}

	@Override
	public boolean removeBoardComment(int cmntId) {
		return mapper.deleteBoardComment(cmntId) > 0;
	}




}
