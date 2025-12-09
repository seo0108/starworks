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
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<link rel="stylesheet" href="/css/left-menu.css">
<!-- 좌측 카드 -->
<div class="card left-menu-card">
	<div class="card-body">
		<h4 style="margin-bottom: 15%">자료실</h4>

		<c:choose>
			<c:when test="${documentType eq 'user' }">
				<a href="#" class="btn btn-primary btn-lg w-100 mb-4" data-bs-toggle="modal"
										data-bs-target="#fileModal"
										data-folder-sqn="${currentFolderSqn }">
					<i class="bi bi-pencil-fill me-2"></i>자료 등록
				</a>
			</c:when>
			<c:when test="${documentType eq 'department' }">
				<a href="#" class="btn btn-primary btn-lg w-100 mb-4" data-bs-toggle="modal"
										data-bs-target="#departFileModal" data-feature-id="M006-04">
					<i class="bi bi-pencil-fill me-2"></i>자료 등록
				</a>
			</c:when>
			<c:when test="${documentType eq 'company' }">
				<a href="#" class="btn btn-primary btn-lg w-100 mb-4" data-bs-toggle="modal"
										data-bs-target="#companyFileModal" data-feature-id="M006-05">
					<i class="bi bi-pencil-fill me-2"></i>자료 등록
				</a>
			</c:when>
			<c:otherwise>
				<a href="#" class="btn btn-primary btn-lg w-100 mb-4" data-bs-toggle="modal"
										data-bs-target="#fileModal"
										data-folder-sqn>
					<i class="bi bi-pencil-fill me-2"></i>자료 등록
				</a>
			</c:otherwise>
		</c:choose>



		<!-- 메뉴 시작 -->
		<div class="approval-menu">
			<div class="menu-group">
				<a href="/document/user">
					<p class="fw-bold mb-2">개인자료실</p>
				</a>
			</div>

			<div class="menu-group">
				<a href="/document/depart">
					<p class="fw-bold mb-2">부서자료실</p>
				</a>
			</div>

			<div class="menu-group">
				<a href="/document/company">
					<p class="fw-bold mb-2">공용자료실</p>
				</a>
			</div>
			<div class="menu-group">
				<a href="/document/trash">
					<p class="fw-bold mb-2" ><i class="fa-solid fa-trash"></i>&nbsp 휴지통</p>
				</a>
			</div>
		</div>
		<!-- 메뉴 끝 -->
	</div>
</div>

<script src="/js/common/left-menu.js"></script>