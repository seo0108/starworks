<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 16.     	임가영            최초 생성
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

				<div class="outline-section-3">
					<div class="outline-title">휴지통</div>
					<div class="outline-subtitle">삭제된 자료를 확인하고 복원할 수 있습니다.</div>
				</div>

				<section class="section">
					<div class="card" style="min-height: 680px;">
						<div class="card-body">
							<div class="row mb-3 justify-content-end align-items-center">

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
									<button id="batch-restore" class="btn btn-primary"> <svg
											xmlns="http://www.w3.org/2000/svg" width="18" height="18"
											fill="currentColor" class="bi-plus-circle"
											viewBox="0 0 16 16">
										  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
										  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
										</svg>
										선택 복원
									</button>
									<button class="btn btn-danger" id="batch-delete">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
											fill="currentColor" class="bi-trash" viewBox="0 0 16 16">
										  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
										  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
										</svg>
										영구 삭제
									</button>
								</div>
							</div>

							<div class="alert alert-light-danger color-danger">
								<i class="bi bi-exclamation-circle"></i>
								휴지통에서 영구 삭제 시 복구 불가능합니다.
							</div>

							<div class="table-responsive">
								<table class="table table-hover documentTable">
									<thead class="thead-light">
										<tr>
											<th><input id="selectAll" class="form-check-input" type="checkbox"></th>
											<th>자료실종류</th>
											<th>파일명</th>
											<th class="text-center col-date">등록일</th>
											<th class="text-center col-filesize">파일 크기</th>
											<th class="text-center col-setting">관리</th>
										</tr>
									</thead>
									<tbody>

										<!-- 하위 폴더 존재하면 표시 -->
										<c:if test="${not empty userFolderList }">
											<c:forEach items="${userFolderList }" var="userFolder">
												<tr data-foldersqn="${userFolder.folderSqn }">
													<td><input class="form-check-input file-checkbox"
														type="checkbox"
														data-foldersqn="${userFolder.folderSqn }">
													</td>
													<td>개인자료실</td>
													<td><a
														href="/document/trash/${userFolder.folderSqn }">📁
															${userFolder.folderNm }</a></td>
													<td>${userFolder.userId }</td>
													<td colspan="2">${fn:substringBefore(userFolder.crtDt, 'T')}</td>
												</tr>
											</c:forEach>
										</c:if>

										<c:choose>
											<c:when test="${empty userFileList and empty deptFileList }">
												<tr>
													<td colspan="7" class="text-center text-muted py-5">표시할
														문서가 없습니다.</td>
												</tr>
											</c:when>
											<c:otherwise>
												<!-- 개인자료실 -->
												<c:forEach items="${userFileList }" var="userFile">
													<tr>
														<td><input class="form-check-input file-checkbox"
															type="checkbox" type="checkbox"
															data-fileid="${userFile.userFileId}"
															data-fileseq="${userFile.userFileSqn}"></td>
														<td>개인자료실</td>
														<td>${userFile.fileIconClass}
															${userFile.fileDetailVO['orgnFileNm'] }</td>
														<td class="text-center">${fn:substringBefore(userFile.fileMasterVO['crtDt'], 'T')}</td>
														<td class="text-center"><c:set value="${userFile.fileDetailVO['fileSize'] }" var="fileSize" />
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
														<td></td>
													</tr>
												</c:forEach>

												<!-- 부서자료실 -->
												<c:forEach items="${deptFileList }" var="departmentFile">
													<c:if test="${departmentFile.deptId ne 'DP000000'}">
														<tr>
															<td><input class="form-check-input file-checkbox"
																type="checkbox" type="checkbox"
																data-fileid="${departmentFile.deptFileId}"
																data-fileseq="${departmentFile.fileSeq}"></td>
															<td>부서자료실</td>
															<td>${departmentFile.fileIconClass}
																${departmentFile['orgnFileNm'] }</td>
															<td class="text-center">${fn:substringBefore(departmentFile['crtDt'], 'T')}</td>
															<td class="text-center"><c:set value="${departmentFile['fileSize'] }"
																	var="fileSize" /> <c:choose>
																	<c:when test="${fileSize lt 1024}">
														    ${fileSize} B
														</c:when>
																	<c:when test="${fileSize lt (1024 * 1024)}">
														    ${fileSize / 1024} KB
														</c:when>
																	<c:when test="${fileSize lt (1024 * 1024 * 1024)}">
														    ${fileSize / (1024 * 1024)} MB
														</c:when>
																	<c:otherwise>
														    ${fileSize / (1024 * 1024 * 1024)} GB
														</c:otherwise>
																</c:choose></td>
															<td></td>
														</tr>
													</c:if>
												</c:forEach>

												<!-- 전사자료실 -->
												<c:forEach items="${deptFileList }" var="departmentFile">
													<c:if test="${departmentFile.deptId eq 'DP000000'}">
														<tr>
															<td><input class="form-check-input file-checkbox"
																type="checkbox" type="checkbox"
																data-fileid="${departmentFile.deptFileId}"
																data-fileseq="${departmentFile.fileSeq}"></td>
															<td>전사자료실</td>
															<td>${departmentFile.fileIconClass}
																${departmentFile['orgnFileNm'] }</td>
															<td>${departmentFile['userNm'] }</td>
															<td class="text-center">${fn:substringBefore(departmentFile['crtDt'], 'T')}</td>
															<td class="text-center"><c:set value="${departmentFile['fileSize'] }"
																	var="fileSize" /> <c:choose>
																	<c:when test="${fileSize lt 1024}">
														    ${fileSize} B
														</c:when>
																	<c:when test="${fileSize lt (1024 * 1024)}">
														    ${fileSize / 1024} KB
														</c:when>
																	<c:when test="${fileSize lt (1024 * 1024 * 1024)}">
														    ${fileSize / (1024 * 1024)} MB
														</c:when>
																	<c:otherwise>
														    ${fileSize / (1024 * 1024 * 1024)} GB
														</c:otherwise>
																</c:choose></td>
															<td></td>
														</tr>
													</c:if>
												</c:forEach>
											</c:otherwise>
										</c:choose>

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
	<c:url value="/document/restore${not empty currentFolderSqn ? '/' : '' }${currentFolderSqn}" var="restoreUrl"/>
	<form method="post" id="restoreForm" action="${restoreUrl }"></form>
	<%@ include file="/WEB-INF/views/document/remove-confirm-modal.jsp" %>

<script src="/js/documents/document_file.js"></script>
</body>
</html>
