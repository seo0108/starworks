/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 06.     	김주민            최초 생성
 * 2025. 10. 07.     	김주민            업무 수정 기능 추가
 * 2025. 10. 08.     	김주민            업무 상태 변경 권한 추가
 * 2025. 10. 10. 		김주민			진행률 색상 공통 함수 추가
 *
 * </pre>
 */

// 전역 변수
let currentTaskPage = 1;

let selectedTaskIds = new Set();

function isProjectCompleted() {
    return project.statusCode === 'B304' || project.statusCode === '완료';
}

//  진행률 색상 계산 공통 함수
function getProgressColor(progress) {
    if (progress === 100) return 'bg-success';
    if (progress > 50) return 'bg-primary';
    if (progress > 0) return 'bg-warning';
    return 'bg-secondary';
}

// ===============================================
// 업무 등록 모달용 더미 데이터 채우기 함수
// '월리를 찾아라' 콜라보 신메뉴 개발 프로젝트 관련
// ===============================================

// 더미 데이터 버튼 이벤트 리스너
$(document).ready(function() {
    $(document).on('click', '#fill-task-dummy-btn', function() {
        fillTaskDummyData();
    });
});

function fillTaskDummyData() {
    // 날짜 계산 (오늘부터 20일)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 20);

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // 업무명
    $('#task-name-modal').val('[레시피 개선] 아메리카노 원두 블렌딩 비율 재조정 및 추출 테스트');

    // 시작일/종료일
    $('#start-date-modal').val(formatDate(today));
    $('#end-date-modal').val(formatDate(endDate));

    // 상세내용
    $('#task-description-modal').val('고객 VOC에서 지적된 "맛의 일관성 부족" 개선을 위한 아메리카노 레시피 표준화 작업. 현행 블렌딩 비율(브라질 40% / 콜롬비아 30% / 에티오피아 30%) 대비 3가지 개선안 테스트. 추출 온도, 시간, 압력 등 변수별 관능평가 실시 후 최적 레시피 도출. 바리스타 10명 대상 블라인드 테스트 진행.');

}



// 업무 목록 조회
function loadTaskList(page = 1) {
    currentTaskPage = page;

    const bizUserId = getCurrentFilteredBizUserId();

    $.ajax({
        url: `/rest/task/list/${project.id}`,
        method: 'GET',
        data: {
            page: page,
            bizUserId: bizUserId  // <-- 담당자 ID 파라미터 추가
        },
        success: function(response) {
            renderTaskList(response.mainTaskList);
            renderTaskPagingHTML(response.pagingHTML);
            updateTaskCount(response.totalRecord);
        },
        error: function(xhr, status, error) {
            console.error('업무 목록 조회 실패:', error);
            Swal.fire({
                icon: 'error',
                title: '조회 실패',
                text: '업무 목록을 불러오는데 실패했습니다.',
                confirmButtonText: '확인'
            });
        }
    });
}

// 업무 개수 업데이트 함수 추가
function updateTaskCount(totalRecord) {
    const countBadge = $('#task-total-count');
    if (countBadge.length) {
        countBadge.text(totalRecord || 0);
    }
}


// 업무 완료 여부 체크 함수
function isTaskCompleted(task) {
    return task.taskSttsCd === 'B404';
}

