<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 17.     			김주민            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<!-- Task Details Modal -->
<div class="modal fade" id="task-checklist-modal" tabindex="-1"
	aria-labelledby="taskChecklistModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="taskChecklistModalLabel">
					업무 상세: <span></span>
				</h5>
				<div>
					<button type="button" class="btn btn-outline-primary btn-sm"
						id="edit-task-btn">수정</button>
					<button type="button" class="btn btn-success btn-sm d-none"
						id="save-task-btn">저장</button>
					<button type="button" class="btn btn-danger btn-sm"
						id="delete-task-btn">삭제</button>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
			</div>
			<div class="modal-body">
				<!-- View Mode -->
				<div id="task-details-container" class="mb-4">
					<div class="row mb-2">
						<div class="col-sm-3">
							<strong>담당자</strong>
						</div>
						<div class="col-sm-9" id="modal-task-assignee"></div>
					</div>
					<div class="row mb-2">
						<div class="col-sm-3">
							<strong>업무 상태</strong>
						</div>
						<div class="col-sm-9" id="modal-task-status"></div>
					</div>
					<div class="row mb-2">
						<div class="col-sm-3">
							<strong>기간</strong>
						</div>
						<div class="col-sm-9" id="modal-task-period"></div>
					</div>
					<div class="row mb-2">
						<div class="col-sm-3">
							<strong>업무 진행률</strong>
						</div>
						<div class="col-sm-9" id="modal-task-progress"></div>
					</div>

					<div class="row mb-2">
						<div class="col-sm-3">
							<strong>상세 내용</strong>
						</div>
						<div class="col-sm-9" id="modal-task-description"></div>
					</div>
					<div class="row mt-2">
						<div class="col-sm-3">
							<strong>첨부파일</strong>
						</div>
						<div class="col-sm-9" id="modal-task-attachments"></div>
					</div>

				</div>
				<!-- Edit Form (hidden) -->
				<div id="task-edit-form-container" class="mb-4 d-none">
					<div class="row mb-3">
						<label for="modal-task-name-edit" class="col-sm-3 col-form-label">
							<strong>업무명</strong>
						</label>
						<div class="col-sm-9">
							<input type="text" class="form-control" id="modal-task-name-edit">
						</div>
					</div>
					<div class="row mb-3">
						<label for="modal-task-assignee-edit"
							class="col-sm-3 col-form-label"> <strong>담당자</strong>
						</label>
						<div class="col-sm-9">
							<select class="form-select" id="modal-task-assignee-edit"></select>
						</div>
					</div>
					<div class="row mb-3">
						<label for="modal-task-status-edit"
							class="col-sm-3 col-form-label"> <strong>업무 상태</strong>
						</label>
						<div class="col-sm-9">
							<select class="form-select" id="modal-task-status-edit">
								<option value="B401">미시작</option>
								<option value="B402">진행중</option>
								<option value="B403">보류</option>
								<option value="B404">완료</option>
							</select>
						</div>
					</div>
					<div class="row mb-3">
						<label class="col-sm-3 col-form-label"><strong>기간</strong></label>
						<div class="col-sm-9 input-group">
							<input type="date" class="form-control"
								id="modal-task-start-date-edit"> <span
								class="input-group-text">~</span> <input type="date"
								class="form-control" id="modal-task-end-date-edit">
						</div>
					</div>
					<div class="row mb-3">
						<label for="modal-task-description-edit"
							class="col-sm-3 col-form-label"> <strong>상세 내용</strong>
						</label>
						<div class="col-sm-9">
							<textarea class="form-control" id="modal-task-description-edit"
								rows="3"></textarea>
						</div>
					</div>
					<!-- 파일 입력 필드 -->
					<div class="row mb-3">
						<label for="modal-task-files-edit" class="col-sm-3 col-form-label">
							<strong>첨부파일 변경</strong>
						</label>
						<div class="col-sm-9">
							<input type="file" id="modal-task-files-edit"
								class="form-control" multiple> <small class="text-muted">
								새 파일을 선택하면 기존 파일이 교체됩니다. 선택하지 않으면 기존 파일이 유지됩니다. </small>
						</div>
					</div>
				</div>
				<hr class="mb-4">

				<h6>체크리스트</h6>
				<div class="input-group mb-4">
					<input type="text" id="new-checklist-item-input"
						class="form-control" placeholder="새 체크리스트 항목 추가">
					<button id="add-checklist-item-btn" class="btn btn-outline-primary"
						type="button">추가</button>
				</div>
				<div id="checklist-container" class="mb-3"></div>
				<hr>

				<!-- 업무 코멘트 -->
				<h6 class="mt-4">코멘트</h6>
				<div id="taskComment-list" class="mb-4"></div>
				<div class="comment-form">
					<div class="d-flex gap-3">
						<!-- 댓글 등록 프로필사진 없앰 -->
						<div id="current-user" data-id="${currentUserId}"
							data-name="${principal.realUser.userNm}"
							data-avatar="/assets/images/faces/${currentUserId}.jpg"
							data-auth-code="${currentUserAuthCode}"></div>
						<div class="flex-grow-1">
							<textarea id="new-comment-input" class="form-control" rows="2"
								placeholder="코멘트를 입력하세요..."></textarea>
							<button id="add-comment-btn"
								class="btn btn-primary btn-sm mt-2 float-end">등록</button>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary"
					data-bs-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</div>

