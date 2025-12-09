<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>내 프로젝트</title>
<link rel="stylesheet" href="/css/project.css">

</head>

<body>
	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/project/left-menu.jsp"%>

			<!-- 우측 본문 -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">나의 업무</div>
					<div class="outline-subtitle">진행 중인 업무와 참여 프로젝트를 한눈에 확인하고 관리하세요.</div>
				</div>

				<!-- 그래프 & 카드 -->
				<section class="section mb-3">
					<div class="row align-items-stretch g-3">
						<div class="col-12 col-xl-3 col-lg-6 col-md-6">
							<div class="card h-100">
								<div
									class="card-body px-3 py-4 d-flex flex-column justify-content-center">
									<div class="row align-items-center">
										<div class="col-4">
											<div class="stats-icon purple">
												<i class="bi bi-play-circle-fill summary-card-icon"></i>
											</div>
										</div>
										<div class="col-8">
											<h6 class="text-muted font-semibold summary-card-title mb-1">진행
												중인 업무</h6>
											<h6 class="font-extrabold mb-0 summary-card-value"
												id="summary-doing">0</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 col-xl-3 col-lg-6 col-md-6">
							<div class="card h-100">
								<div
									class="card-body px-3 py-4 d-flex flex-column justify-content-center">
									<div class="row align-items-center">
										<div class="col-4">
											<div class="stats-icon blue">
												<i class="bi bi-hourglass-split summary-card-icon"></i>
											</div>
										</div>
										<div class="col-8">
											<h6 class="text-muted font-semibold summary-card-title mb-1">미시작
												업무</h6>
											<h6 class="font-extrabold mb-0 summary-card-value"
												id="summary-todo">0</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 col-xl-3 col-lg-6 col-md-6">
							<div class="card h-100">
								<div
									class="card-body px-3 py-4 d-flex flex-column justify-content-center">
									<div class="row align-items-center">
										<div class="col-4">
											<div class="stats-icon green">
												<i class="bi bi-check-circle-fill summary-card-icon"></i>
											</div>
										</div>
										<div class="col-8">
											<h6 class="text-muted font-semibold summary-card-title mb-1">완료된
												업무</h6>
											<h6 class="font-extrabold mb-0 summary-card-value"
												id="summary-done">0</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-12 col-xl-3 col-lg-6 col-md-6">
							<div class="card h-100">
								<div
									class="card-body px-3 py-4 d-flex flex-column justify-content-center">
									<div class="row align-items-center">
										<div class="col-4">
											<div class="stats-icon red">
												<i class="bi bi-graph-up summary-card-icon"></i>
											</div>
										</div>
										<div class="col-8">
											<h6 class="text-muted font-semibold summary-card-title mb-1">업무
												평균 진척률</h6>
											<h6 class="font-extrabold mb-0 summary-card-value"
												id="summary-progress">0%</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- 담당 업무 리스트 -->
				<section class="section">
				    <div class="card">
				        <div class="card-header">
				            <!-- ⭐ 상태별 필터 탭 추가 ⭐ -->
				            <ul class="nav nav-pills mb-3" id="taskStatusFilter" role="tablist">
				                <li class="nav-item" role="presentation">
				                    <button class="nav-link active" data-status="all" type="button">
				                        전체 <span class="badge bg-light-secondary ms-1" id="count-all">0</span>
				                    </button>
				                </li>
				                <li class="nav-item" role="presentation">
				                    <button class="nav-link" data-status="B402" type="button">
				                        진행중 <span class="badge bg-primary ms-1" id="count-doing">0</span>
				                    </button>
				                </li>
				                <li class="nav-item" role="presentation">
				                    <button class="nav-link" data-status="B401" type="button">
				                        미시작 <span class="badge bg-light-secondary ms-1" id="count-todo">0</span>
				                    </button>
				                </li>
				                <li class="nav-item" role="presentation">
				                    <button class="nav-link" data-status="B403" type="button">
				                        보류 <span class="badge bg-secondary ms-1" id="count-hold">0</span>
				                    </button>
				                </li>
				                <li class="nav-item" role="presentation">
				                    <button class="nav-link" data-status="B404" type="button">
				                        완료 <span class="badge bg-success ms-1" id="count-done">0</span>
				                    </button>
				                </li>
				            </ul>

				            <!-- <ul class="nav nav-tabs" id="myTab" role="tablist">
				                <li class="nav-item" role="presentation">
				                    <button class="nav-link active" id="tasks-tab"
				                        data-bs-toggle="tab" data-bs-target="#tasks" type="button"
				                        role="tab" aria-controls="tasks" aria-selected="true">내 업무</button>
				                </li>
				            </ul> -->
				        </div>
				        <div class="card-body">
				            <div class="table-responsive">
			                <table class="table table-hover table-lg" id="tasks-table">
			                    <thead>
			                        <tr>
			                            <th>업무명</th>
			                            <th>프로젝트</th>
			                            <th>마감일</th>
			                            <th>상태</th>
			                            <th>진행률</th>
			                           <!--  <th>최근 코멘트</th> -->
			                        </tr>
			                    </thead>
			                    <tbody>
			                        <c:choose>
			                            <c:when test="${not empty myTaskList}">
			                                <c:forEach items="${myTaskList}" var="task">
			                                    <tr class="${task.taskSttsCd eq 'B404' ? 'task-completed' : ''}"
			                                        data-status="${task.taskSttsCd}"
			                                        data-deadline="${fn:substringBefore(task.endTaskDt, 'T')}">
			                                        <td>
			                                            <c:if test="${task.taskSttsCd eq 'B404'}">
			                                                <i class="bi bi-check-circle-fill task-completed-icon"></i>
			                                            </c:if>
			                                            <i class="bi bi-clipboard-check text-primary me-2"></i>
			                                            <a href="javascript:void(0);"
			                                               class="task-link"
			                                               onclick="openTaskDetailModal('${task.taskId}')">
			                                                ${task.taskNm}
			                                            </a>
			                                        </td>
			                                        <td><a href="/projects/${task.bizId}">${task.bizNm}</a></td>
			                                        <td class="deadline-cell">
			                                            ${fn:substringBefore(task.endTaskDt, 'T')}
			                                        </td>
			                                        <td>
			                                            <c:choose>
			                                                <c:when test="${task.taskSttsCd eq 'B401'}">
			                                                    <span class="badge bg-light-secondary">미시작</span>
			                                                </c:when>
			                                                <c:when test="${task.taskSttsCd eq 'B402'}">
			                                                    <span class="badge bg-primary">진행중</span>
			                                                </c:when>
			                                                <c:when test="${task.taskSttsCd eq 'B403'}">
			                                                    <span class="badge bg-secondary">보류</span>
			                                                </c:when>
			                                                <c:when test="${task.taskSttsCd eq 'B404'}">
			                                                    <span class="badge bg-success">완료</span>
			                                                </c:when>
			                                                <c:otherwise>
			                                                    <span class="badge bg-light-secondary">${task.taskSttsCd}</span>
			                                                </c:otherwise>
			                                            </c:choose>
			                                        </td>
			                                        <td>${task.taskPrgrs}%
			                                            <div class="progress progress-sm">
			                                                <div class="progress-bar
			                                                    <c:choose>
			                                                        <c:when test="${task.taskPrgrs == 100}">bg-success</c:when>
			                                                        <c:when test="${task.taskPrgrs > 50}">bg-primary</c:when>
			                                                        <c:when test="${task.taskPrgrs > 0}">bg-warning</c:when>
			                                                        <c:otherwise>bg-secondary</c:otherwise>
			                                                    </c:choose>"
			                                                    role="progressbar" style="width: ${task.taskPrgrs}%">
			                                                </div>
			                                            </div>
			                                        </td>
			                                       <!--  <td><span class="text-muted fst-italic">-</span></td> -->
			                                    </tr>
			                                </c:forEach>
			                            </c:when>
			                            <c:otherwise>
			                                <tr>
			                                    <td colspan="6" class="text-center py-5">
			                                        <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
			                                        <p class="text-muted fs-5 mt-3 mb-0">현재 담당하는 업무가 없습니다.</p>
			                                    </td>
			                                </tr>
			                            </c:otherwise>
			                        </c:choose>
			                    </tbody>
			                </table>
			                <div id="task-pagination-container">
							    ${taskPagingHTML}
							</div>
			            </div>
			        </div>
			    </div>
			</section>

			</div>
		</div>
	</div>

	<!--  업무 상세 모달 -->
	<div class="modal fade" id="task-detail-modal" tabindex="-1">
	    <div class="modal-dialog modal-lg">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="modal-task-title">업무 상세</h5>
	                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
	            </div>
	            <div class="modal-body">
	                <div class="row mb-3">
	                    <div class="col-3"><strong>프로젝트</strong></div>
	                    <div class="col-9" id="modal-task-project"></div>
	                </div>
	                <div class="row mb-3">
	                    <div class="col-3"><strong>담당자</strong></div>
	                    <div class="col-9" id="modal-task-assignee"></div>
	                </div>
	                <div class="row mb-3">
	                    <div class="col-3"><strong>상태</strong></div>
	                    <div class="col-9" id="modal-task-status"></div>
	                </div>
	                <div class="row mb-3">
	                    <div class="col-3"><strong>기간</strong></div>
	                    <div class="col-9" id="modal-task-period"></div>
	                </div>
	                <div class="row mb-3">
	                    <div class="col-3"><strong>진행률</strong></div>
	                    <div class="col-9" id="modal-task-progress"></div>
	                </div>
	                <div class="row mb-3">
	                    <div class="col-3"><strong>상세 내용</strong></div>
	                    <div class="col-9" id="modal-task-description"></div>
	                </div>
	                <div class="row mb-3">
	                    <div class="col-3"><strong>첨부파일</strong></div>
	                    <div class="col-9" id="modal-task-files"></div>
	                </div>
	            </div>
	            <div class="modal-footer">
	                <button type="button" class="btn btn-primary" id="goto-project-btn">
	                    <i class="bi bi-box-arrow-up-right me-1"></i>프로젝트로 이동
	                </button>
	                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
	            </div>
	        </div>
	    </div>
	</div>


	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>

