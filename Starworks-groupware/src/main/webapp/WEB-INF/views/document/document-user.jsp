<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 5.     	임가영            최초 생성
 *  2025. 10. 8.     	장어진            기능 추가를 위한 수정
 *  2025. 10.10.     	장어진            기능 추가를 위한 수정
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="/css/document.css">
</head>
<body>
	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/document/left-menu.jsp"%>


			<!-- 우측 본문(기안 작성 화면 + 결재선) -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">개인자료실</div>
					<div class="outline-subtitle">개인 문서를 효율적으로 관리할 수 있습니다.</div>
				</div>

				<section class="section">
					<div class="card" style="min-height: 680px;">
						<div class="card-body">
							<div class="row mb-3 justify-content-between align-items-center">
								<div class="col-md-6">
									<form method="get" id="searchUI" class="d-flex">
										<input type="text" class="form-control" name="searchWord"
											value="${search.searchWord}" placeholder="파일 이름으로 검색하세요">
										<button class="btn btn-primary" type="button" id="searchBtn">
											<i class="bi bi-search"></i>
										</button>
									</form>
								</div>

								<div class="col-md-6 text-end">
									<button class="btn btn-warning" data-bs-toggle="modal"
										data-bs-target="#folderModalEl"
										data-folder-sqn="${currentFolderSqn }">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
											fill="currentColor" class="bi bi-folder-plus"
											viewBox="0 0 16 16">
											  <path
												d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z" />
											  <path
												d="M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5" />
											</svg>
										폴더 생성
									</button>

									<button class="btn btn-info" id="batch-download">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
											fill="currentColor" class="bi-download" viewBox="0 0 16 16">
											  <path
												d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
											  <path
												d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
											</svg>
										선택 다운로드
									</button>
									<button class="btn btn-danger" id="batch-delete">
