/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 21.     	장어진            최초 생성
 *
 * </pre>
 */
/**
 * AI 챗봇 메인 모듈
 */
(function() {
	// 중복 초기화 방지
	if (window.isAIChatbotSetup) return;
	window.isAIChatbotSetup = true;

	// 전역 z-index 카운터 (일반 채팅과 공유)
	if (!window.chatZIndexCounter) {
		window.chatZIndexCounter = 9000; // 시작 값
	}

	/**
	 * 세션 ID 생성
	 */
	function generateSessionId() {
		return 'ai_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
	}

	function initAIChatbot() {
		const chatFab = document.getElementById('aiChatFab');
		const chatContainer = document.getElementById('aiChatContainer');

		// 상태 변수
		let isOpen = false;
		let currentBubble = null;

		// ✅ 수정: 저장된 sessionId가 있으면 사용, 없으면 새로 생성
		let sessionId = localStorage.getItem('aIChatSessionId');
		if (!sessionId) {
			sessionId = generateSessionId();
			localStorage.setItem('aIChatSessionId', sessionId);
		}
		window.currentAIChatSessionId = sessionId;

		let stompClient = null;
		let aiSubscription = null;

		// ✅ 저장된 채팅 상태 복원
		const savedState = localStorage.getItem('aIChatbotState');
		if (savedState) {
			try {
				const state = JSON.parse(savedState);
				if (state.shouldRestoreChat && state.isOpen) {
					console.log('✓ 이전 채팅창 상태 복원');
					isOpen = true;
					localStorage.removeItem('aIChatbotState');
				}
			} catch (e) {
				console.error('상태 복원 중 오류:', e);
			}
		}

		// ===== z-index 관리 =====
		function bringToFront() {
			window.chatZIndexCounter++;
			chatFab.style.zIndex = window.chatZIndexCounter;
			chatContainer.style.zIndex = window.chatZIndexCounter;
		}

		/**
		 * WebSocket 연결 - 기존 채팅의 stompClient 재사용
		 */
		function connectWebSocket() {
			console.log('🔗 connectWebSocket 호출');  // ← 추가

			if (!window.stompClient) {
				console.log('❌ window.stompClient 없음!');  // ← 추가
				return Promise.reject('WebSocket 클라이언트를 찾을 수 없습니다.');
			}

			if (window.stompClient.connected) {
				console.log('✅ 이미 connected, subscribeToAI만 실행');  // ← 추가
				return subscribeToAI();
			}

			// 연결 대기
			return new Promise((resolve, reject) => {
				let attempts = 0;
				const maxAttempts = 10;

				const checkConnection = setInterval(() => {
					attempts++;
					console.log(`🔗 연결 확인 ${attempts}/${maxAttempts}`, window.stompClient?.connected);  // ← 추가

					if (window.stompClient && window.stompClient.connected) {
						clearInterval(checkConnection);
						console.log('✅ 연결됨, subscribeToAI 실행');  // ← 추가
						subscribeToAI().then(resolve).catch(reject);
					} else if (attempts >= maxAttempts) {
						clearInterval(checkConnection);
						console.log('❌ 연결 타임아웃');  // ← 추가
						reject('WebSocket 연결 타임아웃');
					}
				}, 500);
			});
		}


		/**
		 * AI 챗봇 전용 구독
		 */
		function subscribeToAI() {
			console.log('🔗 subscribeToAI 호출됨');  // ← 추가

			return new Promise((resolve, reject) => {
				try {
					console.log('🔗 구독 시도: /topic/ai/' + sessionId);  // ← 추가
					console.log('window.stompClient 존재?', !!window.stompClient);  // ← 추가

					if (aiSubscription) {
						aiSubscription.unsubscribe();
					}

					aiSubscription = window.stompClient.subscribe(
						'/topic/ai/' + sessionId,
						function(message) {
							console.log('📨 메시지 수신:', message.body);  // ← 추가
							const data = JSON.parse(message.body);
							handleAIResponse(data);
						}
					);

					console.log('✅ 구독 완료');  // ← 추가
					resolve();
				} catch (error) {
					console.error('❌ 구독 실패:', error);  // ← 수정
					reject(error);
				}
			});
		}


		/**
		 * AI 응답 처리
		 */
		function handleAIResponse(data) {
			console.log('📨 AI 메시지 수신:', data.type, data);

			switch (data.type) {
				case 'START':
					currentBubble = window.AIChatbotUI.createAIMessageBubble(chatContainer);
					break;

				case 'CHUNK':
					if (currentBubble) {
						window.AIChatbotUI.appendAIChunk(currentBubble, data.chunk);
					}
					break;

				case 'MENU_IMAGE':
					console.log('🔍 MENU_IMAGE 메시지 수신됨!');

					let cleanBase64 = data.imageBase64;
					if (!cleanBase64.startsWith('data:image/')) {
						cleanBase64 = 'data:image/png;base64,' + cleanBase64;
					}

					while (cleanBase64.includes('data:image/jpeg;base64,data:image/')) {
						cleanBase64 = cleanBase64.replace('data:image/jpeg;base64,data:image/', 'data:image/');
					}
					while (cleanBase64.includes('data:image/png;base64,data:image/')) {
						cleanBase64 = cleanBase64.replace('data:image/png;base64,data:image/', 'data:image/');
					}

					window.AIChatbotUI.displayMenuImage(chatContainer, cleanBase64, data.title);

					// ✅ 추가: localStorage에 저장 (기안서 페이지에서 사용)
					if (cleanBase64) {
						localStorage.setItem('aiFillFormImage', cleanBase64);
						sessionStorage.setItem('aiFillFormImage', cleanBase64);
						console.log('✅ 이미지 localStorage 저장 완료');
					}
					break;

				case 'REDIRECT_FORM':
					console.log('REDIRECT_FORM 수신');

					// 1. UI에 즉시 피드백을 주고, 이미지도 표시하여 스냅샷에 포함시킴
					if (currentBubble) {
						window.AIChatbotUI.finalizeAIMessage(currentBubble, "신메뉴 기안서 작성을 위해 페이지로 이동합니다.");
						currentBubble = null;
					}
					if (data.imageBase64) {
						window.AIChatbotUI.displayMenuImage(chatContainer, data.imageBase64, "AI 생성 이미지");
					}

					// 2. DOM 업데이트를 기다린 후 페이지 이동 관련 작업 수행
					setTimeout(() => {
						// 3. 현재 채팅창의 HTML을 sessionStorage에 저장
						const messagesContainer = chatContainer.querySelector('.ai-messages');
						if (messagesContainer) {
							sessionStorage.setItem('aiChatHistoryHtml', messagesContainer.innerHTML);
							console.log('✓ 채팅 로그 HTML을 sessionStorage에 저장했습니다.');
						}

						// 4. 폼 채우기에 필요한 데이터는 localStorage에 저장
						if (data.imageBase64) {
							localStorage.setItem('aiFillFormImage', data.imageBase64);
						}
						if (data.script) {
							localStorage.setItem('aiFillFormScript', data.script);
						}

						// 5. 페이지 이동
						console.log('폼 페이지로 이동:', data.url);
						window.location.href = data.url;
					}, 100); // DOM 업데이트를 위한 짧은 지연(100ms)
					break;

				case 'END':
					if (currentBubble) {
						window.AIChatbotUI.finalizeAIMessage(currentBubble, data.fullAnswer);

						// 히스토리 저장
						const lastQuestion = getLastUserQuestion();
						if (lastQuestion) {
							window.AIChatbotAPI.saveMessage(lastQuestion, data.fullAnswer);
						}

						currentBubble = null;
					}
					break;

				case 'ERROR':
					window.AIChatbotUI.displayError(chatContainer, data.error);
					currentBubble = null;
					break;
			}
		}

		// 폼 리다이렉션 헬퍼 함수
		function redirectToForm(data) {
			setTimeout(() => {
				localStorage.setItem('aiFillFormScript', data.script);
				console.log('✓ localStorage에 폼 채우기 스크립트 저장');
				console.log('폼 URL로 이동: ' + data.url);
				window.location.href = data.url;
			}, 100);
		}

		/**
		 * 마지막 사용자 질문 가져오기
		 */
		function getLastUserQuestion() {
			const messages = chatContainer.querySelectorAll('.ai-message-group.user');
			if (messages.length > 0) {
				const lastMessage = messages[messages.length - 1];
				return lastMessage.querySelector('.ai-message-bubble')?.textContent || '';
			}
			return '';
		}

		/**
		 * 메시지 전송
		 */
		function sendMessage() {
			const input = chatContainer.querySelector('.ai-message-input');
			if (!input || !input.value.trim()) {
				return;
			}

			const question = input.value.trim();
			// 사용자 메시지 표시
			window.AIChatbotUI.displayUserMessage(chatContainer, question);
			input.value = '';
			input.style.height = 'auto';

			// 기존 stompClient로 전송
			sendQuestionViaWebSocket(question);
		}

		/**
		 * WebSocket으로 질문 전송 (기존 채팅과 동일한 방식)
		 */
		function sendQuestionViaWebSocket(question) {
			if (!window.stompClient || !window.stompClient.connected) {
				window.AIChatbotUI.displayError(chatContainer, 'WebSocket 연결이 필요합니다.');

				// 연결 재시도
				connectWebSocket().then(() => {
					sendQuestionViaWebSocket(question);
				}).catch(error => {
					console.error(error);
				});
				return;
			}

			try {
				// 기존 채팅과 동일한 방식: publish 사용
				window.stompClient.publish({
					destination: '/app/ai.ask',
					body: JSON.stringify({
						question: question,
						sessionId: sessionId,
						userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
					})
				});
			} catch (error) {
				window.AIChatbotUI.displayError(chatContainer, '메시지 전송에 실패했습니다: ' + error.message);
			}
		}

		/**
		 * 챗봇 열기/닫기
		 */
		function toggleChat(show) {
			isOpen = show;

			if (show) {
				bringToFront();
				chatContainer.classList.add('show');

				const hasTemplate = chatContainer.querySelector('.ai-chat-header');
				if (!hasTemplate) {
					chatContainer.innerHTML = window.AIChatbotUI.template;

					// WebSocket 연결
					connectWebSocket()
						.catch(error => {
							console.error('❌ connectWebSocket 실패:', error);
						});

					// ⭐ 핵심: 히스토리 복원 로직 수정
					const restoredHtml = sessionStorage.getItem('aiChatHistoryHtml');
					if (restoredHtml) {
						// 1. sessionStorage에 저장된 HTML 스냅샷이 있으면, 그것으로 UI를 즉시 복원
						const messagesContainer = chatContainer.querySelector('.ai-messages');
						messagesContainer.innerHTML = restoredHtml;
						messagesContainer.scrollTop = messagesContainer.scrollHeight;
						sessionStorage.removeItem('aiChatHistoryHtml'); // 한 번 사용 후 삭제
						console.log('✓ sessionStorage에서 채팅 로그를 복원했습니다.');
					} else {
						// 2. 스냅샷이 없으면, 기존 방식대로 서버에 히스토리 요청
						window.AIChatbotAPI.loadHistory().then(response => {
							if (response.success && response.history && response.history.length > 0) {
								window.AIChatbotUI.displayHistoryMessages(chatContainer, response.history);
								console.log('✓ 채팅 히스토리 복원 완료: ' + response.history.length + '개 메시지');
							} else {
								// 웰컴 메시지
								const welcomeMessage = `
			                    <div class="ai-message-group bot">
			                        <div class="ai-bot-avatar-small">
			                            <svg viewBox="0 0 32 32" fill="#4CAF50">
			                                <path xmlns="http://www.w3.org/2000/svg" d="M30.9,12.7C30.8,12.3,30.4,12,30,12h-9.3l-3.8-9.7C16.8,2,16.4,1.7,16,1.7S15.2,2,15.1,2.3L11.3,12H2  c-0.4,0-0.8,0.3-0.9,0.7c-0.1,0.4,0,0.9,0.3,1.1L9,19.5l-2.6,9.2c-0.1,0.4,0,0.8,0.4,1.1c0.3,0.2,0.8,0.3,1.1,0l8.1-5.3l8.1,5.3  c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.5-0.7,0.4-1.1L23,19.5l7.6-5.7C30.9,13.5,31.1,13.1,30.9,12.7z M15,18  c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z M19,18c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z  "/>
			                            </svg>
			                        </div>
			                        <div class="ai-message-content">
			                            <div class="ai-sender-name">스텔레 AI</div>
			                            <div class="ai-message-bubble">안녕하세요! starworks의 AI 스텔레입니다. 무엇을 도와드릴까요?</div>
			                        </div>
			                    </div>`;
								const messagesContainer = chatContainer.querySelector('.ai-messages');
								if (messagesContainer) {
									messagesContainer.innerHTML = welcomeMessage;
								}
							}
						}).catch(error => {
							console.error(error);
						});
					}

					// ✅ 폼 채우기 스크립트 자동 실행
					const scriptToExecute = localStorage.getItem('aiFillFormScript');
					if (scriptToExecute) {
						console.log('✓ 폼 채우기 스크립트 자동 실행');
						try {
							eval(scriptToExecute);
						} catch (error) {
							console.error('스크립트 실행 오류:', error);
						}
						localStorage.removeItem('aiFillFormScript');
					}
				}

			} else {
				chatContainer.classList.remove('show');
			}
		}

		/**
		 * 히스토리 초기화
		 */
		function clearHistory() {
			const result = Swal.fire({
				title: '모든 대화 내용을 삭제하시겠습니까?',
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "삭제",
				cancelButtonText: "취소"
			}).then((result) => {
				if (!result.isConfirmed) return;

				window.AIChatbotAPI.clearHistory().then(response => {
					if (response.success) {
						const messagesContainer = chatContainer.querySelector('.ai-messages');
						if (messagesContainer) {
							messagesContainer.innerHTML = `
                        <div class="ai-message-group bot">
                            <div class="ai-bot-avatar-small">
                                <svg viewBox="0 0 32 32" fill="#4CAF50">
                                    <path xmlns="http://www.w3.org/2000/svg" d="M30.9,12.7C30.8,12.3,30.4,12,30,12h-9.3l-3.8-9.7C16.8,2,16.4,1.7,16,1.7S15.2,2,15.1,2.3L11.3,12H2  c-0.4,0-0.8,0.3-0.9,0.7c-0.1,0.4,0,0.9,0.3,1.1L9,19.5l-2.6,9.2c-0.1,0.4,0,0.8,0.4,1.1c0.3,0.2,0.8,0.3,1.1,0l8.1-5.3l8.1,5.3  c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.5-0.7,0.4-1.1L23,19.5l7.6-5.7C30.9,13.5,31.1,13.1,30.9,12.7z M15,18  c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z M19,18c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z  "/>
                				</svg>
                            </div>
                            <div class="ai-message-content">
                                <div class="ai-sender-name">스텔레 AI</div>
                                <div class="ai-message-bubble">대화 내용이 초기화되었습니다. 새로운 질문을 해주세요!</div>
                            </div>
                        </div>`;
						}
					}
				});
			}
			)
		}

		// ===== 이벤트 리스너 =====
		// FAB 버튼 클릭
		chatFab.addEventListener('click', () => {
			bringToFront();
			toggleChat(!isOpen);
		});

		// 컨테이너 클릭 이벤트
		chatContainer.addEventListener('click', function(e) {
			bringToFront();

			const actionTarget = e.target.closest('[data-action]');
			if (!actionTarget) return;

			const action = actionTarget.dataset.action;

			switch (action) {
				case 'close-chat':
					toggleChat(false);
					break;
				case 'send-message':
					sendMessage();
					break;
				case 'clear-history':
					clearHistory();
					break;
			}
		});

		// textarea 자동 높이 조절
		chatContainer.addEventListener('input', function(e) {
			if (e.target.classList.contains('ai-message-input')) {
				e.target.style.height = 'auto';
				e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
			}
		});

		// Enter 키 전송
		chatContainer.addEventListener('keypress', function(e) {
			if (e.target.classList.contains('ai-message-input') && e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				sendMessage();
			}
		});

		// ⭐ 페이지 종료 시 구독 해제만 (연결은 유지)
		window.addEventListener('beforeunload', function() {
			if (aiSubscription) {
				aiSubscription.unsubscribe();
			}
			// stompClient는 기존 채팅에서 관리하므로 disconnect 하지 않음
		});

		// 페이지 로드 후 스크립트 자동 실행
		window.addEventListener('load', () => {
			const scriptToExecute = localStorage.getItem('aiFillFormScript');
			if (scriptToExecute) {
				try {
					// ✅ 우선순위: window → localStorage
					let imageToUse = window.__aiFillFormImage ||
						localStorage.getItem('aiFillFormImage');

					if (imageToUse) {
						sessionStorage.setItem('aiFillFormImage', imageToUse);
						console.log('✅ 이미지 복원 완료');
					}

					// 100ms 대기 후 스크립트 실행 (DOM 완성 대기)
					setTimeout(() => {
						eval(scriptToExecute);
					}, 100);
				} catch (error) {
					console.error('스크립트 실행 오류:', error);
				}
				localStorage.removeItem('aiFillFormScript');
			}
		});


		// ✅ 초기 상태가 열려있으면 자동으로 열기
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => {
				if (isOpen) {
					setTimeout(() => toggleChat(true), 500);
				}
			});
		} else {
			if (isOpen) {
				setTimeout(() => toggleChat(true), 500);
			}
		}
	}

	// DOM 로딩 상태에 따라 분기 처리
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAIChatbot);
	} else {
		setTimeout(initAIChatbot, 100);
	}
})();