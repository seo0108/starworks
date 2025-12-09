<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 16.     	임가영            최초 생성
 *	2025. 10. 17.		홍현택			UrI 추가..
 *	2025. 10. 17.		홍현택			인기글 모아보기 기능 구현
 *	2025. 10. 24. 		홍현택			게시글 카운트 추가
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
		<h4 style="margin-bottom: 15%">사내 커뮤니티</h4>

		<a href="${boardType eq notice ? '/board/notice/create' : '/board/community/create' }" class="btn btn-primary btn-lg w-100 mb-4" data-feature-id="${boardType eq notice ? 'M008-02-02' : 'M008-01-02' }">
			<i class="bi bi-pencil-fill me-2"></i>글쓰기
		</a>

		<!-- 메뉴 시작 -->
		<div class="approval-menu">
			<div class="menu-group">
				<a href="/board/notice">
					<p class="fw-bold"> 공지사항</p>
				</a>
			</div>

			<div class="menu-group">
				<a href="/board/community">
					<p class="fw-bold"> 자유게시판</p>
				</a>
				<ul class="list-unstyled ps-3 mb-0">
					<li><a href="<c:url value='/board/community'/>"
						class="text-decoration-none text-dark d-block py-1">전체 (${empty categoryCounts['total'] ? 0 : categoryCounts['total']})</a></li>
					<li><a href="<c:url value='/board/community?category=F102'/>"
						class="text-decoration-none text-dark d-block py-1">동호회 (${empty categoryCounts['F102'] ? 0 : categoryCounts['F102']})</a></li>
					<li><a href="<c:url value='/board/community?category=F103'/>"
						class="text-decoration-none text-dark d-block py-1">경조사 (${empty categoryCounts['F103'] ? 0 : categoryCounts['F103']})</a></li>
					<li><a href="/board/community?category=F104"
						class="text-decoration-none text-dark d-block py-1">사내활동 (${empty categoryCounts['F104'] ? 0 : categoryCounts['F104']})</a></li>
					<li><a href="/board/community?category=F105"
						class="text-decoration-none text-dark d-block py-1">건의사항 (${empty categoryCounts['F105'] ? 0 : categoryCounts['F105']})</a></li>
					<li><a href="/board/community?category=F106"
						class="text-decoration-none text-dark d-block py-1">기타 (${empty categoryCounts['F106'] ? 0 : categoryCounts['F106']})</a></li>
					<li><a href="<c:url value='/board/community?category=popular'/>"
						class="text-decoration-none text-dark d-block py-1">인기글 모아보기🔥</a></li>
				</ul>
			</div>
		</div>
		<!-- 메뉴 끝 -->
	</div>
</div>

<script src="/js/common/left-menu.js"></script>