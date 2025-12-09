/**
 * 채팅 메인 컨트롤러 (리팩토링)
 * 비즈니스 로직, 이벤트 핸들링, 상태 관리 전담
 *
 * @author 김주민 (리팩토링)
 * @since 2025. 10. 28.
 *
 * << 개정이력(Modification Information) >>
 * 수정일          수정자       수정내용
 * -----------   --------    ---------------------------
 * 2025. 10. 16.  김주민      최초 생성
 * 2025. 10. 28.  김주민      MVC 패턴 기반 리팩토링
 *
 * 의존성:
 * - websocket.js (WebSocket 연결 및 구독 관리)
 * - ChatAPI.js (HTTP API 통신)
 * - ChatUI.js (UI 렌더링)
 */

(function() {
	// 중복 초기화 방지
	if (window.isChatControllerSetup) return;
	window.isChatControllerSetup = true;

	if (!window.chatZIndexCounter) {
		window.chatZIndexCounter = 9000; // 시작 값
	}

	// ===== 초기 상태 설정 =====
	const initialChatFab = document.getElementById('chatFab');
	if (initialChatFab) {
		initialChatFab.classList.remove('has-badge');
		initialChatFab.removeAttribute('data-count');
	}

	document.addEventListener('DOMContentLoaded', function() {
		const chatFab = document.getElementById('chatFab');
		const chatContainer = document.getElementById('chatContainer');

		if (!chatFab || !chatContainer) {
			console.error('[ChatController] Chat elements not found');
			return;
		}

		// ===== 상태 변수 =====
		const state = {
			// 사용자 정보
			currentUserId: window.username || '2026009',
			currentUserNm: window.username || '2026009',

			// 채팅방 정보
			currentMsgrId: null,
			currentChatName: '',
			isGroupChat: false,
			currentRoomParticipants: [],

			// UI 상태
			selectedUsers: [],
			userList: null,

			// WebSocket 구독 키
			currentChatSubscriptionKey: null,
			globalUpdateSubscriptionKey: null
		};

		// ===== z-index 관리 =====

		/**
		 * 채팅창을 맨 앞으로 가져오기
		 */
		function bringToFront() {
			window.chatZIndexCounter++;
			chatFab.style.zIndex = window.chatZIndexCounter;
			chatContainer.style.zIndex = window.chatZIndexCounter;
		}

		// ===== 초기화 =====

		/**
		 * 애플리케이션 초기화
		 */
		function initialize() {
			console.log('[ChatController] 초기화 시작');

			// 현재 사용자 정보 로드
			ChatAPI.loadCurrentUserInfo().then(user => {
				if (user) {
					state.currentUserId = user.userId;
					state.currentUserNm = user.userNm || user.userId;
					console.log('[ChatController] 사용자 정보 로드 완료:', state.currentUserNm);

					// 뱃지 업데이트
					updateChatBadge();

					// 전역 채팅 업데이트 구독
					subscribeToGlobalUpdates();
				}
			});
		}

		// ===== WebSocket 관련 =====

		/**
		 * 전역 채팅 업데이트 구독
		 */
		function subscribeToGlobalUpdates() {
			state.globalUpdateSubscriptionKey = window.subscribeToGlobalChatUpdates((message) => {
				console.log('[ChatController] 전역 채팅 업데이트 수신');

				// 뱃지 업데이트
				updateChatBadge();

				// 채팅방 목록이 열려있으면 새로고침
				const isRecentListOpen = chatContainer &&
					chatContainer.classList.contains('show') &&
					chatContainer.querySelector('.recent-list');

				if (isRecentListOpen) {
					refreshRecentList();
				}
			});
		}

		/**
		 * 채팅방 구독
		 */
		function subscribeToChatRoom(msgrId) {
			// 기존 구독 해제
			if (state.currentChatSubscriptionKey) {
				window.unsubscribeFromChat(state.currentChatSubscriptionKey);
				state.currentChatSubscriptionKey = null;
			}

			// 새 채팅방 구독
			state.currentChatSubscriptionKey = window.subscribeToChatRoom(msgrId, {
				onMessage: (chatMessage) => {
					handleIncomingMessage(chatMessage, msgrId);
				},
				onRead: (readerId) => {
					handleReadConfirmation(readerId, msgrId);
				},
				onCountUpdate: (updatedCounts) => {
					ChatUI.updateReadCounts(chatContainer, updatedCounts, state.currentUserId);
				}
			});

			console.log(`[ChatController] 채팅방 구독: ${msgrId}`);
		}

		/**
		 * 수신 메시지 처리
		 */
		function handleIncomingMessage(chatMessage, msgrId) {
			const isSent = chatMessage.userId === state.currentUserId;

			// 스크롤 위치 확인
			const messagesContainer = chatContainer.querySelector('.messages');
			const isNearBottom = messagesContainer &&
				(messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight) < 100;

			// 메시지 표시 (내가 보냈거나 아래에 있으면 자동 스크롤)
			const shouldAutoScroll = isSent || isNearBottom;
			ChatUI.displayMessage(chatContainer, chatMessage, state.currentUserId, state.isGroupChat, shouldAutoScroll);

			// 채팅방 목록 업데이트
			if (chatMessage.type === 'CHAT') {
				const recentList = chatContainer.querySelector('.recent-list');
				if (recentList) {
					ChatUI.updateRecentListItem(recentList, msgrId, chatMessage.contents, !isSent);
				}
				updateChatBadge();
			}

			// 상대방 메시지는 자동 읽음 처리
			if (!isSent && chatMessage.type === 'CHAT' && state.currentMsgrId === msgrId) {
				setTimeout(() => {
					markRoomAsRead(msgrId);
				}, 1000);
			}
		}

		/**
		 * 읽음 확인 처리
		 */
		function handleReadConfirmation(readerId, msgrId) {
			if (readerId === state.currentUserId) return;
			if (msgrId !== state.currentMsgrId) {
				console.log(`[ChatController] 읽음 처리 스킵 - 다른 방 (현재: ${state.currentMsgrId}, 알림: ${msgrId})`);
				return;
			}

			console.log(`[ChatController] 읽음 확인 처리: ${readerId}`);

			// 서버에서 최신 메시지 다시 조회
			ChatAPI.loadMessages(msgrId, state.currentUserId).then(messages => {
				const messagesContainer = chatContainer.querySelector('.messages');
				if (!messagesContainer) return;

				// 읽음 카운트 업데이트
				messages.forEach(msg => {
					if (msg.userId === state.currentUserId) {
						// ★★★ 핵심: .sent 클래스 추가 ★★★
						const msgElement = messagesContainer.querySelector(
							`.message-group.sent[data-msgid="${msg.msgContId}"]`
						);

						if (msgElement) {
							const readStatusEl = msgElement.querySelector('.read-status');
							if (readStatusEl) {
								const unreadCount = msg.unreadCount || 0;
								readStatusEl.dataset.unreadCount = unreadCount;

								if (unreadCount === 0) {
									readStatusEl.innerHTML = `<span class="read-all-mark"> </span>`;
								} else {
									readStatusEl.innerHTML = `<span class="unread-count">${unreadCount}</span>`;
								}

							}
						}
					}
				});
			});
		}

		// ===== 채팅방 관련 =====

		/**
		 * 채팅방 입장
		 */
		function enterChatRoom(msgrId, roomName, isGroup = false, partnerDeptNm = '', partnerJbgdNm = '') {
			console.log(`[ChatController] 채팅방 입장: ${msgrId} (${roomName})`);

			state.currentMsgrId = msgrId;
			state.currentChatName = roomName;
			state.isGroupChat = isGroup;

			// 채팅방 화면 렌더링
			renderView('room');

			// 그룹 채팅이면 제목 편집 가능하도록
			if (isGroup) {
				const titleEl = chatContainer.querySelector('#chatRoomTitle');
				if (titleEl && !titleEl.classList.contains('editable')) {
					titleEl.classList.add('editable');
				}
			}

			// 제목 설정 (1:1은 부서/직급 정보 포함)
			const titleEl = chatContainer.querySelector('#chatRoomTitle');
			if (titleEl) {
				if (!isGroup && (partnerDeptNm || partnerJbgdNm)) {
					const parts = [];
					if (partnerDeptNm) parts.push(partnerDeptNm);
					if (partnerJbgdNm) parts.push(partnerJbgdNm);
					const positionText = parts.join(' ');

					titleEl.innerHTML = `
                        ${roomName}
                        <span style="font-size: 13px; color: #ffffff; margin-left: 6px; font-weight: normal;">${positionText}</span>`;
				} else {
					titleEl.textContent = roomName;
				}
			}

			// 메시지 로드 및 표시
			ChatAPI.loadMessages(msgrId, state.currentUserId).then(messages => {
				const messagesContainer = chatContainer.querySelector('.messages');

				// 날짜 구분선
				let roomDate = new Date();
				if (messages && messages.length > 0 && messages[0].sendDt) {
					roomDate = new Date(messages[0].sendDt);
				}

				const dateStr = roomDate.toLocaleDateString('ko-KR', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				});

				messagesContainer.innerHTML = `<div class="date-divider"><span>${dateStr}</span></div>`;

				// 메시지 표시
				messages.forEach(msg => {
					ChatUI.displayMessage(chatContainer, {
						msgContId: msg.msgContId,
						msgrId: msg.msgrId,
						userId: msg.userId,
						userNm: msg.userNm || '알 수 없음',
						contents: msg.contents,
						sendDt: msg.sendDt,
						type: 'CHAT',
						readYn: msg.readYn,
						unreadCount: msg.unreadCount,
						userFilePath: msg.userFilePath,
						jbgdNm: msg.jbgdNm,
						deptNm: msg.deptNm
					}, state.currentUserId, isGroup, false);
				});

				// 맨 아래로 스크롤
				setTimeout(() => {
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				}, 100);
			});

			// WebSocket 구독
			subscribeToChatRoom(msgrId);

			// 읽음 처리
			markRoomAsRead(msgrId);
		}

		/**
		 * 채팅방 읽음 처리
		 */
		function markRoomAsRead(msgrId) {
			ChatAPI.markAsRead(msgrId, state.currentUserId)
				.then(response => {
					if (response.ok) {
						// WebSocket으로 읽음 알림 전송
						window.sendReadNotification(msgrId, state.currentUserId);

						// 뱃지 업데이트
						updateChatBadge();

						// 목록 새로고침
						if (chatContainer.querySelector('.recent-list')) {
							refreshRecentList();
						}
					}
				})
				.catch(error => console.error('[ChatController] 읽음 처리 실패:', error));
		}

		/**
		 * 채팅방 나가기
		 */
		function leaveRoom() {
			if (!state.currentMsgrId) {
				console.error('[ChatController] 현재 채팅방 ID가 없습니다');
				return;
			}

			const roomName = state.currentChatName || '이 채팅방';
			Swal.fire({
        title: '채팅방 나가기',
        html: `<b>${roomName}</b>에서 나가시겠습니까?<br><br><small>대화 내용은 유지되지만 채팅방 목록에서 사라집니다.</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#d33',
        confirmButtonText: '나가기',
        cancelButtonText: '취소'
    }).then((result) => {
        if (result.isConfirmed) {
            console.log('[ChatController] 채팅방 나가기:', state.currentMsgrId);

            ChatAPI.leaveRoom(state.currentMsgrId, state.currentUserId)
                .then(() => {
                    console.log('[ChatController] 채팅방 나가기 성공');

                    // WebSocket 퇴장 알림 (함수가 존재할 때만 호출)
                    if (typeof window.sendLeaveNotification === 'function') {
                        window.sendLeaveNotification(state.currentMsgrId, {
                            userId: state.currentUserId,
                            userNm: state.currentUserNm,
                            type: 'LEAVE'
                        });
                    } else {
                        console.warn('[ChatController] sendLeaveNotification 함수가 없습니다');
                    }

                    // 구독 해제
                    if (state.currentChatSubscriptionKey) {
                        window.unsubscribeFromChat(state.currentChatSubscriptionKey);
                        state.currentChatSubscriptionKey = null;
                    }

                    // 채팅방 목록으로 이동
                    state.currentMsgrId = null;
                    renderView('recent');
                    refreshRecentList();

                    // 성공 알림
                    Swal.fire({
                        icon: 'success',
                        title: '나가기 완료',
                        text: '채팅방에서 나갔습니다.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                })
                .catch(error => {
                    console.error('[ChatController] 채팅방 나가기 실패:', error);
                    Swal.fire({
                        icon: 'error',
                        title: '오류',
                        text: '채팅방 나가기에 실패했습니다.'
                    });
                });
        }
    });
}

		// ===== 메시지 전송 =====

		/**
		 * 메시지 전송
		 */
		function sendMessage() {
			const input = chatContainer.querySelector('.message-input');
			if (!input) return;

			const content = input.value.trim();
			if (!content) return;

			if (!state.currentMsgrId) {
				alert('채팅방을 선택해주세요.');
				return;
			}

			const message = {
				msgrId: state.currentMsgrId,
				userId: state.currentUserId,
				userNm: state.currentUserNm,
				contents: content,
				type: 'CHAT',
				readYn: 'N',
				sendDt: new Date().toISOString()
			};

			if (window.sendChatMessage(state.currentMsgrId, message)) {
				input.value = '';
				input.style.height = 'auto';
			} else {
				alert('메시지 전송에 실패했습니다.');
			}
		}

		// ===== UI 관련 =====

		/**
		 * 채팅 토글
		 */
		function toggleChat(show) {
			if (show) {
				bringToFront();

				chatContainer.classList.add('show');
				renderView('recent');
				refreshRecentList();
			} else {
				chatContainer.classList.remove('show');

				// 채팅방 구독 해제
				if (state.currentChatSubscriptionKey) {
					window.unsubscribeFromChat(state.currentChatSubscriptionKey);
					state.currentChatSubscriptionKey = null;
				}

				state.currentMsgrId = null;
			}
		}

		/**
		 * 뷰 렌더링
		 */
		function renderView(viewName) {
			console.log('[ChatController] 뷰 렌더링:', viewName);

			let html = '';
			switch (viewName) {
				case 'recent':
					html = ChatUI.templates.recentListView;
					break;
				case '1on1':
					html = ChatUI.templates.userSelectView;
					break;
				case 'group':
					html = ChatUI.templates.groupSelectView;
					break;
				case 'room':
					html = ChatUI.templates.chatRoomView;
					break;
			}

			chatContainer.innerHTML = html;

			// 뷰별 초기화
			if (viewName === '1on1' || viewName === 'group') {
				loadAndRenderUsers(viewName === 'group');
			}
		}

		/**
		 * 사용자 목록 로드 및 렌더링
		 */
		function loadAndRenderUsers(isGroupSelect) {
			const userListContainer = chatContainer.querySelector('.user-list');
			if (!userListContainer) return;

			ChatAPI.loadUserList(state.currentUserId).then(users => {
				state.userList = users;
				ChatUI.renderUserList(userListContainer, users, isGroupSelect);

				// 검색 기능 추가
				setupUserSearch();
			});
		}

		/**
		 * 사용자 검색 설정
		 */
		function setupUserSearch() {
			const searchInput = chatContainer.querySelector('.search-input');
			if (!searchInput) return;

			searchInput.addEventListener('input', function(e) {
				const searchTerm = e.target.value.toLowerCase();
				const userItems = chatContainer.querySelectorAll('.user-item');

				userItems.forEach(item => {
					const name = item.querySelector('.user-name').textContent.toLowerCase();
					const dept = item.querySelector('.user-dept').textContent.toLowerCase();

					if (name.includes(searchTerm) || dept.includes(searchTerm)) {
						item.style.display = 'flex';
					} else {
						item.style.display = 'none';
					}
				});
			});
		}

		/**
		 * 채팅방 목록 새로고침
		 */
		function refreshRecentList() {
			const recentList = chatContainer.querySelector('.recent-list');
			updateChatBadge();

			if (!recentList) return;

			ChatAPI.loadMyRooms(state.currentUserId).then(rooms => {
				ChatUI.renderRecentList(recentList, rooms);
			});
		}

		/**
		 * 채팅 뱃지 업데이트
		 */
		function updateChatBadge() {
			ChatAPI.loadMyRooms(state.currentUserId).then(rooms => {
				const totalUnreadCount = rooms.reduce((sum, room) => {
					return sum + (room.unreadCount || 0);
				}, 0);

				ChatUI.updateChatFabBadge(totalUnreadCount);
			});
		}

		/**
		 * 채팅방 이름 수정
		 */
		function editChatRoomName() {
			const titleEl = chatContainer.querySelector('#chatRoomTitle');
			if (!titleEl || !state.isGroupChat) return;

			// 이미 input 상태면 무시
			if (titleEl.tagName === 'INPUT') return;

			const currentName = titleEl.textContent.trim();

			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'chat-title-input';
			input.value = currentName;
			input.placeholder = '채팅방 이름을 입력하세요';

			titleEl.replaceWith(input);
			input.focus();
			input.select();

			function saveName() {
				const newName = input.value.trim();

				// 변경사항 없으면 원래대로
				if (!newName || newName === currentName) {
					restoreTitle(currentName);
					return;
				}

				// 서버에 이름 변경 요청
				ChatAPI.updateRoomName(state.currentMsgrId, newName)
					.then(data => {
						if (data.success) {
							state.currentChatName = newName;
							restoreTitle(newName);
							updateRoomNameInList(state.currentMsgrId, newName);
							console.log('[ChatController] 채팅방 이름 수정 완료:', newName);
						} else {
							alert(data.message || '채팅방 이름 수정에 실패했습니다.');
							restoreTitle(currentName);
						}
					})
					.catch(error => {
						console.error('[ChatController] 채팅방 이름 수정 실패:', error);
						alert('채팅방 이름 수정에 실패했습니다.');
						restoreTitle(currentName);
					});
			}

			function restoreTitle(name) {
				const newTitleEl = document.createElement('div');
				newTitleEl.className = 'chat-title editable';
				newTitleEl.id = 'chatRoomTitle';
				newTitleEl.textContent = name;

				if (input.parentNode) {
					input.replaceWith(newTitleEl);
				}
			}

			input.addEventListener('blur', saveName);
			input.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					saveName();
				}
			});
		}

		/**
		 * 목록에서 채팅방 이름 업데이트
		 */
		function updateRoomNameInList(msgrId, newName) {
			const recentList = document.querySelector('.recent-list');
			if (!recentList) return;

			const targetItem = recentList.querySelector(`.recent-item[data-msgrid="${msgrId}"]`);
			if (targetItem) {
				const nameEl = targetItem.querySelector('.recent-name');
				if (nameEl) {
					nameEl.textContent = newName;
				}
				targetItem.setAttribute('data-name', newName);
				console.log('[ChatController] 목록에서 채팅방 이름 업데이트 완료:', newName);
			}
		}

		/**
		 * 채팅방 정보 패널 토글
		 */
		function toggleRoomInfo() {
			const roomInfoPanel = chatContainer.querySelector('#roomInfoPanel');
			if (!roomInfoPanel) {
				console.error('[ChatController] roomInfoPanel을 찾을 수 없습니다');
				return;
			}

			const isOpen = roomInfoPanel.classList.contains('show');

			if (isOpen) {
				roomInfoPanel.classList.remove('show');
			} else {
				loadRoomParticipants(state.currentMsgrId);
				roomInfoPanel.classList.add('show');
			}
		}

		/**
		 * 채팅방 정보 패널 닫기
		 */
		function closeRoomInfo() {
			const roomInfoPanel = chatContainer.querySelector('#roomInfoPanel');
			if (roomInfoPanel) {
				roomInfoPanel.classList.remove('show');
			}
		}

		/**
		 * 참여자 목록 로드
		 */
		function loadRoomParticipants(msgrId) {
			if (!msgrId) {
				console.error('[ChatController] msgrId가 없습니다');
				return;
			}

			console.log('[ChatController] 참여자 목록 로드:', msgrId);

			ChatAPI.getRoomParticipants(msgrId)
				.then(participants => {
					console.log('[ChatController] 참여자 목록:', participants);
					state.currentRoomParticipants = participants;
					ChatUI.renderParticipants(chatContainer, participants);
				})
				.catch(error => {
					console.error('[ChatController] 참여자 목록 로드 실패:', error);
					alert('참여자 목록을 불러오지 못했습니다.');
				});
		}

		// ===== 이벤트 리스너 =====

		/**
		 * FAB 버튼 클릭
		 */
		chatFab.addEventListener('click', () => {
			bringToFront();

			const isOpen = chatContainer.classList.contains('show');
			toggleChat(!isOpen);
		});

		/**
		 * 컨테이너 클릭 이벤트 (이벤트 위임)
		 */
		chatContainer.addEventListener('click', function(e) {
			bringToFront();

			// 채팅방 제목 클릭
			const titleEl = e.target.closest('#chatRoomTitle');
			if (titleEl && titleEl.classList.contains('editable')) {
				e.stopPropagation();
				editChatRoomName();
				return;
			}

			// 액션 버튼 클릭
			const actionTarget = e.target.closest('[data-action]');
			if (actionTarget) {
				handleAction(actionTarget.dataset.action);
				return;
			}

			// 사용자 아이템 클릭
			const userItem = e.target.closest('.user-item');
			if (userItem) {
				handleUserItemClick(userItem);
				return;
			}

			// 채팅방 아이템 클릭
			const recentItem = e.target.closest('.recent-item');
			if (recentItem) {
				handleRecentItemClick(recentItem);
				return;
			}
		});

		/**
		 * 액션 처리
		 */
		function handleAction(action) {
			switch (action) {
				case 'close-chat':
					toggleChat(false);
					break;
				case 'show-recent-list':
					if (state.currentChatSubscriptionKey) {
						window.unsubscribeFromChat(state.currentChatSubscriptionKey);
						state.currentChatSubscriptionKey = null;
					}
					state.currentMsgrId = null;
					renderView('recent');
					refreshRecentList();
					break;
				case 'show-1on1-select':
					renderView('1on1');
					break;
				case 'show-group-select':
					renderView('group');
					break;
				case 'send-message':
					sendMessage();
					break;
				case 'create-group':
					createGroupChat();
					break;
				case 'toggle-room-info':
					toggleRoomInfo();
					break;
				case 'close-room-info':
					closeRoomInfo();
					break;
				case 'leave-room':
					leaveRoom();
					break;
			}
		}

		/**
		 * 사용자 아이템 클릭 처리
		 */
		function handleUserItemClick(userItem) {
			const currentView = chatContainer.querySelector('.bottom-bar') ? 'group' : '1on1';

			if (currentView === '1on1') {
				// 1:1 채팅 시작
				const partnerId = userItem.dataset.id;

				ChatAPI.createChatRoom([state.currentUserId, partnerId], null, false)
					.then(room => {
						enterChatRoom(room.msgrId, room.msgrNm);
					})
					.catch(error => {
						console.error('[ChatController] 채팅방 생성 실패:', error);
						alert('채팅방 생성에 실패했습니다: ' + (error.message || '서버 통신 오류'));
					});
			} else {
				// 그룹 채팅 사용자 선택
				const checkbox = userItem.querySelector('.checkbox');
				const userId = userItem.dataset.id;
				const userName = userItem.dataset.name;
				const isChecked = checkbox.classList.toggle('checked');
				checkbox.innerHTML = isChecked
					? '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
					: '';

				if (isChecked) {
					state.selectedUsers.push({ id: userId, name: userName });
				} else {
					state.selectedUsers = state.selectedUsers.filter(u => u.id !== userId);
				}

				// UI 업데이트
				const countSpan = chatContainer.querySelector('.selected-count span');
				const confirmBtn = chatContainer.querySelector('.confirm-btn');
				if (countSpan) countSpan.textContent = state.selectedUsers.length;
				if (confirmBtn) confirmBtn.disabled = state.selectedUsers.length === 0;
			}
		}

		/**
		 * 채팅방 아이템 클릭 처리
		 */
		function handleRecentItemClick(recentItem) {
			const msgrId = recentItem.dataset.msgrid;
			const roomName = recentItem.dataset.name;
			const participantCount = recentItem.dataset.participantCount;
			const isGroup = participantCount ? parseInt(participantCount) > 2 : roomName.includes(',');
			const partnerDeptNm = recentItem.dataset.deptNm || '';
			const partnerJbgdNm = recentItem.dataset.jbgdNm || '';

			console.log(`[ChatController] 채팅방 클릭: ${msgrId}, 참여자: ${participantCount}명, 그룹: ${isGroup}`);
			enterChatRoom(msgrId, roomName, isGroup, partnerDeptNm, partnerJbgdNm);
		}

		/**
		 * 그룹 채팅 생성
		 */
		function createGroupChat() {
			if (state.selectedUsers.length === 0) return;

			const partnerIds = state.selectedUsers.map(u => u.id);
			const userIds = [state.currentUserId, ...partnerIds];
			const allNames = [state.currentUserNm, ...state.selectedUsers.map(u => u.name)];
			const groupName = allNames.join(', ');

			ChatAPI.createChatRoom(userIds, groupName, true)
				.then(room => {
					state.selectedUsers = [];
					const countSpan = chatContainer.querySelector('.selected-count span');
					const confirmBtn = chatContainer.querySelector('.confirm-btn');
					if (countSpan) countSpan.textContent = 0;
					if (confirmBtn) confirmBtn.disabled = true;

					enterChatRoom(room.msgrId, room.msgrNm, true);
				})
				.catch(error => {
					console.error('[ChatController] 그룹 채팅방 생성 실패:', error);
					alert('그룹 채팅방 생성에 실패했습니다: ' + (error.message || '서버 통신 오류'));
				});
		}

		/**
		 * 입력 이벤트 (textarea 높이 자동 조절)
		 */
		chatContainer.addEventListener('input', function(e) {
			if (e.target.classList.contains('message-input')) {
				e.target.style.height = 'auto';
				e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
			}
		});

		/**
		 * 키보드 이벤트 (Enter로 메시지 전송)
		 */
		chatContainer.addEventListener('keypress', function(e) {
			if (e.target.classList.contains('message-input') && e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				sendMessage();
			}
		});

		/**
		 * 페이지 종료 시 정리
		 */
		window.addEventListener('beforeunload', function() {
			if (state.currentChatSubscriptionKey) {
				window.unsubscribeFromChat(state.currentChatSubscriptionKey);
			}
			if (state.globalUpdateSubscriptionKey) {
				window.unsubscribeFromChat(state.globalUpdateSubscriptionKey);
			}
		});

		// 초기화 실행
		initialize();
	});
})();
