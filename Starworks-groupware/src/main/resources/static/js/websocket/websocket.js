/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 7.     	임가영            최초 생성
 *
 * </pre>
 */

let username = window.username; // 로그인시 가져오기..

// 클라이언트 생성 (연결 준비 (서버 주소 지정))
const stompClient = new StompJs.Client({
  brokerURL: `ws://localhost/starworks-groupware-websocket`
});

// 전역 접근을 위해 window에 할당 - (주민)추가
window.stompClient = stompClient;
// 구독 관리용 Map - (주민)추가
const subscriptions = new Map();

// 서버와 연결되었을 때 수행할 콜백 (연결 성공 시 실행될 로직(구독 등록 등) 정의)
stompClient.onConnect = (frame) => {
	console.log('Connected: ' + frame); // 연결 정보 출력
	// 특정 토픽(경로)에 구독 등록 (메시지 수신용)
 	stompClient.subscribe(`/topic/notify/${username}`, (message) => {
		const data = JSON.parse(message.body)
		console.log(data)

		// 알림이 오면 Toastify로 실시간 표시
		Toastify({
			text: data.template,
			duration: 4000,
			close: true,
			style: {
				background: "linear-gradient(to right, #667eea, #764ba2)",
			},
			offset: {
				y: '3.7rem'
			},
		}).showToast();

		// 수신된 알림 DB 저장
		// saveToDatabase(data);

		// LocalStorage 저장
		saveToLocalStorage(data);

		// 드롭다운 UI 업데이트
		updateToNotificationUI();

		// 뱃지 상태 업데이트
		updateBadge();
	}); // 알림 수신 시 동작하는 로직 끝
};

// 실제 서버와 연결 시작
function connect() {
    stompClient.activate();
}

// 로그인하면 자동 웹소켓 연결
document.addEventListener("DOMContentLoaded", function(){
	connect();
})


//////////////////////////////////// 알림 관련 ////////////////////////////////////
// 보내는 방법 sendNotification(수신자, 알림타입(커스텀 알림이면 null), 커스텀메시지(옵션))
function sendNotification(receiverId, alarmCode, pk, customMessage = null) {

	/* 아직 모르는 코드라서 보류
	if (!stompClient || !stompClient.connected) {
        console.warn("WebSocket이 아직 연결되지 않았습니다.");
        return;
    }
    */
    const payload = {
        receiverId: receiverId,
        alarmCode: alarmCode,
        pk: pk,
        customMessage: customMessage
    };

	console.log("전송할 알림: ", payload);
    stompClient.publish({
        destination: "/app/notify",
        body: JSON.stringify(payload)
    });
}

