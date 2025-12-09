/**
 * 채팅 API 통신 모듈 (리팩토링)
 * HTTP 요청만 담당 - WebSocket 로직 제거
 *
 * @author 김주민 (리팩토링)
 * @since 2025. 10. 28.
 *
 * << 개정이력(Modification Information) >>
 * 수정일          수정자       수정내용
 * -----------   --------    ---------------------------
 * 2025. 10. 16.  김주민      최초 생성
 * 2025. 10. 28.  김주민      HTTP 통신만으로 책임 분리
 */

const ChatAPI = {
    /**
     * 기본 fetch 래퍼 (에러 처리 통합)
     * @private
     */
    _fetch(url, options = {}) {
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        }).then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'API 요청 실패');
                });
            }
            return response;
        });
    },

    /**
     * 사용자 목록 로드
     * @param {String} currentUserId 현재 사용자 ID
     * @returns {Promise<Array>}
     */
    loadUserList(currentUserId) {
        return fetch('/chat/users')
            .then(response => response.json())
            .then(users => {
                return users.filter(u => u.userId && u.userId !== currentUserId);
            })
            .catch(error => {
                console.error('[API] 사용자 목록 로드 실패:', error);
                return [];
            });
    },

    /**
     * 현재 로그인 사용자 정보 로드
     * @returns {Promise<Object|null>}
     */
    loadCurrentUserInfo() {
        return fetch('/chat/current-user')
            .then(response => response.json())
            .then(user => {
                if (user && user.userId) {
                    return user;
                } else {
                    console.error('[API] 유효하지 않은 사용자 정보');
                    return null;
                }
            })
            .catch(error => {
                console.error('[API] 현재 사용자 정보 로드 실패:', error);
                return null;
            });
    },

    /**
     * 내 채팅방 목록 조회
     * @param {String} currentUserId 현재 사용자 ID
     * @returns {Promise<Array>}
     */
    loadMyRooms(currentUserId) {
        return fetch(`/chat/rooms?userId=${currentUserId}`)
            .then(response => response.json())
            .catch(error => {
                console.error('[API] 채팅방 목록 로드 실패:', error);
                return [];
            });
    },

    /**
     * 채팅방 메시지 조회
     * @param {String} msgrId 채팅방 ID
     * @param {String} currentUserId 현재 사용자 ID
     * @returns {Promise<Array>}
     */
    loadMessages(msgrId, currentUserId) {
        return fetch(`/chat/room/${msgrId}/messages?userId=${currentUserId}`)
            .then(response => response.json())
            .catch(error => {
                console.error('[API] 메시지 불러오기 실패:', error);
                return [];
            });
    },

    /**
     * 채팅방 생성
     * @param {Array<String>} userIds 참여자 ID 목록
     * @param {String} roomName 채팅방 이름
     * @param {Boolean} isGroup 그룹 채팅 여부
     * @returns {Promise<Object>}
     */
    createChatRoom(userIds, roomName, isGroup) {
        const payload = {
            userIds: userIds,
            roomNm: isGroup ? roomName : null,
            isGroup: isGroup
        };

        return this._fetch('/chat/room/create', {
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(response => response.json());
    },

    /**
     * 읽음 처리
     * @param {String} msgrId 채팅방 ID
     * @param {String} currentUserId 현재 사용자 ID
     * @returns {Promise<Response>}
     */
    markAsRead(msgrId, currentUserId) {
        return this._fetch(`/chat/room/markAsRead/${msgrId}`, {
            method: 'POST',
            body: JSON.stringify({ userId: currentUserId })
        });
    },

    /**
     * 채팅방 이름 변경
     * @param {String} msgrId 채팅방 ID
     * @param {String} newName 새 이름
     * @returns {Promise<Object>}
     */
    updateRoomName(msgrId, newName) {
        return this._fetch(`/chat/room/${msgrId}/name`, {
            method: 'POST',
            body: JSON.stringify({ msgrNm: newName })
        }).then(response => response.json());
    },

    /**
     * 채팅방 참여자 목록 조회
     * @param {String} msgrId 채팅방 ID
     * @returns {Promise<Array>}
     */
    getRoomParticipants(msgrId) {
        return fetch(`/chat/room/${msgrId}/participants`)
            .then(response => {
                if (!response.ok) throw new Error('참여자 목록 조회 실패');
                return response.json();
            });
    },

    /**
     * 채팅방 나가기
     * @param {String} msgrId 채팅방 ID
     * @param {String} userId 사용자 ID
     * @returns {Promise<Object>}
     */
    leaveRoom(msgrId, userId) {
        return this._fetch(`/chat/room/${msgrId}/leave`, {
            method: 'POST',
            body: JSON.stringify({ userId: userId })
        }).then(response => response.json());
    }
};

// 전역 객체로 내보내기
window.ChatAPI = ChatAPI;