<!-- Task Create Modal -->
<form:form method="post" enctype="multipart/form-data"
	id="taskCreateForm">

	<div class="modal fade" id="task-create-modal" tabindex="-1"
		aria-labelledby="taskCreateModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="taskCreateModalLabel">업무 등록</h5>
					<button type="button" class="btn btn-sm" id="fill-task-dummy-btn"
						style="border: padding: 2px 8px; font-size: 0.9rem;"
						title="더미 데이터 채우기">
						<i class="bi bi-plus-circle"></i>
					</button>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form class="form">
						<div class="row">
							<div class="col-12">
								<div class="form-group">
									<label for="task-name-modal" class="form-label">업무명 <span
										class="text-danger">*</span></label> <input type="text"
										id="task-name-modal" name="taskNm"
										class="form-control form-control-lg"
										placeholder="예: 로그인 기능 개발" required>
								</div>
							</div>
							<div class="col-md-6 col-12">
								<div class="form-group">
									<label for="task-assignee-modal" class="form-label">담당자
										<span class="text-danger">*</span>
									</label> <select id="task-assignee-modal" name="bizUserId"
										class="form-select"></select>
								</div>
							</div>
							<div class="col-md-6 col-12">
								<div class="form-group">
									<label for="task-status-modal" class="form-label">업무 상태</label>
									<select id="task-status-modal" name="taskSttsCd"
										class="form-select">
										<option value="B401" selected>미시작</option>
										<option value="B402">진행중</option>
										<option value="B403">보류</option>
										<option value="B404">완료</option>
									</select>
								</div>
							</div>
							<div class="col-12">
								<div class="form-group">
									<label class="form-label">기간 <span class="text-danger">*</span></label>
									<div class="input-group">
										<input type="date" id="start-date-modal" name="strtTaskDt"
											class="form-control" required><span
											class="input-group-text">~</span> <input type="date"
											id="end-date-modal" name="endTaskDt" class="form-control"
											required>
									</div>
								</div>
							</div>
							<div class="col-12">
								<div class="form-group">
									<label for="task-description-modal" class="form-label">상세
										내용</label>
									<textarea id="task-description-modal" name="taskDetail"
										class="form-control" rows="6"
										placeholder="업무의 배경, 목표, 요구사항 등을 상세히 작성합니다."></textarea>
								</div>
							</div>
						</div>
						<hr class="form-section-divider">
						<div class="row">
							<div class="col-12">
								<div class="form-group">
									<label for="task-files-modal" class="form-label">첨부파일</label> <input
										type="file" id="task-files-modal" name="fileList"
										class="form-control" multiple>
									<p class="text-muted mt-1">
										<small>기획서, 디자인 시안, 관련 자료 등을 첨부할 수 있습니다.</small>
									</p>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary" id="create-task-btn">업무
						생성</button>
				</div>
			</div>
		</div>
	</div>
</form:form>

