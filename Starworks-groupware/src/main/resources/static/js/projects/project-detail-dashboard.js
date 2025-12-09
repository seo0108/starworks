/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 17.     	     김주민            최초 생성
 *
 * </pre>
 */

document.addEventListener('DOMContentLoaded', function() {
    // 대시보드 탭 클릭 시 초기화
    const dashboardTab = document.getElementById('dashboard-tab');
    if (dashboardTab) {
        dashboardTab.addEventListener('shown.bs.tab', function() {
            initDashboard();
        });
    }
});

/**
 * 대시보드 초기화
 */
function initDashboard() {
    console.log('대시보드 초기화 시작');

    // 1. 기간 경과율 렌더링
    renderTimeProgress();

    // 2. 업무 현황 로드 (업무 진행률 포함)
    loadTaskStatus();

    // 3. 멤버별 업무 현황 로드
    loadMemberTasks();

    // 4. 주간 완료 추세 차트 렌더링
    /*renderWeeklyCompletionChart();*/
}

/**
 * 기간 경과율 렌더링
 */
function renderTimeProgress() {
    const projectInfo = document.getElementById('project-info');
    if (!projectInfo) return;

    const startDate = new Date(projectInfo.dataset.startDate);
    const endDate = new Date(projectInfo.dataset.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 전체 기간 (일)
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // 경과 일수
    const elapsedDays = Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)));

    // 남은 일수
    const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    // 기간 경과율 계산
    const timeProgress = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

    // 기간 경과율 업데이트
    document.getElementById('time-progress-percent').textContent = timeProgress + '%';
    document.getElementById('time-progress-bar').style.width = timeProgress + '%';
    document.getElementById('elapsed-days').textContent = elapsedDays;
    document.getElementById('total-days').textContent = totalDays;

    // 남은 날짜 표시
    const daysRemainingEl = document.getElementById('dashboard-days-remaining');
    if (daysRemainingEl) {
        if (remainingDays > 0) {
            daysRemainingEl.innerHTML = `<i class="bi bi-clock"></i> D-${remainingDays}일`;
            daysRemainingEl.className = 'badge bg-primary';
        } else if (remainingDays === 0) {
            daysRemainingEl.innerHTML = `<i class="bi bi-alarm"></i> D-DAY`;
            daysRemainingEl.className = 'badge bg-danger';
        } else {
            daysRemainingEl.innerHTML = `<i class="bi bi-check-circle"></i> 기간 종료`;
            daysRemainingEl.className = 'badge bg-secondary';
        }
    }
    initTooltips();
}

/**
 * 업무 상태 로드 (업무 진행률 포함)
 */
function loadTaskStatus() {
    const projectInfo = document.getElementById('project-info');
    if (!projectInfo) return;

    const bizId = projectInfo.dataset.id;

    fetch(`/rest/task/list/${bizId}/all`)
        .then(response => response.json())
        .then(data => {
            const tasks = data.mainTaskList || [];

            // 상태별 개수 계산
            const statusCount = {
                done: tasks.filter(t => t.taskSttsCd === 'B404').length,
                doing: tasks.filter(t => t.taskSttsCd === 'B402').length,
                todo: tasks.filter(t => t.taskSttsCd === 'B401').length,
                hold: tasks.filter(t => t.taskSttsCd === 'B403').length
            };

            const totalTasks = tasks.length;

            // 업무 진행률 계산 및 업데이트
            const taskProgress = totalTasks > 0
                ? Math.round((statusCount.done / totalTasks) * 100)
                : 0;

            document.getElementById('task-progress-percent').textContent = taskProgress + '%';
            document.getElementById('task-progress-bar').style.width = taskProgress + '%';
            document.getElementById('completed-count').textContent = statusCount.done;
            document.getElementById('total-count').textContent = totalTasks;

            // 개수 표시
            document.getElementById('dashboard-total-tasks').textContent = totalTasks;
            document.getElementById('task-status-done-count').textContent = statusCount.done;
            document.getElementById('task-status-doing-count').textContent = statusCount.doing;
            document.getElementById('task-status-todo-count').textContent = statusCount.todo;
            document.getElementById('task-status-hold-count').textContent = statusCount.hold;

            // 진행률 바 너비 계산
            if (totalTasks > 0) {
                const donePercent = (statusCount.done / totalTasks) * 100;
                const doingPercent = (statusCount.doing / totalTasks) * 100;
                const todoPercent = (statusCount.todo / totalTasks) * 100;
                const holdPercent = (statusCount.hold / totalTasks) * 100;

                document.getElementById('task-status-done-bar').style.width = donePercent + '%';
                document.getElementById('task-status-doing-bar').style.width = doingPercent + '%';
                document.getElementById('task-status-todo-bar').style.width = todoPercent + '%';
                document.getElementById('task-status-hold-bar').style.width = holdPercent + '%';
            }

            // 일정 경고 메시지 표시
            displayScheduleAlert(taskProgress);

            // 툴팁 초기화
            initTooltips();
        })
        .catch(error => {
            console.error('업무 상태 로드 실패:', error);
        });
}

