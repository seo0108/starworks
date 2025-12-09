package kr.or.ddit.websocket.service;

import java.util.List;

import kr.or.ddit.vo.MessengerContentVO;
import kr.or.ddit.vo.MessengerRoomVO;
import kr.or.ddit.vo.UsersVO;

/**
 *
 * @author 김주민
 * @since 2025. 10. 14.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 10. 14.     	김주민	          최초 생성
 *  2025. 10. 15.		김주민			  그룹 채팅방 생성 createGroupRoom, updateRoomName 추가
 *  2025. 10. 24.		김주민			  채팅방 참여자 목록 조회 getRoomParticipants 추가
 *
 * </pre>
 */
public interface ChatService {

	/**
	 * 특정 채팅방 참여자 목록 조회
	 * @param msgrId
	 * @return
	 */
	public List<UsersVO> getRoomParticipants(String msgrId);


	/**
	 * 특정 채팅방의 현재 참여자 수를 조회한다. (LEFT_DT가 없는 사용자만 카운트)
	 * @param msgrId 채팅방 ID
	 * @return 현재 참여자 수
	 */
	public int getRoomParticipantCount(String msgrId);

	/**
	 * 대화방 이름 수정
	 * @param msgrId 대화방 ID
	 * @param msgrNm 대화방 명
	 */
	public void updateRoomName(String msgrId, String msgrNm);

	/**
	 * 그룹 채팅방 생성
	 * @param userIds 참여할 사용자 ID 목록
	 * @param msgrNm 채팅방 이름
	 * @return 생성된 채팅방 정보
	 */
	public MessengerRoomVO createGroupRoom(List<String> userIds, String msgrNm);
	public void markAllAsRead(String msgrId, String userId);

	/**
     * 내 채팅방 목록 조회
     */
    public List<MessengerRoomVO> getMyRooms(String userId);

    /**
     * 채팅방 메시지 내역 조회
     */
    public List<MessengerContentVO> getRoomMessages(String msgrId, String userId);

    /**
     * 1:1 채팅방 찾기 또는 생성
     */
    public MessengerRoomVO findOrCreatePrivateRoom(String userId1, String userId2);

    /**
     * 메시지 저장
     */
    public void saveMessage(MessengerContentVO message);

    /**
     * 퇴장 시간 업데이트
     */
    public void updateLeftTime(String userId, String msgrId);

    /**
     * 메시지 읽음 처리
     */
    public void markAsRead(String msgContId);
}
