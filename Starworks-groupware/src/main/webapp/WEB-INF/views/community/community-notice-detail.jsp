<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자       			수정내용
 *  ============   	============== =======================
 *  2025. 9. 27.     	홍현택      			최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>
<%@ taglib uri="jakarta.tags.functions" prefix="fn" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<security:authentication property="principal.realUser" var="realUser"/>

	<div id="main-content">
		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/community/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">공지사항 상세</div>
					<!-- 		        <div class="outline-subtitle">새로운 문서를 기안합니다.</div> -->
				</div>

				<section class="section">
					<div class="card">
						<div class="card-header">
							<h3 class="card-title">${board["pstTtl"] }</h3>
						</div>
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
								<div>
									<small class="text-muted me-3"><i class="bi bi-person"></i> 작성자: ${board.users["userNm"] }</small>
									<small class="text-muted"><i class="bi bi-calendar-date"></i> 작성일: <fmt:formatDate value="${board.frstCrtDtAsUtilDate}" pattern="yyyy-MM-dd HH:mm" /></small>
								</div>
								<small class="text-muted"><i class="bi bi-eye"></i> 조회수: ${board.viewCnt}</small>
							</div>
							<div class="post-content mb-4">
								${board["contents"] }
							</div>
							<hr class="my-4">
							<h5>첨부파일</h5>
						</div>
					</div>
				</section>
					<div class="d-flex justify-content-end mt-4">
					<c:url value="/board/notice/${board['pstId'] }/edit" var="modifyUrl"/>
					<c:url value="/board/notice/${board['pstId'] }/remove" var="deleteUrl"/>
						<c:if test="${board.crtUserId eq realUser.userId}">
							<a href="${modifyUrl }" class="btn btn-light-secondary me-2">수정</a>
							<a href="${deleteUrl }" class="btn btn-danger me-2">삭제</a>
						</c:if>
						<a href="/board/notice" class="btn btn-primary">목록</a>
					</div>
				</div>
			</div>
		</div>
	</div>


</body>
</html>