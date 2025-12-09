package kr.or.ddit.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.MessengerRoomVO;

/**
 *
 * @author 윤서현
 * @since 2025. 9. 26.
 * @see
 *
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 *  2025. 9. 26.     	윤서현	          최초 생성
 *  2025. 10. 14. 		김주민			  selectMyRooms, findPrivateRoom, markRoomMessagesAsRead 추가
 *  2025. 10. 15.		김주민			  채팅방 이름 수정 updateMessengerRoomName 추가
 *
 * </pre>
 */
@Mapper
public interface MessengerRoomMapper {

	/**
	 * 채팅방 이름 수정
	 * @param msgrId 대화방 ID
	 * @param msgrNm 대화방 명
	 * @return UPDATE된 레코드 수
	 */
	public int updateMessengerRoomName(@Param("msgrId") String msgrId, @Param("msgrNm") String msgrNm);

	/**
	 * 읽음 처리 메서드
	 *  - 특정 채팅방의 모든 읽지 않은 메시지에 대해 MESSENGER_READ 기록 추가.
	 * @param msgrId 채팅방 ID
	 * @param userId 사용자 ID
	 * @return INSERT된 레코드 수
	 */
	public int markRoomMessagesAsRead(@Param("msgrId") String msgrId, @Param("userId") String userId);

	/**
	 * 내가 참여 중인 채팅방 목록 조회
	 * @param userId
	 * @return
	 */
	public List<MessengerRoomVO> selectMyRooms(String userId);

	/**
	 * 1:1 채팅방 찾기
	 * @param userId1
	 * @param userId2
	 * @return
	 */
	public MessengerRoomVO findPrivateRoom(@Param("userId1") String userId1, @Param("userId2") String userId2);

	/**
	 * 메신저 대화방 추가
	 * @param mesRoom
	 * @return
	 */
	public int insertMessengerRoom(MessengerRoomVO mesRoom);
	/**
	 * 메신저 대화방 목록 조회
	 * @return
	 */
	public List<MessengerRoomVO> selectMessengerRoomList();
	/**
	 * 메신저 대화방 상세조회
	 * @param msgrId
	 * @return
	 */
	public MessengerRoomVO selectMessengerRoom(String msgrId);
	/**
	 * 메신저 대화방 삭제
	 * @param msgrId
	 * @return
	 */
	public int deleteMessengerRoom(String msgrId);

}
