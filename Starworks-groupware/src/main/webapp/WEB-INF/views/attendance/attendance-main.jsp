<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      수정자           수정내용
 *  ============   ============== =======================
 *  2025. 10. 7.     임가영            최초 생성
 *
-->
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
<title>Insert title here</title>
<style>
/* ========== 공통 요소 ========== */
.fc-list-event-time {
	display: none;
}

.card-body {
	line-height: 1.5;
}

.card-body h2, .card-body h3, .card-body .fs-2 {
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

/* ========== 카드 헤더 ========== */
.card-header {
	padding: 20px 24px;
}

.card-header h4 {
	font-weight: 600;
	font-size: 17px;
	color: #2c3e50;
	margin: 0;
}

/* ========== 현재 시간 카드 ========== */
.col-md-3 .card-body {
	padding: 20px 16px !important;
}

#current-time {
	font-size: 28px;
	font-weight: 700;
	color: #2c3e50;
	letter-spacing: 0.5px;
	margin-bottom: 20px;
}

#current-working-status {
	font-size: 30px;
	font-weight: 800;
	padding: 0;
	margin: 20px 0;
	text-align: center;
	width: 100%;
	background: none;
	border: none;
	color: #6c757d;
}

#current-working-status.status-working {
	color: #198754;
}

#current-working-status.status-away {
	color: #fd7e14;
}

#current-working-status.status-absent {
	color: #6c757d;
}

/* ========== 버튼 ========== */
.button-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	width: 100%;
	margin-top: 20px;
}

.btn-sm {
	padding: 14px 8px;
	font-weight: 700;
	font-size: 16px;
	border-radius: 8px;
	border: none;
	transition: all 0.2s ease;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	width: 100%;
	white-space: nowrap;
}

.btn-sm:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary {
	background: #0d6efd;
	color: white;
}

.btn-primary:hover {
	background: #0b5ed7;
}

.btn-danger {
	background: #dc3545;
	color: white;
}

.btn-danger:hover {
	background: #bb2d3b;
}

.btn-info {
	background: #0dcaf0;
	color: white;
}

.btn-info:hover {
	background: #0aa2c0;
}

.btn-secondary {
	background: #6c757d;
	color: white;
}

.btn-secondary:hover {
	background: #5c636a;
}

/* ========== 주간 근무시간 카드 ========== */
.col-md-9 .card-body {
	padding: 24px !important;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	min-height: 100%;
}

.col-md-9 .card-body .d-flex.justify-content-between:first-child {
	margin-bottom: 0;
}

.col-md-9 .card-body .d-flex.align-items-center {
	margin: 16px 0 0 0;
}

.col-md-9 .card-body .text-muted {
	font-size: 15px;
	margin: 2px 0 0 0;
}

.col-md-9 .card-body .row.mt-3 {
	margin-top: 0 !important;
}

.col-md-9 .card-body hr {
	margin: 0;
	width: 100%;
}

.col-md-9 .card-body>.d-flex:last-child {
	margin: 8px 0 0 0;
}

#nameSpace, #week {
	font-size: 19px;
	font-weight: 700;
	color: #2c3e50;
}

#totalWorkHr {
	font-size: 36px;
	font-weight: 700;
	color: #2c3e50;
	margin: 0;
}

#leftWorkHr, #leftoverWorkHr {
	font-size: 18px;
	font-weight: 600;
	color: #495057;
}

/* ========== 프로그레스 바 ========== */
.progress {
	height: 30px;
	border-radius: 10px;
	background-color: #e9ecef;
	overflow: hidden;
}

.progress-bar {
	transition: width 0.6s ease;
	font-weight: 600;
	font-size: 15px;
}

.badge.rounded-pill {
	padding: 6px 10px;
	font-weight: 500;
	font-size: 15px;
}

/* ========== 통계 카드 ========== */
.col-md-4 .card-body {
	padding: 0 16px !important;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	height: 100%;
	min-height: 200px;
}

.card-title {
	font-size: 24px;
	font-weight: 700;
	color: #495057;
	margin: 0;
}

.fs-2 {
	font-size: 52px !important;
	font-weight: 700;
	margin: 0 !important;
	line-height: 1;
}

.text-success {
	color: #198754 !important;
}

.text-danger {
	color: #dc3545 !important;
}

.text-warning {
	color: #ffc107 !important;
}

#vacationCntSub, #lateCntSub, #earlyCntSub {
	font-size: 20px;
	color: #6c757d;
	font-weight: 500;
	margin: 0;
}

