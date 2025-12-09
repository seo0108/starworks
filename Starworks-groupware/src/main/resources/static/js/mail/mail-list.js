/*<--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 10.     	홍현택            최초 생성
 *  2025. 10. 13. 		홍현택			임시저장 표시 관련 추가
 *  2025. 10. 14. 		홍현택			중요 메일 관련 스크립트 추가
 *  2025. 10. 15.		홍현택			메일 카운트 관련 스크립트 추가
 *  2025. 10. 16.		홍현택			휴지통에서 선택 복원 스크립트 추가
 *  2025. 10. 20.       임가영            메일 목록 외 페이지에서 왼쪽 메뉴가 동작하도록 수정
 *  2025. 10. 20.       홍현택            메뉴 클릭 시 해당 편지함으로 바로 이동하도록 개선
 *
-->
*/
import { formatSendDate, createEmailListItemHTML, renderEmailList } from './mail-boxrenderer.js';

document.addEventListener('DOMContentLoaded', function() {
    const emailDynamicContentArea = document.getElementById('email-dynamic-content-area');
    if (!emailDynamicContentArea) {
        console.error("메일 컨텐츠 영역을 찾을 수 없습니다.");
        return;
    }

    const emailListContainer = emailDynamicContentArea.querySelector('.email-list');
    const paginationArea = document.getElementById('pagination-area');

    const inboxLink = document.getElementById('inbox-link');
    const sentLink = document.getElementById('sent-link');
    const draftsLink = document.getElementById('drafts-link');
    const importantLink = document.getElementById('important-link');
    const trashLink = document.getElementById('trash-link');

    // --- 공통 기능: 메일함 카운트 업데이트 ---
    async function updateAllMailboxCounts() {
        try {
            const response = await fetch('/mail/counts');
            if (!response.ok) throw new Error(`HTTP 오류! 상태: ${response.status}`);
            const counts = await response.json();

            document.getElementById('inbox-count').innerHTML = `(${counts.inboxCount || 0})`;
            document.getElementById('sent-count').innerHTML = `(${counts.sentCount || 0})`;
            document.getElementById('drafts-count').innerHTML = `(${counts.draftsCount || 0})`;
            document.getElementById('important-count').innerHTML = `(${counts.importantCount || 0})`;
            document.getElementById('trash-count').innerHTML = `(${counts.trashCount || 0})`;
            const unreadInboxCount = counts.unreadInboxCount || 0;
            document.getElementById('unread-inbox-count').innerHTML = unreadInboxCount > 0 ? `${unreadInboxCount}` : '';
        } catch (error) {
            console.error('메일함 카운트 가져오기 오류:', error);
            ['inbox-count', 'sent-count', 'drafts-count', 'important-count', 'trash-count'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerHTML = '(0)';
            });
        }
    }
    updateAllMailboxCounts();

    // --- 페이지 분기 처리 ---

    // 1. 메일 목록 페이지가 아닌 경우 (detail, send, reply, forward 등)
    if (!emailListContainer) {
        const navigateToMailbox = (e, mailboxCode) => {
            e.preventDefault();
            window.location.href = `/mail/list?mailbox=${mailboxCode}`;
        };

        inboxLink.addEventListener('click', (e) => navigateToMailbox(e, 'G101'));
        sentLink.addEventListener('click', (e) => navigateToMailbox(e, 'G102'));
        draftsLink.addEventListener('click', (e) => navigateToMailbox(e, 'G103'));
        importantLink.addEventListener('click', (e) => navigateToMailbox(e, 'G104'));
        trashLink.addEventListener('click', (e) => navigateToMailbox(e, 'G105'));

        return; // 목록 페이지가 아니므로 이후 코드는 실행하지 않음
    }

    // 2. 메일 목록 페이지인 경우 (원래 로직 수행)
    const restoreSelectedEmailsBtn = document.getElementById('restore-selected-emails');
    const urlParams = new URLSearchParams(window.location.search);
    const initialMailbox = urlParams.get('mailbox') || 'G101';

    let currentMailboxTypeCd = initialMailbox;
    let currentUserId;
    let currentSearchParams = {};

    async function fetchAndDisplayEmails(mailboxTypeCd, page = 1, searchParams = currentSearchParams) {
        try {
            let url = `/mail/listData/${mailboxTypeCd}?page=${page}`;
            if (searchParams.searchType && searchParams.searchWord) {
                url += `&searchType=${encodeURIComponent(searchParams.searchType)}&searchWord=${encodeURIComponent(searchParams.searchWord)}`;
            }
            if (searchParams.startDate) url += `&startDate=${encodeURIComponent(searchParams.startDate)}`;
            if (searchParams.endDate) url += `&endDate=${encodeURIComponent(searchParams.endDate)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP 오류! 상태: ${response.status}`);
            const data = await response.json();

            currentMailboxTypeCd = mailboxTypeCd;
            currentUserId = data.currentUserId;

            renderEmailList(data.emailList, emailListContainer, currentMailboxTypeCd, currentUserId);
            if (paginationArea) paginationArea.innerHTML = data.paginationHTML;

            if (restoreSelectedEmailsBtn) {
                restoreSelectedEmailsBtn.style.display = currentMailboxTypeCd === 'G105' ? 'inline-block' : 'none';
            }
        } catch (error) {
            console.error('이메일 가져오기 오류:', error);
            emailListContainer.innerHTML = '<p>이메일을 불러오는 데 실패했습니다.</p>';
            if (paginationArea) paginationArea.innerHTML = '';
        }
    }

    window.listEmail = function(page) {
        fetchAndDisplayEmails(currentMailboxTypeCd, page, currentSearchParams);
    };

    function setActiveMenu(mailboxCode) {
        document.querySelectorAll('.list-group-item.active').forEach(item => item.classList.remove('active'));
        const linkMap = {
            'G101': inboxLink,
            'G102': sentLink,
            'G103': draftsLink,
            'G104': importantLink,
            'G105': trashLink
        };
        if (linkMap[mailboxCode]) {
            linkMap[mailboxCode].classList.add('active');
        }
    }

    function handleMenuClick(e, mailboxTypeCd) {
        e.preventDefault();
        currentSearchParams = {};
        fetchAndDisplayEmails(mailboxTypeCd, 1, currentSearchParams);
        setActiveMenu(mailboxTypeCd);
        // URL을 변경하여 페이지 새로고침 시 상태 유지
        history.pushState(null, '', `/mail/list?mailbox=${mailboxTypeCd}`);
    }

    inboxLink.addEventListener('click', (e) => handleMenuClick(e, 'G101'));
    sentLink.addEventListener('click', (e) => handleMenuClick(e, 'G102'));
    draftsLink.addEventListener('click', (e) => handleMenuClick(e, 'G103'));
    importantLink.addEventListener('click', (e) => handleMenuClick(e, 'G104'));
    trashLink.addEventListener('click', (e) => handleMenuClick(e, 'G105'));

    // 초기 로드
    fetchAndDisplayEmails(initialMailbox, 1);
    setActiveMenu(initialMailbox);

    emailListContainer.addEventListener('click', function(e) {
        const emailItem = e.target.closest('.email-list-item');
        if (!emailItem) return;
        if (e.target.classList.contains('email-checkbox') || e.target.classList.contains('star-icon')) return;

        const emailId = emailItem.dataset.emailId;
        if (emailId) {
            if (currentMailboxTypeCd === 'G103') {
                window.location.href = `/mail/send?draftId=${emailId}`;
            } else {
                window.location.href = `/mail/detail/${emailId}`;
            }
        }
    });

    async function toggleImportance(emailId, starElement) {
        try {
            const response = await fetch(`/mail/toggle-importance/${emailId}`, { method: 'POST' });
            if (!response.ok) throw new Error(`HTTP 오류! 상태: ${response.status}`);
            const result = await response.json();
            if (result.status === 'success') {
                starElement.classList.toggle('bi-star', !result.isImportant);
                starElement.classList.toggle('bi-star-fill', result.isImportant);
                updateAllMailboxCounts();
            } else {
                console.error('중요 상태 변경 실패:', result.message);
            }
        } catch (error) {
            console.error('중요 상태 변경 중 오류 발생:', error);
        }
    }

    emailListContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('star-icon')) {
            const starElement = e.target;
            const emailId = starElement.dataset.emailId;
            if (emailId) toggleImportance(emailId, starElement);
        }
    });

    const selectAllEmailsCheckbox = document.getElementById('select-all-emails');
    if (selectAllEmailsCheckbox) {
        selectAllEmailsCheckbox.addEventListener('change', function() {
            emailListContainer.querySelectorAll('.email-checkbox').forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    async function handleBulkAction(url, body, successMsg, errorMsg, confirmTitle, confirmText, confirmButtonText) {
        const selectedEmailIds = Array.from(emailListContainer.querySelectorAll('.email-checkbox:checked')).map(cb => cb.value);
        if (body.emailContIds && selectedEmailIds.length === 0) {
            showToast('처리할 이메일을 선택해주세요.', 'warning');
            return;
        }
        if(body.emailContIds) body.emailContIds = selectedEmailIds;

        const confirmResult = await Swal.fire({
            title: confirmTitle, text: confirmText, icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33', confirmButtonText: confirmButtonText, cancelButtonText: '취소'
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error(`HTTP 오류! 상태: ${response.status}`);
            const result = await response.json();
            if (result.status === 'success') {
                showToast(successMsg, 'success');
                fetchAndDisplayEmails(currentMailboxTypeCd, 1);
                updateAllMailboxCounts();
            } else {
                showToast(`${errorMsg}: ${result.message}`, 'error');
            }
        } catch (error) {
            console.error(`${errorMsg} 중 오류 발생:`, error);
            showToast(`${errorMsg} 중 오류가 발생했습니다.`, 'error');
        }
    }

    const deleteSelectedEmailsBtn = document.getElementById('delete-selected-emails');
    if (deleteSelectedEmailsBtn) {
        deleteSelectedEmailsBtn.addEventListener('click', () => {
            const confirmText = currentMailboxTypeCd === 'G105'
                ? '선택한 이메일을 영구적으로 삭제하시겠습니까?'
                : '선택한 이메일을 휴지통으로 이동하시겠습니까?';
            handleBulkAction(
                '/mail/deleteSelected', { emailContIds: [], mailboxTypeCd: currentMailboxTypeCd },
                '이메일이 성공적으로 삭제되었습니다.', '이메일 삭제 실패', '확인', confirmText, '삭제'
            );
        });
    }

    const deleteAllEmailsBtn = document.getElementById('delete-all-emails');
    if (deleteAllEmailsBtn) {
        deleteAllEmailsBtn.addEventListener('click', () => {
            const confirmText = currentMailboxTypeCd === 'G105'
                ? '휴지통의 모든 이메일을 영구적으로 삭제하시겠습니까? 복구할 수 없습니다.'
                : '현재 메일함의 모든 이메일을 휴지통으로 이동하시겠습니까?';
            handleBulkAction(
                '/mail/deleteAll', { mailboxTypeCd: currentMailboxTypeCd },
                '모든 이메일이 성공적으로 삭제되었습니다.', '모든 이메일 삭제 실패', '확인', confirmText, '삭제'
            );
        });
    }

    if (restoreSelectedEmailsBtn) {
        restoreSelectedEmailsBtn.addEventListener('click', () => handleBulkAction(
            '/mail/restoreSelected', { emailContIds: [] },
            '이메일이 성공적으로 복원되었습니다.', '이메일 복원 실패', '확인', '선택한 이메일을 복원하시겠습니까?', '복원'
        ));
    }

    const emailSearchForm = document.getElementById('emailSearchForm');
    if (emailSearchForm) {
        emailSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            currentSearchParams = {
                searchType: document.getElementById('searchType').value,
                searchWord: document.getElementById('searchWord').value,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value
            };
            fetchAndDisplayEmails(currentMailboxTypeCd, 1, currentSearchParams);
        });
    }

    function showToast(message, type = 'info') {
        const bgClass = { success: 'bg-success', error: 'bg-danger', warning: 'bg-warning' }[type] || 'bg-info';
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        toastContainer.innerHTML = `
            <div class="toast ${bgClass} text-white" role="alert">
                <div class="toast-body"><i class="bi bi-check-circle me-2"></i>${message}</div>
            </div>`;
        document.body.appendChild(toastContainer);
        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'), { autohide: true, delay: 3000 });
        toast.show();
        setTimeout(() => toastContainer.remove(), 3500);
    }
});
