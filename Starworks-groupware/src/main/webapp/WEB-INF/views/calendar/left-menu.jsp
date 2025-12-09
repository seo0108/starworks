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
<!-- 좌측 카드 -->
<div class="card left-menu-card">
	<div class="card-body">
		<h4 style="margin-bottom: 10%" class="mb-5">일정관리</h4>

		<!-- 메뉴 시작 -->
		<div class="approval-menu">
			<div class="menu-group mb-3">
				<a href="/calendar/depart">
					<p class="fw-bold mb-2">부서일정</p>
				</a>
			</div>

			<div class="menu-group">
				<a href="/calendar/team">
					<p class="fw-bold mb-2">프로젝트팀
					일정</p>
				</a>
			</div>
		</div>
		<!-- 메뉴 끝 -->
	</div>
</div>