small.text-muted {
	font-size: 20px;
	color: #6c757d;
	font-weight: 500;
}

#yearMonth1, #yearMonth2 {
	font-size: 20px;
	color: #6c757d;
	font-weight: 400;
}

/* ========== 근태 기록 카드 - 높이 고정 ========== */
.col-md-7>.card:last-child {
	max-height: 550px;
	display: flex;
	flex-direction: column;
}

.col-md-7>.card:last-child>.card-body {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
}

/* ========== 근태 기록 테이블 ========== */
#attendance-record {
	table-layout: fixed;
}

#attendance-record tbody tr {
	height: 58px;
	transition: background-color 0.2s ease;
}

#attendance-record tbody tr:hover {
	background-color: #f8f9fa;
}

#attendance-record tbody tr.empty-row {
	background-color: transparent !important;
}

#attendance-record tbody tr.empty-row:hover {
	background-color: transparent !important;
}

#attendance-record tbody tr.empty-row td {
	border: none;
	padding: 18px 16px;
}

#attendance-record thead th {
	font-weight: 600;
	font-size: 17px;
	color: #2c3e50;
	padding: 18px 16px;
	background: #f8f9fa;
	border-bottom: 2px solid #dee2e6;
}

#attendance-record tbody td {
	padding: 18px 16px;
	font-size: 16px;
	color: #495057;
	vertical-align: middle;
}

.table .badge {
	padding: 6px 12px;
	font-weight: 500;
	font-size: 13px;
	border-radius: 6px;
}

/* ========== 페이지네이션 - card-footer ========== */
.card-footer {
	background-color: white;
	border-top: none;
	padding: 15px 24px;
	flex-shrink: 0;
}

.pagination {
	margin: 0;
}

.pagination .page-link {
	color: #435ebe;
	border: 1px solid #dfe3e7;
	padding: 8px 12px;
	font-size: 14px;
	font-weight: 500;
	transition: all 0.2s ease;
}

.pagination .page-link:hover {
	background-color: #f3f4f6;
	color: #435ebe;
}

.pagination .page-item.active .page-link {
	background-color: #435ebe;
	border-color: #435ebe;
	color: white;
}

.pagination .page-item.disabled .page-link {
	color: #adb5bd;
	pointer-events: none;
	background-color: #f8f9fa;
}

/* ========== 캘린더 - 연차카드 + 근태기록과 동일 높이 ========== */
.col-md-5>.card {
	height: 808px !important;
}

#calendar {
	height: 100%;
}

#calendar .fc-button {
	background: #0d6efd;
	border: none;
	border-radius: 6px;
	padding: 8px 16px;
	font-weight: 500;
	font-size: 14px;
	transition: all 0.2s ease;
}

#calendar .fc-button:hover {
	background: #0b5ed7;
}

#calendar .fc-button:active {
	background: #0a58ca;
}

#calendar .fc-list-day-cushion, #calendar .fc-cell-shaded {
	display: none;
}

#calendar .fc-toolbar-title {
	font-size: 22px;
	font-weight: 700;
	color: #2c3e50;
}

#calendar .fc-toolbar-title::after {
	content: attr(data-day);
	margin-left: 12px;
	font-size: 20px;
	font-weight: 600;
	color: #6c757d;
}

#calendar .fc-daygrid-day-number {
	font-weight: 500;
	font-size: 15px;
	color: #495057;
}

#calendar .fc-col-header-cell-cushion {
	font-weight: 600;
	font-size: 15px;
	color: #2c3e50;
}
/* ========== 버튼 ========== */
.button-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	width: 100%;
	margin-top: 20px;
}

/* 버튼이 1개만 표시될 때 중앙 정렬 */
.button-grid.single-button {
	grid-template-columns: 1fr;
	max-width: 50%;
	margin-left: auto;
	margin-right: auto;
}

.btn-sm {
	padding: 14px 8px;
	font-weight: 700;
	font-size: 16px;
	border-radius: 8px;
	border: none;
	transition: all 0.2s ease;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	width: 100%;
	white-space: nowrap;
}
.status-business-trip {
    color: #e74c3c;
    font-weight: bold;
}

.status-vacation {
    color: #f39c12;
    font-weight: bold;
}

