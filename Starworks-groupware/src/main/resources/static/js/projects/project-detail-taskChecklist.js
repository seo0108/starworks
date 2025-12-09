/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 10.     	김주민            최초 생성
 * 2025. 10. 10.     	김주민            진행률 색상 공통 함수 사용
 *
 * </pre>
 */

// 업무 ID를 저장하는 변수
let currentEditingTaskId = null;
let currentTaskData = null; // 현재 업무 객체(task)를 저장할 변수

// 프로젝트 완료 상태 체크 함수
function isProjectCompleted() {
    return project.statusCode === 'B304' || project.statusCode === '완료';
}

// 진행률 색상 계산 공통 함수
function getProgressColor(progress) {
    if (progress === 100) return 'bg-success';
    if (progress > 50) return 'bg-primary';
    if (progress > 0) return 'bg-warning';
    return 'bg-secondary';
}

/**
 * 체크리스트 목록 렌더링
 */
function renderChecklist(taskId) {
    const container = document.getElementById('checklist-container');

    if (!container) {
        console.error('checklist-container를 찾을 수 없습니다.');
        return;
    }

    // 현재 편집 중인 업무 ID 저장
    currentEditingTaskId = taskId;

    currentTaskData = $('#task-checklist-modal').data('current-task-data');

    // 권한 체크: 프로젝트 완료 상태도 고려
    const canManage = !isProjectCompleted() &&
                     (typeof canManageChecklist === 'function' ? canManageChecklist(currentTaskData) : false);

    const addInputGroup = document.querySelector('.input-group.mb-4');

    if (addInputGroup) {
        if (canManage) {
            addInputGroup.style.display = 'flex';
        } else {
            addInputGroup.style.display = 'none';
        }
    }

    // 체크리스트 조회
    fetch(`/rest/task-checklist/${taskId}`)
        .then(response => {
            if (!response.ok) throw new Error('체크리스트 조회 실패');
            return response.json();
        })
        .then(data => {
            const checklists = data.checklists || [];

            if (checklists.length === 0) {
                container.innerHTML = '<p class="text-center text-muted">등록된 체크리스트가 없습니다.</p>';
                return;
            }

            container.innerHTML = '';
            checklists.forEach(item => {
                const itemEl = createChecklistItem(item);
                container.appendChild(itemEl);
            });

            // 진행률 업데이트
            updateTaskProgress(taskId, checklists);
        })
        .catch(error => {
            console.error('체크리스트 조회 실패:', error);
            container.innerHTML = '<p class="text-center text-danger">체크리스트를 불러오는데 실패했습니다.</p>';
            Swal.fire({
                icon: 'error',
                title: '체크리스트 조회 실패',
                text: '체크리스트 목록을 불러오는 중 오류가 발생했습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#435ebe'
            });
        });
}

/**
 * 체크리스트 아이템 HTML 생성
 */
function createChecklistItem(item) {
	// 프로젝트 완료 상태 체크 추가
    const canManage = !isProjectCompleted() &&
                     (typeof canManageChecklist === 'function' ? canManageChecklist(currentTaskData) : false);

    const itemEl = document.createElement('div');
    itemEl.className = `checklist-item list-group-item d-flex align-items-center gap-2 mb-2 ${item.compltYn === 'Y' ? 'done' : ''}`;
    itemEl.dataset.itemId = item.chklistSqn;

    // 담당자 권한이 있을 때만 수정/삭제 버튼 HTML 생성
    let buttonHTML = '';
    if (canManage) {
        buttonHTML = `
            <div class="btn-group btn-group-sm" role="group">
                <button class="btn btn-outline-secondary btn-edit-checklist"
                        data-checklist-id="${item.chklistSqn}"
                        title="수정">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-delete-checklist"
                        data-checklist-id="${item.chklistSqn}"
                        title="삭제">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    }

    itemEl.innerHTML = `
        <input class="form-check-input checklist-checkbox"
               type="checkbox"
               ${item.compltYn === 'Y' ? 'checked' : ''}
               data-checklist-id="${item.chklistSqn}">
        <span class="checklist-text flex-grow-1">${escapeHtml(item.chklistCont)}</span>
        ${buttonHTML}
    `;

    // 체크박스 활성화/비활성화 (완료 상태 변경 담당자만 가능)
    const checkbox = itemEl.querySelector('.checklist-checkbox');
    if (checkbox && !canManage) {
        checkbox.disabled = true; // 권한이 없으면 체크박스 비활성화
    }

    return itemEl;
}

/**
 * 체크리스트 추가
 */
function addChecklistItem(taskId) {
	if (typeof canManageChecklist === 'function' && !canManageChecklist(currentTaskData)) {
        Swal.fire({
            icon: 'warning',
            title: '권한 없음',
            text: '체크리스트 추가는 업무 담당자만 가능합니다.',
            confirmButtonText: '확인'
        });
        return;
    }
    const input = document.getElementById('new-checklist-item-input');
    const content = input.value.trim();

    if (!content) {
        Swal.fire({
            icon: 'warning',
            title: '입력 오류',
            text: '체크리스트 내용을 입력해주세요.',
            confirmButtonText: '확인',
            confirmButtonColor: '#435ebe'
        });
        input.focus();
        return;
    }

    const data = {
        taskId: taskId,
        taskPicId: currentUser.id,
        chklistCont: content
    };

    fetch(`/rest/task-checklist/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('체크리스트 추가 실패');
        return response.json();
    })
    .then(result => {
        if (result.success) {
            input.value = '';
            renderChecklist(taskId);

            // 업무 목록 새로고침 추가
            if (typeof loadTaskList === 'function') {
                loadTaskList(currentTaskPage);
            }

            console.log('체크리스트가 추가되었습니다.');
        } else {
            throw new Error('체크리스트 추가 실패');
        }
    })
    .catch(error => {
        console.error('체크리스트 추가 실패:', error);
        Swal.fire({
            icon: 'error',
            title: '체크리스트 추가 실패',
            text: '서버 오류로 체크리스트 추가에 실패했습니다.',
            confirmButtonText: '확인',
            confirmButtonColor: '#435ebe'
        });
    });
}