<!-- 차트용 데이터 설정 -->
<script>
window.serverProjectData = [];
window.myTasks = [];

<c:if test="${not empty allMyTaskList}">
window.myTasks = [
    <c:forEach items="${allMyTaskList}" var="task" varStatus="tStatus">
    {
        id: "${fn:escapeXml(task.taskId)}",
        name: "${fn:escapeXml(task.taskNm)}",
        projectId: "${fn:escapeXml(task.bizId)}",
        projectName: "${fn:escapeXml(task.bizNm)}",
        status: "${fn:escapeXml(task.taskSttsCd)}",
        progress: ${task.taskPrgrs},
        deadline: "${fn:escapeXml(fn:substringBefore(task.endTaskDt, "T"))}",
        assignee: 'user1'
    }<c:if test="${!tStatus.last}">,</c:if>
    </c:forEach>
];
</c:if>
<c:if test="${not empty projectList}">
window.serverProjectData = [
    <c:forEach items="${projectList}" var="project" varStatus="pStatus">
    {
        id: "${fn:escapeXml(project.bizId)}",
        name: "${fn:escapeXml(project.bizNm)}",
        status: "${fn:escapeXml(project.bizSttsCd)}",
        checklists: {
            total: 20,
            done: Math.round(${project.bizPrgrs != null ? project.bizPrgrs : 0} * 20 / 100)
        },
        comments: []
    }<c:if test="${!pStatus.last}">,</c:if>
    </c:forEach>
];
</c:if>
console.log('차트 데이터 설정:', window.serverProjectData);
</script>

