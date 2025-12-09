<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%-- <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%> --%>

<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>프로젝트 등록 - 그룹웨어</title>
<link rel="stylesheet" href="/css/project.css">
</head>

<body>

	<div id="main-content">
		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/project/left-menu.jsp"%>

			<!-- 우측 본문 -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section d-flex justify-content-between align-items-center">
        <div>
            <div class="outline-title">프로젝트 등록</div>
            <div class="outline-subtitle">새로운 프로젝트의 정보를 입력하고 팀과 공유하세요.</div>
        </div>

        <button type="button" class="btn btn-sm" id="fill-dummy-data-btn"
                style="padding: 4px 10px; font-size: 0.9rem;"
                title="더미 데이터 채우기">
            <i class="bi bi-plus-circle"></i>
        </button>
    </div>


				<section id="project-creation-form">
					<div class="card">
						<div class="card-body px-5">
							<form class="form" method="post" enctype="multipart/form-data">
								<!-- Section 1: Core Information -->
								<h5 class="form-section-title">핵심 정보</h5>
								<div class="row">
									<div class="col-12">
										<div class="form-group">
											<label for="project-name-input">프로젝트명 <span
												class="text-danger">*</span></label> <input type="text"
												id="project-name-input" class="form-control form-control-lg"
												placeholder="예: 2025년 신규 그룹웨어 개발" required>
										</div>
									</div>
									<div class="col-md-6 col-12">
										<div class="form-group">
											<label for="project-type-select">프로젝트 유형 <span
												class="text-danger">*</span></label> <select class="form-select"
												id="project-type-select" required>
												<option value="">선택하세요</option>
												<c:forEach items="${projectTypes}" var="type">
													<option value="${type.codeId}">${type.codeNm}</option>
												</c:forEach>
											</select>
											<div class="invalid-feedback">프로젝트 유형을 선택해주세요.</div>
										</div>
									</div>
									<div class="col-md-6 col-12">
										<div class="form-group">
											<label for="start-date-input">기간 <span
												class="text-danger">*</span></label>
											<div class="input-group">
												<input type="date" id="start-date-input"
													class="form-control" required> <span
													class="input-group-text">~</span> <input type="date"
													id="end-date-input" class="form-control" required>
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
											<label for="project-manager-input">담당자 (책임자)</label> <input
												type="text" id="project-manager-input" class="form-control"
												value="${loginUser.userNm} (${loginUser.userId})" readonly>
											<input type="hidden" id="project-manager-id"
												value="${loginUser.userId}">
										</div>
									</div>
									<div class="col-md-6">
										<div class="form-group">
											<label>참여자 <span class="text-danger">*</span></label>
											<div id="participant-list" class="mb-2"></div>
											<button class="btn btn-outline-primary w-100" type="button"
												id="add-participant-btn">
												<i class="bi bi-plus-circle"></i> 참여자 추가
											</button>
										</div>
									</div>
									<div class="col-md-6">
										<div class="form-group">
											<label>열람자</label>
											<div id="viewer-list" class="mb-2"></div>
											<button class="btn btn-outline-secondary w-100" type="button"
												id="add-viewer-btn">
												<i class="bi bi-plus-circle"></i> 열람자 추가
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
												class="text-danger">*</span></label> <input type="text"
												id="project-goal-input" class="form-control"
												placeholder="프로젝트의 핵심 성공 기준(KPI) 또는 목표를 명확하게 입력하세요."
												required>
										</div>
									</div>
									<div class="col-12">
										<div class="form-group">
											<label for="project-description-textarea">상세설명</label>
											<textarea class="form-control"
												id="project-description-textarea" rows="5"
												placeholder="프로젝트의 배경, 주요 기능, 기대 효과 등 상세한 내용을 자유롭게 기술하세요."></textarea>
										</div>
									</div>
								</div>
								<div class="row">
									<div class="col-md-6 col-12">
										<div class="form-group">
											<label for="project-scope-input">범위</label> <input
												type="text" id="project-scope-input" class="form-control"
												placeholder="가맹점 점주 및 본사 직원이 사용할 수 있는 웹 기반 그룹웨어 시스템 구축.">
										</div>
									</div>
									<div class="col-md-6 col-12">
										<div class="form-group">
											<label for="project-budget-input">예산</label>
											<div class="input-group">
												<input type="text" id="project-budget-input"
													class="form-control" placeholder="숫자만 입력" name="projectBudget"> <span
													class="input-group-text">원</span>
											</div>
										</div>
									</div>
								</div>

								<hr class="form-section-divider">

								<!-- Section 4: Misc -->
								<h5 class="form-section-title">파일 업로드</h5>
								<div class="row align-items-center">
									<div class="col-md-8 col-12">
										<div class="form-group">
											<label>첨부파일</label>
											<div class="file-upload-area" id="file-upload-area">
											    <input type="file" id="file-input" multiple hidden>
											    <i class="bi bi-cloud-arrow-up"></i>
											    <p><strong>클릭</strong>하거나 <strong>파일을 드래그</strong>하여 업로드하세요.</p>
											    <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem;">
											        최대 10MB • 여러 파일 선택 가능
											    </p>
											</div>
											<div id="file-list" class="mt-3"></div>
										</div>
									</div>
								</div>

								<div class="col-12 d-flex justify-content-end mt-5">
									<button type="reset" class="btn btn-light-secondary me-1 mb-1">초기화</button>
									<button type="submit" class="btn btn-primary me-1 mb-1"
										data-feature-id="M005-03-01">프로젝트 생성</button>
								</div>
							</form>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>

	<!-- 조직도 모달 -->
	<div class="modal fade" id="org-chart-modal" tabindex="-1"
	    aria-labelledby="orgChartModalLabel" aria-hidden="true">
	    <div class="modal-dialog modal-dialog-scrollable">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h5 class="modal-title" id="orgChartModalLabel">사용자 선택</h5>
	                <div class="d-flex align-items-center gap-2">
	                    <button type="button"
	                            class="btn btn-sm"
	                            id="fill-dummy-members-btn"
	                            style="padding: 4px 10px; font-size: 0.9rem;"
	                            title="더미 데이터로 4명 자동 선택">
	                        <i class="bi bi-plus-circle"></i>
	                    </button>
	                    <button type="button" class="btn-close" data-bs-dismiss="modal"
	                        aria-label="Close"></button>
	                </div>
	            </div>

	            <!-- 검색창 -->
	            <div class="modal-body">
	                <div class="mb-3">
	                    <input type="text"
	                           class="form-control"
	                           id="org-search-input"
	                           placeholder="이름 또는 부서명 검색">
	                </div>
	                <div class="org-chart" id="org-chart-container"></div>
	            </div>

	            <div class="modal-footer">
				    <div class="me-auto">
				        <span class="text-muted" style="font-size: 0.95rem;">
				            <span class="text-primary fw-bold" id="selected-count-number">0</span>명 선택되었습니다.
				        </span>
				    </div>
				    <button type="button" class="btn btn-light-secondary"
				        data-bs-dismiss="modal">취소</button>
				    <button type="button" class="btn btn-primary"
				        id="confirm-selection-btn">선택 완료</button>
				</div>
	        </div>
	    </div>
	</div>

	<script src="/js/projects/project-create.js"></script>
</body>

</html>