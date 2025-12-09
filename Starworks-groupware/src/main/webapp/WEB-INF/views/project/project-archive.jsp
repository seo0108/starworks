<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>보관함 - 그룹웨어</title>
<link rel="stylesheet" href="/css/project.css">
</head>

<body>
	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/project/left-menu.jsp"%>

			<!-- 우측 본문 -->
			<div style="flex: 1 1 78%;" class="archive-restricted right-content">


				<div class="outline-section-3">
					<div class="outline-title">중단 프로젝트</div>
					<div class="outline-subtitle">중단된 프로젝트 목록을 확인하고, 필요 시 재개할 수 있습니다.</div>
				</div>

				<div class="alert alert-light border-start border-danger border-4 d-flex align-items-center" role="alert">
			        <i class="bi bi-lock-fill text-danger me-3" style="font-size: 1.5rem;"></i>
			        <div>
			            <strong>접근 제한</strong><br>
			            <small class="text-muted">취소된 프로젝트는 상세조회 및 작업이 제한되며, 복원 및 재개 권한은 관리자에게 있습니다.</small>
			        </div>
			    </div>

				<!-- Search Filter Section -->
				<section class="section">
					<div class="card mb-3">
						<div class="card-header">
							<h4 class="card-title">검색 및 필터</h4>
						</div>
						<div class="card-body">
							<form class="form" id="searchForm"
								action="<c:url value='/projects/archive'/>" method="get">
								<input type="hidden" name="page" value="1" />
								<div class="row">
									<!-- SimpleSearch: 검색 타입 + 검색어 -->
									<div class="col-md-6 col-lg-4 mb-3">
										<div class="form-group">
											<label for="searchType">검색 구분</label> <select
												class="form-select" id="searchType" name="searchType">
												<option value="">전체</option>
												<option value="projectName"
													${param.searchType eq 'projectName' ? 'selected' : ''}>프로젝트명</option>
												<option value="managerName"
													${param.searchType eq 'managerName' ? 'selected' : ''}>담당자</option>
											</select>
										</div>
									</div>

									<div class="col-md-6 col-lg-4 mb-3">
										<div class="form-group">
											<label for="searchWord">검색어</label> <input type="text"
												class="form-control" id="searchWord" name="searchWord"
												placeholder="검색어 입력" value="${param.searchWord}">
										</div>
									</div>

									<!-- DetailSearch: 기간만 -->
									<div class="col-md-6 col-lg-4 mb-3">
										<label>기간</label>
										<div class="input-group">
											<input type="date" class="form-control" id="searchStrtBizDt"
												name="searchStrtBizDt" value="${param.searchStrtBizDt}">
											<span class="input-group-text">~</span> <input type="date"
												class="form-control" id="searchEndBizDt"
												name="searchEndBizDt" value="${param.searchEndBizDt}">
										</div>
									</div>

									<div class="col-md-12 col-lg-12 mb-3 d-flex align-items-end">
										<button type="submit" class="btn btn-primary me-2">검색</button>
										<button type="button" class="btn btn-light-secondary"
											onclick="resetForm()">초기화</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</section>

				<!-- Archived Project List Section -->
				<section class="section">
					<div class="card">
						<div
							class="card-header d-flex justify-content-between align-items-center">
							<h4 class="card-title">보관된 프로젝트 목록</h4>
						</div>
						<div class="card-body">
							<!-- Table View -->
							<div id="table-view">
								<div class="table-responsive">
									<table class="table table-hover table-lg">
										<thead>
											<tr>
												<th></th>
												<th class="sortable">프로젝트명 <i
													class="bi bi-arrow-down-up"></i></th>
												<th class="sortable">책임자 <i class="bi bi-arrow-down-up"></i></th>
												<th class="sortable">기간 <i class="bi bi-arrow-down-up"></i></th>
												<th class="sortable">상태 <i class="bi bi-arrow-down-up"></i></th>
												<th class="sortable">진행률 <i class="bi bi-arrow-down-up"></i></th>
												<th>첨부</th>
												<th>액션</th>
											</tr>
										</thead>
										<tbody>
										    <c:if test="${not empty archivedProjectList }">
										        <c:forEach items="${archivedProjectList }" var="project">
										            <tr>
										                <td>${project.rnum }</td>
										                <td>
										                    <span class="text-muted" style="cursor: not-allowed;"
										                          data-bs-toggle="tooltip"
										                          title="취소 프로젝트는 조회 및 작업이 제한됩니다.">
										                        ${project.bizNm} <i class="bi bi-lock-fill ms-1"></i>
										                    </span>
										                </td>
										                <!-- 나머지 td들은 그대로 -->
										                <td>
										                    <c:set var="picName" value="${project.bizPicNm}" />
										                    <c:choose>
										                        <c:when test="${not empty picName}">
										                            <c:out value="${picName}" />
										                        </c:when>
										                        <c:otherwise>
										                            <c:out value="${project.bizPicId}" />
										                        </c:otherwise>
										                    </c:choose>

										                    <c:if test="${not empty project.bizUserJobNm}">
										                        <c:out value=" ${project.bizUserJobNm}" />
										                    </c:if>

										                    <c:if test="${not empty project.bizPicDeptNm}">
										                        <c:out value=" (${project.bizPicDeptNm})" />
										                    </c:if>
										                </td>
										                <td>${fn:substringBefore(project.strtBizDt, 'T')}~
										                    ${fn:substringBefore(project.endBizDt, 'T')}</td>
										                <td><c:choose>
										                        <c:when test="${project.bizSttsCd eq '승인 대기'}">
										                            <span class="badge bg-light-primary">승인대기</span>
										                        </c:when>
										                        <c:when test="${project.bizSttsCd eq '진행'}">
										                            <span class="badge bg-primary">진행</span>
										                        </c:when>
										                        <c:when test="${project.bizSttsCd eq '보류'}">
										                            <span class="badge bg-secondary">보류</span>
										                        </c:when>
										                        <c:when test="${project.bizSttsCd eq '완료'}">
										                            <span class="badge bg-success">완료</span>
										                        </c:when>
										                        <c:when test="${project.bizSttsCd eq '취소'}">
										                            <span class="badge bg-danger">취소</span>
										                        </c:when>
										                        <c:otherwise>
										                            <span class="badge bg-light-secondary">${project.bizSttsCd}</span>
										                        </c:otherwise>
										                    </c:choose></td>
										                <td>${project.bizPrgrs }%
										                    <div class="progress progress-sm">
										                        <div class="progress-bar bg-info" role="progressbar"
										                            style="width: ${project.bizPrgrs}%"
										                            aria-valuenow="${project.bizPrgrs}" aria-valuemin="0"
										                            aria-valuemax="100"></div>
										                    </div>
										                </td>
										                <td><c:if test="${not empty project.bizFileId }">
										                        <i class="bi bi-paperclip"></i>
										                    </c:if></td>
										                <td class="text-nowrap">
										                    <button class="btn btn-sm btn-outline-secondary"
										                            style="cursor: not-allowed;"
										                            disabled
										                            data-bs-toggle="tooltip"
										                            title="취소 프로젝트는 조회 및 작업이 제한됩니다.">
										                        상세
										                    </button>
										                </td>
										            </tr>
										        </c:forEach>
										    </c:if>
										</tbody>
									</table>
								</div>
							</div>

						</div>
						${pagingHTML }
					</div>
				</section>
			</div>
		</div>
	</div>

	<!-- Restore Project Modal -->
	<!-- <div class="modal fade" id="restoreProjectModal" tabindex="-1"
		aria-labelledby="restoreProjectModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="restoreProjectModalLabel">프로젝트 복원</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>프로젝트를 복원하시겠습니까? 복원 사유를 입력해주세요.</p>
					<div class="form-group">
						<label for="restore-reason" class="form-label">복원 사유</label>
						<textarea class="form-control" id="restore-reason" rows="3"
							placeholder="예: 프로젝트 재개 요청"></textarea>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary">복원 확인</button>
				</div>
			</div>
		</div>
	</div> -->


