<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%-- <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %> --%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>프로젝트 수정 - 그룹웨어</title>
</head>

<body>
	<div id="main-content">
<!-- 		<div class="page-heading" style="max-width: 1140px; margin: 0 auto;"> -->
<!-- 			<div class="page-title"> -->
<!-- 				<div class="row"> -->
<!-- 					<div class="col-12 col-md-6 order-md-1 order-last"> -->
<!-- 						<h3>프로젝트 수정</h3> -->
<!-- 						<p class="text-subtitle">프로젝트 정보를 수정합니다.</p> -->
<!-- 					</div> -->
<!-- 				</div> -->

	<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/project/left-menu.jsp"%>

			<!-- 우측 본문 -->
			<div style="flex: 1 1 78%;" class="right-content">


				<div class="outline-section-6">
				    <div class="outline-title" id="project-name"><i class="bi bi-list-task me-2"></i>2025년 4월반 TEAM1 그룹웨어 개발 수정</div>
 <!-- 				<div class="outline-subtitle">내가 참여하고 있는 프로젝트 현황을 확인합니다.</div> -->
				</div>

			<section id="project-edit-form">
				<div class="card">
					<div class="card-body">
						<form class="form">
						<input type="hidden" id="project-id" value="${project.bizId}">
						<input type="hidden" id="original-status-cd" value="${project.bizSttsCd}">
							<!-- Section 1: Core Information -->
							<h5 class="form-section-title">핵심 정보</h5>
							<div class="row">
								<div class="col-12">
									<div class="form-group">
										<label for="project-name-input">프로젝트명 <span
											class="text-danger">*</span></label> <input type="text" id="project-name-input"
									        class="form-control form-control-lg"
									        value="${project.bizNm}" required>
									</div>
								</div>
								<div class="col-md-6 col-12">
									<div class="form-group">
										<label for="project-type-select">프로젝트 유형</label>
										<select class="form-select" id="project-type-select">
										    <c:forEach items="${projectTypes}" var="type">
										        <option value="${type.codeId}"
										                ${project.bizTypeCd eq type.codeId ? 'selected' : ''}>
										            ${type.codeNm}
										        </option>
										    </c:forEach>
										</select>
									</div>
								</div>
								<div class="col-md-6 col-12">
									<div class="form-group">
										<label for="start-date-input">기간 <span
											class="text-danger">*</span></label>
										<div class="input-group">
											<input type="date" id="start-date-input" class="form-control"
											       value="${fn:substringBefore(project.strtBizDt, 'T')}" required>
											<input type="date" id="end-date-input" class="form-control"
											       value="${fn:substringBefore(project.endBizDt, 'T')}" required>
										</div>
									</div>
								</div>
							</div>

							<hr class="form-section-divider">

							<!-- Section 2: Team Setup -->
							<h5 class="form-section-title">팀 구성</h5>
							<div class="row">
								<div class="col-12">
									<div class="form-group">
										<label for="project-manager-input">담당자 (책임자)</label>
										<input type="text" id="project-manager-input" class="form-control" value="${project.bizPicNm}" readonly>
										<input type="hidden" id="project-manager-id" value="${project.bizPicId}">
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group">
										<label>참여자 <span class="text-danger">*</span></label>
										<div id="participant-list" class="mb-2"></div>
										<button class="btn btn-outline-primary w-100" type="button"
											id="add-participant-btn">
											<i class="bi bi-plus-circle"></i> 참여자 추가/변경
										</button>
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-group">
										<label>열람자</label>
										<div id="viewer-list" class="mb-2"></div>
										<button class="btn btn-outline-secondary w-100" type="button"
										id="add-viewer-btn">
											<i class="bi bi-plus-circle"></i> 열람자 추가/변경
										</button>
									</div>
								</div>
							</div>

							<hr class="form-section-divider">

							<!-- Section 3: Project Details -->
							<h5 class="form-section-title">상세 내용</h5>
							<div class="row">
								<div class="col-12">
									<div class="form-group">
										<label for="project-goal-input">목표 <span
											class="text-danger">*</span></label>
											<input type="text" id="project-goal-input" class="form-control"
       										value="${project.bizGoal}" required>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label for="project-description-textarea">상세설명</label>
										<textarea class="form-control" id="project-description-textarea" rows="5">${project.bizDetail}</textarea>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-6 col-12">
									<div class="form-group">
										<label for="project-scope-input">범위</label>
										<input type="text" id="project-scope-input" class="form-control" value="${project.bizScope}">
									</div>
								</div>
								<div class="col-md-6 col-12">
									<div class="form-group">
										<label for="project-budget-input">예산</label>
										<div class="input-group">
											<input type="number" id="project-budget-input" class="form-control"
       											value="${project.bizBdgt}"> <span class="input-group-text">원</span>
										</div>
									</div>
								</div>
							</div>

							<hr class="form-section-divider">

							<!-- Section 4: Misc -->
							<h5 class="form-section-title">파일 및 기타 설정</h5>
							<div class="row align-items-center">
							    <div class="col-md-8 col-12">
							        <div class="form-group">
							            <label>첨부파일</label>
							            <div class="file-upload-area" id="file-upload-area">
							                <input type="file" id="file-input" multiple hidden>
							                <i class="bi bi-cloud-arrow-up"></i>
							                <p style="font-weight: normal;">파일을 이곳에 드래그하거나 클릭하여 업로드하세요.</p>
							            </div>
							            <div id="file-list" class="mt-3">
							                <!-- 기존 파일 목록 -->
							                <c:if test="${not empty fileList}">
							                    <c:forEach items="${fileList}" var="file">
							                        <p class="existing-file-item" style="font-weight: normal;">
							                            <i class="bi bi-file-earmark-text me-2"></i>
							                            <a href="/file/download/${file.saveFileNm}" class="text-primary">
							                                ${file.orgnFileNm}
							                            </a>
							                            <span class="text-muted small">(${file.fileSize / 1024} KB)</span>
							                            <button type="button" class="btn btn-sm btn-link text-danger delete-existing-file p-0 ms-2"
							                                    data-file-id="${file.fileId}"
							                                    data-file-seq="${file.fileSeq}">
							                                <i class="bi bi-x-circle"></i>
							                            </button>
							                        </p>
							                    </c:forEach>
							                </c:if>
							            </div>
							        </div>
							    </div>
								<div class="col-md-4 col-12">
									<div class="form-group">
										<label for="project-status-select">프로젝트 상태</label>
									<select class="form-select" id="project-status-select">
									    <c:forEach items="${projectStatus}" var="status">
									        <option value="${status.codeId}"
									                ${project.bizSttsCd eq status.codeNm ? 'selected' : ''}>
									            ${status.codeNm}
									        </option>
									    </c:forEach>
									</select>
									</div>
								</div>
							</div>

							<div class="col-12 d-flex justify-content-end mt-5">
								<a href="/projects/${project.bizId}"
									class="btn btn-light-secondary me-1 mb-1">취소</a>
								<button type="submit" class="btn btn-primary me-1 mb-1">저장</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>


	<!-- Organization Chart Modal -->
	<div class="modal fade" id="org-chart-modal" tabindex="-1"
		aria-labelledby="orgChartModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="orgChartModalLabel">사용자 선택</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="org-chart" id="org-chart-container"></div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary"
						id="confirm-selection-btn">선택 완료</button>
				</div>
			</div>
		</div>
	</div>

<script type="application/json" id="member-data">
<c:choose>
    <c:when test="${empty project.members}">[]</c:when>
    <c:otherwise>[
<c:forEach items="${project.members}" var="member" varStatus="status">
{"bizUserId":"${member.bizUserId}","bizUserNm":"${member.bizUserNm}","bizAuthCd":"${member.bizAuthCd}","bizAuthNm":"${not empty member.bizAuthNm ? member.bizAuthNm : ''}"}<c:if test="${!status.last}">,</c:if>
</c:forEach>
]</c:otherwise>
</c:choose>
</script>

	<script src="mazer-1.0.0/dist/assets/js/bootstrap.bundle.min.js"></script>
	<script src="assets/compiled/js/app.js"></script>
	<script src="/js/projects/project-edit.js"></script>
</body>

</html>