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
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>개인 문서함</title>
<style>
.list-group-item {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.list-group-item a {
	text-decoration: none;
	color: inherit;
}

.list-group-item:hover {
	background-color: #f8f9fa;
}

.draggable-item {
	cursor: grab;
}

.sortable-ghost {
	background: #e9ecef;
	opacity: 0.7;
}
</style>
</head>
<body>
	<div id="main-content">
		<div class="page-heading">
			<h3>개인 문서함</h3>
			<p class="text-subtitle">개인 문서를 관리합니다.</p>
			<%-- TODO: Breadcrumb 경로 표시 영역 --%>
			<p>${folderList }</p>
		</div>
		<div class="page-content">
			<div class="row justify-content-center">
				<div class="col-md-11">
					<div class="card">
						<div class="card-body">
							<div class="row mb-3 justify-content-between align-items-center">
								<div class="col-md-6">
									<form method="get" id="searchUI" class="d-flex">
										<input type="text" class="form-control" name="searchWord"
											value="${search.searchWord}" placeholder="파일 이름을 입력하세요...">
										<button class="btn btn-primary" type="button" id="searchBtn">
											<i class="bi bi-search"></i>
										</button>
									</form>
								</div>
								<div class="col-md-6 text-end">
									<button class="btn btn-success" id="createFolderBtn">
										<i class="bi bi-folder-plus me-2"></i>새 폴더
									</button>
									<!-- [MODIFIED] -->
									<a href="/document/upload" class="btn btn-primary"><i
										class="bi bi-plus-circle me-2"></i>문서 등록</a>
									<button class="btn btn-info" id="batch-download">
										<i class="bi bi-download me-2"></i>선택 다운로드
									</button>
									<button class="btn btn-danger" id="batch-delete">
										<i class="bi bi-trash me-2"></i>선택 삭제
									</button>
								</div>
							</div>

							<%-- 리스트 헤더 --%>
							<div class="list-group-item list-group-item-light">
								<input id="selectAll" class="form-check-input" type="checkbox"
									style="margin-left: 0.5rem;">
								<div class="flex-grow-1">이름</div>
								<div style="width: 150px;">등록일</div>
								<div style="width: 100px;">파일 크기</div>
								<div style="width: 80px;">관리</div>
							</div>

							<%-- 폴더 및 파일 목록을 담는 컨테이너 --%>
							<div id="drive-container" class="list-group">
								<%-- 1. 폴더 목록 표시 --%>
								<c:forEach items="${folderList}" var="folder">
									<div class="list-group-item draggable-item droppable-folder"
										data-item-type="folder" data-folder-sqn="${folder.folderSqn}">

										<input class="form-check-input file-checkbox" type="checkbox"
											disabled> <i
											class="bi bi-folder-fill fs-4 text-warning"></i>
										<div class="flex-grow-1">
											<a
												href="${pageContext.request.contextPath}/document/user?folderSqn=${folder.folderSqn}">
												${folder.folderNm} </a>
										</div>
										<div style="width: 150px;">${fn:substringBefore(folder.crtDt, 'T')}</div>
										<div style="width: 100px;">-</div>
										<div style="width: 80px;">
											<%-- TODO: 폴더 이름변경, 삭제 버튼 --%>
										</div>
									</div>
								</c:forEach>

								<%-- 2. 파일 목록 표시 --%>
								<c:forEach items="${userFileList}" var="fileMapping">
									<div class="list-group-item draggable-item"
										data-item-type="file" data-file-id="${fileMapping.userFileId}"
										data-file-seq="${fileMapping.userFileSqn}"
										data-save-file-nm="${fileMapping.fileDetailVO.saveFileNm}">

										<input class="form-check-input file-checkbox" type="checkbox"
											data-file-id="${fileMapping.userFileId}"
											data-file-seq="${fileMapping.userFileSqn}"
											value="${fileMapping.fileDetailVO.saveFileNm}"> <i
											class="bi bi-file-earmark fs-4"></i>
										<div class="flex-grow-1">${fileMapping.fileDetailVO.orgnFileNm}</div>
										<div style="width: 150px;">${fn:substringBefore(fileMapping.fileMasterVO.crtDt, 'T')}</div>
										<div style="width: 100px;">
											<c:set value="${fileMapping.fileDetailVO.fileSize}"
												var="fileSize" />
											<c:choose>
												<c:when test="${fileSize lt 1024}"> ${fileSize} B</c:when>
												<c:when test="${fileSize lt (1024 * 1024)}"> ${String.format("%.1f", fileSize / 1024)} KB</c:when>
												<c:otherwise> ${String.format("%.1f", fileSize / (1024 * 1024))} MB</c:otherwise>
											</c:choose>
										</div>
										<div style="width: 80px;">
											<a href="/file/download/${fileMapping.fileDetailVO.saveFileNm}"
												class="btn btn-sm btn-outline-primary"><i
												class="bi bi-download"></i></a>
										</div>
									</div>
								</c:forEach>

								<c:if test="${empty folderList and empty userFileList}">
									<div class="list-group-item text-center text-muted py-5">이
										폴더는 비어있습니다.</div>
								</c:if>
							</div>

							<!-- Pagination -->
							<div class="pagingArea mt-3">${pagingHTML}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<form id="searchForm" method="get">
		<input type="hidden" name="searchWord" value="${search.searchWord}" />
		<input type="hidden" name="page" /> <input type="hidden"
			name="folderSqn" value="${param.folderSqn}" />
	</form>
	<form method="post" id="deleteForm" action="/document/user/remove"></form>

	<%-- 라이브러리 로드 --%>
	<script
		src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
	<script src="/js/documents/document_file_test.js"></script>
</body>
</html>