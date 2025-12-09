<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>부서 근태 현황</title>
<link href="/css/attendance-depart.css" rel="stylesheet">
</head>
<body>
	<security:authentication property="principal.realUser" var="realUser" />

	<div id="main-content">
		<div class="outline-section-6">
			<div class="outline-title">${realUser.deptNm } 근태현황</div>
			<div class="outline-subtitle">부서의 실시간 근태 정보를 확인합니다.</div>
		</div>

		<div class="page-content">
			<!-- Row 1: 상단 통계 카드 4개 -->
			<div class="row g-3 mb-3">
				<div class="col-lg-3 col-md-6 col-12">
					<div class="card h-100">
						<div
							class="card-body d-flex align-items-center justify-content-between">
							<div class="d-flex align-items-center">
								<div class="stats-icon purple me-3">
									<i class="bi-people-fill"></i>
								</div>
								<span class="text-muted font-semibold">총&nbsp;&nbsp;원</span>
							</div>
							<div class="text-end">
								<span class="font-extrabold" id="allNum">0</span> <span
									class="font-extrabold">명</span>
							</div>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-12">
					<div class="card h-100">
						<div
							class="card-body d-flex align-items-center justify-content-between">
							<div class="d-flex align-items-center">
								<div class="stats-icon green me-3">
									<i class="bi-briefcase-fill"></i>
								</div>
								<span class="text-muted font-semibold">업무중</span>
							</div>
							<div class="text-end">
								<span class="font-extrabold" id="workingNum">0</span> <span
									class="font-extrabold">명</span>
							</div>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-12">
					<div class="card h-100">
						<div
							class="card-body d-flex align-items-center justify-content-between">
							<div class="d-flex align-items-center">
								<div class="stats-icon red me-3">
									<i class="bi-airplane-fill"></i>
								</div>
								<span class="text-muted font-semibold">출&nbsp;&nbsp;장</span>
							</div>
							<div class="text-end">
								<span class="font-extrabold" id="businessTripNum">0</span> <span
									class="font-extrabold">명</span>
							</div>
						</div>
					</div>
				</div>
				<div class="col-lg-3 col-md-6 col-12">
					<div class="card h-100">
						<div
							class="card-body d-flex align-items-center justify-content-between">
							<div class="d-flex align-items-center">
								<div class="stats-icon blue me-3">
									<i class="bi-calendar2-heart-fill"></i>
								</div>
								<span class="text-muted font-semibold">휴&nbsp;&nbsp;가</span>
							</div>
							<div class="text-end">
								<span class="font-extrabold" id="vacationNum">0</span> <span
									class="font-extrabold">명</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Row 2: 캘린더(왼쪽 넓게) + 요일별 근무시간 & 결근/지각(오른쪽 좁게) -->
			<div class="row mb-4">
				<!-- 캘린더 영역 (75% 너비) -->
				<div class="col-lg-8 col-md-12">
					<div class="card mb-3">
						<div class="card-body">
							<div id="depart-attendance-calendar"></div>
							<!-- 페이지네이션 -->
							<div id="calendar-pagination" class="mt-3"></div>
						</div>
					</div>
					<!-- 테이블 + 페이지네이션 여백 제거 -->
					<div class="card mb-3">
						<div class="card-header">
							<h4 class="card-title">부서원 상세 현황</h4>
						</div>
						<div class="card-body pb-2">
							<table class="table table-striped mb-0"
								id="depart-attendance-today">
								<thead>
									<tr>
										<th>직급</th>
										<th>사원명</th>
										<th>상태</th>
										<th>출근</th>
										<th>퇴근</th>
										<th>근무</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<!-- 사이드 패널 -->
				<div class="col-lg-4 col-md-12">
					<!-- 요일별 평균 근로시간 -->
					<div class="card mb-3">
						<div class="card-body">
							<div id="weekday-workhours"></div>
						</div>
					</div>
					<!-- 결근/지각 현황 -->
					<div class="card mb-3 list-card" id="late-absent">
						<h2 class="card-title">결근/지각 현황 (월간 Top 5)</h2>
						<ol>
						</ol>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="/js/attendance/attendance-depart.js"></script>
</body>
</html>
