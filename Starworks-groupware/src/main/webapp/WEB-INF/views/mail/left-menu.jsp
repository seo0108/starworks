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

<div class="card left-menu-card">
	<div class="card-body">

		<h4 style="margin-bottom: 15%">전자메일</h4>
		<a href="/mail/send" class="btn btn-primary btn-lg w-100 mb-4"> <i
			class="bi bi-pencil-fill me-2" data-feature-id="M001-01"></i>메일 쓰기
		</a>


		<div class="list-group">
			<a href="#" class="list-group-item active" id="inbox-link">받은 편지함
				<span id="inbox-count"></span> <span id="unread-inbox-count"
				class="badge bg-danger rounded-pill ms-1"></span>
			</a> <a href="#" class="list-group-item" id="sent-link">보낸 편지함 <span
				id="sent-count"></span>
			</a> <a href="#" class="list-group-item" id="drafts-link">임시 보관함 <span
				id="drafts-count"></span>
			</a> <a href="#" class=" list-group-item" id="important-link">중요 편지함
				<span id="important-count"></span>
			</a> <a href="#" class="list-group-item" id="trash-link">휴지통 <span
				id="trash-count"></span>
			</a>
		</div>
	</div>
</div>