// 업무 목록 렌더링 함수
function renderTaskList(taskList) {
    const tbody = $('#task-list-tbody');
    tbody.empty();

    // 선택 초기화
    selectedTaskIds.clear();
    updateDeleteButton();

    if (!taskList || taskList.length === 0) {
        const colspan = (canEditTask() && !isProjectCompleted()) ? 7 : 6;
        tbody.append(`
            <tr>
                <td colspan="${colspan}" class="text-center text-muted">등록된 업무가 없습니다.</td>
            </tr>
        `);
        return;
    }

    taskList.forEach(task => {
        const startDate = task.strtTaskDt ? task.strtTaskDt.split('T')[0] : '-';
        const endDate = task.endTaskDt ? task.endTaskDt.split('T')[0] : '-';

        const memberInfo = memberList.find(m => m.userId === task.bizUserId);
        let assigneeDisplay = task.bizUserNm || '-';

        const jobName = task.jobNm || (memberInfo ? memberInfo.jobNm : null);
        if (jobName) {
            assigneeDisplay += ` ${jobName}`;
        }
        if (task.bizUserDeptNm) {
            assigneeDisplay += ` (${task.bizUserDeptNm})`;
        }

        const isMyTask = currentUser.id === task.bizUserId;
        const isCompleted = isTaskCompleted(task);

        // 완료된 업무는 회색 배경 추가
        const rowClass = isCompleted ? 'table-light-secondary' : (isMyTask ? 'task-highlight-row' : ''); //light를 없애면 배경색 생김

        // 프로젝트 완료 상태 또는 업무 완료 상태 체크
        let statusColumn;
        if (isProjectCompleted() || isCompleted) {
            statusColumn = getStatusBadge(task.taskSttsCd);
        } else if (canChangeTaskStatus(task)) {
            statusColumn = `
                <select class="form-select form-select-sm task-status-select"
                        data-task-id="${task.taskId}"
                        data-original-status="${task.taskSttsCd}">
                    <option value="B401" ${task.taskSttsCd === 'B401' ? 'selected' : ''}>미시작</option>
                    <option value="B402" ${task.taskSttsCd === 'B402' ? 'selected' : ''}>진행중</option>
                    <option value="B403" ${task.taskSttsCd === 'B403' ? 'selected' : ''}>보류</option>
                    <option value="B404" ${task.taskSttsCd === 'B404' ? 'selected' : ''}>완료</option>
                </select>
            `;
        } else {
            statusColumn = getStatusBadge(task.taskSttsCd);
        }

        // 진행률 공통 함수 사용
        const progress = task.taskPrgrs || 0;
        const progressColor = getProgressColor(progress);

        // 체크박스는 완료된 업무는 제외
        const checkboxColumn = (canEditTask() && !isProjectCompleted() && !isCompleted)
            ? `<td><input type="checkbox" class="form-check-input task-checkbox" data-task-id="${task.taskId}"></td>`
            : (canEditTask() && !isProjectCompleted())
                ? `<td><input type="checkbox" class="form-check-input" disabled></td>`
                : '';

        const row = `
            <tr class="task-row ${rowClass}" data-task-id="${task.taskId}">
                ${checkboxColumn}
                <td class="task-name-cell" style="cursor: pointer;">
                    <span class="text-primary">${task.taskNm || '-'}</span>
                    ${isCompleted ? '<span class="badge bg-success ms-2">완료됨</span>' : ''}
                </td>
                <td>${assigneeDisplay}</td>
                <td class="task-status-cell">${statusColumn}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar ${progressColor}" role="progressbar"
                            style="width: ${progress}%"
                            aria-valuenow="${progress}"
                            aria-valuemin="0" aria-valuemax="100">
                            ${progress}%
                        </div>
                    </div>
                </td>
                <td>${startDate} ~ ${endDate}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary task-detail-btn"
                        data-task-id="${task.taskId}">
                        상세
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });

    // 업무명 클릭 이벤트 (이벤트 위임)
    tbody.off('click', '.task-name-cell').on('click', '.task-name-cell', function(e) {
        const taskId = $(this).closest('tr').data('task-id');
        openTaskDetailModal(taskId);
    });

    // 상세 버튼 클릭 이벤트 (이벤트 위임)
    tbody.off('click', '.task-detail-btn').on('click', '.task-detail-btn', function(e) {
        e.stopPropagation();
        const taskId = $(this).data('task-id');
        openTaskDetailModal(taskId);
    });

    // 체크박스 클릭 이벤트
    tbody.off('change', '.task-checkbox').on('change', '.task-checkbox', function(e) {
        e.stopPropagation();
        const taskId = $(this).data('task-id');

        if ($(this).is(':checked')) {
            selectedTaskIds.add(taskId);
        } else {
            selectedTaskIds.delete(taskId);
        }

        updateDeleteButton();
        updateSelectAllCheckbox();
    });

    // 완료된 프로젝트가 아닐 때만 상태 변경 이벤트 바인딩
    if (!isProjectCompleted()) {
        tbody.off('click', '.task-status-cell').on('click', '.task-status-cell', function(e) {
            e.stopPropagation();
        });

        $('.task-status-select').on('change', function() {
            const taskId = $(this).data('task-id');
            handleStatusChange(this, taskId);
        });
    }
}

// 업무 상태 변경 권한 체크
function canChangeTaskStatus(task) {
    const authCode = currentUser.authCode;
    const currentUserId = currentUser.id;

    // 책임자는 모든 업무 상태 변경 가능
    if (authCode === 'B101') {
        return true;
    }

    // 참여자는 본인 담당 업무만 변경 가능
    if (authCode === 'B102' && task.bizUserId === currentUserId) {
        return true;
    }

    // 그 외는 불가
    return false;
}

// 상태 변경 핸들러
function handleStatusChange(selectElement, taskId) {
    const newStatus = $(selectElement).val();
    const originalStatus = $(selectElement).data('original-status');

    Swal.fire({
        title: '업무 상태 변경',
        text: '업무 상태를 변경하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '변경',
        cancelButtonText: '취소',
        confirmButtonColor: '#435ebe',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/rest/task/status',
                method: 'PUT',
                data: {
                    taskId: taskId,
                    taskSttsCd: newStatus
                },
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '변경 완료',
                            text: '업무 상태가 변경되었습니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#435ebe'
                        }).then(() => {
                            // 원래 상태 업데이트
                            $(selectElement).data('original-status', newStatus);
                            // 목록 새로고침
                            loadTaskList(currentTaskPage);
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '변경 실패',
                            text: response.message || '상태 변경에 실패했습니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#435ebe'
                        });
                        // 실패 시 원래 값으로 되돌림
                        $(selectElement).val(originalStatus);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('상태 변경 실패:', error);

                    // 에러 메시지 파싱
                    let errorMessage = '상태 변경에 실패했습니다.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: '변경 실패',
                        text: errorMessage,
                        confirmButtonText: '확인',
                        confirmButtonColor: '#435ebe'
                    });
                    // 에러 시 원래 값으로 되돌림
                    $(selectElement).val(originalStatus);
                }
            });
        } else {
            // 취소 시 원래 값으로 되돌림
            $(selectElement).val(originalStatus);
        }
    });
}

// 업무 수정 권한 체크 (책임자만)
function canEditTask() {
    return currentUser.authCode === 'B101';
}

// 상태 코드에 따른 배지 반환
function getStatusBadge(statusCode) {
    const statusMap = {
        'B401': '<span class="badge bg-light-secondary">미시작</span>',
        'B402': '<span class="badge bg-primary">진행중</span>',
        'B403': '<span class="badge bg-warning">보류</span>',
        'B404': '<span class="badge bg-success">완료</span>',
        'B405': '<span class="badge bg-danger">취소</span>'
    };
    return statusMap[statusCode] || '<span class="badge bg-light-secondary">-</span>';
}

// 페이징 HTML 렌더링
function renderTaskPagingHTML(pagingHTML) {
    $('#task-paging-area').html(pagingHTML);
}

// 페이징 함수 (MazerPaginationRenderer에서 호출)
function fnMainTaskPaging(page) {
    loadTaskList(page);
}

// 업무 상세 모달 열기
function openTaskDetailModal(taskId) {

	$('#task-details-container .alert').remove(); //모달 초기화 시 기존 alert 제거

   $.ajax({
        url: '/rest/task',
        method: 'GET',
        data: { taskId: taskId },
        success: function(response) {
            const task = response.task;
            const fileList = response.fileList;
            const isCompleted = isTaskCompleted(task);

            $('#task-checklist-modal').data('current-task-id', taskId);
            $('#task-checklist-modal').data('current-task-data', task);

            $('#taskChecklistModalLabel span').text(task.taskNm);

            const memberInfo = memberList.find(m => m.userId === task.bizUserId);
            let assigneeDisplay = task.bizUserNm || '-';
            const jobName = task.jobNm || (memberInfo ? memberInfo.jobNm : null);
            if (jobName) {
                assigneeDisplay += ` ${jobName}`;
            }
            if (task.bizUserDeptNm) {
                assigneeDisplay += ` (${task.bizUserDeptNm})`;
            }

            $('#modal-task-assignee').text(assigneeDisplay);

            // 완료된 프로젝트 또는 완료된 업무는 상태 변경 불가
            if (isProjectCompleted() || isCompleted) {
                const statusBadge = getStatusBadge(task.taskSttsCd);
                $('#modal-task-status').html(statusBadge);
            } else if (canChangeTaskStatus(task)) {
                $('#modal-task-status').html(`
                    <select class="form-select form-select-sm" id="modal-status-select"
                            data-original-status="${task.taskSttsCd}">
                        <option value="B401" ${task.taskSttsCd === 'B401' ? 'selected' : ''}>미시작</option>
                        <option value="B402" ${task.taskSttsCd === 'B402' ? 'selected' : ''}>진행중</option>
                        <option value="B403" ${task.taskSttsCd === 'B403' ? 'selected' : ''}>보류</option>
                        <option value="B404" ${task.taskSttsCd === 'B404' ? 'selected' : ''}>완료</option>
                    </select>
                `);

                $('#modal-status-select').on('change', function() {
                    handleStatusChange(this, taskId);
                });
            } else {
                const statusBadge = getStatusBadge(task.taskSttsCd);
                $('#modal-task-status').html(statusBadge);
            }

            const progress = task.taskPrgrs || 0;
            const progressColor = getProgressColor(progress);

            $('#modal-task-progress').html(`
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar ${progressColor}" role="progressbar"
                        style="width: ${progress}%">
                        ${progress}%
                    </div>
                </div>
            `);

            const startDate = task.strtTaskDt ? task.strtTaskDt.split('T')[0] : '-';
            const endDate = task.endTaskDt ? task.endTaskDt.split('T')[0] : '-';
            $('#modal-task-period').text(`${startDate} ~ ${endDate}`);
            $('#modal-task-description').text(task.taskDetail || '-');

            const attachmentsContainer = $('#modal-task-attachments');

            if (fileList && fileList.length > 0) {
                let html = '<ul class="list-unstyled">';
                fileList.forEach(file => {
                    html += `
                        <li class="mb-1">
                            <a href="/file/download/${file.saveFileNm}" class="text-primary">
                                <i class="bi bi-paperclip"></i> ${file.orgnFileNm}
                            </a>
                        </li>
                    `;
                });
                html += '</ul>';
                attachmentsContainer.html(html);
            } else {
                attachmentsContainer.html('<p class="text-muted small">첨부파일 없음</p>');
            }

            $('#task-details-container').removeClass('d-none');
            $('#task-edit-form-container').addClass('d-none');
            $('#save-task-btn').addClass('d-none');

            // 완료된 프로젝트 또는 완료된 업무는 수정/삭제 버튼 숨김
            if (isProjectCompleted() || isCompleted) {
                $('#edit-task-btn').hide();
                $('#delete-task-btn').hide();

                // 완료된 업무 안내 메시지
                if (isCompleted && !isProjectCompleted()) {
                    const alertDiv = `
                        <div class="alert alert-info alert-dismissible fade show" role="alert">
                            <i class="bi bi-info-circle me-2"></i>
                            완료된 업무는 수정할 수 없습니다.
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `;
                    $('#task-details-container').prepend(alertDiv);
                }
            } else if (canEditTask()) {
                $('#edit-task-btn').show();
                $('#delete-task-btn').show();
            } else {
                $('#edit-task-btn').hide();
                $('#delete-task-btn').hide();
            }

            // 체크리스트 비활성화 처리 (코멘트는 작성 가능하도록 유지)
            if (isCompleted) {
                // 체크리스트 추가 버튼 비활성화
                $('#add-checklist-item-btn').prop('disabled', true);
                $('#new-checklist-item-input').prop('disabled', true);
            } else {
                $('#add-checklist-item-btn').prop('disabled', false);
                $('#new-checklist-item-input').prop('disabled', false);
            }

            // 코멘트는 완료된 업무에도 작성 가능
            $('#add-comment-btn').prop('disabled', false);
            $('#new-comment-input').prop('disabled', false)
                .attr('placeholder', '코멘트를 입력하세요...');

            $('#task-checklist-modal').modal('show');

            $('#task-checklist-modal').one('shown.bs.modal', function() {
                setTimeout(function() {
                    if (typeof renderChecklist === 'function') {
                        renderChecklist(taskId);
                    }

                    if (typeof loadTaskComments === 'function') {
                        loadTaskComments(taskId);
                    }
                }, 100);
            });
        },
        error: function(xhr, status, error) {
            console.error('업무 상세 조회 실패:', error);
            Swal.fire({
                icon: 'error',
                title: '조회 실패',
                text: '업무 상세 정보를 불러오는데 실패했습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#435ebe'
            });
        }
    });
}

// 수정 버튼 클릭 이벤트
$('#edit-task-btn').on('click', function() {

    // View 모드 숨기기
    $('#task-details-container').addClass('d-none');
    // Edit 폼 보이기
    $('#task-edit-form-container').removeClass('d-none');

    // 버튼 토글
    $('#edit-task-btn').addClass('d-none');
    $('#save-task-btn').removeClass('d-none');
    $('#delete-task-btn').addClass('d-none');

    // 현재 데이터를 Edit 폼에 채우기
    populateEditForm();
});

// Edit 폼에 현재 데이터 채우기
function populateEditForm() {
    const taskData = $('#task-checklist-modal').data('current-task-data');

    // 업무명
    $('#modal-task-name-edit').val(taskData.taskNm);

    // 담당자 선택 드롭다운 채우기
    populateEditAssigneeSelect(taskData.bizUserId);

    // 업무 상태 선택
    $('#modal-task-status-edit').val(taskData.taskSttsCd);

    // 기간
    const startDate = taskData.strtTaskDt ? taskData.strtTaskDt.split('T')[0] : '';
    const endDate = taskData.endTaskDt ? taskData.endTaskDt.split('T')[0] : '';
    $('#modal-task-start-date-edit').val(startDate);
    $('#modal-task-end-date-edit').val(endDate);

    // 상세내용
    $('#modal-task-description-edit').val(taskData.taskDetail || '');

    // 파일 입력 초기화
    $('#modal-task-files-edit').val('');
}

// 저장 버튼 클릭 이벤트
$('#save-task-btn').on('click', function() {
    const taskId = $('#task-checklist-modal').data('current-task-id');
    const taskData = $('#task-checklist-modal').data('current-task-data');

    Swal.fire({
        title: '업무 수정',
        text: '업무를 수정하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '수정',
        cancelButtonText: '취소',
        confirmButtonColor: '#435ebe',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();

            formData.append('taskId', taskId);
            formData.append('bizId', project.id);
            formData.append('taskNm', $('#modal-task-name-edit').val());
            formData.append('bizUserId', $('#modal-task-assignee-edit').val());

            const startDate = $('#modal-task-start-date-edit').val();
            const endDate = $('#modal-task-end-date-edit').val();
            formData.append('strtTaskDt', startDate ? startDate + 'T00:00:00' : '');
            formData.append('endTaskDt', endDate ? endDate + 'T00:00:00' : '');
            formData.append('taskDetail', $('#modal-task-description-edit').val());

            // 기존 값 유지
            formData.append('taskPrgrs', taskData.taskPrgrs || 0);
            // 업무 상태 - 수정된 값 사용
            formData.append('taskSttsCd', $('#modal-task-status-edit').val());

            // 파일 처리 로직
            const fileInput = $('#modal-task-files-edit')[0];
            if (fileInput && fileInput.files.length > 0) {
                // 새 파일이 선택된 경우: 새 파일로 교체
                for (let i = 0; i < fileInput.files.length; i++) {
                    formData.append('fileList', fileInput.files[i]);
                }
            } else {
                // 새 파일이 없는 경우: 기존 파일 ID 유지
                if (taskData.taskFileId) {
                    formData.append('taskFileId', taskData.taskFileId);
                }
            }

            $.ajax({
                url: '/rest/task',
                method: 'PUT',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    if(response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '수정 완료',
                            text: '업무가 수정되었습니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#435ebe'
                        }).then(() => {
                            // 모달 닫기
                            $('#task-checklist-modal').modal('hide');
                            // 목록 새로고침
                            loadTaskList(currentTaskPage);
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '수정 실패',
                            text: response.message || '업무 수정에 실패했습니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#435ebe'
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error('업무 수정 실패:', error);

                    let errorMessage = '업무 수정에 실패했습니다.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: '수정 실패',
                        text: errorMessage,
                        confirmButtonText: '확인',
                        confirmButtonColor: '#435ebe'
                    });
                }
            });
        }
    });
});

// 삭제 버튼 클릭 이벤트
$('#delete-task-btn').on('click', function() {

    const taskId = $('#task-checklist-modal').data('current-task-id');
    const taskData = $('#task-checklist-modal').data('current-task-data');

    Swal.fire({
        title: '업무 삭제',
        text: `"${taskData.taskNm}" 업무를 정말 삭제하시겠습니까?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/rest/task/delete',
                method: 'PUT',
                data: { taskId: taskId },
                success: function(response) {
                    if(response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '삭제 완료',
                            text: '업무가 삭제되었습니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#435ebe'
                        }).then(() => {
                            // 모달 닫기
                            $('#task-checklist-modal').modal('hide');
                            // 목록 새로고침
                            loadTaskList(currentTaskPage);
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '삭제 실패',
                            text: response.message || '업무 삭제에 실패했습니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#435ebe'
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error('업무 삭제 실패:', error);

                    let errorMessage = '업무 삭제에 실패했습니다.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: '삭제 실패',
                        text: errorMessage,
                        confirmButtonText: '확인',
                        confirmButtonColor: '#435ebe'
                    });
                }
            });
        }
    });
});