<script src="/js/projects/project-myproject.js"></script>

<script>
//현재 선택된 상태 저장
let currentStatus = 'all';

// 상태별 필터 탭 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('#taskStatusFilter button');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 모든 버튼의 active 클래스 제거
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭한 버튼에 active 클래스 추가
            this.classList.add('active');

            // 선택된 상태 저장
            currentStatus = this.getAttribute('data-status');

            // 1페이지부터 다시 조회
            fnTaskPaging(1);
        });
    });

    updateTaskCounts();
});
//업무 페이징 함수 (AJAX)
function fnTaskPaging(page) {
    console.log("업무 페이지 이동:", page, "상태:", currentStatus);

    let url = '/rest/project/my/tasks?page=' + page;
    if (currentStatus && currentStatus !== 'all') {
        url += '&status=' + currentStatus;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data.error) {
                alert('로그인이 필요합니다.');
                return;
            }

            const tbody = document.querySelector('#tasks-table tbody');
            let allRows = '';

            if(data.myTaskList && data.myTaskList.length > 0) {
                data.myTaskList.forEach(task => {
                    const deadline = task.endTaskDt ? task.endTaskDt.substring(0, 10) : '-';
                    const progress = task.taskPrgrs || 0;

                    const isCompleted = task.taskSttsCd === 'B404';
                    const completedClass = isCompleted ? 'task-completed' : '';
                    const completedIcon = isCompleted ? '<i class="bi bi-check-circle-fill task-completed-icon"></i>' : '';

                    let statusBadge = '';
                    if(task.taskSttsCd === 'B401') {
                        statusBadge = '<span class="badge bg-light-secondary">미시작</span>';
                    } else if(task.taskSttsCd === 'B402') {
                        statusBadge = '<span class="badge bg-primary">진행중</span>';
                    } else if(task.taskSttsCd === 'B403') {
                        statusBadge = '<span class="badge bg-secondary">보류</span>';
                    } else if(task.taskSttsCd === 'B404') {
                        statusBadge = '<span class="badge bg-success">완료</span>';
                    } else {
                        statusBadge = '<span class="badge bg-light-secondary">' + task.taskSttsCd + '</span>';
                    }

                    let progressBarColor = 'bg-secondary';
                    if(progress === 100) {
                        progressBarColor = 'bg-success';
                    } else if(progress > 50) {
                        progressBarColor = 'bg-primary';
                    } else if(progress > 0) {
                        progressBarColor = 'bg-warning';
                    }

                    allRows += '<tr class="' + completedClass + '" data-status="' + task.taskSttsCd + '" data-deadline="' + deadline + '">' +
                        '<td>' +
                            completedIcon +
                            '<i class="bi bi-clipboard-check text-primary me-2"></i>' +
                            '<a href="javascript:void(0);" class="task-link" onclick="openTaskDetailModal(\'' + task.taskId + '\')">' +
                                task.taskNm +
                            '</a>' +
                        '</td>' +
                        '<td><a href="/projects/' + task.bizId + '">' + task.bizNm + '</a></td>' +
                        '<td class="deadline-cell">' + deadline + '</td>' +
                        '<td>' + statusBadge + '</td>' +
                        '<td>' + progress + '%' +
                            '<div class="progress progress-sm">' +
                                '<div class="progress-bar ' + progressBarColor + '" role="progressbar" style="width: ' + progress + '%"></div>' +
                            '</div>' +
                        '</td>' +
                    '</tr>';
                });
            } else {
                allRows = '<tr><td colspan="5" class="text-center py-5">해당 상태의 업무가 없습니다.</td></tr>';
            }

            tbody.innerHTML = allRows;
            document.getElementById('task-pagination-container').innerHTML = data.pagingHTML;

            updateDeadlines();

            console.log('업무 테이블 업데이트 완료');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('데이터를 불러오는데 실패했습니다.');
        });
}
</script>

</body>

</html>