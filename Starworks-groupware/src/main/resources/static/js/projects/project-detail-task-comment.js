/**
 * 업무 코멘트 관리 모듈
 *
 * @author 김주민
 * @since 2025.10.09
 */

let currentTaskId = null;

// 프로젝트 완료 상태 체크 함수
function isProjectCompleted() {
    return project.statusCode === 'B304' || project.statusCode === '완료';
}

/**
 * 업무 코멘트 목록 로드
 */
async function loadTaskComments(taskId) {
    currentTaskId = taskId;

    try {
        const resp = await fetch(`/rest/task-comment/${taskId}`);
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const data = await resp.json();
        const commentList = data.commentList || [];

        renderTaskComments(commentList);
    } catch (error) {
        console.error('=== 코멘트 로딩 오류 ===');
        console.error('오류 상세:', error);

        if (commentListEl) {
            commentListEl.innerHTML = '<p class="text-center text-danger">코멘트를 불러올 수 없습니다.</p>';
        } else {
            console.error('taskComment-list 요소를 찾을 수 없습니다');
            Swal.fire({
                icon: 'error',
                title: '로드 실패',
                text: '업무 코멘트 목록을 불러오는 중 오류가 발생했습니다.',
                confirmButtonColor: '#435ebe'
            });
        }
    }
}

/**
 * 코멘트 목록 렌더링
 */
function renderTaskComments(commentList) {
    const commentListEl = document.getElementById('taskComment-list');
    if (!commentListEl) {
        console.error('taskComment-list 요소를 찾을 수 없습니다');
        return;
    }

    commentListEl.innerHTML = '';

    if (!commentList || commentList.length === 0) {
        commentListEl.innerHTML = '<p class="text-center text-muted">코멘트가 없습니다.</p>';
        return;
    }

    commentList.forEach((comment, index) => {
        try {
            const commentDiv = createCommentElement(comment);
            commentListEl.appendChild(commentDiv);
        } catch (error) {
            console.error(`댓글 ${index + 1} 렌더링 오류:`, error);
        }
    });
}

/**
 * 코멘트 요소 생성
 */
function createCommentElement(comment) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment-item mb-3';
    commentDiv.dataset.commentId = comment.taskCommSqn;

    const currentUserId = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.id : null;
    const isMyComment = comment.crtUserId === currentUserId;

    // 프로젝트 완료 상태면 삭제 버튼 숨김
    const canDelete = isMyComment && !isProjectCompleted();

    const dateField = comment.crtDt || comment.frstCrtDt || '';
    const formattedDate = formatDateTime(dateField);

    //사용자명(부서명) 형식으로 표시
    let userName = (comment.users && comment.users.userNm)
        ? comment.users.userNm
        : comment.crtUserId;

    let jobNm = '';
    let deptNm = (comment.users && comment.users.deptNm) ? comment.users.deptNm : '';

    // 프로필 사진 경로 처리
    let userFilePath = '/images/faces/1.jpg'; // 기본값

    // 1. 먼저 API 응답에서 filePath 확인
    if (comment.users && comment.users.filePath) {
        userFilePath = comment.users.filePath;
    }
    // 2. API에 없으면 JSP의 member-list에서 찾기
    else if (comment.crtUserId) {
        const memberListEl = document.getElementById('member-list');
        if (memberListEl) {
            const memberItems = memberListEl.querySelectorAll('li');
            memberItems.forEach(item => {
                if (item.dataset.userId === comment.crtUserId) {
                    // 프로필 사진 경로
                    const memberFilePath = item.dataset.filePath;
                    if (memberFilePath && memberFilePath !== '/images/faces/1.jpg') {
                        userFilePath = memberFilePath;
                    }

                    // 직급명
                    if (item.dataset.jobNm) {
                        jobNm = item.dataset.jobNm;
                    }

                    // 부서명
                    if (!deptNm && item.dataset.deptNm) {
                        deptNm = item.dataset.deptNm;
                    }
                }
            });
        }

        // member-list에도 없으면 userId 기반 경로 생성
        if (userFilePath === '/images/faces/1.jpg') {
            userFilePath = `/assets/images/faces/${comment.crtUserId}.jpg`;
        }
    }

    // 사용자 표시명 생성: 이름 직급 (부서)
    let userDisplay = userName;
    if (jobNm) {
        userDisplay += ` ${jobNm}`;
    }
    if (deptNm) {
        userDisplay += `(${deptNm})`;
    }
    const contents = comment.contents || '';

    // 프로필 이미지 HTML 생성 (이미지 로드 실패 시 기본 이미지로 대체)
    const avatarHtml = `<img src="${userFilePath}"
                             alt="${userName}"
                             onerror="this.src='/images/faces/1.jpg'"
                             style="object-fit: cover; width: 40px; height: 40px; border-radius: 50%;">`;

    const html = `
        <div class="d-flex gap-3">
            <div class="avatar avatar-md">
                ${avatarHtml}  </div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="mb-0">${userDisplay}</h6>
                    <div class="d-flex align-items-center gap-2">
                        <small class="text-muted">${formattedDate}</small>
                        ${isMyComment ? `
                            <button class="btn btn-sm btn-outline-danger delete-task-comment-btn"
                                    data-comment-id="${comment.taskCommSqn}"
                                    title="삭제">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <p class="mb-0 text-muted">${escapeHtml(contents).split('\n').join('<br>')}</p>
            </div>
        </div>
    `;

    commentDiv.innerHTML = html;
    return commentDiv;
}

/**
 * 코멘트 등록
 */
async function submitTaskComment() {
    const commentInput = document.getElementById('new-comment-input');
    if (!commentInput) {
        console.error('new-comment-input 요소를 찾을 수 없습니다');
        return;
    }

    const contents = commentInput.value.trim();

    if (!contents) {
        Swal.fire({
            icon: 'warning',
            title: '내용 입력 필요',
            text: '코멘트 내용을 입력하세요.',
            confirmButtonColor: '#435ebe'
        });
        return;
    }

    if (!currentTaskId) {
        console.error('업무 ID가 없습니다.');
        Swal.fire({
            icon: 'error',
            title: '오류',
            text: '업무 정보를 불러올 수 없습니다.',
            confirmButtonColor: '#435ebe'
        });
        return;
    }

    try {
        const resp = await fetch(`/rest/task-comment/${currentTaskId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents: contents })
        });

        const data = await resp.json();

        if (data.success) {
            commentInput.value = '';

            setTimeout(() => {
                loadTaskComments(currentTaskId);
            }, 100);

            Swal.fire({
                icon: 'success',
                title: '등록 완료',
                text: '코멘트가 등록되었습니다.',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '등록 실패',
                text: '코멘트 등록 처리 중 오류가 발생했습니다.',
                confirmButtonColor: '#435ebe'
            });
        }
    } catch (error) {
        console.error('코멘트 등록 오류:', error);
        Swal.fire({
            icon: 'error',
            title: '네트워크 오류',
            text: '코멘트 등록 중 통신 오류가 발생했습니다.',
            confirmButtonColor: '#435ebe'
        });
    }
}

