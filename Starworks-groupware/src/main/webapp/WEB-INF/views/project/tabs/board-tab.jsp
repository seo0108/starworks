<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 17.     	김주민            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- 게시판 Start-->
				<div class="tab-pane fade" id="board-pane" role="tabpanel"
					aria-labelledby="board-tab">
					<div id="board-list-view" class="card mt-3">
						<div class="card-header">
							<h5 class="card-title">게시판</h5>
						</div>
						<div class="card-body">
							<div class="table-responsive">
								<table class="table table-hover">
									<thead>
										<tr>
											<th></th>
											<th>제목</th>
											<th>작성자</th>
											<th>등록일</th>
											<th>조회수</th>
										</tr>
									</thead>
									<tbody id="board-list-body">
										<!-- 여기 JS가 채움 -->
									</tbody>
								</table>
								<div id="paging-area" class="d-flex justify-content-center mt-3">
									<!-- 여기 페이징 UI 삽입 -->
								</div>
							</div>

							<!-- 검색 및 글쓰기 UI 삽입 위치 -->
							<div
								class="d-flex justify-content-between align-items-center mb-4 px-3 pt-3">
								<div class="col-md-4 col-sm-6">
									<form method="get" id="searchUI" class="d-flex">
										<select class="form-select me-2" name="searchType"
											id="searchTypeSelect" style="width: auto;">
											<option value="" ${empty search.searchType ? 'selected' : ''}>전체</option>
											<option value="title"
												${search.searchType eq 'title' ? 'selected' : ''}>제목</option>
											<option value="writer"
												${search.searchType eq 'writer' ? 'selected' : ''}>작성자</option>
											<option value="content"
												${search.searchType eq 'content' ? 'selected' : ''}>내용</option>
										</select> <input type="text" class="form-control" name="searchWord"
											id="searchWordInput" value="${search.searchWord}"
											placeholder="검색...">
										<button class="btn btn-primary" type="button" id="searchBtn">
											<i class="bi bi-search"></i>
										</button>
									</form>
								</div>
								<a href="#" class="btn btn-primary" data-bs-toggle="modal"
									data-bs-target="#write-post-modal">글쓰기</a>
							</div>
						</div>
					</div>

					<!-- 게시판 상세 뷰 -->
					<div id="board-detail-view" class="card mt-3"
						style="display: none;">
						<div class="card-header">
							<div class="d-flex justify-content-between align-items-center">
								<h5 id="detail-post-title"></h5>
								<button type="button" class="btn btn-light"
									id="back-to-list-btn">
									<i class="bi bi-list"></i> 목록
								</button>
							</div>
							<div class="text-muted mt-2">
								<span id="detail-post-author"></span> | <span
									id="detail-post-date"></span> | 조회수: <span
									id="detail-post-views"></span>
							</div>
						</div>
						<div class="card-body">
							<div id="detail-post-content" class="mb-4"
								style="min-height: 200px; white-space: pre-wrap;"></div>
							<hr>
							<div id="detail-post-files" class="mb-4">
								<h6>첨부파일</h6>
								<ul id="detail-file-list"></ul>
							</div>

							<!-- 수정/삭제 버튼 (작성자만 표시) -->
							<div id="post-action-buttons" class="mb-4" style="display: none;">
								<button type="button" class="btn btn-warning"
									id="edit-post-btn-inline">수정</button>
								<button type="button" class="btn btn-danger"
									id="delete-post-btn-inline">삭제</button>
							</div>
							<hr>
							<!-- 댓글 영역 -->
							<div id="comment-section">
								<h6 class="mb-3">
									댓글 <span id="comment-count" class="badge bg-secondary">0</span>
								</h6>

								<!-- 댓글 작성 폼 -->
								<div class="card mb-4">
									<div class="card-body">
										<textarea class="form-control mb-2" id="comment-input"
											rows="3" placeholder="댓글을 입력하세요"></textarea>
										<div class="d-flex justify-content-end">
											<button type="button" class="btn btn-primary"
												id="submit-comment-btn">등록</button>
										</div>
									</div>
								</div>

								<!-- 댓글 목록 -->
								<div id="comment-list">
									<!-- JS가 채움 -->
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 게시판 END -->