/**
 * 체크리스트 완료 상태 토글
 */
function toggleChecklistItem(chklistSqn, checked) {
	// 권한 체크 로직 추가
    if (typeof canManageChecklist === 'function' && !canManageChecklist(currentTaskData)) {
        Swal.fire({
            icon: 'warning',
            title: '권한 없음',
            text: '체크리스트 상태 변경은 업무 담당자만 가능합니다.',
            confirmButtonText: '확인'
        });

        // 체크박스 원상복구
        const checkbox = document.querySelector(`[data-checklist-id="${chklistSqn}"]`);
        if (checkbox) checkbox.checked = !checked;

        return;
    }
    const compltYn = checked ? 'Y' : 'N';

    fetch(`/rest/task-checklist/${currentEditingTaskId}/${chklistSqn}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ compltYn: compltYn })
    })
    .then(response => {
        if (!response.ok) throw new Error('체크리스트 업데이트 실패');
        return response.json();
    })
    .then(result => {
        if (result.success) {
            const itemEl = document.querySelector(`[data-item-id="${chklistSqn}"]`);
            if (itemEl) {
                if (checked) {
                    itemEl.classList.add('done');
                } else {
                    itemEl.classList.remove('done');
                }
            }

            // 진행률 업데이트
            if (currentEditingTaskId) {
                renderChecklist(currentEditingTaskId);

                // 업무 목록 새로고침 추가
                if (typeof loadTaskList === 'function') {
                    loadTaskList(currentTaskPage);
                }
            }
        } else {
            throw new Error('체크리스트 업데이트 실패');
        }
    })
    .catch(error => {
        console.error('체크리스트 업데이트 실패:', error);
        Swal.fire({
            icon: 'error',
            title: '업데이트 실패',
            text: '체크리스트 상태 변경에 실패했습니다. 다시 시도해 주세요.',
            confirmButtonText: '확인',
            confirmButtonColor: '#435ebe'
        });

        // 체크박스 원상복구
        const checkbox = document.querySelector(`[data-checklist-id="${chklistSqn}"]`);
        if (checkbox) checkbox.checked = !checked;
    });
}

/**
 * 체크리스트 수정
 */
function editChecklistItem(chklistSqn) {
    if (typeof canManageChecklist === 'function' && !canManageChecklist(currentTaskData)) {
        Swal.fire({
            icon: 'warning',
            title: '권한 없음',
            text: '체크리스트 수정은 업무 담당자만 가능합니다.',
            confirmButtonText: '확인'
        });
        return;
    }

    const itemEl = document.querySelector(`[data-item-id="${chklistSqn}"]`);
    if (!itemEl) return;

    const textSpan = itemEl.querySelector('.checklist-text');
    const currentText = textSpan.textContent;

    // 브라우저 기본 prompt
    const newText = prompt('체크리스트 항목 수정:', currentText);

    if (newText === null) return; // 취소
    if (newText.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: '입력 오류',
            text: '체크리스트 내용을 입력해주세요.',
            confirmButtonText: '확인',
            confirmButtonColor: '#435ebe'
        });
        return;
    }
    if (newText.trim() === currentText) return;

    fetch(`/rest/task-checklist/${currentEditingTaskId}/${chklistSqn}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chklistCont: newText.trim() })
    })
    .then(response => {
        if (!response.ok) throw new Error('체크리스트 수정 실패');
        return response.json();
    })
    .then(result => {
        if (result.success) {
            textSpan.textContent = newText.trim();

            Swal.fire({
                icon: 'success',
                title: '수정 완료',
                text: '체크리스트 내용이 수정되었습니다.',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            throw new Error('체크리스트 수정 실패');
        }
    })
    .catch(error => {
        console.error('체크리스트 수정 실패:', error);
        Swal.fire({
            icon: 'error',
            title: '수정 실패',
            text: '체크리스트 내용 수정에 실패했습니다.',
            confirmButtonText: '확인',
            confirmButtonColor: '#435ebe'
        });
    });
}

/**
 * 체크리스트 삭제
 */
async function deleteChecklistItem(chklistSqn, taskId) {
    // 권한 체크 로직
    if (typeof canManageChecklist === 'function' && !canManageChecklist(currentTaskData)) {
        Swal.fire({
            icon: 'warning',
            title: '권한 없음',
            text: '체크리스트 삭제는 업무 담당자만 가능합니다.',
            confirmButtonText: '확인'
        });
        return;
    }

    const result = await Swal.fire({
        title: '체크리스트 삭제',
        text: '이 체크리스트 항목을 삭제하시겠습니까?',
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
        const response = await fetch(`/rest/task-checklist/${taskId}/${chklistSqn}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('체크리스트 삭제 실패');

        const result = await response.json();

        if (result.success) {
            renderChecklist(taskId);

            // 업무 목록 새로고침 추가
            if (typeof loadTaskList === 'function') {
                loadTaskList(currentTaskPage);
            }

            // 삭제 성공 메시지
            Swal.fire({
                icon: 'success',
                title: '삭제 완료',
                text: '체크리스트가 삭제되었습니다.',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            throw new Error('체크리스트 삭제 실패');
        }
    } catch (error) {
        console.error('체크리스트 삭제 실패:', error);
        Swal.fire({
            icon: 'error',
            title: '삭제 실패',
            text: '체크리스트 내용 삭제에 실패했습니다.',
            confirmButtonText: '확인',
            confirmButtonColor: '#435ebe'
        });
    }
}

/**
 * 업무 진행률 업데이트
 */
function updateTaskProgress(taskId, checklists) {
    if (!checklists || checklists.length === 0) {
        updateProgressBar(0);
        return;
    }

    const completedCount = checklists.filter(item => item.compltYn === 'Y').length;
    const progress = Math.round((completedCount / checklists.length) * 100);

    updateProgressBar(progress);
}

/**
 * 모달 내 진행률 바 업데이트
 */
function updateProgressBar(progress) {
    const progressContainer = document.getElementById('modal-task-progress');
    if (!progressContainer) return;

    // 공통 함수 사용
    const progressColor = getProgressColor(progress);

    progressContainer.innerHTML = `
        <div class="progress" style="height: 20px;">
            <div class="progress-bar ${progressColor}"
                 role="progressbar"
                 style="width: ${progress}%;"
                 aria-valuenow="${progress}"
                 aria-valuemin="0"
                 aria-valuemax="100">
                ${progress}%
            </div>
        </div>
    `;
}

/**
 * HTML 이스케이프
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
function initChecklistEvents() {
    // 체크리스트 추가 버튼
    const addBtn = document.getElementById('add-checklist-item-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            if (currentEditingTaskId) {
                addChecklistItem(currentEditingTaskId);
            }
        });
    }

    // 체크리스트 컨테이너에 이벤트 위임
    const container = document.getElementById('checklist-container');
    if (container) {
        container.addEventListener('click', function(e) {
            const checkbox = e.target.closest('.checklist-checkbox');
            const editBtn = e.target.closest('.btn-edit-checklist');
            const deleteBtn = e.target.closest('.btn-delete-checklist');

            if (checkbox) {
                const chklistSqn = parseInt(checkbox.dataset.checklistId);
                toggleChecklistItem(chklistSqn, checkbox.checked);
            } else if (editBtn) {
                const chklistSqn = parseInt(editBtn.dataset.checklistId);
                editChecklistItem(chklistSqn);
            } else if (deleteBtn) {
                const chklistSqn = parseInt(deleteBtn.dataset.checklistId);
                deleteChecklistItem(chklistSqn, currentEditingTaskId);
            }
        });
    }

    // Enter 키로 체크리스트 추가
    const input = document.getElementById('new-checklist-item-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (currentEditingTaskId) {
                    addChecklistItem(currentEditingTaskId);
                }
            }
        });
    }
}

// 페이지 로드 시 이벤트 초기화
document.addEventListener('DOMContentLoaded', initChecklistEvents);