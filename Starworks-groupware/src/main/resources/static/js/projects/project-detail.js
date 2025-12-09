// JSP에서 전달받은 데이터를 JavaScript 변수로 변환
const projectInfoEl = document.getElementById('project-info');
const project = {
  id: projectInfoEl.dataset.id,
  name: projectInfoEl.dataset.name,
  managerId: projectInfoEl.dataset.managerId,
  statusCode: projectInfoEl.dataset.statusCode,
//  status: projectInfoEl.dataset.status,
  startDate: projectInfoEl.dataset.startDate,
  endDate: projectInfoEl.dataset.endDate,
  projectType: projectInfoEl.dataset.projectType,
  budget: projectInfoEl.dataset.budget,
  goal: projectInfoEl.dataset.goal,
  scope: projectInfoEl.dataset.scope,
  description: projectInfoEl.dataset.description,
  progress: parseInt(projectInfoEl.dataset.progress) || 0,
  fileId: projectInfoEl.dataset.fileId
};

const memberEls = document.querySelectorAll('#member-list li');
const memberList = Array.from(memberEls).map(el => ({
  userId: el.dataset.userId,
  userName: el.dataset.userName,
  authCode: el.dataset.authCode,
  deptNm: el.dataset.deptNm,
  jobNm: el.dataset.jobNm
}));

const currentUserEl = document.getElementById('current-user');
const currentUser = {
  id: currentUserEl.dataset.id,
  name: currentUserEl.dataset.name,
  avatar: currentUserEl.dataset.avatar,
  authCode: currentUserEl.dataset.authCode
};

// 권한 확인 함수 추가
function canEditTask() {
    return currentUser.authCode === 'B101'; // 팀장만 수정/삭제 가능
}

function canChangeStatus() {
    return currentUser.authCode === 'B101' || currentUser.authCode === 'B102'; // 팀장, 참여자 상태 변경 가능
}

// 상태 코드를 한글명으로 변환
const statusCodeToName = {
    'B301': '승인대기',
    'B302': '진행',
    'B303': '보류',
    'B304': '완료',
    'B305': '취소'
};

// 업무 상태 코드 매핑
const taskStatusMap = {
    'T101': '미시작',
    'T102': '진행중',
    'T103': '보류',
    'T104': '완료',
    'T105': '취소'
};

const taskStatusColors = {
    'T101': 'secondary',
    'T102': 'primary',
    'T103': 'warning',
    'T104': 'success',
    'T105': 'danger'
};