// 수신된 알림 DB 저장
function saveToDatabase(data) {
	const notifyReceiver = data.receiverId;
	const senderId = data.senderId;
	const alarmMessage = data.alarmMessage;
	const alarmCategory = data.alarmCategory;
	const alarmCode = data.alarmCode;
	const relatedUrl = data.relatedUrl;

	const url = `/rest/alarm-log-list`
	fetch(url, {
		method : 'post',
		headers: {
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify({
			receiverId : notifyReceiver,
			senderId : senderId,
			alarmCode : alarmCode,
			alarmMessage : alarmMessage,
			alarmCategory : alarmCategory,
			relatedUrl : relatedUrl
		})
	}) // fetch 끝
	.then(resp => resp.json())
	.then(data => {
		if(data.success) {
			console.log("AlarmLog DB 저장 성공");
		} else {
			console.log("AlarmLog DB 저장 실패");
		}
	})
	.catch(err => console.error('알림 DB 저장 중 에러:', err));
}

// 수신된 알림 로컬스토리지에 저장
function saveToLocalStorage(data) {
	// localStorage 에서 알림 목록 가져오기
	let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

	// createdAt이 없으면 현재 시간 추가(DB 에는 SYSDATE 이지만 지금 저장할 땐 없음)
  	if (!data.createdDt) data.createdDt = new Date().toISOString();
  	data.readYn = 'N';

	// 중복 방지 (같은 메시지, 같은 시간일 경우) (** 코드 검토 다시 필요)
	const exists = notifications.some(n =>
		n.alarmMessage === data.alarmMessage &&
	    n.senderId === data.senderId &&
	    n.createdDt === data.createdDt
	  );
	  if (exists) return;

    // unshift (배열의 맨 앞에 새로운 하나 이상의 요소를 추가하는데 사용)
    notifications.unshift(data);

    // 최대 10개까지만 유지 (** 코드 검토 다시 필요)
  	if (notifications.length > 10) notifications = notifications.slice(0, 10);

    localStorage.setItem("notifications", JSON.stringify(notifications));
}

// 드롭다운 UI 업데이트
function updateToNotificationUI() {
	// 드롭다운에 새로운 알림 append
	const notificationDiv = document.querySelector("#notification-div");
  	const notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  	// 알림이 없으면..
  	if (notifications.length === 0) {
	    notificationDiv.innerHTML = `
	      <div class="notification-text ms-4">
	        <p class="notification-subtitle text-sm">새로운 알림이 없습니다.</p>
	      </div>`;
	    return;
	  }

	  let code = "";
	  notifications.forEach(alarm => {
	    const timeAgo = getTimeAgo(alarm.createdDt);
	    // 안읽은 알림 배경색 지정
	    const unreadClass = alarm.readYn === "N" ? "bg-unread" : "";
	    const alarmCategory = alarm.alarmCategory;
	    const relatedUrl = alarm.relatedUrl;

	    let alarmColor;
		let alarmIcon;
		if (alarmCategory == "전자메일") {
			alarmColor = "var(--danger-color)";
			alarmIcon = "bi-envelope-arrow-down";
		} else if (alarmCategory == "전자결재") {
			alarmColor = "var(--primary-color)";
			alarmIcon = "bi-file-earmark-check";
		} else if (alarmCategory == "프로젝트 관리") {
			alarmColor = "var(--success-color)";
			alarmIcon = "bi-easel2";
		} else if (alarmCategory == "자유게시판") {
			alarmColor = "var(--warning-color)";
			alarmIcon = "bi-people-fill";
		} else {
			alarmColor = "var(--danger-color)";
			alarmIcon = "bi-at";
		}

	    code += `
	      <li class="dropdown-item notification-item ${unreadClass}">
	        <a class="d-flex align-items-center" href="${relatedUrl}">
	          <div class="notification-icon" style="background-color: ${alarmColor}">
                <i class="bi ${alarmIcon}"></i>
              </div>
	          <div class="notification-text ms-4">
	            <p class="notification-title font-bold">${alarm.alarmMessage}</p>
	            <p class="notification-subtitle text-sm">${timeAgo}</p>
	          </div>
	        </a>
	      </li>`;
	  });

	  notificationDiv.innerHTML = code;
}

// 뱃지 상태 업데이트
function updateBadge() {
	const notificationIcon = document.getElementById("notificationIcon");
 	const notificationBadge = document.getElementById("notificationBadge");

	let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
	let unreadCount = notifications.filter(n => n.readYn === 'N' || !n.readYn).length;

    if(!notificationBadge) {
		if (unreadCount > 0) {
			notificationIcon.insertAdjacentHTML (
				"beforeend",
				`<span class="badge badge-notification" style="background-color:var(--danger-color)" id="notificationBadge">${unreadCount}</span>`
			);
		}
	} else {
		if (unreadCount > 0) {
			notificationBadge.textContent = unreadCount;
		} else {
			notificationBadge.remove();
		}
    }
}
//////////////////////////////////// 알림 관련 끝 ////////////////////////////////////

//////////////////////////////////// 채팅 관련 (추가) ////////////////////////////////////

/**
 * 채팅방 구독
 * @param {String} msgrId 채팅방 ID
 * @param {Object} callbacks 콜백 함수들
 * @returns {String} 구독 키
 */
function subscribeToChatRoom(msgrId, callbacks) {
	// 구독을 식별할 고유 키 생성
    const subscriptionKey = `chat-${msgrId}`;

    // 이미 이 채팅방을 구독 중인지 확인
    if (subscriptions.has(subscriptionKey)) {
		// 중복 구독 방지를 위해 기존 구독 해제
        unsubscribeFromChat(subscriptionKey);
    }

    // 채팅 메시지 구독 (예: /topic/room/ROOM123)
    const chatSub = stompClient.subscribe(
        `/topic/room/${msgrId}`, // 구독할 토픽 경로
        (message) => { // 메시지 수신 시 실행되는 콜백 함수
        	// message.body는 JSON 문자열 (예: '{"userId":"user1","contents":"안녕"}')
            const chatMessage = JSON.parse(message.body); // JSON 파싱

            // callbacks 객체에 onMessage 함수가 있으면 실행
            if (callbacks.onMessage) {
                callbacks.onMessage(chatMessage); // 파싱된 메시지 전달
            }
        }
    );

    // 읽음 상태 구독 (예: /topic/room/ROOM123/read)
    const readSub = stompClient.subscribe(
        `/topic/room/${msgrId}/read`, //읽음 알림 토픽
        (message) => { // 읽음 알림 수신 시
        	// message.body는 단순 문자열 (예: "user1")
            if (callbacks.onRead) {
                callbacks.onRead(message.body); // 읽은 사용자 ID 전달
            }
        }
    );

    // 카운트 업데이트 구독 (예: /topic/room/ROOM123/countUpdate)
    const countSub = stompClient.subscribe(
        `/topic/room/${msgrId}/countUpdate`, // 카운트 업데이트 토픽
        (message) => { // 카운트 업데이트 수신 시
            const updatedMessages = JSON.parse(message.body);
            if (callbacks.onCountUpdate) {
                callbacks.onCountUpdate(updatedMessages);
            }
        }
    );

    // Map에 구독 객체들 저장
    subscriptions.set(subscriptionKey, {
        chatSub, // 채팅 메시지 구독 객체
        readSub, // 읽음 상태 구독 객체
        countSub, // 카운트 구독 객체
        msgrId // 채팅방 ID
    });

    console.log(`[WebSocket] 채팅방 구독 완료: ${msgrId}`);
    return subscriptionKey; // "chat-ROOM123" 반환
}

/**
 * 전역 채팅 업데이트 구독
 * (모든 채팅방의 업데이트 알림을 받기 위한 구독)
 */
function subscribeToGlobalChatUpdates(callback) {
    // 전역 구독은 하나만 필요하므로 고정 키 사용
    const subscriptionKey = 'global-chat-updates';
	// 이미 구독 중이면 중복 구독 방지
    if (subscriptions.has(subscriptionKey)) {
        return subscriptionKey; // 기존 키 반환
    }
	// 전역 업데이트 토픽 구독
    const subscription = stompClient.subscribe(
        '/topic/chat/update', // 전역 업데이트 토픽
        (message) => { // 업데이트 알림 수신 시
            if (callback) {
                callback(message); // 콜백 함수 실행
            }
        }
    );
	// Map에 저장
    subscriptions.set(subscriptionKey, subscription);
    console.log('[WebSocket] 전역 채팅 업데이트 구독 완료');
    return subscriptionKey;
}

/**
 * 채팅 구독 해제
 * @param {String} subscriptionKey - 구독 키 (예: "chat-ROOM123")
 */
function unsubscribeFromChat(subscriptionKey) {
    // 해당 키의 구독이 없으면 무시
    if (!subscriptions.has(subscriptionKey)) {
        return;
    }
	// Map에서 구독 객체 가져오기
    const subscription = subscriptions.get(subscriptionKey);

    if (subscription.chatSub) {
        subscription.chatSub.unsubscribe(); // 채팅 메시지 구독 해제
        subscription.readSub.unsubscribe(); // 읽음 상태 구독 해제
        subscription.countSub.unsubscribe(); // 카운트 구독 해제
        console.log(`[WebSocket] 채팅방 구독 해제: ${subscription.msgrId}`);
    } else {
		// 전역 구독인 경우 (단일 구독 객체)
        subscription.unsubscribe();
        console.log(`[WebSocket] 구독 해제: ${subscriptionKey}`);
    }
	// Map에서 삭제
    subscriptions.delete(subscriptionKey);
}

/**
 * 채팅 메시지 전송
 * @param {String} msgrId - 채팅방 ID
 * @param {Object} message - 전송할 메시지 객체
 * @returns {Boolean} - 전송 성공 여부
 */
function sendChatMessage(msgrId, message) {
	// WebSocket 연결 상태 확인
    if (!stompClient || !stompClient.connected) {
        console.error('[WebSocket] STOMP 클라이언트가 연결되지 않았습니다. 메시지 전송 실패.');
        return false; // 연결이 안 되었으면 false 반환
    }

    // 메시지 전송
    stompClient.publish({
        destination: `/app/chat.sendMessage/${msgrId}`, // 서버의 @MessageMapping 경로
        body: JSON.stringify(message) // 객체를 JSON 문자열로 변환
    });

    return true; // 전송 성공
}

/**
 * 읽음 알림 전송
 * @param {String} msgrId - 채팅방 ID
 * @param {String} userId - 읽은 사용자 ID
 */
function sendReadNotification(msgrId, userId) {
    // userId는 문자열 그대로 전송 (JSON.stringify 안 함)
    stompClient.publish({
        destination: `/app/chat.readMessage/${msgrId}`, // 서버의 @MessageMapping 경로
        body: userId  // 단순 문자열 (JSON.stringify 안 함)
        // 서버에서 @Payload String userId로 받기 때문
    });
}

/**
 * 퇴장 알림 전송
 * @param {String} msgrId - 채팅방 ID
 * @param {Object} message - 퇴장 메시지 객체
 * @returns {Boolean} - 전송 성공 여부
 */
function sendLeaveNotification(msgrId, message) {
    // WebSocket 연결 상태 확인
    if (!stompClient || !stompClient.connected) {
        console.error('[WebSocket] STOMP 클라이언트가 연결되지 않았습니다. 퇴장 알림 전송 실패.');
        return false;
    }

    try {
        // 퇴장 알림 전송
        stompClient.publish({
            destination: `/app/chat.removeUser/${msgrId}`, // 서버의 @MessageMapping 경로
            body: JSON.stringify(message) // 객체를 JSON 문자열로 변환
        });

        console.log(`[WebSocket] 퇴장 알림 전송 완료 - 방: ${msgrId}, 사용자: ${message.userId}`);
        return true;
    } catch (error) {
        console.error('[WebSocket] 퇴장 알림 전송 중 오류:', error);
        return false;
    }
}


// 전역 함수로 내보내기
window.subscribeToChatRoom = subscribeToChatRoom;
window.subscribeToGlobalChatUpdates = subscribeToGlobalChatUpdates;
window.unsubscribeFromChat = unsubscribeFromChat;
window.sendChatMessage = sendChatMessage;
window.sendReadNotification = sendReadNotification;
window.sendLeaveNotification = sendLeaveNotification;
//////////////////////////////////// 채팅 관련 끝 ////////////////////////////////////