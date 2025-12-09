package kr.or.ddit.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.MessengerUserVO;
import kr.or.ddit.vo.UsersVO;

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
 *  2025. 10. 14.		김주민			  countRoomUsers, updateLeftTime 추가
 *  2025. 10. 15. 		김주민			  그룹채팅을 위한 insertRoomMembers 추가
 *  2025. 10. 24.		김주민		      채팅방 인원 목록 표시를 위한 selectRoomParticipants 추가
 *
 * </pre>
 */
@Mapper
public interface MessengerUserMapper {

	/**
	 * 특정 채팅방 참여자 목록 조회
	 * @param msgrId
	 * @return
	 */
	public List<UsersVO> selectRoomParticipants(String msgrId);

	/**
	 * 그룹채팅을 위한 다중 참여자 일괄 삽입 메서드
	 * @param msgrId 대화방 ID
	 * @param userIds 참여할 사용자 ID 목록
	 * @return 삽입된 행의 개수
	 */
	public int insertRoomMembers(@Param("msgrId") String msgrId, @Param("userIds") List<String> userIds);

	/**
	 * 채팅방 참여자 수 조회
	 * @param msgrId 대화방 ID
	 * @return
	 */
	public int countRoomUsers(String msgrId);

	/**
	 * 채팅방 퇴장 시간 업데이트
	 * @param userId 사용자 ID
	 * @param msgrId 대화방 ID
	 * @return
	 */
	public int updateLeftTime(@Param("userId") String userId, @Param("msgrId") String msgrId);

	/**
	 * 메신저 참여자 추가
	 * @param mesUser
	 * @return
	 */
	public int insertMessengerUser(MessengerUserVO mesUser);
	/**
	 * 메신저 참여자 목록 조회 (전체내역)
	 * @return
	 */
	public List<MessengerUserVO> selectMessengerUserList();
	/**
	 * 메신저 참여자 상세조회
	 * @param userId
	 * @return
	 */
	public MessengerUserVO selectMessengerUser(String userId);
	/**
	 * 메신저 참여자 삭제
	 * @param userId
	 * @return
	 */
	public int deleteMessengerUser(String userId);
}