// 탭 전환 시 업무 목록 로드
$(document).ready(function() {
    $('#tasks-tab').on('shown.bs.tab', function() {
        loadTaskList(currentTaskPage);

        // 완료된 프로젝트면 업무 등록 버튼 숨김
        if (isProjectCompleted()) {
            const createTaskBtn = $('button[data-bs-target="#task-create-modal"]');
            console.log('업무 등록 버튼 숨김 처리:', createTaskBtn.length); // 디버깅
            createTaskBtn.hide();
        } else {
            const createTaskBtn = $('button[data-bs-target="#task-create-modal"]');
            createTaskBtn.show();
        }
    });

    // 업무 상세 모달이 닫힐 때 업무 목록 새로고침
	$('#task-checklist-modal').on('hidden.bs.modal', function() {
	    loadTaskList(currentTaskPage);
	});

    // 업무 등록 모달이 열릴 때 담당자 목록 채우기 및 권한 체크
    $('#task-create-modal').on('show.bs.modal', function(e) {
        if (isProjectCompleted()) {
            e.preventDefault();
            e.stopImmediatePropagation();
            Swal.fire({
                icon: 'warning',
                title: '읽기 전용',
                text: '완료된 프로젝트는 업무를 등록할 수 없습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#435ebe'
            });
            return false;
        }

        if (!canEditTask()) {
            e.preventDefault();
            e.stopImmediatePropagation();
            Swal.fire({
                icon: 'warning',
                title: '권한 없음',
                text: '업무 등록은 프로젝트 책임자만 가능합니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#435ebe'
            });
            return false;
        }
        populateAssigneeSelect();
    });

    // 전체 선택 체크박스
    $('#select-all-tasks').on('change', function() {
        const isChecked = $(this).is(':checked');
        $('.task-checkbox').prop('checked', isChecked);

        selectedTaskIds.clear();
        if (isChecked) {
            $('.task-checkbox').each(function() {
                selectedTaskIds.add($(this).data('task-id'));
            });
        }

        updateDeleteButton();
    });

    // 선택 삭제 버튼 클릭
    $('#delete-selected-tasks-btn').on('click', function() {
        if (selectedTaskIds.size === 0) {
            return;
        }

        const taskCount = selectedTaskIds.size;

        Swal.fire({
            title: '업무 일괄 삭제',
            text: `선택한 ${taskCount}개의 업무를 정말 삭제하시겠습니까?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSelectedTasks();
            }
        });
    });
});

// 삭제 버튼 업데이트
function updateDeleteButton() {
    const deleteBtn = $('#delete-selected-tasks-btn');
    const countSpan = $('#selected-count');

    if (selectedTaskIds.size > 0) {
        deleteBtn.show();
        countSpan.text(selectedTaskIds.size);
    } else {
        deleteBtn.hide();
        countSpan.text('0');
    }
}

// 전체 선택 체크박스 상태 업데이트
function updateSelectAllCheckbox() {
    const totalCheckboxes = $('.task-checkbox').length;
    const checkedCheckboxes = $('.task-checkbox:checked').length;

    const selectAllCheckbox = $('#select-all-tasks');

    if (checkedCheckboxes === 0) {
        selectAllCheckbox.prop('checked', false);
        selectAllCheckbox.prop('indeterminate', false);
    } else if (checkedCheckboxes === totalCheckboxes) {
        selectAllCheckbox.prop('checked', true);
        selectAllCheckbox.prop('indeterminate', false);
    } else {
        selectAllCheckbox.prop('checked', false);
        selectAllCheckbox.prop('indeterminate', true);
    }
}

// 선택된 업무 일괄 삭제
function deleteSelectedTasks() {
    const taskIds = Array.from(selectedTaskIds);

    $.ajax({
        url: '/rest/task/delete/batch',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ taskIds: taskIds }),
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '삭제 완료',
                    text: `${taskIds.length}개의 업무가 삭제되었습니다.`,
                    confirmButtonText: '확인',
                    confirmButtonColor: '#435ebe'
                }).then(() => {
                    selectedTaskIds.clear();
                    loadTaskList(currentTaskPage);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '삭제 실패',
                    text: response.message || '업무 삭제에 실패했습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#435ebe'
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('업무 일괄 삭제 실패:', error);

            let errorMessage = '업무 삭제에 실패했습니다.';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }

            Swal.fire({
                icon: 'error',
                title: '삭제 실패',
                text: errorMessage,
                confirmButtonText: '확인',
                confirmButtonColor: '#435ebe'
            });
        }
    });
}

// Task Create Modal의 "업무 생성" 버튼 이벤트
$('#create-task-btn').on('click', function() {
    const formElement = document.getElementById('taskCreateForm');

    if (!formElement) {
        console.error("폼 요소를 찾을 수 없습니다.");
        Swal.fire({
            icon: 'error',
            title: '오류',
            text: '폼 요소가 없어 업무 등록을 진행할 수 없습니다.',
            confirmButtonText: '확인',
            confirmButtonColor: '#435ebe'
        });
        return;
    }

    //FormData 객체 생성 (파일과 폼 데이터 모두 포함)
    const formData = new FormData(formElement);

    //JS 변수 값 수동 추가 (폼에 없는 데이터)
    formData.set('bizId', project.id);
    formData.set('taskPrgrs', 0); // 진행률 0%로 초기값 설정

    //strtTaskDt 필드 확인 및 시간 정보 추가
    const strtDt = formData.get('strtTaskDt');
    if (strtDt && !strtDt.includes('T')) {
        formData.set('strtTaskDt', strtDt + 'T00:00:00'); // 'yyyy-MM-dd' -> 'yyyy-MM-ddT00:00:00' 로 변환
    }

    //endTaskDt 필드 확인 및 시간 정보 추가
    const endDt = formData.get('endTaskDt');
    if (endDt && !endDt.includes('T')) {
        formData.set('endTaskDt', endDt + 'T00:00:00'); // 'yyyy-MM-dd' -> 'yyyy-MM-ddT00:00:00' 로 변환
    }

    // 유효성 검사 로직 시작
    if(!strtDt || !endDt){ //시작일시,마감일시 미입력시
		Swal.fire({
			icon: 'warning',
			title: '경고',
			text: '시작일시와 마감일시를 모두 입력해야 합니다.',
			confirmButtonText: '확인',
			confirmButtonColor: '#435ebe'
		});
		return; // ajax 전송 중단
	}

	const startDate = new Date(formData.get('strtTaskDt'));
    const endDate = new Date(formData.get('endTaskDt'));

    if(startDate > endDate){ //시작일시 > 마감일시
		Swal.fire({
			icon: 'warning',
			title: '기간 오류',
			text: '종료일은 시작일 이후여야 합니다.',
			confirmButtonText: '확인',
			confirmButtonColor: '#435ebe'
		});
		return;
	}
	// 유효성 검사 로직 끝

    //FormData 전송 설정
    $.ajax({
        url: '/rest/task',
        method: 'POST',
        data: formData,

        contentType: false,
        processData: false,

        success: function(response) {
            if(response.success) {
                // 1. 폼 초기화
                formElement.reset();

                // 2. 모달 닫기 및 backdrop 완전 제거
                const modalElement = $('#task-create-modal');
                modalElement.modal('hide');

                // Bootstrap 모달 backdrop 강제 제거
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open');
                $('body').css('padding-right', '');

                // 3. 알림 표시 및 목록 새로고침 (약간의 지연 후)
                setTimeout(function() {
                    Swal.fire({
                        icon: 'success',
                        title: '등록 완료',
                        text: '업무가 등록되었습니다.',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#435ebe'
                    }).then(() => {
                        loadTaskList(currentTaskPage);
                    });
                }, 100);

            } else {
                Swal.fire({
                    icon: 'error',
                    title: '등록 실패',
                    text: response.message || '업무 등록에 실패했습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#435ebe'
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('업무 등록 실패:', error);

            let errorMessage = '업무 등록에 실패했습니다. 관리자에게 문의하세요.';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }

            Swal.fire({
                icon: 'error',
                title: '등록 실패',
                text: errorMessage,
                confirmButtonText: '확인',
                confirmButtonColor: '#435ebe'
            });
        }
    });
});

// 업무 담당자만이 체크리스트를 수정/추가/삭제 권한체크 (완료된 업무 체크 추가)
function canManageChecklist(task) {
    if (!task) return false;

    // 완료된 업무는 체크리스트 수정 불가
    if (isTaskCompleted(task)) return false;

    const currentUserId = currentUser.id;
    const taskAssigneeId = task.bizUserId;

    if (currentUserId === taskAssigneeId) {
        return true;
    }

    return false;
}
// 담당자 선택 드롭다운 채우기
function populateAssigneeSelect() {
    const select = $('#task-assignee-modal');
    select.empty();

    // memberList는 project-detail.js에서 이미 정의되어 있음
    memberList.forEach(member => {
        // B101: 책임자, B102: 참여자
        if (member.authCode === 'B102' || member.authCode === 'B101') {
			// 이름과 직급명을 먼저 조합
            let displayName = member.userName;
            if (member.jobNm) { // 직급명이 있으면 이름 뒤에 붙임
                displayName += ` ${member.jobNm}`;
            }

            // 부서명은 괄호로 묶어서 추가 (부서명이 있을 때만)
            if (member.deptNm) {
                displayName += ` (${member.deptNm})`;
            }

            // 결과: "홍길동 대리 (마케팅팀)"
            const option = `<option value="${member.userId}">${displayName}</option>`;
            select.append(option);
        }
    });
}

// 수정용 담당자 선택 드롭다운 채우기
function populateEditAssigneeSelect(selectedUserId) {
    const select = $('#modal-task-assignee-edit');
    select.empty();

    memberList.forEach(member => {
        if (member.authCode === 'B102' || member.authCode === 'B101') {

            // 이름과 직급명을 먼저 조합
            let displayName = member.userName;
            if (member.jobNm) { // 직급명이 있으면 이름 뒤에 붙임
                displayName += ` ${member.jobNm}`;
            }

            // 부서명은 괄호로 묶어서 추가 (부서명이 있을 때만)
            if (member.deptNm) {
                displayName += ` (${member.deptNm})`;
            }

            let selected = member.userId === selectedUserId ? 'selected' : '';

            // option value는 userId, 보여지는 텍스트는 displayName
            const option = `<option value="${member.userId}" ${selected}>${displayName}</option>`;
            select.append(option);
        }
    });


}
    $(document).ready(function() {
    // 기존 초기화 코드가 있다면 그 아래에 추가

    // 담당자 필터 초기화 (새로 추가)
    if (typeof initTaskAssigneeFilter === 'function') {
        initTaskAssigneeFilter();
    }
});