/**
 * 일정 상태 분석 및 알림 메시지 표시
 */
function displayScheduleAlert(taskProgress) {
    const timeProgressText = document.getElementById('time-progress-percent').textContent;
    const timeProgress = parseInt(timeProgressText);

    // 진행률 차이 계산 (업무 진행률 - 기간 경과율)
    const gap = taskProgress - timeProgress;

    // 기존 알림이 있으면 제거
    const existingAlert = document.getElementById('schedule-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // 프로젝트 진행 현황 카드의 card-body 찾기
    const cardBody = document.querySelector('#dashboard-pane .card:first-child .card-body');
    if (!cardBody) return;

    let statusHtml = '';
    let icon = '';
    let iconColor = '';
    let statusText = '';
    let message = '';

    // 상태별 메시지 생성
    if (gap >= 15) {
        icon = 'bi-graph-up-arrow';
        iconColor = 'text-success';
        statusText = '일정 초과 달성';
        message = `업무 진행률(<strong>${taskProgress}%</strong>)이 기간 경과율(<strong>${timeProgress}%</strong>)보다 <strong>${gap}%p</strong> 높습니다.`;
    } else if (gap >= 5) {
        icon = 'bi-check-circle';
        iconColor = 'text-info';
        statusText = '일정 준수';
        message = `업무 진행률(<strong>${taskProgress}%</strong>)이 기간 경과율(<strong>${timeProgress}%</strong>)보다 <strong>${gap}%p</strong> 높습니다.`;
    } else if (gap >= -5) {
        icon = 'bi-speedometer2';
        iconColor = 'text-primary';
        statusText = '정상 진행';
        message = `업무 진행률(<strong>${taskProgress}%</strong>)과 기간 경과율(<strong>${timeProgress}%</strong>)이 균형을 이루고 있습니다.`;
    } else if (gap >= -15) {
        icon = 'bi-exclamation-triangle';
        iconColor = 'text-warning';
        statusText = '일정 지연 주의';
        message = `업무 진행률(<strong>${taskProgress}%</strong>)이 기간 경과율(<strong>${timeProgress}%</strong>)보다 <strong>${Math.abs(gap)}%p</strong> 낮습니다.`;
    } else {
        icon = 'bi-exclamation-octagon';
        iconColor = 'text-danger';
        statusText = '일정 지연 위험';
        message = `업무 진행률(<strong>${taskProgress}%</strong>)이 기간 경과율(<strong>${timeProgress}%</strong>)보다 <strong>${Math.abs(gap)}%p</strong> 낮습니다.`;
    }

    statusHtml = `
        <div id="schedule-alert" class="mt-3 d-flex align-items-center gap-2">
            <i class="bi ${icon} ${iconColor}" style="font-size: 1.5rem;"></i>
            <div>
                <span class="${iconColor} fw-semibold">${statusText}</span>
                <span class="text-muted ms-1" style="font-size: 0.9rem;">${message}</span>
            </div>
        </div>
    `;

    // 두 개의 진행률 표시 영역 바로 아래에 삽입
    const progressRow = cardBody.querySelector('.row.g-3');
    if (progressRow) {
        progressRow.insertAdjacentHTML('afterend', statusHtml);
    }
}

/**
 * 멤버별 업무 현황 로드
 */
function loadMemberTasks() {
    const projectInfo = document.getElementById('project-info');
    if (!projectInfo) return;

    const bizId = projectInfo.dataset.id;

    const memberFilePathMap = {};
    const memberListItems = document.querySelectorAll('#member-list > li');

    memberListItems.forEach(item => {
        const userId = item.dataset.userId;
        const filePath = item.dataset.filePath;

        if (userId && filePath) {
            memberFilePathMap[userId] = filePath;
        }
    });

    fetch(`/rest/task/list/${bizId}/all`)
        .then(response => response.json())
        .then(data => {
			console.log('📊 전체 응답 데이터:', data);
        console.log('📋 업무 목록:', data.mainTaskList);
        console.log('📦 업무 개수:', data.mainTaskList?.length);
            const tasks = data.mainTaskList || [];

            // 멤버별로 그룹핑
            const memberTasks = {};

            tasks.forEach(task => {
                const userId = task.bizUserId;
                if (!memberTasks[userId]) {
                    const imagePath = memberFilePathMap[userId]
                                    || task.filePath
                                    || '/images/faces/1.jpg';

                    memberTasks[userId] = {
                        name: task.bizUserNm || userId,
                        dept: task.bizUserDeptNm || '',
                        job: task.jobNm || '',
                        filePath: imagePath,
                        tasks: [],
                        done: 0,
                        doing: 0,
                        total: 0
                    };
                }

                memberTasks[userId].tasks.push(task);
                memberTasks[userId].total++;

                if (task.taskSttsCd === 'B404') {
                    memberTasks[userId].done++;
                } else if (task.taskSttsCd === 'B402') {
                    memberTasks[userId].doing++;
                }
            });

            // 렌더링
            renderMemberTasks(memberTasks);

            // 생산성 차트 렌더링 추가
            /*renderMemberProductivityChart(memberTasks);*/

            //진척도
            renderMemberProgressChart(bizId);
        })
        .catch(error => {
            console.error('멤버별 업무 로드 실패:', error);
            document.getElementById('member-tasks-container').innerHTML =
                '<div class="text-center text-muted py-4"><p>데이터를 불러올 수 없습니다.</p></div>';
        });
}

/**
 * 멤버별 업무 렌더링
 */
function renderMemberTasks(memberTasks) {
    const container = document.getElementById('member-tasks-container');
    if (!container) return;

    if (Object.keys(memberTasks).length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-4"><p>업무가 할당된 멤버가 없습니다.</p></div>';
        return;
    }

    let html = '';

    Object.values(memberTasks).forEach(member => {
        const progressPercent = member.total > 0
            ? Math.round((member.done / member.total) * 100)
            : 0;

        const jobInfo = member.job ? ` ${member.job}` : '';

        html += `
	    <div class="member-task-item">
	        <div class="d-flex align-items-center gap-3 mb-2">
	            <!-- 프로필 -->
	            <div class="avatar avatar-lg flex-shrink-0">
	                <img src="${member.filePath}"
	                     alt="${member.name}"
	                     onerror="this.onerror=null; this.src='/images/faces/1.jpg';">
	            </div>

	            <!-- 이름/부서 -->
	            <div style="min-width: 120px;">
	                <p class="member-name mb-0">${member.name}${jobInfo}</p>
	                <p class="member-dept mb-0">${member.dept || '-'}</p>
	            </div>

	            <!-- 진행률 바 (flex로 확장) -->
	            <div class="flex-grow-1">
	                <div class="member-progress-bar">
	                    <div class="member-progress-fill" style="width: ${progressPercent}%;">
	                        ${progressPercent}%
	                    </div>
	                </div>
	            </div>
	        </div>

	        <!-- 통계 -->
	        <div class="member-task-stats ps-5 ms-2">
	            <span>
	                <i class="bi bi-check-circle text-success"></i>
	                완료 ${member.done}
	            </span>
	            <span>
	                <i class="bi bi-arrow-repeat text-primary"></i>
	                진행중 ${member.doing}
	            </span>
	            <span>
	                <i class="bi bi-list-task text-secondary"></i>
	                이 ${member.total}건
	            </span>
	        </div>
	    </div>
	`;
    });

    container.innerHTML = html;
    initTooltips();
}

/**
 *  툴팁 초기화 헬퍼 함수
 */
function initTooltips() {
    // 기존 툴팁 제거
    const existingTooltips = document.querySelectorAll('.tooltip');
    existingTooltips.forEach(tooltip => tooltip.remove());

    // 새로운 툴팁 초기화
    const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        // 기존 툴팁 인스턴스가 있으면 제거
        const existingInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (existingInstance) {
            existingInstance.dispose();
        }

        // 새 툴팁 생성
        new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover',
            html: true
        });
    });
}