document.addEventListener('DOMContentLoaded', function() {
	const bizId = '${project.bizId}';

    const urlParams = new URLSearchParams(window.location.search); // URL의 쿼리 파라미터 파싱
    const activeTab = urlParams.get('activeTab'); // ?activeTab=tasks-tab에서 'tasks-tab' 추출

    if (activeTab === 'tasks-tab') {
        const tabElement = document.getElementById('tasks-tab');
        const tab = new bootstrap.Tab(tabElement); //Bootstrap의 Tab 객체 생성
        tab.show(); //탭 활성화

        setTimeout(() => {
            loadTaskList(1, bizId, null);

            // 함수가 존재하는지 확인 후 호출
            if (typeof loadTaskAssignees === 'function') {
                loadTaskAssignees(bizId);
            }
        }, 100);
    } else if (activeTab && document.getElementById(activeTab)) {
		// 다른 탭 ID가 있으면 그 탭 활성화
        document.getElementById(activeTab).click();
    } else {
		// 파라미터 없으면 기본(개요) 탭 활성화
        document.getElementById('overview-tab').click();
    }

	// 프로젝트가 승인대기(B301) 상태면 비활성화
    if (project.statusCode === 'B301') {
        // 승인대기 상태 처리
        disablePendingProject();
    }

    // RENDER FUNCTIONS
    const createFileListItem = (file) => {
        return (
            '<div class="d-flex justify-content-between align-items-center border-bottom py-2">' +
                '<div>' +
                    '<i class="bi bi-file-earmark-text me-2"></i>' +
                    '<a href="' + (file.url || '#') + '" class="text-body">' + (file.name || '파일 이름 없음') + '</a>' +
                '</div>' +
                '<small class="text-muted">' + (file.size || '') + '</small>' +
            '</div>'
        );
    };

    const createAvatarGroup = (container, members, authCode) => {
        container.innerHTML = '';
        const filteredMembers = members.filter(m => m.authCode === authCode);

        if (filteredMembers.length === 0) {
            container.innerHTML = '<p class="text-muted small">해당 없음</p>';
            return;
        }

        filteredMembers.slice(0, 5).forEach(function(m) {
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar avatar-sm';
            avatarDiv.innerHTML = '<img src="/assets/images/faces/' + m.userId + '.jpg" alt="' + m.userId + '" data-bs-toggle="tooltip" data-bs-placement="top" title="' + m.userId + '">';
            container.appendChild(avatarDiv);
        });

        if (filteredMembers.length > 5) {
            const remaining = filteredMembers.length - 5;
            const moreAvatarDiv = document.createElement('div');
            moreAvatarDiv.className = 'avatar avatar-sm bg-secondary';
            moreAvatarDiv.innerHTML = '<span class="avatar-content" data-bs-toggle="tooltip" data-bs-placement="top" title="외 ' + remaining + '명">+' + remaining + '</span>';
            container.appendChild(moreAvatarDiv);
        }
    };

    const renderProjectHeader = () => {
		// 우측 본문 프로젝트명 렌더링
        const iconHtml = '<i class="bi bi-list-task me-2"></i>';
    document.getElementById('project-name').innerHTML = iconHtml + project.name; // textContent 대신 innerHTML 사용

    new bootstrap.Tooltip(document.body, {
        selector: '[data-bs-toggle="tooltip"]',
        trigger: 'hover'
    });
    };

    const renderProjectProgress = () => {
        const progressBar = document.getElementById('project-progress-bar');
        if (progressBar) {
            progressBar.style.width = project.progress + '%';
            progressBar.setAttribute('aria-valuenow', project.progress);
            progressBar.textContent = project.progress + '%';
        }
    };


    // INITIAL LOAD
    renderProjectHeader();
    renderProjectProgress();

	// 프로젝트 완료 처리
	const confirmCompleteBtn = document.getElementById('confirm-complete-btn');
    if (confirmCompleteBtn) {
        confirmCompleteBtn.addEventListener('click', handleProjectComplete);
    }

    // 프로젝트 취소 처리 버튼 리스너 연결
    const confirmCancellationBtn = document.getElementById('confirm-cancellation-btn');
    if (confirmCancellationBtn) {
        // handleProjectCancel 함수 연결
        confirmCancellationBtn.addEventListener('click', handleProjectCancel);
    }

    // 모달이 닫힐 때 유효성 검사 상태 초기화
    const cancelModalEl = document.getElementById('project-cancel-modal');
    if (cancelModalEl) {
        cancelModalEl.addEventListener('hidden.bs.modal', function() {
            const reasonInput = document.getElementById('cancellation-reason');
            if (reasonInput) {
                reasonInput.classList.remove('is-invalid');
                const invalidFeedback = reasonInput.nextElementSibling;
                if(invalidFeedback) {
                     invalidFeedback.style.display = 'none';
                }
                reasonInput.value = ''; // 입력값 초기화
            }
        });
    }

    // Summernote Initialization
    if (typeof $ !== 'undefined' && $.fn.summernote) {
        $('#post-content').summernote({
            height: 300,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview']],
            ]
        });
    }

    // 승인대기 상태 처리 함수
    function disablePendingProject() {
        // 1. 상태 뱃지 표시
        const projectNameElement = document.getElementById('project-name');
        const statusBadge = document.createElement('span');
        statusBadge.className = 'badge bg-warning ms-2';
        statusBadge.textContent = '승인대기';
        projectNameElement.appendChild(statusBadge);

        // 2. 탭 비활성화
        document.getElementById('tasks-tab').disabled = true;
        document.getElementById('schedule-tab').disabled = true;
        document.getElementById('board-tab').disabled = true;

        // 3. 수정 버튼 비활성화
        const editButtons = document.querySelectorAll('.btn-edit');
        editButtons.forEach(btn => {
            btn.classList.add('disabled');
            btn.setAttribute('aria-disabled', 'true');
        });

        // 4. 업무 등록 버튼 비활성화
        const createTaskBtn = document.getElementById('create-task-btn');
        if (createTaskBtn) {
            createTaskBtn.disabled = true;
            createTaskBtn.setAttribute('data-bs-toggle', 'tooltip');
            createTaskBtn.setAttribute('title', '프로젝트 승인 후 사용 가능합니다.');
        }

        // 5. 게시판 작성 버튼 비활성화
        const writePostBtn = document.querySelector('[data-bs-target="#write-post-modal"]');
        if (writePostBtn) {
            writePostBtn.disabled = true;
        }

        // 6. 비활성화 안내 메시지 표시
        const overviewPane = document.getElementById('overview-pane');
        if (overviewPane) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning mt-3';
            alertDiv.innerHTML = '<i class="bi bi-info-circle me-2"></i>이 프로젝트는 현재 승인 대기 상태입니다. 최종 승인 후 사용 가능합니다.';
            overviewPane.insertBefore(alertDiv, overviewPane.firstChild);
        }

        // 7. 진행률 0%로 표시
        const progressBar = document.getElementById('project-progress-bar');
        if (progressBar) {
            progressBar.classList.remove('bg-primary');
            progressBar.classList.add('bg-secondary');
            progressBar.style.width = '0%';
            progressBar.textContent = '0% (승인대기)';
        }
    }
});

