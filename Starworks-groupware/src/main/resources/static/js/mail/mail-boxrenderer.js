// D:\finalworkspace\Starworks-groupware\src\main\resources\static\js\mail\email-renderer.js

/**
 * 메일 전송 날짜를 포맷팅합니다.
 * @param {string} sendDateString - 메일 전송 날짜 문자열.
 * @returns {string} 포맷팅된 날짜 문자열.
 */
export function formatSendDate(sendDateString) {
    if (!sendDateString) {
        return '임시저장';
    }
    const date = new Date(sendDateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
        return '어제';
    } else {
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
}

/**
 * 단일 이메일 항목에 대한 HTML 문자열을 생성합니다.
 * @param {object} email - 이메일 데이터 객체.
 * @param {string} currentMailboxTypeCd - 현재 메일함 유형 코드.
 * @param {string} currentUserId - 현재 로그인한 사용자 ID.
 * @returns {string} 이메일 항목의 HTML 문자열.
 */
export function createEmailListItemHTML(email, currentMailboxTypeCd, currentUserId) {
    const isReadClass = email.readYn === 'N' ? 'fw-bold' : '';
    const formattedDate = formatSendDate(email.sendDate);
    const starClass = email.isUserImportant === 'Y' ? 'bi-star-fill text-warning' : 'bi-star';
    const mailTypeLabel = email.userId === currentUserId ? '보냄' : '받음';

    let displayName = email.senderName;
    if (currentMailboxTypeCd === 'G102' && email.senderName) {
        const recipients = email.senderName.split(',');
        if (recipients.length > 1) {
            displayName = `${recipients[0].trim()} 외 ${recipients.length - 1}명`;
        }
    }

    const badgeHTML = (currentMailboxTypeCd === 'G104' || currentMailboxTypeCd === 'G105') 
        ? `<span class="badge ${mailTypeLabel === '보냄' ? 'bg-success' : 'bg-info'} ms-2">${mailTypeLabel}</span>` 
        : '';

    return `
        <div class="email-list-item d-flex align-items-center py-2 border-bottom ${isReadClass}" data-email-id="${email.emailContId}">
            <div class="form-check me-3">
                <input class="form-check-input email-checkbox" type="checkbox" value="${email.emailContId}">
                <label class="form-check-label"></label>
            </div>
            <i class="bi ${starClass} text-warning me-3 star-icon" data-email-id="${email.emailContId}" style="width: 1.25rem;"></i>
            <div class="email-sender fw-bold me-3 d-flex align-items-center" style="width: 150px;">
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${displayName}</span>
                ${badgeHTML}
            </div>
            <div class="email-subject flex-grow-1">${email.subject}
            <!-- 첨부파일 아이콘 -->
              ${email.mailFileId ? '<i class="bi bi-paperclip ms-2"></i>' : ''}</div>
            <div class="email-date text-muted" style="width: 100px; white-space: nowrap;">${formattedDate}</div>
        </div>
    `;
}

/**
 * 이메일 목록을 지정된 컨테이너에 렌더링합니다.
 * @param {Array<object>} emails - 렌더링할 이메일 객체 배열.
 * @param {HTMLElement} emailListContainer - 이메일 목록이 렌더링될 DOM 요소.
 * @param {string} currentMailboxTypeCd - 현재 메일함 유형 코드.
 * @param {string} currentUserId - 현재 로그인한 사용자 ID.
 */
export function renderEmailList(emails, emailListContainer, currentMailboxTypeCd, currentUserId) {
    let emailListHtml = '';
    if (emails.length === 0) {
        emailListHtml = '<p>해당 메일함에 이메일이 없습니다.</p>';
    } else {
        emails.forEach(email => {
            emailListHtml += createEmailListItemHTML(email, currentMailboxTypeCd, currentUserId);
        });
    }
    emailListContainer.innerHTML = emailListHtml;
}