/**
 * 코멘트 삭제
 */
async function removeTaskComment(taskCommSqn) {
    if (!currentTaskId) {
        console.error('업무 ID가 없습니다.');
        return;
    }

    const result = await Swal.fire({
        title: '코멘트 삭제',
        text: '이 코멘트를 삭제하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
    });

    // 취소 버튼 클릭 시
    if (!result.isConfirmed) {
        return;
    }

    try {
        const resp = await fetch(`/rest/task-comment/${currentTaskId}/${taskCommSqn}`, {
            method: 'DELETE'
        });

        const data = await resp.json();
        if (data.success) {
            loadTaskComments(currentTaskId);

            Swal.fire({
                icon: 'success',
                title: '삭제 완료',
                text: '코멘트가 삭제되었습니다.',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '삭제 실패',
                text: '코멘트 삭제 처리 중 오류가 발생했습니다.',
                confirmButtonColor: '#435ebe'
            });
        }
    } catch (error) {
        console.error('코멘트 삭제 오류:', error);
        Swal.fire({
            icon: 'error',
            title: '네트워크 오류',
            text: '코멘트 삭제 중 통신 오류가 발생했습니다.',
            confirmButtonColor: '#435ebe'
        });
    }
}

/**
 * 날짜/시간 포맷팅
 */
function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '';

    try {
        const date = new Date(dateTimeStr);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) {
            return '방금 전';
        }
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes}분 전`;
        }
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours}시간 전`;
        }
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days}일 전`;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    } catch (e) {
        console.error('날짜 포맷 오류:', e);
        return dateTimeStr;
    }
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
function escapeHtml(text) {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 이벤트 리스너 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
    const addCommentBtn = document.getElementById('add-comment-btn');
    if (addCommentBtn) {
        // 프로젝트 완료 상태면 버튼 숨기기
        if (isProjectCompleted()) {
            addCommentBtn.style.display = 'none';
        }

        addCommentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            submitTaskComment();
        });
    } else {
        console.error('add-comment-btn 요소를 찾을 수 없습니다');
    }

    const commentInput = document.getElementById('new-comment-input');
    if (commentInput) {
        // 프로젝트 완료 상태면 입력창 숨기고 안내 메시지 표시
        if (isProjectCompleted()) {
            // 입력창의 부모 요소(comment-form)를 찾아서 숨김
            const commentForm = commentInput.closest('.comment-form');
            if (commentForm) {
                commentForm.style.display = 'none';
            }

            // 안내 메시지 추가
            /*const taskCommentList = document.getElementById('taskComment-list');
            if (taskCommentList && taskCommentList.parentElement) {
                const existingNotice = taskCommentList.parentElement.querySelector('.completed-project-notice');
                if (!existingNotice) {
                    const noticeDiv = document.createElement('div');
                    noticeDiv.className = 'alert alert-secondary completed-project-notice mt-3';
                    noticeDiv.innerHTML = '<i class="bi bi-info-circle me-2"></i>완료된 프로젝트는 코멘트를 작성할 수 없습니다.';
                    taskCommentList.parentElement.appendChild(noticeDiv);
                }
            }*/
        }

        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitTaskComment();
            }
        });
    } else {
        console.error('new-comment-input 요소를 찾을 수 없습니다.');
    }

    const commentList = document.getElementById('taskComment-list');
    if (commentList) {
        commentList.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-task-comment-btn');
            if (deleteBtn) {
                const commentId = parseInt(deleteBtn.dataset.commentId);
                if (!isNaN(commentId)) {
                    removeTaskComment(commentId);
                }
            }
        });
    } else {
        console.error('taskComment-list 요소를 찾을 수 없습니다');
    }
});