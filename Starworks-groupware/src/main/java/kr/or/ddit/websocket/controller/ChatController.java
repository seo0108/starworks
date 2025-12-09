package kr.or.ddit.websocket.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.mybatis.mapper.UsersMapper;
import kr.or.ddit.security.CustomUserDetails;
import kr.or.ddit.vo.ChatMessageDTO;
import kr.or.ddit.vo.MessengerContentVO;
import kr.or.ddit.vo.MessengerRoomVO;
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
 *  2025. 10. 14.     	김주민	          최초 생성
 *
 * </pre>
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

	private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final UsersMapper usersMapper;

    // ============================================
    // REST API 영역 (AJAX 호출용)
    // ============================================

    /**
     * 채팅 페이지 이동
     */
    @GetMapping("/chat")
    public String chatPage(Model model) {
        log.info("채팅 페이지 접근");
        return "chat/chat";
    }

    /**
     * 현재 로그인한 사용자의 ID와 이름을 조회 (AJAX 호출용)
     */
    @GetMapping("/chat/current-user")
    @ResponseBody
    public UsersVO getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        log.info("현재 로그인 사용자 정보 조회 요청");

        if (userDetails != null) {
            UsersVO realUser = userDetails.getRealUser();
            UsersVO user = new UsersVO();
            user.setUserId(realUser.getUserId());
            user.setUserNm(realUser.getUserNm());
            return user;
        }
        return new UsersVO();
    }

    /**
     * 사용자 목록 조회 (채팅 상대 선택용)
     */
    @GetMapping("/chat/users")
    @ResponseBody
    public List<UsersVO> getUserList() {
        log.info("사용자 목록 조회");
        return usersMapper.selectUserList();
    }

    /**
     * 내 채팅방 목록 조회 (AJAX)
     */
    @GetMapping("/chat/rooms")
    @ResponseBody
    public List<MessengerRoomVO> getMyRooms(@RequestParam String userId) {
        return chatService.getMyRooms(userId);
    }

    /**
     * 채팅방의 메시지 내역 조회 (AJAX)
     */
    @GetMapping("/chat/room/{msgrId}/messages")
    @ResponseBody
    public List<MessengerContentVO> getRoomMessages(
    	@PathVariable String msgrId,
    	@RequestParam String userId
    ) {
        log.info("메시지 내역 조회 요청 - msgrId: {}", msgrId);
        return chatService.getRoomMessages(msgrId, userId);
    }

    /**
     * 1:1 채팅방 생성 또는 기존 채팅방 조회 (AJAX)
     */
    @GetMapping("/chat/room/findOrCreate")
    @ResponseBody
    public MessengerRoomVO findOrCreateRoom(
            @RequestParam String userId1,
            @RequestParam String userId2) {
        log.info("1:1 채팅방 찾기/생성 요청 - user1: {}, user2: {}", userId1, userId2);
        return chatService.findOrCreatePrivateRoom(userId1, userId2);
    }

    /**
     * 그룹 채팅방 생성 (AJAX)
     * @param request
     * @return
     */
    @PostMapping("/chat/room/create")
    @ResponseBody
    public MessengerRoomVO createChatRoom(@RequestBody Map<String, Object> request) {
    	List<String> userIds = (List<String>) request.get("userIds");
    	String roomNm = (String) request.get("roomNm");
    	Boolean isGroup = (Boolean) request.getOrDefault("isGroup", false);

    	if(isGroup) {
    		// 그룹 채팅방 생성 서비스 호출
    		return chatService.createGroupRoom(userIds, roomNm);
    	}else {
    		// 1:1 채팅방 생성 로직 (두 명의 사용자 ID로 처리)
            if (userIds != null && userIds.size() == 2) {
                return chatService.findOrCreatePrivateRoom(userIds.get(0), userIds.get(1));
            } else {
                 throw new IllegalArgumentException("1:1 채팅방 생성에 필요한 사용자 ID가 부족하거나 너무 많습니다.");
            }
    	}

    }

    /**
     * 채팅방 입장 시 모든 읽지 않은 메시지를 읽음 처리 (AJAX 호출용)
     */
    @PostMapping("/chat/room/markAsRead/{msgrId}")
    @ResponseBody
    public ResponseEntity<String> markRoomMessagesAsRead(
            @PathVariable String msgrId,
            @RequestBody Map<String, String> requestBody) {
        try {
            String userId = requestBody.get("userId");

            if (userId == null) {
                return new ResponseEntity<>("User ID is missing.", HttpStatus.BAD_REQUEST);
            }
            // DB 업데이트
            chatService.markAllAsRead(msgrId, userId);
            return new ResponseEntity<>("Read status updated successfully.", HttpStatus.OK);

        } catch (Exception e) {
            log.error("REST API 읽음 처리 중 오류 발생 - msgrId: {}", msgrId, e);
            return new ResponseEntity<>("Failed to update read status.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 그룹 채팅방 이름 수정 (AJAX)
     */
    @PostMapping("/chat/room/{msgrId}/name")
    @ResponseBody
    public ResponseEntity<?> updateRoomName(
            @PathVariable String msgrId,
            @RequestBody Map<String, String> requestBody) {
        try {
            String newName = requestBody.get("msgrNm");

            if (newName == null || newName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "채팅방 이름을 입력해주세요."));
            }

            chatService.updateRoomName(msgrId, newName);

            log.info("채팅방 이름 수정 성공 - msgrId: {}, 새 이름: {}", msgrId, newName);

            return ResponseEntity.ok()
                .body(Map.of("success", true, "message", "채팅방 이름이 수정되었습니다.", "msgrNm", newName));

        } catch (IllegalArgumentException e) {
            log.error("채팅방 이름 수정 실패 - 잘못된 인자: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));

        } catch (Exception e) {
            log.error("채팅방 이름 수정 중 오류 발생 - msgrId: {}", msgrId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "채팅방 이름 수정에 실패했습니다."));
        }
    }

    /**
     * 채팅방 참여자 목록 조회 (AJAX)
     */
    @GetMapping("/chat/room/{msgrId}/participants")
    @ResponseBody
    public ResponseEntity<List<UsersVO>> getRoomParticipants(@PathVariable String msgrId) {
        log.info("참여자 목록 조회 요청 - msgrId: {}", msgrId);
        try {
            List<UsersVO> participants = chatService.getRoomParticipants(msgrId);
            return ResponseEntity.ok(participants);
        } catch (Exception e) {
            log.error("참여자 목록 조회 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 채팅방 나가기 (AJAX)
     */
    @PostMapping("/chat/room/{msgrId}/leave")
    @ResponseBody
    public ResponseEntity<?> leaveRoom(
            @PathVariable String msgrId,
            @RequestBody Map<String, String> requestBody) {
        log.info("채팅방 나가기 요청 - msgrId: {}", msgrId);
        try {
            String userId = requestBody.get("userId");
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "사용자 ID가 필요합니다."));
            }

            chatService.updateLeftTime(msgrId, userId);

            return ResponseEntity.ok()
                .body(Map.of("success", true, "message", "채팅방에서 나갔습니다."));
        } catch (Exception e) {
            log.error("채팅방 나가기 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "나가기 실패"));
        }
    }


    // ============================================
    // WebSocket 영역 (실시간 통신용)
    // ============================================

    /**
     * 채팅 메시지 수신 및 처리 (WebSocket)
     */
    @MessageMapping("/chat.sendMessage/{msgrId}") //클라이언트가 보낸 경로와 매핑
    public void sendMessage(
            @DestinationVariable String msgrId, // 경로 변수 추출
            @Payload ChatMessageDTO message) { // 메시지 본문 파싱

        try {
        	// 비즈니스 로직 : DB 저장
            MessengerContentVO contentVO = new MessengerContentVO();
            contentVO.setMsgrId(msgrId);
            contentVO.setUserId(message.getUserId());
            contentVO.setContents(message.getContents());
            contentVO.setReadYn("N");
            contentVO.setDelYn("N");
            chatService.saveMessage(contentVO);

            // 저장 후 메타데이터 추가
            message.setMsgContId(contentVO.getMsgContId());
            message.setSendDt(contentVO.getSendDt());

            UsersVO sender = usersMapper.selectUser(message.getUserId());
            if (sender != null) {
                message.setUserNm(sender.getUserNm());
                message.setJbgdNm(sender.getJbgdNm());
                message.setDeptNm(sender.getDeptNm());

                String dbFilePath = sender.getFilePath();
                if (dbFilePath != null && !dbFilePath.isEmpty()) {
                    // DB에 파일 경로가 있으면 사용
                    message.setUserFilePath(dbFilePath);
                    log.info("DB 프로필 경로 사용 - userId: {}, path: {}", sender.getUserId(), dbFilePath);
                } else {
                    // DB에 없으면 null로 유지 (클라이언트에서 기본 이미지 처리)
                    message.setUserFilePath(null);
                    log.info("프로필 경로 없음 - userId: {}, 기본 이미지 사용 예정", sender.getUserId());
                }
            }

            // 저장된 메시지의 정확한 unreadCount를 DB에서 조회
            List<MessengerContentVO> messages = chatService.getRoomMessages(msgrId, message.getUserId());
            // 방금 저장한 메시지 찾기
            MessengerContentVO savedMessage = messages.stream()
                .filter(m -> m.getMsgContId().equals(contentVO.getMsgContId()))
                .findFirst()
                .orElse(null);
            if (savedMessage != null) {
                message.setUnreadCount(savedMessage.getUnreadCount());
            } else {
                // 조회 실패 시 기본값 (전체 참여자 - 본인)
                int totalParticipants = chatService.getRoomParticipantCount(msgrId);
                message.setUnreadCount(Math.max(0, totalParticipants - 1));
            }

            // 해당 채팅방 구독자 전체에게 브로드캐스트
            messagingTemplate.convertAndSend(
            		"/topic/room/" + msgrId,	// 목적지 토픽
            		message						// 전송할 데이터
            );

            messagingTemplate.convertAndSend("/topic/chat/update",Map.of("type", "NEW_MESSAGE", "msgrId", msgrId));
            log.info("메시지 브로드캐스트 완료 - unreadCount: {}", message.getUnreadCount());

        } catch (Exception e) {
            log.error("메시지 전송 중 오류 발생", e);
        }
    }

    /**
     * 메시지 읽음 처리 (WebSocket)
     */
    @MessageMapping("/chat.readMessage/{msgrId}")
    public void readMessage(
            @DestinationVariable String msgrId,
            @Payload String userId) {
        try {
        	// 읽음 처리 수행(db업데이트)
            chatService.markAllAsRead(msgrId, userId);

            // 읽음 처리 알림 (optional: 누가 읽었는지 알림)
            messagingTemplate.convertAndSend(
            		"/topic/room/" + msgrId + "/read",
            		userId
            );

            // 메시지 카운트 업데이트 브로드캐스트 (읽음 처리된 방의 모든 메시지의 최신 카운트를 조회)
            List<MessengerContentVO> messagesWithUpdatedCount = chatService.getRoomMessages(msgrId, userId);

            //  카운트 업데이트 전용 토픽으로 브로드캐스트
            //    클라이언트는 이 리스트를 받아 UI의 메시지 카운트들을 일괄 갱신
            messagingTemplate.convertAndSend("/topic/room/" + msgrId + "/countUpdate", messagesWithUpdatedCount);

        } catch (Exception e) {
            log.error("읽음 처리 중 오류 발생", e);
        }
    }

    /**
     * 사용자 입장 알림 (WebSocket)
     */
    @MessageMapping("/chat.addUser/{msgrId}")
    public void addUser(
            @DestinationVariable String msgrId,
            @Payload ChatMessageDTO message) {

        log.info("사용자 입장 알림 - 방: {}, 사용자: {}", msgrId, message.getUserId());

        message.setType(ChatMessageDTO.MessageType.JOIN);
        messagingTemplate.convertAndSend("/topic/room/" + msgrId, message);
    }

    /**
     * 사용자 퇴장 알림 (WebSocket)
     */
    @MessageMapping("/chat.removeUser/{msgrId}")
    public void removeUser(
            @DestinationVariable String msgrId,
            @Payload ChatMessageDTO message) {

        log.info("사용자 퇴장 알림 - 방: {}, 사용자: {}", msgrId, message.getUserId());

        try {
            chatService.updateLeftTime(message.getUserId(), msgrId);

            message.setType(ChatMessageDTO.MessageType.LEAVE);
            messagingTemplate.convertAndSend("/topic/room/" + msgrId, message);

        } catch (Exception e) {
            log.error("퇴장 처리 중 오류 발생", e);
        }
    }
}