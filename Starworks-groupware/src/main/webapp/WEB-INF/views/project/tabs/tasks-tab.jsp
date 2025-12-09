<!--
* == 개정이력(Modification Information) ==
*
* 수정일 수정자 수정내용
* ============ ============== =======================
* 2025. 10. 17. 김주민 최초 생성
* 2025. 10. 24. 김주민 담당자 필터링 기능 추가
*
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!-- 주요 업무 목록-->
<div class="tab-pane fade" id="tasks-pane" role="tabpanel"
	aria-labelledby="tasks-tab">
	<!-- Task List Card -->
	<section class="row mt-3">
		<div class="col-12">
			<div class="card">
				<div
					class="card-header d-flex justify-content-between align-items-center">
					<h4 class="mb-0">
						업무 목록 <span class="badge bg-light-primary ms-2"
							id="task-total-count">0</span>
					</h4>

					<div class="d-flex gap-2 align-items-center">
						<!-- 선택된 업무 삭제 버튼 (처음에는 숨김) -->
						<c:if
							test="${currentUserAuthCode == 'B101' && project.bizSttsCd != '완료'}">
							<button type="button" class="btn btn-danger"
								id="delete-selected-tasks-btn" style="display: none;">
								삭제 (<span id="selected-count">0</span>)
							</button>
							<!-- 책임자만 업무 등록 버튼 표시 -->
							<button type="button" class="btn btn-primary"
								data-bs-toggle="modal" data-bs-target="#task-create-modal">업무
								등록</button>
						</c:if>
					</div>

				</div>
				<div class="card-body">
					<div class="table-responsive">
						<table class="table table-hover">
							<thead>
								<tr>
									<!-- 책임자만 체크박스 컬럼 표시 -->
									<c:if
										test="${currentUserAuthCode == 'B101' && project.bizSttsCd != '완료'}">
										<th style="width: 40px;"><input type="checkbox"
											class="form-check-input" id="select-all-tasks"></th>
									</c:if>
									<th>업무명</th>
									<th>담당자 <!-- 담당자 필터링 드롭다운 -->
										<div class="dropdown d-inline-block ms-1">
											<button class="btn btn-link p-0 text-decoration-none"
												type="button" id="task-assignee-filter-btn"
												data-bs-toggle="dropdown" aria-expanded="false"
												title="담당자 필터">
												<i class="bi bi-funnel"></i>
											</button>
											<ul class="dropdown-menu dropdown-menu-end"
												aria-labelledby="task-assignee-filter-btn"
												id="task-assignee-filter-dropdown" style="min-width: 200px;">
												<li><a class="dropdown-item active" href="#"
													data-biz-user-id=""> <i class="bi bi-check2 me-2"></i>전체
												</a></li>
												<li><hr class="dropdown-divider"></li>
												<!-- 담당자 목록이 JS로 동적 추가됨 -->
											</ul>
										</div>
									</th>
									<th>상태</th>
									<th>업무 진행률</th>
									<th>기간</th>
									<th>액션</th>
								</tr>
							</thead>
							<tbody id="task-list-tbody">
								<!-- JS가 채움 -->
							</tbody>
						</table>
					</div>
					<!-- 페이징 영역 추가 -->
					<div id="task-paging-area"
						class="d-flex justify-content-center mt-3">
						<!-- 페이징 UI 삽입 -->
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
