<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>

<body>
	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/project/left-menu.jsp"%>

			<!-- 우측 본문 -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">회사 전체 프로젝트</div>
					<div class="outline-subtitle">회사 전체에서 진행 중인 모든 프로젝트를 조회하고 현황을 파악할 수 있습니다.</div>
				</div>

				<!-- Search Filter Section -->
				<section class="section">
					<div class="card">
						<div class="card-header">
							<h4 class="card-title">검색 및 필터</h4>
						</div>
						<div class="card-body">
							<form class="form" id="searchForm" action="/projects/all"
								method="get">
								<div class="row">
									<input type="hidden" name="page" value="1" />

									<!-- SimpleSearch: 검색 타입 + 검색어 통합 -->
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

									<!-- DetailSearch: 상태, 기간 -->
									<div class="col-md-6 col-lg-4 mb-3">
										<div class="form-group">
											<label for="bizSttsCd">상태</label> <select class="form-select"
												id="bizSttsCd" name="bizSttsCd">
												<option value="">전체</option>
												<option value="B301"
													${param.bizSttsCd eq 'B301' ? 'selected' : ''}>승인대기</option>
												<option value="B302"
													${param.bizSttsCd eq 'B302' ? 'selected' : ''}>진행</option>
												<option value="B303"
													${param.bizSttsCd eq 'B303' ? 'selected' : ''}>보류</option>
												<option value="B304"
													${param.bizSttsCd eq 'B304' ? 'selected' : ''}>완료</option>
											</select>
										</div>
									</div>

									<div class="col-md-6 col-lg-4 mb-3">
										<label>기간</label>
										<div class="input-group">
											<input type="date" class="form-control"
												name="searchStrtBizDt" value="${param.searchStrtBizDt}">
											<span class="input-group-text">~</span> <input type="date"
												class="form-control" name="searchEndBizDt"
												value="${param.searchEndBizDt}">
										</div>
									</div>

									<div class="col-md-12 col-lg-4 mb-3 d-flex align-items-end">
										<button type="submit" class="btn btn-primary me-2">검색</button>
										<button type="button" class="btn btn-light-secondary"
											onclick="resetForm()">초기화</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</section>

				<!-- Project List Section -->
				<section class="section">
					<div class="card">
						<div
							class="card-header d-flex justify-content-between align-items-center">
							<h4 class="card-title">프로젝트 목록</h4>
						</div>
						<div class="card-body">
							<!-- Table View -->
							<div id="table-view">
								<div class="table-responsive">
									<table class="table table-hover table-lg">
										<thead>
											<tr>
												<th></th>
												<th>프로젝트명</th>
												<th>책임자</th>
												<th>기간</th>
												<th>상태</th>
												<th>진행률</th>
												<th>첨부</th>
												<th>액션</th>
											</tr>
										</thead>
										<tbody>
										    <c:if test="${not empty projectList}">
										        <c:forEach items="${projectList}" var="project">
										            <tr>
										                <td>${project.rnum}</td>
										                <td>
										                    <c:choose>
										                        <c:when test="${project.hasAccess}">
										                            <a href="/projects/${project.bizId}">${project.bizNm}</a>
										                        </c:when>
										                        <c:otherwise>
										                            <span class="text-muted"
										                                  style="cursor: not-allowed;"
										                                  data-bs-toggle="tooltip"
										                                  data-bs-placement="right"
										                                  title="접근 권한이 없습니다 (책임자/참여자/열람자만 가능)">
										                                <i class="bi bi-lock-fill me-1"></i>
										                                ${project.bizNm}
										                            </span>
										                        </c:otherwise>
										                    </c:choose>
										                </td>
										                <td>
										                    <c:out value="${project.bizPicNm}" default="${project.bizPicId}" />
										                    <c:if test="${not empty project.bizUserJobNm}">
										                        <c:out value=" ${project.bizUserJobNm}" />
										                    </c:if>
										                    <c:if test="${not empty project.bizPicDeptNm}">
										                        <c:out value=" (${project.bizPicDeptNm})" />
										                    </c:if>
										                </td>
										                <td>${fn:substringBefore(project.strtBizDt, 'T')}~
										                    ${fn:substringBefore(project.endBizDt, 'T')}</td>
										                <td>
										                    <c:choose>
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
										                    </c:choose>
										                </td>
										                <td>${project.bizPrgrs}%
										                    <div class="progress progress-sm">
										                        <div class="progress-bar bg-info" role="progressbar"
										                            style="width: ${project.bizPrgrs}%"
										                            aria-valuenow="${project.bizPrgrs}" aria-valuemin="0"
										                            aria-valuemax="100"></div>
										                    </div>
										                </td>
										                <td>
										                    <c:if test="${not empty project.bizFileId}">
										                        <i class="bi bi-paperclip"></i>
										                    </c:if>
										                </td>
										                <td class="text-nowrap">
										                    <c:choose>
										                        <c:when test="${project.hasAccess}">
										                            <a href="/projects/${project.bizId}"
										                               class="btn btn-sm btn-outline-secondary">상세</a>
										                        </c:when>
										                        <c:otherwise>
										                            <button class="btn btn-sm btn-outline-secondary"
										                                    disabled
										                                    data-bs-toggle="tooltip"
										                                    title="접근 권한 없음">
										                                상세
										                            </button>
										                        </c:otherwise>
										                    </c:choose>
										                </td>
										            </tr>
										        </c:forEach>
										    </c:if>
										</tbody>
									</table>
								</div>
							</div>
							${pagingHTML }
						</div>
					</div>
				</section>
			</div>
		</div>


	</div>

<script>
let searchForm;

   function fnPaging(page) {
       console.log("페이지 이동:", page);

       if (searchForm) {
           searchForm.page.value = page;
           searchForm.requestSubmit();
       } else {
           console.error("오류: searchForm이 초기화되지 않았습니다.");
       }
   }

   function resetForm() {
       // 모든 검색 조건 없이 기본 페이지로 이동
       window.location.href = '/projects/all?page=1';
   }

   document.addEventListener('DOMContentLoaded', function() {
       searchForm = document.getElementById('searchForm');

    	// Bootstrap Tooltip 초기화
       var tooltipTriggerList = [].slice.call(
           document.querySelectorAll('[data-bs-toggle="tooltip"]')
       );
       var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
           return new bootstrap.Tooltip(tooltipTriggerEl);
       });

       // SweetAlert2 Toast 팝업
       var iconType = "${icon}";
       var message = "${toastMessage}";

       if (iconType && message) {
           if (typeof showToast === 'function') {
               showToast(iconType, message);
           }
       }
   });
</script>
</body>

</html>