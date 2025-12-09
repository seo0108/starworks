// 서버에서 받은 프로젝트 데이터를 저장
let data = {
    projects: window.serverProjectData || [],
    tasks: window.myTasks || []
};

document.addEventListener('DOMContentLoaded', function() {
    // 현재 사용자가 담당하는 업무
    const myTasks = data.tasks;
    console.log('업무 데이터:', myTasks); // 디버깅용

    // 현재 열려있는 모달 추척
    let activeModal = { type: null, id: null };

    const getDaysRemaining = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        today.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return Math.round((end - today) / (1000 * 60 * 60 * 24));
    };

    const createTooltip = (element, title) => {
        if (!element || !title) return;
        return new bootstrap.Tooltip(element, { title: title, placement: 'top', trigger: 'hover', container: 'body' });
    };

    // ==== 업무 상태별 카드 렌더링 함수 ====
	const renderSummaryAndCharts = (projectList, taskList) => {
	    // 업무 상태별 개수 계산
	    const doingTasks = taskList.filter(t => t.status === 'B402').length;      // 진행중
	    const todoTasks = taskList.filter(t => t.status === 'B401').length;       // 미시작
	    const doneTasks = taskList.filter(t => t.status === 'B404').length;       // 완료
	    const holdTasks = taskList.filter(t => t.status === 'B403').length;       // 보류

	    // 업무 평균 진행률 계산
	    const totalTaskProgress = taskList.reduce((acc, t) => acc + (t.progress || 0), 0);
	    const avgTaskProgress = taskList.length > 0 ? Math.round(totalTaskProgress / taskList.length) : 0;

	    // 요약 카드에 숫자 표시
	    document.getElementById('summary-doing').textContent = doingTasks;
	    document.getElementById('summary-todo').textContent = todoTasks;
	    document.getElementById('summary-done').textContent = doneTasks;
	    document.getElementById('summary-progress').textContent = `${avgTaskProgress}%`;

	};


    // 툴팁 초기화
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new bootstrap.Tooltip(el);
    });

});


// ==== 업무 상세 모달 관련 함수들 ====

/**
 *  업무명 클릭 시 업무 상세 모달 열기
 */
window.openTaskDetailModal = function(taskId) {
	const taskFromPage = window.myTasks.find(t => t.id === taskId);
    const projectName = taskFromPage ? taskFromPage.projectName : null;

    fetch('/rest/task?taskId=' + taskId)
        .then(response => response.json())
        .then(data => {
            const task = data.task;
            const fileList = data.fileList || [];

            // 모달에 데이터 채우기
            document.getElementById('modal-task-title').textContent = task.taskNm;
            document.getElementById('modal-task-project').innerHTML =
                '<a href="/projects/' + task.bizId + '">' + task.bizNm + '</a>';

            // 담당자
            let assigneeText = task.bizUserNm || '-';
            if (task.jobNm) assigneeText += ' ' + task.jobNm;
            if (task.bizUserDeptNm) assigneeText += ' (' + task.bizUserDeptNm + ')';
            document.getElementById('modal-task-assignee').textContent = assigneeText;

            // 상태
            const statusBadge = getTaskStatusBadge(task.taskSttsCd);
            document.getElementById('modal-task-status').innerHTML = statusBadge;

            // 기간
            const startDate = task.strtTaskDt ? task.strtTaskDt.split('T')[0] : '-';
            const endDate = task.endTaskDt ? task.endTaskDt.split('T')[0] : '-';
            document.getElementById('modal-task-period').textContent = startDate + ' ~ ' + endDate;

            // 진행률
            const progress = task.taskPrgrs || 0;
            const progressColor = getTaskProgressColor(progress);
            document.getElementById('modal-task-progress').innerHTML =
                '<div class="progress" style="height: 25px;">' +
                    '<div class="progress-bar ' + progressColor + '" role="progressbar" ' +
                         'style="width: ' + progress + '%">' +
                        progress + '%' +
                    '</div>' +
                '</div>';

            // 상세 내용
            document.getElementById('modal-task-description').textContent = task.taskDetail || '-';

            // 첨부파일
            const filesContainer = document.getElementById('modal-task-files');
            if (fileList.length > 0) {
                let filesHtml = '<ul class="list-unstyled mb-0">';
                fileList.forEach(file => {
                    filesHtml +=
                        '<li class="mb-1">' +
                            '<a href="/file/download/' + file.saveFileNm + '" class="text-primary">' +
                                '<i class="bi bi-paperclip"></i> ' + file.orgnFileNm +
                            '</a>' +
                        '</li>';
                });
                filesHtml += '</ul>';
                filesContainer.innerHTML = filesHtml;
            } else {
                filesContainer.innerHTML = '<p class="text-muted small mb-0">첨부파일 없음</p>';
            }

            // 프로젝트로 이동 버튼
            document.getElementById('goto-project-btn').onclick = function() {
                window.location.href = '/projects/' + task.bizId + '?activeTab=tasks-tab';
            };

            // 모달 표시
            const modal = new bootstrap.Modal(document.getElementById('task-detail-modal'));
            modal.show();
        })
        .catch(error => {
            console.error('업무 조회 실패:', error);
            alert('업무 정보를 불러올 수 없습니다.');
        });
};

