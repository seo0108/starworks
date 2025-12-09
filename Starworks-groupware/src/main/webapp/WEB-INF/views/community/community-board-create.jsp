<!-- 
 * == 개정이력(Modification Information) ==
 *   
 *   수정일      			수정자       			수정내용
 *  ============   	============== =======================
 *  2025. 9. 26.     	임가영      			최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<div id="main-content">
		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/community/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">자유게시판 새 글 작성</div>
					<!-- 		        <div class="outline-subtitle">새로운 문서를 기안합니다.</div> -->
				</div>
				
					<div class="card">
						<div class="card-body">
							<form:form method="post" enctype="multipart/form-data" modelAttribute="board">
								<c:if test="${not empty board }">
									<input name="pstId" value="${board['pstId' ]}" type="hidden"/>
									<input name="crtUserId" value="${board['crtUserId' ]}" type="hidden"/>
								</c:if>
								<div class="mb-3">
									<label for="postTitle" class="form-label">
										제목
									</label>
									<input type="text" class="form-control" id="postTitle" name="pstTtl" value="${board['pstTtl'] }" placeholder="제목을 입력하세요">
									<form:errors path="pstTtl" cssClass="text-danger"/>
								</div>

								<div class="mb-3">
									<label for="postCategory" class="form-label">카테고리</label> 
									<select class="form-select" id="postCategory" name="bbsCtgrCd">
										<option value="" ${empty board ? 'selected' : ' '}>카테고리 선택</option>
										<c:forEach items="${categoryCodeList }" var="categoryCode" begin="1">
											<option value="${categoryCode['codeId'] }" ${categoryCode['codeId'] eq board['bbsCtgrCd'] ? 'selected' : ' ' }>${categoryCode["codeNm"] }</option>
										</c:forEach>
									</select>
									<form:errors path="bbsCtgrCd" cssClass="text-danger"/>
								</div>

								<div class="mb-3">
						            <label for="content" class="form-label">내용</label>
						            <textarea id="editor" name="contents">${board["contents"] }</textarea>
									<form:errors path="contents" cssClass="text-danger"/>
								</div>

								<div class="mb-3">
									<label for="formFile" class="form-label">첨부파일</label>
									<input class="form-control" type="file" id="formFileMultiple" name="fileList" multiple>
								</div>

								<div class="d-flex justify-content-end mt-4">
<!-- 								<a href="javascript:history.back();" class="btn btn-light me-2">취소</a> -->
									<a href="/board/community" class="btn btn-light me-2">취소</a>
									<button type="submit" class="btn btn-primary">저장</button>
								</div>
							</form:form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>