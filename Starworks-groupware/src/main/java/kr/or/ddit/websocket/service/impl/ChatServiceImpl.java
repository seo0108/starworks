package kr.or.ddit.websocket.service.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.ddit.mybatis.mapper.MessengerContentMapper;
import kr.or.ddit.mybatis.mapper.MessengerReadMapper;
import kr.or.ddit.mybatis.mapper.MessengerRoomMapper;
import kr.or.ddit.mybatis.mapper.MessengerUserMapper;
import kr.or.ddit.mybatis.mapper.UsersMapper;
import kr.or.ddit.vo.MessengerContentVO;
import kr.or.ddit.vo.MessengerRoomVO;
import kr.or.ddit.vo.MessengerUserVO;
import kr.or.ddit.vo.UsersVO;
import kr.or.ddit.websocket.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
 *  2025. 10. 14.     	김주민	          최초 생성(코드보완필요)
 *
 * </pre>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService{

	private final MessengerRoomMapper roomMapper;
    private final MessengerUserMapper userMapper;
    private final MessengerContentMapper contentMapper;
    private final UsersMapper usersMapper;
    private final MessengerReadMapper readMapper;

	/**
	 * 그룹 채팅방을 생성하고 참여자를 등록한다.
	 */
	@Override
	@Transactional
	public MessengerRoomVO createGroupRoom(List<String> userIds, String msgrNm) {

		MessengerRoomVO roomVO = new MessengerRoomVO();

		if(msgrNm == null || msgrNm.trim().isEmpty()) {
			// 그룹 채팅방명이 없을 경우 기본 이름 설정
			roomVO.setMsgrNm("새 그룹 채팅방");
		}else {
			roomVO.setMsgrNm(msgrNm);
		}

		//채팅방 생성
		int result = roomMapper.insertMessengerRoom(roomVO);

		if(result != 1 || roomVO.getMsgrId() == null) {
			log.error("채팅방 생성 실패 : 테이블 삽입 오류");
			throw new RuntimeException("채팅방 생성에 실패했습니다.");
		}

		String msgrId = roomVO.getMsgrId(); //대화방 ID

		// 채팅방 참여자 등록
		int memInsertCnt = userMapper.insertRoomMembers(msgrId, userIds);
		if (memInsertCnt != userIds.size()) {
			log.error("채팅방 참여자 등록 실패: 삽입된 멤버 수 불일치 (기대: {}, 실제: {})",
                    userIds.size(), memInsertCnt);
			// 참여자 수 불일치 시 @Transactional에 의해 자동 롤백
			throw new RuntimeException("채팅방 참여자 등록 중 오류가 발생했습니다.");
		}

		return roomVO;
	}

    /**
     * 내 채팅방 목록 조회
     */
    @Override
    public List<MessengerRoomVO> getMyRooms(String userId) {
    	log.info("내 채팅방 목록 조회 - userId: {}", userId);
        List<MessengerRoomVO> rooms = roomMapper.selectMyRooms(userId);

        // 1:1 채팅방 이름 갱신 로직
        for (MessengerRoomVO room : rooms) {
            String roomName = room.getMsgrNm();

            if (roomName != null && roomName.contains(",") && roomName.contains(userId)) {
                // ID 목록에서 현재 사용자 제외한 상대방 ID 찾기 (수정 필요)
                String partnerId = java.util.Arrays.stream(roomName.split(","))
                                            .map(String::trim)
                                            .filter(id -> !id.equals(userId))
                                            .findFirst()
                                            .orElse(null);

                //상대방 이름 조회 및 갱신
                if (partnerId != null) {
                    String partnerName = findUserNmByUserId(partnerId); // 구현한 보조 메서드 사용
                    room.setMsgrNm(partnerName);
                }
            }
        }

        return rooms;
    }

    /**
     * 채팅방 메시지 내역 조회
     */
    @Override
    public List<MessengerContentVO> getRoomMessages(String msgrId, String userId) {
        log.info("채팅방 메시지 조회 - msgrId: {}", msgrId);
        return contentMapper.selectMessengerContentByRoomId(msgrId, userId);
    }

    /**
     * 1:1 채팅방 찾기 또는 생성
     */
    @Override
    @Transactional
    public MessengerRoomVO findOrCreatePrivateRoom(String userId1, String userId2) {
        log.info("1:1 채팅방 찾기 또는 생성 - user1: {}, user2: {}", userId1, userId2);

        // 상대방 ID 식별
        String partnerId = userId2;

        // 기존 채팅방 찾기
        MessengerRoomVO existingRoom = roomMapper.findPrivateRoom(userId1, userId2);

        if (existingRoom != null) {
            log.info("기존 채팅방 발견: {}", existingRoom.getMsgrId());

            // 기존 방의 msgrNm을 상대방 이름으로 갱신하여 반환
            String partnerName = findUserNmByUserId(partnerId);
            existingRoom.setMsgrNm(partnerName);

            return existingRoom;
        }

        //  없으면 새로 생성
        MessengerRoomVO newRoom = new MessengerRoomVO();
        String newMsgrId = "R" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
        newRoom.setMsgrId(newMsgrId);

        // 상대방 이름 조회 및 msgrNm 설정 (DB에 저장될 값)
        String partnerName = findUserNmByUserId(partnerId);
        newRoom.setMsgrNm(partnerName); // 👈 상대방 이름으로 저장

        newRoom.setCrtDt(new Date());
        newRoom.setDelYn("N");

        roomMapper.insertMessengerRoom(newRoom);
        log.info("새 채팅방 생성: {}, 방 이름: {}", newRoom.getMsgrId(), partnerName);

        // 두 사용자 추가 로직 유지
        MessengerUserVO user1 = new MessengerUserVO();
        user1.setUserId(userId1);
        user1.setMsgrId(newRoom.getMsgrId());
        user1.setJoinDt(new Date());

        MessengerUserVO user2 = new MessengerUserVO();
        user2.setUserId(userId2);
        user2.setMsgrId(newRoom.getMsgrId());
        user2.setJoinDt(new Date());

        userMapper.insertMessengerUser(user1);
        userMapper.insertMessengerUser(user2);

        log.info("채팅방 사용자 추가 완료");
        return newRoom;
    }

    // selectUser 쿼리를 활용하여 사용자 이름(userNm)을 조회하는 보조 메서드
    private String findUserNmByUserId(String userId) {
        try {
            // usersMapper의 selectUser(String userId)를 호출하여 UsersVO를 받음.
            kr.or.ddit.vo.UsersVO userVO = usersMapper.selectUser(userId);

            if (userVO != null && userVO.getUserNm() != null) {
                // UsersVO 객체에서 userNm을 추출하여 반환
                return userVO.getUserNm();
            }
            return userId; // userVO가 null이거나 이름이 없다면 ID 반환
        } catch (Exception e) {
            log.error("사용자 정보(selectUser) 조회 실패: {}", userId, e);
            return userId; // 예외 발생 시 ID 반환
        }
    }


    /**
     * 메시지 저장
     */
    @Override
    @Transactional
    public void saveMessage(MessengerContentVO message) {
        log.info("메시지 저장 - 방: {}, 사용자: {}", message.getMsgrId(), message.getUserId());

        // UUID를 12자 이하로 자르고 접두사 'M'을 붙여 DB 컬럼 제약에 맞춤.
        String newMsgContId = "M" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
        message.setMsgContId(newMsgContId);
        message.setSendDt(new Date());

        // 기본값 설정 (null이면)
        if (message.getReadYn() == null) {
            message.setReadYn("N");
        }
        if (message.getDelYn() == null) {
            message.setDelYn("N");
        }

        contentMapper.insertMessengerContent(message);
        log.info("메시지 저장 완료 - msgContId: {}", message.getMsgContId());
    }

    /**
     * 나간 시간 업데이트
     */
    @Override
    @Transactional
    public void updateLeftTime(String userId, String msgrId) {
        log.info("채팅방 나가기 - userId: {}, msgrId: {}", userId, msgrId);
        userMapper.updateLeftTime(userId, msgrId);
    }

    @Override
    @Transactional
    public void markAsRead(String msgContId) {
        log.info("메시지 읽음 처리 - msgContId: {}", msgContId);
        contentMapper.updateReadStatus(msgContId);
    }

	@Override
	public void markAllAsRead(String msgrId, String userId) {
//		int updatedCount = contentMapper.updateAllUnreadMessages(msgrId, userId);
		int updatedCount = readMapper.insertReadRecords(msgrId, userId);
        log.info("채팅방 {} 에서 사용자 {} 에 의해 {} 건의 메시지가 읽음 처리되었습니다.", msgrId, userId, updatedCount);
    }

	/**
	 * 대화방 이름 수정
	 */
	@Override
	public void updateRoomName(String msgrId, String msgrNm) {
		log.info("채팅방 이름 수정 - msgrId: {}, 새 이름: {}", msgrId, msgrNm);

		if(msgrNm == null || msgrNm.trim().isEmpty()) {
			throw new IllegalArgumentException("채팅방 이름은 비어있을 수 없습니다.");
		}

		int result = roomMapper.updateMessengerRoomName(msgrId, msgrNm.trim());

		if(result != 1) {
			log.error("채팅방 이름 수정 실패 - msgrId: {}", msgrId);
            throw new RuntimeException("채팅방 이름 수정에 실패했습니다.");
		}
		log.info("채팅방 이름 수정 완료");
	}

	/**
	 * 특정 채팅방의 현재 참여자 '수' 조회
	 */
	@Override
	public int getRoomParticipantCount(String msgrId) {
		return userMapper.countRoomUsers(msgrId);
	}

	/**
	 * 특정 채팅방 참여자 목록 조회
	 */
	@Override
	public List<UsersVO> getRoomParticipants(String msgrId) {
		log.info("참여자 목록 조회 - msgrId: {}", msgrId);
		return userMapper.selectRoomParticipants(msgrId);
	}


}