// 프로젝트 완료 처리 함수
function handleProjectComplete() {
    Swal.fire({
        title: '프로젝트 완료',
        html: '정말 완료 처리하시겠습니까?<br>완료 후에는 수정할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '완료 처리',
        cancelButtonText: '취소',
        confirmButtonColor: '#435ebe',
        cancelButtonColor: '#6c757d',
        reverseButtons: true  // 취소 버튼을 왼쪽에 배치
    }).then((result) => {
        if (!result.isConfirmed) return;

        // 완료 처리 요청
        fetch('/rest/project/' + project.id + '/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('완료 처리에 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '완료!',
                    text: '프로젝트가 완료 처리되었습니다.',
                    confirmButtonText: '확인'
                }).then(() => {
                    // 모달 닫기
                    const modal = bootstrap.Modal.getInstance(
                        document.getElementById('project-complete-modal')
                    );
                    if (modal) {
                        modal.hide();
                    }
                    // 페이지 새로고침
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '실패',
                    text: data.message || '완료 처리에 실패했습니다.',
                    confirmButtonText: '확인'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: '완료 처리 중 오류가 발생했습니다.',
                confirmButtonText: '확인'
            });
        });
    });
}

async function handleProjectCancel() {
    // 취소 사유 input 요소 가져오기 (UX/경고용)
    const reasonInput = document.getElementById('cancellation-reason');
    const reason = reasonInput.value.trim();
    const cancelModalEl = document.getElementById('project-cancel-modal');
    // 인스턴스가 없을 경우를 대비해 null 체크를 합니다.
    const cancelModal = cancelModalEl ? bootstrap.Modal.getInstance(cancelModalEl) : null;

    // 1. 유효성 검사: 취소 사유 필수(그냥 UI)
    if (!reason) {
        reasonInput.classList.add('is-invalid');
        // invalid-feedback 표시
        const invalidFeedback = reasonInput.nextElementSibling;
        if(invalidFeedback) {
             invalidFeedback.style.display = 'block';
        }
        return;
    } else {
        reasonInput.classList.remove('is-invalid');
        const invalidFeedback = reasonInput.nextElementSibling;
        if(invalidFeedback) {
             invalidFeedback.style.display = 'none';
        }
    }

    // confirm() -> Swal.fire()로 변경
    const confirmResult = await Swal.fire({
        title: '프로젝트 취소 확인',
        html: `
            <p>프로젝트를 정말로 취소하시겠습니까?</p>
            <p class="text-danger" style="font-weight: bold;">취소된 프로젝트는 되돌릴 수 없으며 보관함으로 이동합니다.</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', // 취소(위험) 버튼 색상
        cancelButtonColor: '#6c757d', // 취소 버튼 색상
        confirmButtonText: '예, 취소합니다',
        cancelButtonText: '아니요, 유지합니다'
    });

    if (!confirmResult.isConfirmed) {
        return; // 사용자가 '아니요'를 클릭한 경우 중단
    }

    const CANCELLATION_CODE = 'B305';

    // 2. 상태 변경을 위한 최소 데이터 구성 (서버에서 bizId만 사용)
    const updateData = {
        bizId: project.id,
        bizSttsCd: CANCELLATION_CODE
        // 취소 사유는 서버에서 요구하지 않으므로 포함하지 않습니다.
    };

    // 3. 서버로 취소 요청 전송
    fetch(`/rest/project/${project.id}/cancel`, {
        method: 'POST', // POST 메서드 사용
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                 // 5. 서버에서 JSON 응답이 오지 않을 경우를 대비한 상세 에러 메시지
                 const errorText = text.length > 500 ? text.substring(0, 500) + '...' : text;
                 throw new Error(`취소 실패. 응답 코드: ${response.status}. 서버 에러 메시지: ${errorText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 성공 alert() -> Swal.fire()로 변경 후 페이지 이동
            Swal.fire({
                title: '취소 완료!',
                text: '프로젝트가 성공적으로 취소 처리되었습니다.',
                icon: 'success',
                confirmButtonText: '확인',
                confirmButtonColor: '#3085d6'
            }).then(() => { // 사용자가 '확인'을 누른 후 페이지 이동
                if (cancelModal) {
                    cancelModal.hide();
                }
                location.href = '/projects/archive';
            });

        } else {
            // 실패 alert() -> Swal.fire()로 변경
            Swal.fire({
                title: '처리 실패',
                text: data.message || '취소 처리에 실패했습니다. 서버 로직을 확인하세요.',
                icon: 'error',
                confirmButtonText: '확인',
                confirmButtonColor: '#d33'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // 최종 오류 alert() -> Swal.fire()로 변경
        Swal.fire({
            title: '시스템 오류',
            text: '취소 처리 중 오류가 발생했습니다: ' + error.message,
            icon: 'error',
            confirmButtonText: '확인',
            confirmButtonColor: '#d33'
        });
    });
}