<!-- Write Post Modal -->
<div class="modal fade" id="write-post-modal" tabindex="-1"
	aria-labelledby="writePostModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="writePostModalLabel">새 글 작성</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
					aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<form id="write-post-form">
					<button type="button" class="btn btn-outline-info me-2"
						id="demo-data-btn">시연 데이터 추가</button>
					<div class="form-group">
						<div class="form-check">
							<input class="form-check-input" type="checkbox"
								id="is-notice-checkbox" disabled> <label
								class="form-check-label" for="is-notice-checkbox">
								공지사항으로 등록 </label> <small class="text-muted d-block">프로젝트 책임자만
								선택할 수 있습니다.</small>
						</div>
					</div>
					<div class="form-group">
						<label for="post-title" class="form-label">제목</label> <input
							type="text" id="post-title" class="form-control"
							placeholder="제목을 입력하세요" required>
					</div>
					<div class="form-group">
						<label for="post-content" class="form-label">내용</label>
						<textarea id="post-content" class="form-control" rows="10"></textarea>
					</div>
					<div class="form-group">
						<label for="post-attachments" class="form-label">첨부파일</label> <input
							class="form-control" type="file" id="post-attachments" multiple>

						<!-- 파일 목록 미리보기 영역 추가 -->
						<div id="file-list-preview" class="mt-3">
							<p class="text-muted small mb-0">선택된 파일이 없습니다.</p>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-light-secondary"
					data-bs-dismiss="modal">취소</button>
				<button type="button" class="btn btn-primary" id="save-post-btn">등록</button>
			</div>
		</div>
	</div>
</div>

<!-- 게시글 상세보기 Modal -->
<div class="modal fade" id="post-detail-modal" tabindex="-1"
	aria-labelledby="postDetailModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="postDetailModalLabel">게시글 상세</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
					aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="mb-3">
					<h4 id="detail-post-title"></h4>
					<div class="text-muted">
						<span id="detail-post-author"></span> | <span
							id="detail-post-date"></span> | 조회수: <span id="detail-post-views"></span>
					</div>
				</div>
				<hr>
				<div id="detail-post-content" class="mb-3"
					style="min-height: 200px;"></div>
				<hr>
				<div id="detail-post-files">
					<h6>첨부파일</h6>
					<ul id="detail-file-list"></ul>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary"
					data-bs-dismiss="modal">닫기</button>
				<button type="button" class="btn btn-warning" id="edit-post-btn">수정</button>
				<button type="button" class="btn btn-danger" id="delete-post-btn">삭제</button>
			</div>
		</div>
	</div>
</div>

<!-- 프로젝트 완료 Modal -->
<div class="modal fade" id="project-complete-modal" tabindex="-1"
	aria-labelledby="projectCompleteModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="projectCompleteModalLabel">프로젝트 완료</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
					aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="alert alert-success">
					<i class="bi bi-info-circle me-2"></i> "<strong>${project.bizNm}</strong>"
					프로젝트를 완료 처리하시겠습니까?
				</div>

				<!-- 회고 입력 -->
				<div class="form-group mb-3">
					<label for="project-retro" class="form-label fw-semibold">
						회고 작성 <span class="text-danger">*</span>
					</label>
					<textarea id="project-retro" class="form-control" rows="6"></textarea>
					<small class="text-muted">프로젝트 진행 과정에서의 소감을 작성해주세요.</small>
				</div>

				<!-- 주의사항 -->
				<div class="border rounded p-3">
					<small class="text-muted"> <i
						class="bi bi-info-circle me-1"></i> '완료 처리' 버튼을 누르면 해당 프로젝트는 읽기
						전용으로 전환되며, 수정이 불가합니다.
					</small>
				</div>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success"
					id="confirm-complete-btn">완료 처리</button>
				<button type="button" class="btn btn-light-secondary"
					data-bs-dismiss="modal">취소</button>
			</div>
		</div>
	</div>
</div>

<!-- 프로젝트 취소 모달 -->
<div class="modal fade" id="project-cancel-modal" tabindex="-1"
	aria-labelledby="projectCancelModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="projectCancelModalLabel">프로젝트 취소 처리</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
					aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="alert alert-danger" role="alert">
					<i class="bi bi-exclamation-triangle-fill me-2"></i> <strong>경고:</strong>
					프로젝트를 취소하면 조회 외의 모든 작업이 제한됩니다. 이 결정은 되돌릴 수 없습니다.
				</div>

				<form id="project-cancel-form">
					<input type="hidden" id="cancel-biz-id" value="${project.bizId}">

					<div class="mb-3">
						<label for="cancellation-reason" class="form-label">취소 사유
							<span class="text-danger">*</span>
						</label>
						<textarea class="form-control" id="cancellation-reason" rows="4"
							placeholder="취소 사유를 명확하게 입력해 주세요." required></textarea>
						<div class="invalid-feedback">취소 사유를 반드시 입력해야 합니다.</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-light-secondary"
					data-bs-dismiss="modal">취소</button>
				<button type="button" class="btn btn-danger"
					id="confirm-cancellation-btn">취소 확정</button>
			</div>
		</div>
	</div>
</div>