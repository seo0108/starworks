<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="kr.or.ddit.vo.ProjectMemberVO" %>
<%@ page import="kr.or.ddit.vo.ProjectVO" %>
<%@ page import="java.util.List" %>

<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>프로젝트 상세</title>
<link rel="stylesheet" href="/css/project-detail.css">
</head>

<body>
	<div id="project-info" data-id="${project.bizId}"
		data-name="${project.bizNm}" data-manager-id="${project.bizPicId}"
		data-status-code="${project.bizSttsCd}"
		<%--      data-status="${project.bizSttsNm}" --%>
     data-start-date="${fn:substringBefore(project.strtBizDt, 'T')}"
		data-end-date="${fn:substringBefore(project.endBizDt, 'T')}"
		data-project-type="${project.bizTypeCd}"
		data-budget="${project.bizBdgt}" data-goal="${project.bizGoal}"
		data-scope="${project.bizScope}"
		data-description="${project.bizDetail}"
		data-progress="${project.bizPrgrs}"
		data-file-id="${project.bizFileId}"></div>

	<ul id="member-list" style="display: none;">
		<c:forEach items="${project.members}" var="member">
			<li data-user-id="${member.bizUserId}"
				data-user-name="${member.bizUserNm}"
				data-auth-code="${member.bizAuthCd}"
				data-dept-nm="${member.bizUserDeptNm}"
				data-job-nm="${member.bizUserJobNm}"
				data-file-path="${not empty member.filePath ? member.filePath : '/images/faces/1.jpg'}"></li>
		</c:forEach>
	</ul>

<%-- 1. Spring Security 태그를 사용하여 현재 로그인된 사용자 ID를 JSTL 변수에 저장 --%>
<security:authentication property="principal.realUser.userId" var="currentUserId" />

<%-- 2. 기본 권한 코드 변수를 초기화 (참여자가 아닐 경우를 대비해 빈 값 또는 기본값 설정) --%>
<c:set var="currentUserAuthCode" value="" />

<%-- 3. 프로젝트 책임자(BizPicId)인지 확인하고 권한 코드 설정 (B101: 책임자) --%>
<c:if test="${project.bizPicId eq currentUserId}">
    <c:set var="currentUserAuthCode" value="B101" />
</c:if>

<%-- 4. 책임자가 아닐 경우, 프로젝트 멤버 목록을 순회하며 참여 권한 코드(B102, B103) 찾기 --%>
<c:if test="${empty currentUserAuthCode}">
    <c:forEach items="${project.members}" var="member">
        <c:if test="${member.bizUserId eq currentUserId}">
            <c:set var="currentUserAuthCode" value="${member.bizAuthCd}" />
        </c:if>
    </c:forEach>
</c:if>

<%-- 5. 최종 결정된 권한 코드를 HTML 데이터 속성에 반영 --%>
<div id="current-user"
     data-id="${currentUserId}"
     data-name="${principal.realUser.userNm}"
     data-avatar="/assets/images/faces/${currentUserId}.jpg"
     data-auth-code="${currentUserAuthCode}">
