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
		<h4 style="margin-bottom: 15%">프로젝트</h4>
		<a href="/projects/create" class="btn btn-primary btn-lg w-100 mb-4" data-feature-id="M005-03">
			<i class="bi bi-pencil-fill me-2"></i>프로젝트 등록
		</a>

		<!-- 메뉴 시작 -->
		<div class="approval-menu">
	        <!-- 나의 프로젝트 -->
	        <div class="menu-group">
	          <a href="/projects/main" style="color : #607080">
	          	<p class="fw-bold mb-2">
	          		나의 업무
	          	</p>
	          </a>
	        </div>

	        <!-- 참여 프로젝트 -->
	        <div class="menu-group">
	        <a href="#" style="color : #607080">
	          <p class="fw-bold mb-2">나의 프로젝트 현황</p>
	        </a>
		          <ul class="list-unstyled ps-1 mb-0">
		            <li><a href="<c:url value='/projects/my/progress'/>" class="text-decoration-none text-dark d-block py-1">진행 중인 프로젝트</a></li>
		            <li><a href="<c:url value='/projects/my/completed'/>" class="text-decoration-none text-dark d-block py-1">진행완료 프로젝트</a></li>
		          </ul>
	        </div>


		        <!-- 회사 전체 프로젝트 -->
		        <div class="menu-group">
		        <a href="#" style="color : #607080">
		          <p class="fw-bold mb-2">전체 프로젝트</span></p>
		        </a>
		          <ul class="list-unstyled ps-1 mb-0">
		            <li><a href="<c:url value='/projects/all'/>" class="text-decoration-none text-dark d-block py-1">운영 프로젝트 </a></li>
		            <li><a href="<c:url value='/projects/archive'/>" class="text-decoration-none text-dark d-block py-1">중단 프로젝트</a></li>
		          </ul>
		        </div>
	      </div>
		<!-- 메뉴 끝 -->
	</div>
</div>

<script src="/js/common/left-menu.js"></script>