<!-- 									<button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal"> -->
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
											fill="currentColor" class="bi-trash" viewBox="0 0 16 16">
											  <path
												d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
											  <path
												d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
											</svg>
										선택 삭제
									</button>
								</div>
							</div>
							<div class="table-responsive">
								<div class="alert alert-light-primary color-primary">
									<i class="bi bi-star"></i> 개인자료실에서는 드래그 앤 드롭으로 파일 이동이 가능합니다.
								</div>

								<!-- 현재 경로 나타내기 -->
								<c:if test="${not empty folderList }">
									<a href="/document/user" style="color: #607080">🏠 내 자료실 >
									</a>
									<c:forEach var="folder" items="${folderList }"
										varStatus="status">
										<c:choose>
											<c:when test="${status.last }">
												<span
													style="text-decoration: underline; color: #607080; font-weight: bold;">
													${folder.folderNm} </span>
											</c:when>
											<c:otherwise>
												<a href="/document/user/${folder.folderSqn }"
													style="color: #607080">${folder.folderNm } ></a>
											</c:otherwise>
										</c:choose>
									</c:forEach>
								</c:if>

								<table class="table table-hover documentTable">
									<thead class="thead-light">
										<tr>
											<th class="col-checkbox"><input id="selectAll" class="form-check-input" type="checkbox"></th>
											<th class="col-title">파일명</th>
											<th class="text-center col-date">등록일</th>
											<th class="text-center col-filesize">파일 크기</th>
											<th class="text-center">관리</th>
										</tr>
									</thead>
									<tbody>

										<!-- 상위 폴더 ... 표시 -->
										<c:if test="${not empty currentFolder.folderSqn }">
											<tr data-foldersqn="${currentFolder.upFolderSqn }">
												<td><input class="form-check-input file-checkbox"
													type="hidden"></td>
												<td class="drag_leave_folder" colspan="4"><c:choose>
														<c:when test="${currentFolder.upFolderSqn != null}">
															<a href="/document/user/${currentFolder.upFolderSqn}">📁
																...</a>
														</c:when>
														<c:otherwise>
															<a href="/document/user">📁 ...</a>
														</c:otherwise>
													</c:choose></td>
											</tr>
										</c:if>

										<!-- 하위 폴더 존재하면 표시 -->
										<c:if test="${not empty userFolderList }">
											<c:forEach items="${userFolderList }" var="userFolder">
												<tr data-foldersqn="${userFolder.folderSqn }">
													<td><input class="form-check-input file-checkbox"
														type="checkbox" data-foldersqn="${userFolder.folderSqn }"></td>
													<td class="drag_leave_folder drag_item"><a
														href="/document/user/${userFolder.folderSqn }">📁
															${userFolder.folderNm }</a></td>
													<td class="text-center">${fn:substringBefore(userFolder.crtDt, 'T')}</td>
													<td></td>
													<td class="text-center">
														<a href="/folder/download/${userFolder.folderSqn }"
														class="btn btn-sm btn-outline-primary"><i
															class="bi bi-download"></i></a></td>
												</tr>
											</c:forEach>
										</c:if>

										<!-- 파일리스트 표시 -->
										<c:if test="${not empty userFileList }">
											<c:forEach items="${userFileList }" var="userFile">
												<tr data-filesqn="${userFile.userFileSqn }"
													data-fileId="${userFile.userFileId }">
													<td><input class="form-check-input file-checkbox"
														type="checkbox"
														data-saveFileNm="${userFile.fileDetailVO.saveFileNm}"
														data-fileid="${userFile.fileDetailVO.fileId}"
														data-fileseq="${userFile.fileDetailVO.fileSeq}"></td>
													<td draggable="true" class="drag_item">${userFile.fileIconClass }
														${userFile.fileDetailVO.orgnFileNm }</td>
													<td class="text-center">${fn:substringBefore(userFile.fileMasterVO.crtDt, 'T')}</td>
													<td class="text-center">
														<c:set value="${userFile.fileDetailVO.fileSize }" var="fileSize" />
														<c:choose>
															<c:when test="${fileSize lt 1024}">
																<fmt:formatNumber value="${fileSize}" pattern="#.##"/> B
																</c:when>
															<c:when test="${fileSize lt (1024 * 1024)}">
																<fmt:formatNumber value="${fileSize / 1024}" pattern="#.##"/> KB
																</c:when>
															<c:when test="${fileSize lt (1024 * 1024 * 1024)}">
																  <fmt:formatNumber value="${fileSize / (1024 * 1024)}" pattern="#.##"/> MB
																</c:when>
															<c:otherwise>
																   <fmt:formatNumber value="${fileSize / (1024 * 1024 * 1024)}" pattern="#.##"/> GB
															</c:otherwise>
														</c:choose></td>
													<td class="text-center"><a
														href="/file/download/${userFile.fileDetailVO.saveFileNm }"
														class="btn btn-sm btn-outline-primary"><i
															class="bi bi-download"></i></a></td>
												</tr>
											</c:forEach>
										</c:if>

										<c:if test="${empty userFileList and empty userFolderList}">
											<tr>
												<td colspan="5" class="text-center text-muted py-5">
													표시할 파일이 없습니다.</td>
											</tr>
										</c:if>
									</tbody>
								</table>
							</div>
							<!-- Pagination -->
							<div class="pagingArea">${pagingHTML }</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
	<form id="searchForm" method="get">
		<input type="hidden" name="searchWord" value="${search.searchWord }" />
		<input type="hidden" name="page" />
	</form>
	<form method="post" id="deleteForm"
		action="/document/user/remove?type=user"></form>

	<!-- 폴더 생성 모달 -->
	<div id="folderModalEl" class="modal fade text-left" tabindex="-1"
		role="dialog" aria-labelledby="myModalLabel4" aria-modal="true">
		<div class="modal-dialog modal-dialog modal-dialog-scrollable"
			role="document">
			<div class="modal-content">
				<!-- 폴더 생성 폼 -->
				<form id="folderCreateForm">
					<div class="modal-header">
						<h4 class="modal-title" id="myModalLabel4">폴더 생성</h4>
						<input type="hidden" id="upFolderSqn" value="${currentFolderSqn }"
							name="upFolderSqn" />
					</div>
					<div class="modal-body">
						📁 생성할 폴더명 <input type="text" name="folderNm" class="form-control"
							placeholder="ex) 사내 동호회 폴더" />
					</div>
					<div class="modal-footer">
						<!-- 						<button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal"> -->
						<button type="button" class="btn btn-light-secondary"
							data-bs-dismiss="modal">
							<i class="bx bx-x d-block d-sm-none"></i> <span
								class="d-none d-sm-block">취소</span>
						</button>
						<button type="button" class="btn btn-primary ms-1"
							data-bs-dismiss="modal" id="folderCreateBtn">
							<i class="bx bx-check d-block d-sm-none"></i> <span
								class="d-none d-sm-block">만들기</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>


	<!-- 파일 추가 모달 -->
	<div id="fileModal" class="modal fade text-left" tabindex="-1"
		role="dialog" aria-labelledby="myModalLabel4" aria-modal="true">
		<div class="modal-dialog modal-dialog modal-dialog-scrollable"
			role="document">
			<div class="modal-content">
				<!-- 파일 생성 폼 -->
				<%-- 				<form id="fileCreateForm" enctype="multipart/form-data"> --%>
				<div class="modal-header">
					<h4 class="modal-title" id="myModalLabel4">문서 등록</h4>
					<%-- 						<input type="hidden" value="${currentFolderSqn }" name="folderSqn" /> --%>
				</div>
				<div class="modal-body">
					폴더 위치 <select id="folderSelect" name="folderSqn"
						class="form-select mb-3">
						<option value="">내 자료실 (최상위)</option>
						<!-- 문서등록 모달 - 폴더 select -->
						<c:forEach var="folder" items="${allFolderList }">
							<option value=${folder.folderSqn }
								${currentFolderSqn eq folder.folderSqn ? 'selected' : ' ' }>
								${folder.folderNm }</option>
						</c:forEach>
					</select> 파일 첨부
					<!-- 						<input class="form-control" type="file" id="formFileMultiple" -->
					<!-- 							name="fileList" multiple> -->
					<form id="fileCreateForm" action="/document/upload/user"
						method="post" enctype="multipart/form-data" class="dropzone">
					</form>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">
						<i class="bx bx-x d-block d-sm-none"></i> <span
							class="d-none d-sm-block">취소</span>
					</button>
					<button type="button" class="btn btn-primary ms-1"
						data-bs-dismiss="modal" id="fileCreateBtn">
						<i class="bx bx-check d-block d-sm-none"></i> <span
							class="d-none d-sm-block">업로드</span>
					</button>
				</div>
				<%-- 				</form> --%>
			</div>
		</div>
	</div>

	<%@ include file="/WEB-INF/views/document/remove-confirm-modal.jsp" %>


	<script src="/js/documents/document_file.js"></script>
	<script src="/js/documents/document_user.js"></script>
	<script>
		Dropzone.autoDiscover = false;
		document.addEventListener("DOMContentLoaded", () => {

			const folderModalEl = document.getElementById('folderModalEl');

			folderModalEl.addEventListener('show.bs.modal', (e) => {
		        // 모달을 연 버튼
		        const button = e.relatedTarget;

		        // 버튼의 data-folder-sqn 값 가져오기
		        const folderSqn = button.getAttribute('data-folder-sqn');

		        // 모달 내부 input에 값 설정
		        const input = folderModalEl.getElementById('upFolderSqn');
		        input.value = folderSqn;
		    });

			const folderCreateBtn = document.getElementById("folderCreateBtn");
			folderCreateBtn.addEventListener("click", async (e) => {
				e.preventDefault();

				const folderCreateForm = document.getElementById("folderCreateForm");
				const formData = new FormData(folderCreateForm);

				const resp = await fetch("/rest/document/user/folder", {
					method : "post",
					body : formData
				})
				const data = await resp.json();

				if(data.success) {
					location.reload(true);
				} else {
					showToast("error", "등록에 실패하였습니다")
				}
			});

			dropzoneInit();
		});

		const dropzoneInit = () => {
		    const myDropzone = new Dropzone("#fileCreateForm", {
		    	url : "/document/upload/user",
		        paramName: "fileList",
		        maxFilesize: 1000,
		        addRemoveLinks: true,
		        dictDefaultMessage: "파일을 끌어다 놓거나 클릭하여 업로드하세요.",
		        autoProcessQueue: false,
		        init: function() {
		            let dz = this;

		            document.querySelector("#fileCreateBtn").addEventListener("click", function() {
		                dz.options.params = { folderSqn: document.querySelector("#folderSelect").value };
		                dz.processQueue(); // 업로드 시작
		            });

		            dz.on("queuecomplete", function(file) {

		                if (dz.getQueuedFiles().length === 0 && dz.getUploadingFiles().length === 0) {
		                    const modalEl = document.getElementById('fileModal');
		                    const modal = bootstrap.Modal.getInstance(modalEl);
		                    modal.hide();

		                    location.reload();
		                }
		            });
		        }
		    });
		};
	</script>
</body>
</html>
