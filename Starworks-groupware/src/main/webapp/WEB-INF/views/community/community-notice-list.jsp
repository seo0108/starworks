<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 9. 26.     	홍현택            최초 생성
 *	2025. 9. 27			홍현택			페이징 기능 수정
 *	2025. 10.02 		홍현택			검색 기능 수정
 *	2025. 10.16			홍현택			공지사항 조회 수 기능 추가
 *	2025. 10.16			홍현택			공지사항 고정 기능 추가
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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>공지사항</title>
<style>
.page-link {
	cursor: pointer;
}
.pinned-notice {
    background-color: #ffe699; /* 고정된 공지사항 배경색 */
}
</style>
<script>
	function goPage(page) {
		const form = document.getElementById('searchForm');
		form.page.value = page;
		form.submit();
	}
	window.fnBoardPaging = goPage;
</script>

</head>
<body>
	<div id="main-content">
		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/community/left-menu.jsp"%>

			<!-- 우측 본문(기안 작성 화면 + 결재선) -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">공지사항</div>
					<div class="outline-subtitle">회사의 주요 소식과 안내를 확인합니다.</div>
				</div>

				<section class="section">
					<div class="card" style="min-height: 600px">
						<div class="card-body">
							<!-- 검색 UI -->
							<form id="searchForm" action="/board/notice" method="get">
								<input type="hidden" name="page" />
								<div
									class="d-flex justify-content-between align-items-center mb-4">
									<div class="col-md-5 col-sm-6">
										<div class="d-flex">
											<select class="form-select me-2" name="searchType"
												style="width: auto;">
												<option value=""
													${empty search.searchType ? 'selected' : '' }>전체</option>
												<option value="title"
													${search.searchType eq 'title' ? 'selected' : '' }>제목</option>
												<option value="writer"
													${search.searchType eq 'writer' ? 'selected' : '' }>작성자</option>
												<option value="content"
													${search.searchType eq 'content' ? 'selected' : '' }>내용</option>
											</select> <input type="text" class="form-control" name="searchWord"
												value="${search.searchWord}" placeholder="검색...">

											<button class="btn btn-primary" type="submit">
												<i class="bi bi-search"></i>
											</button>
										</div>
									</div>

								</div>

								<table class="table table-responsive">
									<thead>
										<tr>
											<th>번호</th>
											<th>제목</th>
											<th>작성자</th>
											<th>작성일</th>
											<th>조회수</th>
										</tr>
									</thead>
									<tbody>
										<c:choose>
											<c:when test="${not empty noticeList}">
												<c:forEach items="${noticeList}" var="notice" varStatus="vs">
													<tr <c:if test="${notice.fixedYn eq 'Y'}">class="pinned-notice"</c:if>>
														<td>
															<c:choose>
																<c:when test="${notice.fixedYn eq 'Y'}">
																	<span class="badge bg-info rounded-pill">알림</span>
																</c:when>
																<c:otherwise>
																	${paging.startRow + vs.index}
																</c:otherwise>
															</c:choose>
														</td>
														<td><a
															href="${pageContext.request.contextPath}/board/notice/${notice.pstId}">${notice.pstTtl}</a></td>
														<td>${notice.users.userNm}</td>
														<td><fmt:formatDate
																value="${notice.frstCrtDtAsUtilDate}"
																pattern="yyyy-MM-dd HH:mm" /></td>
														<td>${notice.viewCnt}</td>
													</tr>
												</c:forEach>
											</c:when>
											<c:otherwise>
												<tr>
													<td colspan="4" class="text-center">게시글이 없습니다.</td>
												</tr>
											</c:otherwise>
										</c:choose>
									</tbody>
								</table>

								<div class="pagingArea">${pagingHTML}</div>
							</form>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>

</body>
</html>