<script>
function fnPaging(page){
    console.log("페이지 이동:", page);

    // 폼 요소를 함수 내에서 직접 찾습니다.
    const form = document.getElementById('searchForm');

    if (form) {
        // name="page"인 input의 value를 변경
        const pageInput = form.querySelector('input[name="page"]');

        if (pageInput) {
            pageInput.value = page;
            form.submit(); // 폼 제출
        } else {
            console.error("오류: name='page'인 input 필드를 찾을 수 없습니다.");
        }
    } else {
        console.error("오류: searchForm을 찾을 수 없습니다. (HTML에 id='searchForm'이 있는지 확인하세요)");
    }
}

// 검색 폼 초기화 함수 (기존 로직 유지)
function resetForm() {
    const url = new URL(window.location.href);
    window.location.href = url.pathname + "?page=1";
}


    document.addEventListener('DOMContentLoaded', function () {
    	// 툴팁 초기화
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        const tableViewBtn = document.getElementById('table-view-btn');
        const cardViewBtn = document.getElementById('card-view-btn');
        const tableView = document.getElementById('table-view');
        const cardView = document.getElementById('card-view');

        tableViewBtn.addEventListener('click', function() {
            tableView.style.display = 'block';
            cardView.style.display = 'none';
            tableViewBtn.classList.add('active');
            cardViewBtn.classList.remove('active');
        });

        cardViewBtn.addEventListener('click', function() {
            tableView.style.display = 'none';
            cardView.style.display = 'block';
            cardViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
        });
    });
</script>
</body>

</html>