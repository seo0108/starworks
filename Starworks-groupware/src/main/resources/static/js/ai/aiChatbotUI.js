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
 * AI 챗봇 UI 렌더링 모듈
 */
const AIChatbotUI = {
	// ⭐ 기존 채팅과 동일한 구조의 템플릿
	template: `
        <div class="ai-chat-header">
            <div class="ai-chat-header-left">
                <div class="ai-bot-avatar-small">
                    <svg viewBox="0 0 32 32" fill="white">
                        <path xmlns="http://www.w3.org/2000/svg" d="M30.9,12.7C30.8,12.3,30.4,12,30,12h-9.3l-3.8-9.7C16.8,2,16.4,1.7,16,1.7S15.2,2,15.1,2.3L11.3,12H2  c-0.4,0-0.8,0.3-0.9,0.7c-0.1,0.4,0,0.9,0.3,1.1L9,19.5l-2.6,9.2c-0.1,0.4,0,0.8,0.4,1.1c0.3,0.2,0.8,0.3,1.1,0l8.1-5.3l8.1,5.3  c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.5-0.7,0.4-1.1L23,19.5l7.6-5.7C30.9,13.5,31.1,13.1,30.9,12.7z M15,18  c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z M19,18c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z  "/>
                    </svg>
                </div>
                <div class="ai-chat-title">스텔레 AI</div>
            </div>
            <div class="header-actions">
                <button class="icon-btn" data-action="clear-history" title="대화 초기화">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/>
                    </svg>
                </button>
                <button class="icon-btn" data-action="close-chat" title="닫기">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="ai-chat-content">
            <div class="ai-messages"></div>
        </div>
        <div class="ai-input-area">
            <textarea class="ai-message-input" placeholder="무엇을 도와드릴까요?" rows="1"></textarea>
            <button class="ai-send-btn" data-action="send-message">
                <svg viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
            </button>
        </div>
    `,

	/**
	 * 사용자 메시지 표시
	 */
	displayUserMessage(container, question) {
		const messagesContainer = container.querySelector('.ai-messages');
		if (!messagesContainer) return;

		const time = new Date().toLocaleTimeString('ko-KR', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});

		const messageHTML = `
            <div class="ai-message-group user">
                <div class="ai-message-content">
                    <div class="ai-message-bubble">${this.escapeHtml(question)}</div>
                    <div class="ai-message-time">${time}</div>
                </div>
            </div>`;

		messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	},

	/**
	 * AI 응답 버블 생성
	 */
	createAIMessageBubble(container) {
		const messagesContainer = container.querySelector('.ai-messages');
		if (!messagesContainer) return null;

		const time = new Date().toLocaleTimeString('ko-KR', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});

		const messageHTML = `
            <div class="ai-message-group bot">
                <div class="ai-bot-avatar-small">
                    <svg viewBox="0 0 32 32" fill="white">
                        <path xmlns="http://www.w3.org/2000/svg" d="M30.9,12.7C30.8,12.3,30.4,12,30,12h-9.3l-3.8-9.7C16.8,2,16.4,1.7,16,1.7S15.2,2,15.1,2.3L11.3,12H2  c-0.4,0-0.8,0.3-0.9,0.7c-0.1,0.4,0,0.9,0.3,1.1L9,19.5l-2.6,9.2c-0.1,0.4,0,0.8,0.4,1.1c0.3,0.2,0.8,0.3,1.1,0l8.1-5.3l8.1,5.3  c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.5-0.7,0.4-1.1L23,19.5l7.6-5.7C30.9,13.5,31.1,13.1,30.9,12.7z M15,18  c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z M19,18c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z  "/>
                    </svg>
                </div>
                <div class="ai-message-content">
                    <div class="ai-sender-name">스텔레 AI</div>
                    <div class="ai-message-bubble typing">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </div>
                    <div class="ai-message-time">${time}</div>
                </div>
            </div>`;

		messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
		messagesContainer.scrollTop = messagesContainer.scrollHeight;

		return messagesContainer.lastElementChild.querySelector('.ai-message-bubble');
	},

	/**
	 * AI 응답 청크 추가
	 */
	appendAIChunk(bubbleElement, chunk) {
		if (!bubbleElement) return;

		if (bubbleElement.classList.contains('typing')) {
			bubbleElement.classList.remove('typing');
			bubbleElement.innerHTML = '';
		}

		bubbleElement.textContent += chunk;

		const messagesContainer = bubbleElement.closest('.ai-messages');
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	},

	/**
	 * AI 응답 완료
	 */
	finalizeAIMessage(bubbleElement, fullAnswer) {
		if (!bubbleElement) return;
		bubbleElement.classList.remove('typing');

		if (fullAnswer && bubbleElement.textContent.trim().length === 0) {
			bubbleElement.textContent = fullAnswer;
		}
	},

	/**
	 * 오류 메시지 표시
	 */
	displayError(container, errorMessage) {
		const messagesContainer = container.querySelector('.ai-messages');
		if (!messagesContainer) return;

		const messageHTML = `
            <div class="ai-message-group system">
                <div class="ai-error-message">
                    <svg viewBox="0 0 24 24" fill="#f44336">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span>${this.escapeHtml(errorMessage)}</span>
                </div>
            </div>`;

		messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	},

	/**
	 * HTML 이스케이프
	 */
	escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	},

	displayHistoryMessages(container, history) {
		const messagesContainer = container.querySelector('.ai-messages');
		if (!messagesContainer || !history || history.length === 0) return;

		console.log('📦 조회된 히스토리 데이터:', JSON.stringify(history, null, 2));  // ← 추가

		history.forEach((msg, index) => {
			if (msg.question && msg.question.trim()) {
				this.displayUserMessage(container, msg.question);
			}

			if (msg.answer) {
				if ((msg.type === 'MENU_IMAGE' || msg.type === 'menu_image') && msg.imageBase64) {
					console.log('✅ 이미지 메시지 발견!');
					this.displayMenuImage(container, msg.imageBase64, msg.answer);
				}
				else if (msg.type === 'REDIRECT_FORM' && msg.imageBase64) {
					console.log('✅ REDIRECT_FORM 이미지 발견!');
					console.log('imageBase64 있나?', !!msg.imageBase64);  // ← 디버그 로그 추가
					this.displayMenuImage(container, msg.imageBase64, msg.answer);
				} else {
					const time = new Date().toLocaleTimeString('ko-KR', {
						hour: '2-digit',
						minute: '2-digit',
						hour12: true
					});

					const messageHTML = `
                    <div class="ai-message-group bot">
                        <div class="ai-bot-avatar-small">
                            <svg viewBox="0 0 32 32" fill="white">
                                <path xmlns="http://www.w3.org/2000/svg" d="M30.9,12.7C30.8,12.3,30.4,12,30,12h-9.3l-3.8-9.7C16.8,2,16.4,1.7,16,1.7S15.2,2,15.1,2.3L11.3,12H2  c-0.4,0-0.8,0.3-0.9,0.7c-0.1,0.4,0,0.9,0.3,1.1L9,19.5l-2.6,9.2c-0.1,0.4,0,0.8,0.4,1.1c0.3,0.2,0.8,0.3,1.1,0l8.1-5.3l8.1,5.3  c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.5-0.7,0.4-1.1L23,19.5l7.6-5.7C30.9,13.5,31.1,13.1,30.9,12.7z M15,18  c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z M19,18c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z  "/>
                            </svg>
                        </div>
                        <div class="ai-message-content">
                            <div class="ai-sender-name">스텔레 AI</div>
                            <div class="ai-message-bubble">${this.escapeHtml(msg.answer)}</div>
                        </div>
                    </div>`;

					messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
				}
			}
		});

		messagesContainer.scrollTop = messagesContainer.scrollHeight;
		console.log('히스토리 표시 완료');
	},

	displayMenuImage(container, imageBase64, title) {
		const messagesContainer = container.querySelector('.ai-messages');
		if (!messagesContainer) return;

		const time = new Date().toLocaleTimeString('ko-KR', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});

		// ✅ Base64 중복 제거
		let finalBase64 = imageBase64;

		if (!finalBase64.startsWith('data:image/')) {
			finalBase64 = 'data:image/png;base64,' + finalBase64;
		}

		while (finalBase64.includes('data:image/jpeg;base64,data:image/')) {
			finalBase64 = finalBase64.replace('data:image/jpeg;base64,data:image/', 'data:image/');
		}
		while (finalBase64.includes('data:image/png;base64,data:image/')) {
			finalBase64 = finalBase64.replace('data:image/png;base64,data:image/', 'data:image/');
		}

		// ✅ CSS 클래스 사용
		const messageHTML = `
        <div class="ai-message-group bot">
            <div class="ai-bot-avatar-small">
                <svg viewBox="0 0 32 32" fill="white">
                    <path xmlns="http://www.w3.org/2000/svg" d="M30.9,12.7C30.8,12.3,30.4,12,30,12h-9.3l-3.8-9.7C16.8,2,16.4,1.7,16,1.7S15.2,2,15.1,2.3L11.3,12H2  c-0.4,0-0.8,0.3-0.9,0.7c-0.1,0.4,0,0.9,0.3,1.1L9,19.5l-2.6,9.2c-0.1,0.4,0,0.8,0.4,1.1c0.3,0.2,0.8,0.3,1.1,0l8.1-5.3l8.1,5.3  c0.2,0.1,0.4,0.2,0.6,0.2c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.5-0.7,0.4-1.1L23,19.5l7.6-5.7C30.9,13.5,31.1,13.1,30.9,12.7z M15,18  c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z M19,18c0,0.6-0.4,1-1,1s-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1V18z  "/>
                </svg>
            </div>
            <div class="ai-message-content">
                <div class="ai-sender-name">스텔레 AI</div>
                <div class="ai-message-image-container">
                    <img src="${finalBase64}"
                         alt="${this.escapeHtml(title)}"
                         loading="lazy">
                    <p class="ai-message-image-title">${this.escapeHtml(title)}</p>
                </div>
                <div class="ai-message-time">${time}</div>
            </div>
        </div>`;

		messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
		messagesContainer.scrollTop = messagesContainer.scrollHeight;

		console.log('✅ 이미지 표시 완료:', finalBase64.substring(0, 50) + '...');
	},
};

window.AIChatbotUI = AIChatbotUI;
