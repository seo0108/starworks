<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<div id="main-content">
	<!--     <div class="page-heading"> -->
	<!--         <div class="page-title"> -->
	<!--             <div class="row"> -->
	<!--                 <div class="col-12 col-md-6 order-md-1 order-last"> -->
	<!--                     <h3>임시저장 문서</h3> -->
	<!--                     <p class="text-subtitle">임시저장된 결재 문서를 확인합니다.</p> -->
	<!--                 </div> -->
	<!--             </div> -->
	<!--         </div> -->

	<div class="page-content d-flex flex-wrap gap-3">
		<%@include file="/WEB-INF/views/approval/left-menu.jsp"%>

		<!-- 우측 본문(기안 작성 화면 + 결재선) -->
		<div style="flex: 1 1 78%;" class="right-content">

			<div class="outline-section">
				<div class="outline-title">임시저장함</div>
				<div class="outline-subtitle">임시저장된 결재문서를 확인합니다.</div>
			</div>

			<section class="section">
				<div class="card"  style="min-height: 680px;">
					<div class="card-header"></div>
					<div class="card-body">
						<table class="table table-lg">
							<thead>
								<tr>
									<th>문서종류</th>
									<th>제목</th>
									<th>저장일시</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach var="doc" items="${draftList}">
 									<%-- <td class="text-bold-500"><c:out value="${doc.atrzDocTmplNm}"/></td> --%>
									<tr
										onclick="location.href='/approval/create?formId=${doc.atrzDocTmplId}&atrzTempSqn=${doc.atrzTempSqn}'"
										style="cursor: pointer;">
	 									<td class="text-bold-500"><c:out value="${doc.atrzDocTmplNm}"/></td>
										<td>${doc.atrzDocTtl}</td>
										<td>${fn:substring(doc.atrzSbmtDt, 0, 10)}</td>
									</tr>
								</c:forEach>

								<c:if test="${empty draftList}">
									<tr>
										<td colspan="3" class="text-center text-muted py-5">임시저장된
											문서가 없습니다.</td>
									</tr>
								</c:if>
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