</style>
</head>
<body>
	<input type="hidden" id="hiddenUserId"
		value='<security:authentication property="principal.realUser.userId"/>' />
	<input type="hidden" id="hiddenHireYmd"
		value='<security:authentication property="principal.realUser.hireYmd"/>' />
	<div id="main-content">
		<div class="outline-section">
			<div class="outline-title">
				개인 근태 현황
				<!-- <a href="/attendance/depart" class="btn btn-dark rounded-pill">⏰ 부서 근태 현황 보기</a> -->
			</div>
			<div class="outline-subtitle">개인의 근태 현황을 확인하고 관리합니다.</div>
		</div>

		<section class="section">
			<div class="row mb-4">
				<div class="col-md-3">
					<div class="card text-center h-100">
						<div class="card-header">
							<h4>현재 시간</h4>
						</div>
						<div
							class="card-body d-flex flex-column justify-content-center p-3">
							<h3 id="current-time" class="mb-3"></h3>
							<div
								class="d-flex align-items-center justify-content-center my-3"
								id="current-working-status"></div>
							<div class="button-grid mt-auto">
								<button class="btn btn-primary btn-sm" id="start-btn"
									style="display: none;">출근</button>
								<button class="btn btn-danger btn-sm" id="end-btn"
									style="display: none;">퇴근</button>
								<button class="btn btn-info btn-sm" id="absence-btn"
									style="display: none;">자리비움</button>
								<button class="btn btn-secondary btn-sm" id="working-btn"
									style="display: none;">복귀</button>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-9">
					<div class="card h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between">
								<span id="nameSpace"></span> <span id="week"></span>
							</div>
							<div class="d-flex align-items-center my-3">
								<h2 class="me-3" id="totalWorkHr"></h2>
								<div class="progress flex-grow-1">
									<div id="regularBar" class="progress-bar bg-primary"
										role="progressbar" style="width: %;" aria-valuenow=""
										aria-valuemin="0" aria-valuemax="40"></div>
									<div id="overtimeBar" class="progress-bar bg-danger"
										role="progressbar" style="width: %;" aria-valuenow=""
										aria-valuemin="" aria-valuemax="52"></div>
								</div>
							</div>
							<div class="d-flex justify-content-between text-muted">
								<span></span> <span></span> <span></span> <span></span> <span></span>
								<span></span> <span>최소 40h</span> <span></span> <span>최대
									52h</span>
							</div>
							<div class="row mt-3">
								<div class="col" id="leftWorkHr"></div>
								<div class="col" id="leftoverWorkHr"></div>
							</div>
							<hr>
							<div class="d-flex">
								<div class="me-4">
									<span class="badge bg-primary rounded-pill me-2">&nbsp;</span>
									선택근무
								</div>
								<div>
									<span class="badge bg-danger rounded-pill me-2">&nbsp;</span>
									초과근무 (연장)
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="row">
				<div class="col-md-7">
					<div class="row mb-4">
						<div class="col-md-4">
							<div class="card text-center h-100">
								<div class="card-body">
									<h6 class="card-title">
										잔여연차 <small class="text-muted"></small>
									</h6>
									<p class="fs-2 text-success" id="vacationCnt"></p>
									<small class="text-muted" id="vacationCntSub"></small>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="card text-center h-100">
								<div class="card-body">
									<h6 class="card-title">
										지각 <small class="text-muted" id="yearMonth1"></small>
									</h6>
									<p class="fs-2 text-danger" id="lateCnt"></p>
									<small class="text-muted" id="lateCntSub"></small>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="card text-center h-100">
								<div class="card-body">
									<h6 class="card-title">
										조퇴 <small class="text-muted" id="yearMonth2"></small>
									</h6>
									<p class="fs-2 text-warning" id="earlyCnt"></p>
									<small class="text-muted" id="earlyCntSub"></small>
								</div>
							</div>
						</div>
					</div>
					<div class="card h-100">
						<div class="card-header">
							<h4>근태 기록</h4>
						</div>
						<div class="card-body">
							<div id="attendance-record-container">
								<table class="table table-striped" id="attendance-record">
									<thead>
										<tr>
											<th>날짜</th>
											<th>출근 시간</th>
											<th>퇴근 시간</th>
											<th>상태</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
							<!-- 페이지네이션은 JavaScript로 동적 생성됨 -->
						</div>
					</div>
				</div>
				<div class="col-md-5">
					<div class="card h-100">
						<div class="card-body" id="calendar"></div>
					</div>
				</div>
			</div>
		</section>
	</div>
	<script src="/js/attendance/attendance-main.js"></script>
</body>
</html>
