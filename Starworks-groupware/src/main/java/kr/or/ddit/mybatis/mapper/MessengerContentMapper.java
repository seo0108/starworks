package kr.or.ddit.mybatis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.MessengerContentVO;

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
 *  2025. 10. 14. 		김주민			  selectMessengerContentByRoomId 추가
 *
 * </pre>
 */
@Mapper
public interface MessengerContentMapper {
	/**
	 * 특정 채팅방의 메시지 목록 조회 (사용자 이름 조인)
	 * @param msgrId 대화방 ID
	 * @return
	 */
	public List<MessengerContentVO> selectMessengerContentByRoomId(@Param("msgrId") String msgrId, @Param("userId") String userId);

	/**
	 * 메시지 읽음 처리
	 * @param msgContId 메시지 ID
	 * @return
	 */
	public int updateReadStatus(String msgContId);

	/**
	 * 메신저 대화 추가
	 * @param mesContent
	 * @return
	 */
	public int insertMessengerContent(MessengerContentVO mesContent);
	/**
	 * 메신저 대화 목록 조회
	 * @return
	 */
	public List<MessengerContentVO> selectMessengerContentList();
	/**
	 * 메신저 대화 삭제
	 * @param msgContId
	 * @return
	 */
	public int deleteMessengerContent(String msgContId);
}