</div>

	<div id="main-content">
		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/project/left-menu.jsp"%>


			<!-- 우측 본문 -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section-6">
				    <div class="outline-title" id="project-name">
				    	<i class="bi bi-list-task me-2"></i>${project.bizNm }
				    </div>
 <!-- 				<div class="outline-subtitle">내가 참여하고 있는 프로젝트 현황을 확인합니다.</div> -->
				</div>

			<ul class="nav nav-tabs" id="projectTab" role="tablist">
				<li class="nav-item" role="presentation">
					<button class="nav-link active" id="overview-tab"
						data-bs-toggle="tab" data-bs-target="#overview-pane" type="button"
						role="tab" aria-controls="overview-pane" aria-selected="true">개요</button>
				</li>
				<li class="nav-item" role="presentation">
			        <button class="nav-link" id="dashboard-tab" data-bs-toggle="tab"
			            data-bs-target="#dashboard-pane" type="button" role="tab"
			            aria-controls="dashboard-pane" aria-selected="false">대시보드</button>
			    </li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="tasks-tab" data-bs-toggle="tab"
						data-bs-target="#tasks-pane" type="button" role="tab"
						aria-controls="tasks-pane" aria-selected="false">업무</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="board-tab" data-bs-toggle="tab"
						data-bs-target="#board-pane" type="button" role="tab"
						aria-controls="board-pane" aria-selected="false">게시판</button>
				</li>
				 <!--  파일 탭 추가 -->
			    <li class="nav-item" role="presentation">
			        <button class="nav-link" id="files-tab" data-bs-toggle="tab"
			            data-bs-target="#files-pane" type="button" role="tab"
			            aria-controls="files-pane" aria-selected="false">
			            <i class="bi bi-folder2-open"></i> 공유 드라이브
			        </button>
			    </li>
			</ul>

			<!-- 프로젝트 상세 정보 -->
			<div class="tab-content" id="projectTabContent">
				<div class="tab-pane fade show active" id="overview-pane"
					role="tabpanel" aria-labelledby="overview-tab">
					<section class="row mt-3">
						<div class="col-12">
						<!-- Project Progress Card -->
							<div class="card" id="card-progress">
								<div class="card-header">
									<h4 class="card-title">프로젝트 진행률</h4>
								</div>
								<div class="card-body">
									<div class="progress" style="height: 25px;">
										<div id="project-progress-bar"
											class="progress-bar progress-bar-striped progress-bar-animated"
											role="progressbar"
											<%-- 1. style="width" 속성 수정: 진행률 값% --%>
							            style="width: ${project.bizPrgrs}%;"
											<%-- 2. aria-valuenow 속성 수정: 진행률 값 --%>
							            aria-valuenow="${project.bizPrgrs}"
											aria-valuemin="0" aria-valuemax="100">

											<%-- 3. 표시 텍스트 수정: 진행률 값% --%>
											${project.bizPrgrs}%
										</div>
									</div>
								</div>
							</div>
							<!-- Project Overview Card -->
							<div class="card">
								<div class="card-header d-flex justify-content-between align-items-center">
								    <h4 class="card-title mb-0">프로젝트 개요</h4>

								    <c:if test="${currentUserAuthCode == 'B101' && project.bizSttsCd != '완료'}">
								        <div class="d-flex gap-2">
								            <a href="/projects/edit?bizId=${project.bizId}"
								                class="btn btn-sm btn-outline-primary">프로젝트 수정</a>

								            <div class="btn-group">
								                <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle"
								                        data-bs-toggle="dropdown" aria-expanded="false">
								                    상태 변경
								                </button>
								                <ul class="dropdown-menu dropdown-menu-end">
								                    <c:if test="${project.bizSttsCd == '진행' || project.bizSttsCd == '보류'}">
								                        <li>
								                            <a class="dropdown-item text-success" href="#"
								                                data-bs-toggle="modal"
								                                data-bs-target="#project-complete-modal">
								                                <i class="bi bi-check-circle me-2"></i> 프로젝트 완료
								                            </a>
								                        </li>
								                    </c:if>
								                    <li><hr class="dropdown-divider"></li>
								                    <li>
								                        <a class="dropdown-item text-danger" href="#"
								                           data-bs-toggle="modal"
								                           data-bs-target="#project-cancel-modal">
								                           <i class="bi bi-x-circle me-2"></i> 프로젝트 취소
								                        </a>
								                    </li>
								                </ul>
								            </div>
								        </div>
								    </c:if>
								</div>
								<div class="card-body">
									<div class="row">
										<!-- Column 1 -->
										<div class="col-md-4 border-end">
											<div class="mb-3">
												<strong>프로젝트명</strong>
												<p>${project.bizNm }</p>
											</div>
											<div class="mb-3">
												<strong>책임자</strong>
												<p>
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
												</p>
											</div>
											<div class="mb-3">
												<strong>기간</strong>
												<p>${fn:substringBefore(project.strtBizDt, 'T')}~
													${fn:substringBefore(project.endBizDt, 'T')}</p>
											</div>
											<div class="mb-3">
												<strong>상태</strong>
												<p>
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
												</p>
											</div>
										</div>
										<!-- Column 2 -->
										<div class="col-md-4 border-end">

											<!-- 참여자 -->
											<div class="mb-3">
												<strong>참여자</strong>
												<div class="avatar-group">
													<c:forEach items="${memberList}" var="member">
														<c:if test="${member.bizAuthCd eq 'B102'}">
															<div class="avatar avatar-md" data-bs-toggle="tooltip"
																title="${member.bizUserNm}<c:if test='${not empty member.bizUserJobNm}'> ${member.bizUserJobNm}</c:if><c:if test='${not empty member.bizUserDeptNm}'> (${member.bizUserDeptNm})</c:if>">
																<img src="${not empty member.filePath ? member.filePath : '/images/faces/1.jpg'}"
																	alt="${member.bizUserNm}">
															</div>
														</c:if>
													</c:forEach>
												</div>
											</div>

											<!-- 열람자 -->
											<div class="mb-3">
												<strong>열람자</strong>
												<div class="avatar-group">
													<c:forEach items="${memberList}" var="member">
														<c:if test="${member.bizAuthCd eq 'B103'}">
															<div class="avatar avatar-md" data-bs-toggle="tooltip"
																title="${member.bizUserNm}<c:if test='${not empty member.bizUserJobNm}'> ${member.bizUserJobNm}</c:if><c:if test='${not empty member.bizUserDeptNm}'> (${member.bizUserDeptNm})</c:if>">
																<img src="${not empty member.filePath ? member.filePath : '/images/faces/1.jpg'}"
																	alt="${member.bizUserNm}">
															</div>
														</c:if>
													</c:forEach>
												</div>
											</div>

											<div class="mb-3">
												<strong>프로젝트 유형</strong>
												<p>${project.bizTypeCd }</p>
											</div>
											<div class="mb-3">
												<strong>예산</strong>
												<p id="project-budget-display">
											        <fmt:formatNumber value="${project.bizBdgt}" pattern="#,##0" />
											    </p>
											</div>
										</div>
										<!-- Column 3 -->
										<div class="col-md-4">
											<div class="mb-3">
												<strong>목표</strong>
												<p>${project.bizGoal}</p>
											</div>
											<div class="mb-3">
												<strong>범위</strong>
												<p>${project.bizScope}</p>
											</div>
										</div>
									</div>
									<hr>
									<div class="row">
										<div class="col-12">
											<div class="mb-3">
												<strong>상세설명</strong>
												<textarea class="form-control" rows="3" readonly>${project.bizDetail }</textarea>
											</div>
											<div class="mb-3">
												<strong>첨부파일</strong>
												<c:choose>
													<c:when test="${not empty fileList}">
														<ul class="list-unstyled mt-2">
															<c:forEach items="${fileList}" var="file">
																<li class="mb-1"><a
																	href="/file/download/${file.saveFileNm}"
																	class="text-primary"> <i class="bi bi-paperclip"></i>
																		${file.orgnFileNm}
																</a></li>
															</c:forEach>
														</ul>
													</c:when>
													<c:otherwise>
														<p class="text-muted small">없음</p>
													</c:otherwise>
												</c:choose>
												<%-- <div>${project.bizFileId }</div> --%>
											</div>
										</div>
									</div>
								</div>
							</div>


						</div>
					</section>
				</div>

				<!-- 취소처리 모달 -->
				<div class="modal fade" id="project-cancel-modal" tabindex="-1"
			    aria-labelledby="projectCancelModalLabel" aria-hidden="true">
			    <div class="modal-dialog modal-dialog-centered">
			        <div class="modal-content">
			            <div class="modal-header">
			                <h5 class="modal-title" id="projectCancelModalLabel">프로젝트 취소 처리</h5>
			                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
			                    aria-label="Close"></button>
			            </div>
			            <div class="modal-body">
			                <div class="alert alert-danger" role="alert">
			                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
			                    <strong>경고:</strong> 프로젝트를 취소하면 조회 외의 모든 작업이 제한됩니다. 이 결정은 되돌릴 수 없습니다.
			                </div>

			                <form id="project-cancel-form">
			                    <input type="hidden" id="cancel-biz-id" value="${project.bizId}">

			                    <div class="mb-3">
			                        <label for="cancellation-reason" class="form-label">취소 사유 <span class="text-danger">*</span></label>
			                        <textarea class="form-control" id="cancellation-reason" rows="4"
			                                  placeholder="취소 사유를 명확하게 입력해 주세요." required></textarea>
			                        <div class="invalid-feedback">취소 사유를 반드시 입력해야 합니다.</div>
			                    </div>
			                </form>
			            </div>
			            <div class="modal-footer">
			                <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
			                <button type="button" class="btn btn-danger" id="confirm-cancellation-btn">
			                    취소 확정
			                </button>
			            </div>
			        </div>
			    </div>
			</div>

	<!-- 주요 업무 목록-->
	<%@ include file="tabs/tasks-tab.jsp" %>
	<!-- 게시판 탭 -->
	<%@ include file="tabs/board-tab.jsp" %>
	<!-- 파일 탭  -->
	<%@ include file="tabs/files-tab.jsp" %>
	<!-- 대시보드 탭 -->
	<%@ include file="tabs/dashboard-tab.jsp" %>
	<!-- 모든 모달들 여기에 모아둠. -->
	<%@ include file="modals/all-modals.jsp" %>

	<!-- D3.js 라이브러리 추가 -->
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
	<script
		src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
	<!--     <script src="../mazer-1.0.0/dist/assets/vendors/summernote/summernote-lite.min.js"></script> -->
	<!--     <script src="../mazer-1.0.0/dist/assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js"></script> -->
	<!--     <script src="../mazer-1.0.0/dist/assets/js/bootstrap.bundle.min.js"></script> -->
	<!--     <script src="../mazer-1.0.0/dist/assets/js/main.js"></script> -->
	<script src="/js/projects/project-detail.js"></script>
	<script src="/js/projects/project-detail-board.js"></script>
	<script src="/js/projects/project-detail-task.js"></script>
	<script src="/js/projects/project-detail-task-comment.js"></script>
	<script src="/js/projects/project-detail-taskChecklist.js"></script>
	<script src="/js/projects/project-detail-files.js"></script>
	<script src="/js/projects/project-detail-dashboard.js"></script>
	<script src="/js/projects/project-detail-dashboard-charts.js"></script>
	<script src="/js/projects/project-detail-task-filter.js"></script>
</body>

</html>