<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자       			수정내용
 *  ============   	============== =======================
 *  2025. 9. 26.     	임가영      			최초 생성
 *	2025. 9. 28.		임가영				검색 기능 추가
 *	2025.10. 17.		홍현택			제목 카테고리, 날짜 포맷팅 추가, 인기글 모아보기 추가
-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
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

			<!-- 우측 본문(기안 작성 화면 + 결재선) -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">자유게시판</div>
					<div class="outline-subtitle">자유롭게 의견이나 소식을 공유합니다.</div>
				</div>

				<section class="section">
					<div class="card rounded-2" style="min-height: 600px">
						<div class="card-body">
							<!-- Search and Write Button -->
							<div
								class="d-flex justify-content-between align-items-center mb-4">
								<div class="col-md-4 col-sm-6">
									<form method="get" id="searchUI" class="d-flex">

										<select class="form-select me-2" name="searchType"
											style="width: auto;">
											<option value=""
												${empty search.searchType ? 'selected' : ' ' }>전체</option>
											<option value="title"
												${search.searchType eq 'title' ? 'selected' : ' ' }>제목</option>
											<option value="writer"
												${search.searchType eq 'writer' ? 'selected' : ' ' }>작성자</option>
											<option value="content"
												${search.searchType eq 'content' ? 'selected' : ' ' }>내용</option>
										</select> <input type="text" class="form-control" name="searchWord"
											value="${search.searchWord  }" placeholder="검색..."> <input
											type="hidden" name="category" />

										<button class="btn btn-primary" type="button" id="searchBtn">
											<i class="bi bi-search"></i>
										</button>
									</form>
								</div>
							</div>

							<strong>총 ${totalRecord }건의 게시물</strong>
							<hr class="my-2">

							<c:if test="${not empty boardList }">
								<c:forEach items="${boardList }" var="board">
									<div class="post-item py-2">
										<h6 class="card-title">
											<c:url value="/board/community/${board['pstId'] }" var="detailUrl" />
											<a href="${detailUrl }" class="text-dark text-decoration-none boardTitle" data-title="${board['pstId'] }">
											<c:if test="${not empty categoryMap[board.bbsCtgrCd]}">[${categoryMap[board.bbsCtgrCd]}] </c:if>${board["pstTtl"] }</a>
											<c:if test="${not empty board['pstFileId'] }">
												<i class="bi bi-paperclip"></i>
											</c:if>
										</h6>
										<div
											class="d-flex justify-content-between align-items-center mt-2 mb-1">
											<small class="text-muted">작성자:	${board.users['userNm'] }</small>
												<small class="text-muted"><fmt:formatDate value="${board['frstCrtDtAsUtilDate']}" pattern="yyyy-MM-dd HH:mm"/></small>
												<small class="text-muted">조회수:${board['viewCnt'] }</small>										</div>
									</div>
									<hr class="my-1">
								</c:forEach>
							</c:if>
							<c:if test="${empty boardList }">
								<p>게시글이 없습니다</p>
							</c:if>

						<!-- Pagination -->
						<div class="pagingArea mt-5">${pagingHTML }</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
	</div>

	<form id="searchForm" method="get">
		<input type="hidden" name="searchType" value="${search.searchType }" />
		<input type="hidden" name="searchWord" value="${search.searchWord }" />
		<input type="hidden" name="category" /> <input type="hidden"
			name="page" />
	</form>

	<script type="text/javascript" src="/js/community/community-board.js"></script>
</body>
</html>