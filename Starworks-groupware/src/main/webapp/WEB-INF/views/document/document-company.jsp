<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 5.     	임가영            최초 생성
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
	<security:authentication property="principal.realUser.deptNm" var="deptNm" />
	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/document/left-menu.jsp"%>


			<!-- 우측 본문(기안 작성 화면 + 결재선) -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">공용자료실</div>
					<div class="outline-subtitle">회사 전체 문서를 관리합니다.</div>
				</div>

				<section class="section">
					<div class="card" style="height: 680px;">
						<div class="card-body">
							<div class="row mb-3 justify-content-between align-items-center">
								<div class="col-md-6">

									<!-- 검색 창 -->
									<form method="get" id="searchUI" class="d-flex">
										<select class="form-select me-1" name="searchType"
											style="width: auto;">
											<option value=""
												${empty simpleSearch['searchType'] ? 'selected' : ' ' }>전체</option>
											<option value="title"
												${search['searchType'] eq 'title' ? 'selected' : ' ' }>파일명</option>
											<option value="writer"
												${search['searchType'] eq 'writer' ? 'selected' : ' ' }>등록자</option>
										</select> <input type="text" class="form-control" name="searchWord"
											value="${search['searchWord'] }" placeholder="파일명 또는 등록자로 검색하세요">
										<button class="btn btn-primary" type="submit" id="searchBtn">
											<!-- 						                <i class="bi bi-search"></i> -->
											<svg xmlns="http://www.w3.org/2000/svg" width="16"
												height="16" fill="currentColor" class="bi bi-search"
												viewBox="0 0 16 16">
								  <path
													d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
								</svg>
										</button>
										<input type="hidden" name="page">
									</form>

								</div>
								<div class="col-md-6 text-end">
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
								<table class="table table-hover documentTable mt-3">
									<thead class="thead-light">
										<tr>
											<th class="col-checkbox"><input id="selectAll" class="form-check-input"
												type="checkbox"></th>
											<th>파일명</th>
											<th class="text-center col-user">등록자</th>
											<th class="text-center col-date">등록일</th>
											<th class="text-center col-filesize">파일 크기</th>
											<th class="text-center col-setting">관리</th>
										</tr>
									</thead>
									<tbody>
										<c:if test="${not empty departmentFileList }">
											<c:forEach items="${departmentFileList }"
												var="departmentFile">
												<tr>
													<td><input class="form-check-input file-checkbox"
														type="checkbox" type="checkbox"
														data-saveFileNm="${departmentFile.saveFileNm}"
														data-fileid="${departmentFile.deptFileId}"
														data-fileseq="${departmentFile.fileSeq}"></td>
													<td>${departmentFile.fileIconClass}
														${departmentFile['orgnFileNm'] }</td>
													<td class="text-center">${departmentFile['userNm'] } ${departmentFile['jbgdNm']} (${departmentFile['deptNm']})</td>
													<td class="text-center">${fn:substringBefore(departmentFile['crtDt'], 'T')}</td>
													<td class="text-center"><c:set value="${departmentFile['fileSize'] }" var="fileSize" />
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
													</c:choose>
													</td>
													<td class="text-center">
														<a
															href="/file/download/${departmentFile.saveFileNm }"
															class="btn btn-sm btn-outline-primary"> <svg
																	xmlns="http://www.w3.org/2000/svg" width="16"
																	height="16" fill="currentColor" class="bi bi-download"
																	viewBox="0 0 16 16">
														  <path
																		d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
														  <path
																		d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
														</svg>
														</a>
													</td>
												</tr>
											</c:forEach>
										</c:if>
										<c:if test="${empty departmentFileList }">
											<tr>
												<td colspan="6" class="text-center text-muted py-5">표시할
													문서가 없습니다.</td>
											</tr>
										</c:if>
									</tbody>
								</table>
							</div>
							<!-- table div 끝 -->

							<div class="pagingArea">${pagingHTML }</div>

						</div>
						<!--  card-body div 끝 -->
					</div>
					<!-- card div 끝 -->
				</section>
			</div>
			<!-- paging-content div 끝 -->
		</div>
		<!-- main-content div 끝 -->
	</div>
	<form method="post" id="deleteForm" action="/document/user/remove?type=company"></form>

	<!-- 파일 추가 모달 -->
	<div id="companyFileModal" class="modal fade text-left" tabindex="-1"
		role="dialog" aria-labelledby="myModalLabel4" aria-modal="true">
		<div class="modal-dialog modal-dialog modal-dialog-scrollable"
			role="document">
			<div class="modal-content">
				<!-- 파일 생성 폼 -->
					<div class="modal-header">
						<h4 class="modal-title" id="myModalLabel4">문서 등록</h4>
					</div>
					<div class="modal-body">
						폴더 위치 <select id="folderSelect" name="folderSqn" class="form-select mb-3">
							<option value="">전사자료실</option>
							<!-- 문서등록 모달 - 폴더 select -->
						</select> 파일 첨부
						<form id="fileCreateForm" action="/rest/document-depart/company" method="post" enctype="multipart/form-data" class="dropzone" >
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

	<script type="text/javascript">
		Dropzone.autoDiscover = false;

		document.addEventListener("DOMContentLoaded", () => {
			dropzoneInit();
		});

		const dropzoneInit = () => {
		    const myDropzone = new Dropzone("#fileCreateForm", {
		    	url : "/rest/document-depart/company",
		        paramName: "fileList",
		        maxFilesize: 1000,
		        addRemoveLinks: true,
		        dictDefaultMessage: "파일을 끌어다 놓거나 클릭하여 업로드하세요.",
		        autoProcessQueue: false,
		        init: function() {
		            let dz = this;

		            document.querySelector("#fileCreateBtn").addEventListener("click", function() {
		            	if (dz.getQueuedFiles().length === 0) {
		                    showToast("info", "업로드할 파일을 추가하세요.");
		                    return;
		                }

		                dz.processQueue(); // 업로드 시작
		            });

		            dz.on("queuecomplete", function(file) {

		                if (dz.getQueuedFiles().length === 0 && dz.getUploadingFiles().length === 0) {
		                    const modalEl = document.getElementById('companyFileModal');
		                    const modal = bootstrap.Modal.getInstance(modalEl);
		                    modal.hide();

		                    location.reload();
		                }
		            });
		        }
		    });
		};
	</script>
	<script src="/js/documents/document_file.js"></script>

</body>
</html>