/**
 * 업무 상태 뱃지 반환
 */
function getTaskStatusBadge(code) {
    const statusMap = {
        'B401': '<span class="badge bg-secondary">미시작</span>',
        'B402': '<span class="badge bg-primary">진행중</span>',
        'B403': '<span class="badge bg-warning">보류</span>',
        'B404': '<span class="badge bg-success">완료</span>'
    };
    return statusMap[code] || '<span class="badge bg-light-secondary">-</span>';
}

/**
 * 업무 진행률 색상 반환
 */
function getTaskProgressColor(progress) {
    if (progress === 100) return 'bg-success';
    if (progress > 50) return 'bg-primary';
    if (progress > 0) return 'bg-warning';
    return 'bg-secondary';
}

// ==== 업무 목록 개선 기능 ====

document.addEventListener('DOMContentLoaded', function() {

    // 마감일 긴급도 표시
    function updateDeadlines() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        document.querySelectorAll('#tasks-table tbody tr[data-deadline]').forEach(row => {
            const deadlineStr = row.dataset.deadline;
            const status = row.dataset.status;
            const deadlineCell = row.querySelector('.deadline-cell');

            if (!deadlineStr || !deadlineCell) return;

            const deadline = new Date(deadlineStr);
            deadline.setHours(0, 0, 0, 0);

            const diffTime = deadline - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let html = '';

            // 완료된 업무는 일반 표시
            if (status === 'B404') {
                html = `<span class="deadline-normal">
                    <i class="bi bi-calendar3 me-1"></i>${deadlineStr}
                </span>`;
            }
            // 마감일 지남
            else if (diffDays < 0) {
                html = `<span class="deadline-overdue fw-bold">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i>${deadlineStr}
                    <span class="badge bg-danger ms-1">지연</span>
                </span>`;
            }
            // 오늘 마감
            else if (diffDays === 0) {
                html = `<span class="deadline-today fw-bold">
                    <i class="bi bi-alarm-fill me-1"></i>${deadlineStr}
                    <span class="badge bg-danger ms-1">임박</span>
                </span>`;
            }
            // 3일 이내
            else if (diffDays <= 3) {
                html = `<span class="deadline-soon">
                    <i class="bi bi-calendar3 me-1"></i>${deadlineStr}
                    <span class="badge bg-light-danger ms-1">D-${diffDays}</span>
                </span>`;
            }
            // 여유있음
            else {
                html = `<span class="deadline-normal">
                    <i class="bi bi-calendar3 me-1"></i>${deadlineStr}
                </span>`;
            }

            deadlineCell.innerHTML = html;
        });
    }

    // 전역으로 사용할 수 있도록 window 객체에 할당
	window.updateDeadlines = updateDeadlines;

    // 상태별 카운트 업데이트 함수
	function updateTaskCounts() {
    const allTasks = window.myTasks || []; // 전체 업무 데이터 사용

    const countAll = allTasks.length;
    const countDoing = allTasks.filter(t => t.status === 'B402').length;
    const countTodo = allTasks.filter(t => t.status === 'B401').length;
    const countHold = allTasks.filter(t => t.status === 'B403').length;
    const countDone = allTasks.filter(t => t.status === 'B404').length;

    // 안전하게 요소 업데이트
    const setElementText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    // 뱃지 업데이트
    setElementText('count-all', countAll);
    setElementText('count-doing', countDoing);
    setElementText('count-todo', countTodo);
    setElementText('count-hold', countHold);
    setElementText('count-done', countDone);

    // 서머리 카드도 업데이트
    setElementText('summary-doing', countDoing);
    setElementText('summary-todo', countTodo);
    setElementText('summary-done', countDone);

    // 평균 진행률 계산
    const avgProgress = allTasks.length > 0
        ? Math.round(allTasks.reduce((sum, t) => sum + t.progress, 0) / allTasks.length)
        : 0;
    setElementText('summary-progress', avgProgress + '%');
}

// 필터링 함수
function filterTasks(status) {
    const rows = document.querySelectorAll('#tasks-table tbody tr[data-status]');

    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            row.style.display = row.dataset.status === status ? '' : 'none';
        }
    });
}

// 필터 탭 클릭 이벤트
document.querySelectorAll('#taskStatusFilter button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('#taskStatusFilter button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');

        filterTasks(this.dataset.status);
    });
});

// 초기화
updateDeadlines();
updateTaskCounts();
});