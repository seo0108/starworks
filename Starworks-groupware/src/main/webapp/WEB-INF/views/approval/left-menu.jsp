<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 16.     	임가영            최초 생성
 *  2025. 10. 24.     	홍현택            보관함 카운트 추가
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
		<h4 style="margin-bottom: 15%">전자결재</h4>
		<a href="#" class="btn btn-primary btn-lg w-100 mb-4"
			data-bs-toggle="modal" data-bs-target="#selectFormModal"> <i
			class="bi bi-pencil-fill me-2"></i>기안서 작성
		</a>

		<!-- 메뉴 시작 -->
		<div class="approval-menu">
			<!-- 전자결재 홈 -->
			<div class="menu-group">
				<a href="/approval/main?filter=all">
					<p class="fw-bold mb-2">전자결재 홈</p>
				</a>
				<ul class="list-unstyled ps-1 mb-0">
					<li><a href="<c:url value='/approval/main?filter=all'/>"
						class="text-decoration-none text-dark d-block py-1">전체 (<c:out
								value="${allCount}" />)</a></li>
					<li><a href="<c:url value='/approval/main?filter=drafts'/>"
						class="text-decoration-none text-dark d-block py-1">기안 문서 (<c:out
								value="${draftsCount}" />)</a></li>
					<li><a href="<c:url value='/approval/main?filter=inbox'/>"
						class="text-decoration-none text-dark d-block py-1">결재 요청 문서 (<c:out
								value="${inboxCount}" />)</a></li>
					<li><a href="<c:url value='/approval/main?filter=processed'/>"
						class="text-decoration-none text-dark d-block py-1">결재 완료 문서 (<c:out
								value="${processedCount}" />)</a></li>
				</ul>
			</div>

			<!-- 결재 보관함 -->
			<div class="menu-group">
				<a href="#">
					<p class="fw-bold mb-2">결재 보관함</p>
				</a>
				<ul class="list-unstyled ps-1 mb-0">
					<li><a href="<c:url value='/approval/drafts'/>"
						class="text-decoration-none text-dark d-block py-1">임시저장함 (<c:out
								value="${tempCount}" />)</a></li>
					<li><a href="<c:url value='/approval/archive/personal'/>"
						class="text-decoration-none text-dark d-block py-1">개인보관함 (<c:out
								value="${personalCount}" />)</a></li>
					<li><a href="<c:url value='/approval/archive/depart'/>"
						class="text-decoration-none text-dark d-block py-1">부서보관함 (<c:out
								value="${deptCount}" />)</a></li>
				</ul>
			</div>
		</div>
		<!-- 메뉴 끝 -->
	</div>
</div>

<!-- Select Form Modal) -->
<div class="modal fade" id="selectFormModal" tabindex="-1"
	aria-labelledby="selectFormModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-xl">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="selectFormModalLabel">결재 양식 선택</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
					aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="row">
					<!-- Left Column: Categories -->
					<div class="col-md-3 border-end">
						<h6 class="mb-3">양식 분류</h6>
						<div class="list-group list-group-flush" id="form-categories">
							<a href="#"
								class="list-group-item list-group-item-action active"
								data-category="all">전체</a> <a href="#"
								class="list-group-item list-group-item-action"
								data-category="hr">인사</a> <a href="#"
								class="list-group-item list-group-item-action"
								data-category="finance">재무/회계</a> <a href="#"
								class="list-group-item list-group-item-action"
								data-category="sales">영업/마케팅</a> <a href="#"
								class="list-group-item list-group-item-action"
								data-category="it">개발/IT</a> <a href="#"
								class="list-group-item list-group-item-action"
								data-category="pro">신메뉴/프로젝트</a> <a href="#"
								class="list-group-item list-group-item-action"
								data-category="logistics">물류</a> <a href="#"
								class="list-group-item list-group-item-action"
								data-category="trip">출장/외근</a>
						</div>
					</div>
					<!-- Middle Column: Form List -->
					<div class="col-md-5 border-end">
						<div class="input-group mb-3">
							<input type="text" class="form-control" placeholder="양식명 검색"
								id="form-search-input"> <span class="input-group-text"><i
								class="bi bi-search"></i></span>
						</div>
						<div class="list-group list-group-flush" id="form-list"
							style="height: 400px; overflow-y: auto;">
							<!-- JS will populate this -->
						</div>
					</div>
					<!-- Right Column: Details -->
					<div class="col-md-4">
						<div class="d-flex justify-content-between align-items-center">
							<h6 class="mb-3">상세정보</h6>
							<!-- <button class="btn btn-sm btn-outline-secondary mb-3">자주 쓰는 양식으로 추가</button> -->
						</div>
						<div id="form-details">
							<div class="card-body text-center text-muted pt-5">
								<i class="bi bi-card-list" style="font-size: 4rem;"></i>
								<p class="mt-3">목록에서 양식을 선택하세요.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary"
					data-bs-dismiss="modal">취소</button>
				<button type="button" class="btn btn-primary"
					id="confirm-form-selection" disabled>확인</button>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript" src="/js/approval/approval-modal.js"></script>
<script src="/js/common/left-menu.js"></script>