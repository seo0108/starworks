<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 1.     	임가영            최초 생성
 *	2025. 10.25.		홍현택			보안레벨에 따른 자물쇠 아이콘 출력 추가
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
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
    <%@include file="/WEB-INF/views/approval/left-menu.jsp" %>

		<!-- 우측 본문(기안 작성 화면 + 결재선) -->
		<div style="flex: 1 1 78%;" class="right-content">

			<div class="outline-section">
				<c:if test="${filter eq 'personal'}">
					<div class="outline-title">개인보관함</div>
				</c:if>
				<c:if test="${filter eq 'depart'}">
					<div class="outline-title">${realUser.deptNm } 부서보관함</div>
				</c:if>

		        <div class="outline-subtitle">최종승인 후 보관된 결재 문서를 확인합니다.</div>
		    </div>
		    		    <div class="alert alert-light border-start border-danger border-4 d-flex align-items-center" role="alert">
		    		        <i class="bi bi-lock-fill text-danger me-3" style="font-size: 1.5rem;"></i>
		    		        <div>
		    		            <strong>접근 제한</strong><br>
		    		            <small class="text-muted">사용자가 기안 또는 결재한 문서만 열람 할 수 있습니다.</small><br>
		    		            <small class="text-muted">보안등급별 열람 권한</small><br>
		    		            <span class="badge bg-success badge-pill">낮음</span><small class="text-muted"> : 외부 공유 가능</small><br>
		    		            <span class="badge bg-warning badge-pill">보통</span> <small class="text-muted">: 사내 직원만 열람 가능</small><br>
		    		            <span class="badge bg-danger badge-pill">높음</span> <small class="text-muted">: 기안자와 결재자만 열람 가능</small>
		    		        </div>
		    		    </div>
		<section class="section">
			<div class="card">
				<div class="card-body"  style="min-height: 680px;">

		            <br />
		            <div class="col-md-5 col-sm-5">

		            <!-- 검색 창 -->
		            <form method="get" id="searchUI" class="d-flex">
		            	<select class="form-select me-1" name="atrzDocTmplId" style="width: auto;">
			                <option value="" ${empty atrzDocTmplId ? 'selected' : ' ' } >문서종류</option>
			            	<c:forEach items="${approvalTemplateList }" var="approvalTemplate">
				            	<option value="${approvalTemplate['atrzDocTmplId'] }" ${atrzDocTmplId eq  approvalTemplate['atrzDocTmplId']? 'selected' : ' ' }>${approvalTemplate['atrzDocTmplNm'] }</option>
			            	</c:forEach>
			            </select>
		            	<select class="form-select me-1" name="searchType" style="width: auto;">
			                <option value="" ${empty simpleSearch['searchType'] ? 'selected' : ' ' }>전체</option>
			                <option value="title" ${search['searchType'] eq 'title' ? 'selected' : ' ' }>제목</option>
			                <option value="writer" ${search['searchType'] eq 'writer' ? 'selected' : ' ' }>기안자</option>
			            </select>
			            <input type="text" class="form-control" name="searchWord" value="${search['searchWord'] }" placeholder="제목과 기안자로 검색하세요">
						<button class="btn btn-primary" type="submit" id="searchBtn">
			                <i class="bi bi-search"></i>
			            </button>
			            <input type="hidden" name="page">
		            </form>

		            </div>
					<br />
					<div class="tab-content" id="personalTabContent">
						<div class="tab-pane fade show active" id="${filter }" role="tabpanel" aria-labelledby="personal-tab">
							<table class="table table-lg" id="approval-personal-table">
								<thead>
									<tr>
										<th>문서종류</th>
										<th>제목</th>
										<th class="text-center">보안등급</th>
										<th>기안자</th>
										<th>기안일</th>
										<th>상태</th>
									</tr>
								</thead>
						<tbody id="approval-personal-tbody">
							<c:if test="${not empty approvalList }">
						<c:forEach items="${approvalList }" var="approval">
							<tr>
					<td class="text-bold-500">
						 <c:out value="${approval['atrzDocTmplNm'] }" />
					</td>
					<td>
						<%-- 부서 보관함일 경우, 접근 권한 체크 --%>
						<c:if test="${filter eq 'depart'}">
						    <c:choose>
						        <%-- 접근 권한이 없는 경우 (보안 등급 3 이상 AND (기안자X, 결재선X)) --%>
						        <c:when test="${approval.atrzSecureLvl >= 3 and not approval.accessAllowed}">
						            <a href="#" class="text-decoration-none text-muted" style="cursor: not-allowed;" data-bs-toggle="tooltip" title="접근 제한 : 열람할 수 없는 문서">
						                <i class="bi bi-lock-fill ms-1"></i>
						                <c:out value="${approval['atrzDocTtl'] }" />
						            </a>
						        </c:when>
						        <%-- 접근 권한이 있는 경우 --%>
						        <c:otherwise>
						            <a href="/approval/archive/detail/${approval['atrzDocId']}" class="text-decoration-none">
						                <c:out value="${approval['atrzDocTtl'] }" />
						            </a>
						        </c:otherwise>
						    </c:choose>
						</c:if>
						<%-- 개인 보관함일 경우, 기존 로직(보안등급) 유지 --%>
						<c:if test="${filter eq 'personal'}">
						    <a href="/approval/archive/detail/${approval['atrzDocId']}"
						       class="text-decoration-none<c:if test="${approval.atrzSecureLvl >= 3}"> text-muted</c:if>"
						       <c:if test="${approval.atrzSecureLvl >= 3}">
						       </c:if>>
						        <c:if test="${approval.atrzSecureLvl >= 3}">
						            <i class="bi bi-lock-fill ms-1"></i>
						        </c:if>
						         <c:out value="${approval['atrzDocTtl'] }" />
						    </a>
						</c:if>
					</td>
						<td class="text-center">
							<c:choose>
								<c:when test="${approval.atrzSecureLvl == 1}">
									<span class="badge bg-success badge-pill">낮음</span>
								</c:when>
																						<c:when test="${approval.atrzSecureLvl == 2}">
																							<span class="badge bg-warning badge-pill">보통</span>
																						</c:when>																																<c:when test="${approval.atrzSecureLvl >= 3}">
									<span class="badge bg-danger badge-pill">높음</span>
								</c:when>
								<c:otherwise>
									<span class="badge bg-secondary badge-pill">-</span>
								</c:otherwise>
							</c:choose>
						</td>							<td class="text-bold-500">
								<c:out value="${approval.users['userNm'] }" />
								</td>
								<td>
								<%-- 												 <fmt:formatDate value="${approval['atrzSbmtDt'] }" pattern="yyyy-MM-dd HH:mm"/> --%>
								${fn:substringBefore(approval['atrzSbmtDt'], 'T')}
								</td>
								<td>
									<span class="badge bg-success-subtle text-success fw-normal">
										<c:out value="${approval['crntAtrzStepNm'] }" />
										</span>
									</td>
							</tr>
				</c:forEach>
		</c:if>
	<c:if test="${empty approvalList }">
		<tr>
		<td colspan="6" class="text-center text-muted py-5">표시할 문서가 없습니다.</td>
             </tr>
             </c:if>
			</tbody>
		</table>
	</div>
</div>
<!-- Pagination -->
<div class="pagingArea">${pagingHTML }</div>
				</div>
			</div>
		</section>
	</div>
</div>
</div>

<form id="searchForm">
<input type="hidden" name="searchType">
<input type="hidden" name="searchWord">
<input type="hidden" name="atrzDocTmplId">
<input type="hidden" name="page">
</form>

<script type="text/javascript">
function fnPaging(page) {
	searchForm.page.value = page;
	searchForm.requestSubmit();
}

document.addEventListener("DOMContentLoaded", () => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
})
</script>

</body>
</html>