/**
 * 채팅 UI 렌더링 전담 모듈 (리팩토링)
 * WebSocket 로직 제거, 순수 UI 렌더링만 담당
 *
 * @author 김주민 (리팩토링)
 * @since 2025. 10. 28.
 *
 * << 개정이력(Modification Information) >>
 * 수정일          수정자       수정내용
 * -----------   --------    ---------------------------
 * 2025. 10. 16.  김주민      최초 생성
 * 2025. 10. 28.  김주민      순수 UI 렌더링으로 책임 분리
 */

const ChatUI = {
    // ===== HTML 템플릿 =====
    templates: {
        recentListView: `
            <div class="chat-header">
                <div class="chat-header-left"><div class="chat-title">메시지</div></div>
                <div class="header-actions">
                    <button class="icon-btn" data-action="show-1on1-select" title="1:1 대화">
                        <svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </button>
                    <button class="icon-btn" data-action="show-group-select" title="그룹 채팅">
                        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    </button>
                    <button class="icon-btn" data-action="close-chat" title="닫기">
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                </div>
            </div>
            <div class="chat-content"><div class="recent-list"></div></div>`,

        userSelectView: `
            <div class="chat-header">
                <div class="chat-header-left">
                    <button class="back-btn" data-action="show-recent-list">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </button>
                    <div class="chat-title">대화 상대 선택</div>
                </div>
            </div>
            <div class="search-bar"><input type="text" class="search-input" placeholder="이름 또는 부서명 검색"></div>
            <div class="chat-content"><div class="user-list"></div></div>`,

        groupSelectView: `
            <div class="chat-header">
                <div class="chat-header-left">
                    <button class="back-btn" data-action="show-recent-list">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </button>
                    <div class="chat-title">대화 상대 선택</div>
                </div>
            </div>
            <div class="search-bar"><input type="text" class="search-input" placeholder="이름 또는 부서명 검색"></div>
            <div class="chat-content"><div class="user-list"></div></div>
            <div class="bottom-bar">
                <div class="selected-count"><span>0</span>명 선택됨</div>
                <button class="confirm-btn" data-action="create-group" disabled>확인</button>
            </div>`,

        chatRoomView: `
            <div class="chat-header">
                <div class="chat-header-left">
                    <button class="back-btn" data-action="show-recent-list">
                        <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </button>
                    <div class="chat-title" id="chatRoomTitle"></div>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" data-action="toggle-room-info" title="채팅방 정보">
                        <svg viewBox="0 0 24 24">
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="chat-content">
                <div class="messages"></div>
                <div class="room-info-panel" id="roomInfoPanel">
                    <div class="room-info-header">
                        <h3>채팅방 정보</h3>
                        <button class="close-panel-btn" data-action="close-room-info">
                            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        </button>
                    </div>
                    <div class="room-info-content">
                        <div class="participants-section">
                            <h4>참여자 <span class="participant-count-badge">0</span></h4>
                            <div class="participants-list"></div>
                        </div>
                    </div>
                    <div class="room-info-footer">
                        <button class="leave-room-btn" data-action="leave-room">
                            <svg viewBox="0 0 24 24">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                            </svg>
                            채팅방 나가기
                        </button>
                    </div>
                </div>
            </div>
            <div class="input-area">
                <button class="file-btn" title="파일 첨부">
                    <svg viewBox="0 0 24 24"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
                </button>
                <textarea class="message-input" placeholder="메시지를 입력하세요..." rows="1"></textarea>
                <button class="send-btn" data-action="send-message">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>`
    },

    // ===== 채팅방 목록 렌더링 =====

    /**
     * 채팅방 목록 렌더링
     * @param {Element} container 컨테이너 엘리먼트
     * @param {Array} rooms 채팅방 목록
     */
    renderRecentList(container, rooms) {
        if (rooms.length === 0) {
            container.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: #868e96;">
                    <p>아직 채팅방이 없습니다.</p>
                    <p style="font-size: 12px; margin-top: 8px;">상단의 버튼을 눌러 대화를 시작해보세요!</p>
                </div>`;
            return;
        }

		// 날짜,시간 포맷팅
        container.innerHTML = rooms.map(room => {
        let lastMsgTime = '';
	        if (room.lastMsgDt) {
	            const msgDate = new Date(room.lastMsgDt);
	            const today = new Date();

	            // 오늘 날짜인지 확인 (년월일 비교)
	            const isToday = msgDate.getDate() === today.getDate() &&
	                           msgDate.getMonth() === today.getMonth() &&
	                           msgDate.getFullYear() === today.getFullYear();

	            if (isToday) {
	                // 오늘이면 시간만 표시 (오전/오후 9:30)
	                lastMsgTime = msgDate.toLocaleTimeString('ko-KR', {
	                    hour: '2-digit',
	                    minute: '2-digit',
	                    hour12: true
	                });
	            } else {
	                // 어제 이전이면 날짜 표시
	                const yesterday = new Date(today);
	                yesterday.setDate(yesterday.getDate() - 1);

	                const isYesterday = msgDate.getDate() === yesterday.getDate() &&
	                                   msgDate.getMonth() === yesterday.getMonth() &&
	                                   msgDate.getFullYear() === yesterday.getFullYear();

	                if (isYesterday) {
	                    // 어제면 "어제"
	                    lastMsgTime = '어제';
	                } else if (msgDate.getFullYear() === today.getFullYear()) {
	                    // 올해면 "M월 D일"
	                    lastMsgTime = `${msgDate.getMonth() + 1}월 ${msgDate.getDate()}일`;
	                } else {
	                    // 작년 이전이면 "YYYY.M.D"
	                    lastMsgTime = `${msgDate.getFullYear()}.${msgDate.getMonth() + 1}.${msgDate.getDate()}`;
	                }
	            }
	        }

            const lastMessageContent = room.lastMsgCont || '대화를 시작해보세요';
            const unreadCount = room.unreadCount || 0;
            const unreadBadgeHtml = unreadCount > 0
                ? `<div class="unread-badge">${unreadCount > 99 ? '99+' : unreadCount}</div>`
                : '';

            const participantCount = room.participantCount || 2;
            const isOneOnOne = participantCount === 2;

            let participantCountHtml = '';
            if (!isOneOnOne) {
                participantCountHtml = `<span class="recent-participant-count" title="참여 인원">${participantCount}명</span>`;
            }

            // 아바타 HTML
            let avatarHtml;
            if (isOneOnOne && room.partnerFilePath) {
                avatarHtml = `
                    <img src="${room.partnerFilePath}"
                         alt="${room.msgrNm}"
                         class="avatar"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="avatar" style="display: none;">${room.msgrNm[0]}</div>`;
            } else {
                avatarHtml = `<div class="avatar">${room.msgrNm[0]}</div>`;
            }

            // 부서/직급 정보
            let positionHtml = '';
            if (isOneOnOne && (room.partnerDeptNm || room.partnerJbgdNm)) {
                const parts = [];
                if (room.partnerDeptNm) parts.push(room.partnerDeptNm);
                if (room.partnerJbgdNm) parts.push(room.partnerJbgdNm);
                positionHtml = `<span class="recent-position">${parts.join(' ')}</span>`;
            }

            return `
                <div class="recent-item"
                     data-msgrid="${room.msgrId}"
                     data-name="${room.msgrNm}"
                     data-participant-count="${participantCount}"
                     data-dept-nm="${room.partnerDeptNm || ''}"
                     data-jbgd-nm="${room.partnerJbgdNm || ''}">
                    <div class="avatar-wrapper">
                        ${avatarHtml}
                    </div>
                    <div class="recent-info">
                        <div class="recent-header">
                            <div class="recent-name-wrapper">
                                <span class="recent-name">${room.msgrNm}</span>
                                ${isOneOnOne ? positionHtml : participantCountHtml}
                            </div>
                            <span class="recent-time">${lastMsgTime}</span>
                        </div>
                        <div class="recent-footer">
                            <div class="recent-message">${lastMessageContent}</div>
                            <div class="recent-meta-right">
                                ${unreadBadgeHtml}
                            </div>
                        </div>
                    </div>
                </div>`;
        }).join('');
    },

    // ===== 사용자 목록 렌더링 =====

    /**
     * 사용자 목록 렌더링
     * @param {Element} container 컨테이너 엘리먼트
     * @param {Array} users 사용자 목록
     * @param {Boolean} isGroupSelect 그룹 선택 모드 여부
     */
    renderUserList(container, users, isGroupSelect) {
        container.innerHTML = users.map(user => {
            if (!user.userId) return '';

            const checkboxHtml = isGroupSelect ? '<div class="checkbox"></div>' : '';
            const userName = user.userNm || '알 수 없음';
            const userDept = user.deptNm || user.path || '';
            const isOnline = user.workSttsCd === 'C101';
            const statusClass = isOnline ? 'online' : 'offline';

            const avatarHtml = user.filePath
                ? `<img src="${user.filePath}" alt="${userName}" class="avatar"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="avatar" style="display: none;">${userName[0]}</div>`
                : `<div class="avatar">${userName[0]}</div>`;

            return `
                <div class="user-item" data-id="${user.userId}" data-name="${userName}">
                    <div class="avatar-wrapper">
                        ${avatarHtml}
                        <div class="status-indicator ${statusClass}"></div>
                    </div>
                    <div class="user-info">
                        <div class="user-name">${userName} ${user.jbgdNm ? `<span style="font-size: 11px; color: #868e96;">${user.jbgdNm}</span>` : ''}</div>
                        <div class="user-dept">${userDept}</div>
                    </div>
                    ${checkboxHtml}
                </div>`;
        }).filter(html => html !== '').join('');
    },

    // ===== 메시지 렌더링 =====

    /**
     * 메시지 화면에 표시
     * @param {Element} chatContainer 채팅 컨테이너
     * @param {Object} chatMessage 메시지 객체
     * @param {String} currentUserId 현재 사용자 ID
     * @param {Boolean} isGroupChat 그룹 채팅 여부
     * @param {Boolean} autoScroll 자동 스크롤 여부
     */
    displayMessage(chatContainer, chatMessage, currentUserId, isGroupChat, autoScroll = true) {
        const messagesContainer = chatContainer.querySelector('.messages');
        if (!messagesContainer) return;

        // 시스템 메시지 처리 (입장/퇴장)
        if (chatMessage.type === 'JOIN' || chatMessage.type === 'LEAVE') {
            const systemMsg = `
                <div class="date-divider">
                    <span>${chatMessage.userNm}님이 ${chatMessage.type === 'JOIN' ? '입장' : '퇴장'}하셨습니다.</span>
                </div>`;
            messagesContainer.insertAdjacentHTML('beforeend', systemMsg);
            if (autoScroll) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            return;
        }

        const isSent = chatMessage.userId === currentUserId;
        const time = chatMessage.sendDt ? new Date(chatMessage.sendDt) : new Date();
        const timeStr = time.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        // 읽음 상태 HTML
        let readStatusHtml = '';
        if (isGroupChat) {
            let unreadCount = chatMessage.unreadCount !== undefined ? chatMessage.unreadCount : 0;
            if (unreadCount > 0) {
                readStatusHtml = `<span class="read-status" data-unread-count="${unreadCount}"><span class="unread-count">${unreadCount}</span></span>`;
            } else {
                readStatusHtml = `<span class="read-status" data-unread-count="0"><span class="read-all-mark"> </span></span>`;
            }
        } else {
            // 1:1 채팅은 내가 보낸 메시지만 표시
            if (isSent) {
                let unreadCount = chatMessage.unreadCount !== undefined ? chatMessage.unreadCount : 0;
                if (unreadCount > 0) {
                    readStatusHtml = '<span class="read-status" data-unread-count="1">1</span>';
                } else {
                    readStatusHtml = '<span class="read-status" data-unread-count="0"></span>';
                }
            }
        }

        let messageHtml = '';

        if (isSent) {
            // 내가 보낸 메시지
            messageHtml = `
                <div class="message-group sent" data-msgid="${chatMessage.msgContId}">
                    <div class="message-content-wrapper">

                        <div class="message-bubble">${this._escapeHtml(chatMessage.contents)}</div>
                    </div>
                    <div class="message-meta">${timeStr}</div>${readStatusHtml}
                </div>`;
        } else {
            // 상대방 메시지
            const senderName = chatMessage.userNm || '알 수 없음';

            // 프로필 이미지 처리
            const avatarHtml = chatMessage.userFilePath
                ? `<img src="${chatMessage.userFilePath}" alt="${senderName}" class="avatar"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="avatar" style="display: none;">${senderName[0]}</div>`
                : `<div class="avatar">${senderName[0]}</div>`;

            // 부서/직급 정보
            let positionInfo = '';
            const parts = [];
            if (chatMessage.deptNm) parts.push(chatMessage.deptNm);
            if (chatMessage.jbgdNm) parts.push(chatMessage.jbgdNm);
            if (parts.length > 0) {
                positionInfo = `<span style="font-size: 11px; color: #868e96; margin-left: 4px;">${parts.join(' ')}</span>`;
            }

           messageHtml = `
                <div class="message-group received" data-msgid="${chatMessage.msgContId}">
                    <div class="avatar-wrapper">
                        ${avatarHtml}
                    </div>
                    <div class="message-content">
                        <div class="sender-name">${senderName}${positionInfo}</div>
                        <div class="message-content-wrapper">
                            <div class="message-bubble">${this._escapeHtml(chatMessage.contents)}</div>

                        </div>

                        <div class="message-footer">
                            <div class="message-meta">${timeStr}</div>
                            ${readStatusHtml}
                        </div>
                    </div>
                </div>`;
        }

        messagesContainer.insertAdjacentHTML('beforeend', messageHtml);

        if (autoScroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    },

    // ===== 읽음 상태 업데이트 =====

    /**
 * 읽음 카운트 업데이트
 * @param {Element} chatContainer 채팅 컨테이너
 * @param {Array} updatedCounts 업데이트된 카운트 목록
 * @param {String} currentUserId 현재 사용자 ID
 */
updateReadCounts(chatContainer, updatedCounts, currentUserId) {
    const messagesContainer = chatContainer ? chatContainer.querySelector('.messages') : null;
    if (!messagesContainer) {
        console.warn('[updateReadCounts] messagesContainer 없음');
        return;
    }

    updatedCounts.forEach(update => {
        //핵심 1: 발신자가 보낸 메시지만 처리
        if (update.userId !== currentUserId) {
            return;
        }

        // .sent 클래스로 타겟팅
        const msgElement = messagesContainer.querySelector(
            `.message-group.sent[data-msgid="${update.msgContId}"]`
        );

        if (!msgElement) {
            console.warn(`[updateReadCounts] 메시지 요소 못 찾음: ${update.msgContId}`);
            return;
        }

        const readStatusEl = msgElement.querySelector('.read-status');
        if (!readStatusEl) {
            console.warn(`[updateReadCounts] read-status 요소 없음`);
            return;
        }

        const newCount = update.unreadCount;
        readStatusEl.dataset.unreadCount = newCount;

        if (newCount === 0) {
            readStatusEl.innerHTML = `<span class="read-all-mark"> </span>`;
        } else {
            let countSpan = readStatusEl.querySelector('.unread-count');
            if (countSpan) {
                countSpan.textContent = newCount;
            } else {
                readStatusEl.innerHTML = `<span class="unread-count">${newCount}</span>`;
            }
        }
    });
},

    // ===== 참여자 목록 렌더링 =====

    /**
     * 참여자 목록 렌더링
     * @param {Element} container 컨테이너 엘리먼트
     * @param {Array} participants 참여자 목록
     */
    renderParticipants(container, participants) {
        const participantsList = container.querySelector('.participants-list');
        const countBadge = container.querySelector('.participant-count-badge');

        if (!participantsList || !countBadge) {
            console.error('[ChatUI] 참여자 목록 엘리먼트를 찾을 수 없습니다');
            return;
        }

        countBadge.textContent = participants.length;

        participantsList.innerHTML = participants.map(p => {
            // 프로필 이미지 처리
            const avatarHtml = p.filePath
                ? `<img src="${p.filePath}" alt="${p.userNm}" class="avatar"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="avatar" style="display: none;">${p.userNm[0]}</div>`
                : `<div class="avatar">${p.userNm[0]}</div>`;

            // 부서/직급 정보
            const deptInfo = [];
            if (p.deptNm) deptInfo.push(p.deptNm);
            if (p.jbgdNm) deptInfo.push(p.jbgdNm);
            const deptText = deptInfo.length > 0 ? deptInfo.join(' ') : '';

            return `
                <div class="participant-item">
                    <div class="avatar-wrapper">
                        ${avatarHtml}
                    </div>
                    <div class="participant-info">
                        <div class="participant-name">${p.userNm}</div>
                        ${deptText ? `<div class="participant-dept">${deptText}</div>` : ''}
                    </div>
                </div>`;
        }).join('');
    },

    // ===== 플로팅 버튼 뱃지 업데이트 =====

    /**
     * 플로팅 버튼 알림수 뱃지 업데이트
     * @param {Number} totalUnreadCount 총 읽지 않은 메시지 수
     */
    updateChatFabBadge(totalUnreadCount) {
        const chatFab = document.getElementById('chatFab');
        if (!chatFab) return;

        if (totalUnreadCount > 0) {
            chatFab.classList.add('has-badge');
            chatFab.setAttribute('data-count', totalUnreadCount > 99 ? '99+' : totalUnreadCount);
        } else {
            chatFab.classList.remove('has-badge');
            chatFab.removeAttribute('data-count');
        }
    },

    // ===== 채팅방 목록 아이템 업데이트 =====

    /**
     * 채팅방 목록의 특정 아이템 업데이트
     * @param {Element} recentList 최근 목록 컨테이너
     * @param {String} msgrId 채팅방 ID
     * @param {String} message 마지막 메시지
     * @param {Boolean} incrementUnread 읽지 않음 카운트 증가 여부
     */
    updateRecentListItem(recentList, msgrId, message, incrementUnread = false) {
        if (!recentList) return;

        const currentItem = recentList.querySelector(`.recent-item[data-msgrid="${msgrId}"]`);
        if (!currentItem) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const recentTimeEl = currentItem.querySelector('.recent-time');
        const recentMessageEl = currentItem.querySelector('.recent-message');
        const metaRightEl = currentItem.querySelector('.recent-meta-right');

        if (recentMessageEl) recentMessageEl.textContent = message;
        if (recentTimeEl) recentTimeEl.textContent = timeStr;

        // 맨 위로 이동
        if (recentList.firstChild !== currentItem) {
            recentList.prepend(currentItem);
        }

        // 읽지 않음 뱃지 업데이트
        if (incrementUnread) {
            let unreadBadgeEl = currentItem.querySelector('.unread-badge');
            let currentCount = 0;

            if (unreadBadgeEl) {
                currentCount = parseInt(unreadBadgeEl.textContent.replace('99+', '99')) || 0;
                const newCount = currentCount + 1;
                unreadBadgeEl.textContent = newCount > 99 ? '99+' : newCount;
            } else if (metaRightEl) {
                const newBadgeHtml = `<div class="unread-badge">1</div>`;
                metaRightEl.insertAdjacentHTML('beforeend', newBadgeHtml);
            }
        }
    },

    // ===== 유틸리티 =====

    /**
     * HTML 이스케이프
     * @private
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 전역 객체로 내보내기
window.ChatUI = ChatUI;
