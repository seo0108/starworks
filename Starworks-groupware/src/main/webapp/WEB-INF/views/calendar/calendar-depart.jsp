<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>부서 일정 관리 - 그룹웨어</title>
<style>
/* ===== 날짜 셀 기본 스타일 ===== */
.fc .fc-daygrid-day-top {
	justify-content: flex-start;
	padding: 4px;
}

.fc-daygrid-day-number {
	padding: 2px 4px;
	font-size: 0.95em;
}

/*
 * 날짜 셀 높이 증가
 */
.fc-daygrid-day {
	height: 130px !important;
}

.fc-daygrid-day-frame {
	height: 130px !important;
	min-height: 130px !important;
	max-height: 130px !important;
	overflow: visible !important;
}

/* ===== 이벤트 영역 ===== */
.fc-daygrid-day-events {
	margin-top: 2px;
	min-height: 90px;
	padding-right: 2px;
	overflow: visible !important;
}

.fc-daygrid-day-bottom {
	margin-top: 0;
}

/* ===== 통합 이벤트 스타일 ===== */
.unified-event {
	display: block !important;
	border: none !important;
	padding: 2px 6px !important;
	margin-bottom: 2px !important;
	border-radius: 3px !important;
	height: 20px !important;
	line-height: 16px !important;
	font-size: 12px !important;
	font-weight: 600 !important;
	color: #ffffff !important;
	overflow: hidden !important;
	text-overflow: ellipsis !important;
	white-space: nowrap !important;
	max-width: none !important;
	cursor: default; /* 기본 커서 */
}

/* 드래그 가능한 이벤트 */
.unified-event.fc-event-draggable {
	cursor: move;
	cursor: grab;
}

.unified-event.fc-event-draggable:active {
	cursor: grabbing;
}

/* 호버 효과 */
.unified-event:hover {
	position: relative !important;
	z-index: 999 !important;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
	transform: scale(1.02) !important;
	overflow: hidden !important;
	text-overflow: ellipsis !important;
	white-space: nowrap !important;
	padding: 2px 8px !important;
}

/* 드래그 중 */
.unified-event.fc-event-dragging {
	opacity: 0.6 !important;
	z-index: 998 !important;
	cursor: grabbing !important;
}

/* 드래그 미러 (복사본) */
.unified-event.fc-event-mirror {
	opacity: 0.9 !important;
	z-index: 999 !important;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
	cursor: grabbing !important;
}

/* ===== 컨테이너 스타일 (harness와 harness-abs 동일) ===== */
.fc-daygrid-event-harness, .fc-daygrid-event-harness-abs {
	overflow: visible !important;
	position: relative;
}

/* 타입별 배경색 */
.event-type-department {
	background-color: #3498db !important;
}

.event-type-personal {
	background-color: #2ecc71 !important;
}

.event-type-vacation {
	background-color: #f1c40f !important;
}

.event-type-businesstrip {
	background-color: #e74c3c !important;
}

/* ===== 드래그 스타일 ===== */
.fc-event-dragging {
	opacity: 0.6 !important;
	z-index: 998 !important;
}

.fc-event-mirror {
	opacity: 0.9 !important;
	z-index: 999 !important;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

/*
 * ===== +더보기 링크 =====
 */
.fc-daygrid-more-link {
	display: block !important;
	width: 100% !important;
	height: 20px !important;
	line-height: 20px !important;
	padding: 0 6px !important;
	margin: 0 0 2px 0 !important;
	font-size: 11px !important;
	font-weight: 700 !important;
	color: #ffffff !important;
	background-color: #6c757d !important;
	border: none !important;
	border-radius: 3px !important;
	text-align: center !important;
	cursor: pointer !important;
	box-sizing: border-box !important;
}

.fc-daygrid-more-link:hover {
	background-color: #5a6268 !important;
}

/* 팝오버 차단 */
.fc-popover {
	display: none !important;
}

/* ===== 기본 요소 숨김 ===== */
.fc-daygrid-event-dot {
	display: none !important;
}

/* ===== 리스트 캘린더 ===== */
.fc-list-event-time {
	display: none;
}
/* ===== Flex 컨테이너 ===== */
.calendar-flex-container {
	display: flex;
	gap: 20px;
	width: 100%;
}
/* 필터 컬럼 (13% - gap 고려) */
.calendar-filter-column {
	flex: 0 0 calc(13% - 14px);
	min-width: 140px;
}

/* 메인 캘린더 컬럼 (60% - gap 고려) */
.calendar-main-column {
	flex: 0 0 calc(60% - 12px);
	min-width: 500px;
}

/* 리스트 캘린더 컬럼 (27% - gap 고려) */
.calendar-list-column {
	flex: 0 0 calc(27% - 14px);
	min-width: 250px;
}

/* ===== 카드 높이 통일 ===== */
.filter-card, .calendar-card {
	height: 100%;
}

.filter-card-body, .calendar-card-body {
	padding: 1rem;
	display: flex;
	flex-direction: column;
}

/* 필터 카드 body */
.filter-card-body {
	padding: 1rem 0.75rem;
}

/* 리스트 캘린더 높이 */
#list-calendar {
	height: 830px;
}

#calendar {
	height: auto;
}

/* ===== 필터 섹션 ===== */
.filter-legend-title {
	font-size: 1rem;
	font-weight: 600;
	color: #495057;
	margin-bottom: 14px;
	text-align: center;
	padding-bottom: 12px;
	border-bottom: 2px solid #dee2e6;
}

#filter-container {
	display: flex;
	flex-direction: column;
	gap: 12px;
	flex: 1;
}

/* 필터 아이템 */
.filter-item {
	display: block;
	width: 100%;
}

.filter-item input[type="checkbox"] {
	display: none;
}

.filter-item .filter-label {
	display: block;
	width: 100%;
	padding: 12px 10px;
	border-radius: 6px;
	cursor: pointer;
	user-select: none;
	transition: all 0.2s ease;
	font-size: 0.9rem;
	font-weight: 600;
	color: #ffffff;
	text-align: center;
	box-sizing: border-box;
}

/* 텍스트 줄바꿈 */
.filter-label-text {
	display: inline-block;
	max-width: 100%;
	word-break: keep-all;
	line-height: 1.3;
}

/* 타입별 배경색 */
.filter-item .filter-label[for="filter-department"] {
	background-color: #3498db;
}

.filter-item .filter-label[for="filter-personal"] {
	background-color: #2ecc71;
}

.filter-item .filter-label[for="filter-vacation"] {
	background-color: #f1c40f;
}

.filter-item .filter-label[for="filter-trip"] {
	background-color: #e74c3c;
}

/* 체크 상태 */
.filter-item input[type="checkbox"]:not(:checked)+.filter-label {
	opacity: 0.4;
	filter: grayscale(50%);
}

.filter-item input[type="checkbox"]:checked+.filter-label {
	opacity: 1;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* 호버 효과 */
.filter-item .filter-label:hover {
	transform: scale(1.05);
	box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

/* ===== 반응형 ===== */
@media ( max-width : 991px) {
	.calendar-flex-container {
		flex-direction: column;
	}
	.calendar-filter-column, .calendar-main-column, .calendar-list-column {
		flex: 1 1 100%;
		width: 100%;
	}
	.filter-card {
		height: auto;
	}
	.filter-card-body {
		padding: 1rem;
	}
	#filter-container {
		flex-direction: row;
		flex-wrap: wrap;
	}
	.filter-item {
		width: calc(50% - 6px);
	}
}

@media ( max-width : 768px) {
	.fc-daygrid-day {
		height: 110px !important;
	}
	.fc-daygrid-day-frame {
		height: 110px !important;
		min-height: 110px !important;
		max-height: 110px !important;
	}
	#list-calendar {
		height: 500px;
	}
}

.tooltip-inner {
	text-align: left;
    max-width: 600px !important;  /* 기본값 200px에서 400px로 증가 */
}
</style>
</head>
<body>
	<input type="hidden" id="hiddenUserId"
		value='<security:authentication property="principal.realUser.userId"/>' />
	<input type="hidden" id="hiddenDeptId"
		value='<security:authentication property="principal.realUser.deptId"/>' />

	<div id="main-content">
		<div class="page-content d-flex flex-wrap gap-3">
			<!-- 우측 본문 -->
			<div style="flex: 1 1 78%;">
				<div class="outline-section">
					<div class="outline-title">
						일정관리 > 부서일정
						<!-- ★ 안내 문구 추가 -->
						<i class="bi bi-info-circle ms-1"
							style="font-size: 1.2rem; cursor: help; vertical-align: 3px;"
							data-bs-toggle="tooltip"
							data-bs-html="true" data-bs-placement="top"
							title="<strong>상세 보기 :</strong> 오른쪽 리스트에서 일정을 클릭하면 상세 정보를 볼 수 있습니다. <br>
								   <strong>일정 수정 :</strong> 개인일정은 드래그하거나 상세 정보-수정을 통해 일정을 수정 가능합니다.">
						</i>
					</div>
				</div>

				<div class="page-content calendar-page-container">
					<div class="calendar-flex-container">
						<!-- 필터 섹션 (card 형식) -->
						<div class="calendar-filter-column">
							<div class="card filter-card">
								<div class="card-body filter-card-body">
									<div class="filter-legend-title">일정 필터</div>
									<div id="filter-container">
										<div class="filter-item">
											<input type="checkbox" id="filter-department"
												value="department" checked> <label
												class="filter-label" for="filter-department"> <span
												class="filter-label-text">부서일정</span>
											</label>
										</div>

										<div class="filter-item">
											<input type="checkbox" id="filter-personal" value="personal"
												checked> <label class="filter-label"
												for="filter-personal"> <span
												class="filter-label-text">개인일정</span>
											</label>
										</div>

										<div class="filter-item">
											<input type="checkbox" id="filter-vacation" value="vacation"
												checked> <label class="filter-label"
												for="filter-vacation"> <span
												class="filter-label-text">휴가</span>
											</label>
										</div>

										<div class="filter-item">
											<input type="checkbox" id="filter-trip" value="businesstrip"
												checked> <label class="filter-label"
												for="filter-trip"> <span class="filter-label-text">출장</span>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- 메인 캘린더 -->
						<div class="calendar-main-column">
							<div class="card calendar-card">
								<div class="card-body calendar-card-body">
									<div id='calendar-container'>
										<div id='calendar'></div>
									</div>
								</div>
							</div>
						</div>

						<!-- 리스트 캘린더 -->
						<div class="calendar-list-column">
							<div class="card calendar-card">
								<div class="card-body calendar-card-body">
									<div id="list-calendar"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- 일정 추가 Modal -->
	<div class="modal fade" id="eventModal" tabindex="-1"
		aria-labelledby="eventModalLabel" aria-hidden="true">
		<div
			class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="eventModalLabel"></h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form id="eventForm">
						<input type="hidden" id="eventId">
						<div class="mb-3">
							<label for="eventType" class="form-label">일정 구분</label> <select
								class="form-select" id="eventType">
								<option value="department">부서일정</option>
								<option value="personal">개인일정</option>
							</select>
						</div>
						<div class="mb-3">
							<label for="eventTitle" class="form-label">일정 제목</label> <input
								type="text" class="form-control" id="eventTitle" required>
						</div>
						<div class="mb-3">
							<label for="eventStart" class="form-label">시작일</label> <input
								type="datetime-local" class="form-control" id="eventStart"
								required>
						</div>
						<div class="mb-3">
							<label for="eventEnd" class="form-label">종료일</label> <input
								type="datetime-local" class="form-control" id="eventEnd">
						</div>
						<div class="mb-3 form-check">
							<input type="checkbox" class="form-check-input" id="allDayCheck">
							<label class="form-check-label" for="allDayCheck">하루 종일</label>
						</div>
						<div class="mb-3">
							<label for="eventDescription" class="form-label">설명</label>
							<textarea class="form-control" id="eventDescription" rows="3"></textarea>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" id="addEvent">저장</button>
					<button type="button" class="btn btn-secondary"
						data-bs-dismiss="modal">닫기</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 일정 상세 정보 및 수정 Modal -->
	<div class="modal fade" id="eventDetailModal" tabindex="-1"
		aria-labelledby="eventDetailModalLabel" aria-hidden="true">
		<div
			class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="eventDetailModalLabel">상세 정보</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<!-- 상세 정보 뷰 -->
					<div id="eventDetailView">
						<p>
							<strong>일정 구분:</strong> <span id="detailType"></span>
						</p>
						<p>
							<strong>작 성 자:</strong> <span id="detailUserNm"></span>
						</p>
						<p>
							<strong>일정 제목:</strong> <span id="detailTitle"></span>
						</p>
						<p>
							<strong>시작 일시:</strong> <span id="detailStart"></span>
						</p>
						<p>
							<strong>종료 일시:</strong> <span id="detailEnd"></span>
						</p>
						<p>
							<strong>상세 내용:</strong> <span id="detailDescription"></span>
						</p>
					</div>
					<!-- 수정 폼 뷰 -->
					<div id="eventEditView" style="display: none;">
						<form id="eventEditForm">
							<input type="hidden" id="editEventId">
							<div class="mb-3">
								<label for="editEventType" class="form-label">일정 구분</label> <select
									class="form-select" id="editEventType" disabled>
									<option value="department">부서일정</option>
									<option value="personal">개인일정</option>
								</select>
							</div>
							<div class="mb-3">
								<label for="editEventTitle" class="form-label">일정 제목</label> <input
									type="text" class="form-control" id="editEventTitle" required>
							</div>
							<div class="mb-3">
								<label for="editEventStart" class="form-label">시작일</label> <input
									type="datetime-local" class="form-control" id="editEventStart"
									required>
							</div>
							<div class="mb-3">
								<label for="editEventEnd" class="form-label">종료일</label> <input
									type="datetime-local" class="form-control" id="editEventEnd">
							</div>
							<div class="mb-3 form-check">
								<input type="checkbox" class="form-check-input"
									id="editAllDayCheck"> <label class="form-check-label"
									for="editAllDayCheck">하루 종일</label>
							</div>
							<div class="mb-3">
								<label for="editEventDescription" class="form-label">설명</label>
								<textarea class="form-control" id="editEventDescription"
									rows="3"></textarea>
							</div>
						</form>
					</div>
				</div>
				<div class="modal-footer">
					<!-- 상세 정보 뷰 버튼 -->
					<div id="detailFooter">
						<button type="button" class="btn btn-primary" id="openEditModal">수정</button>
						<button type="button" class="btn btn-danger" id="deleteEvent">삭제</button>
						<button type="button" class="btn btn-secondary"
							data-bs-dismiss="modal">닫기</button>
					</div>
					<!-- 수정 폼 뷰 버튼 -->
					<div id="editFooter" style="display: none;">
						<button type="button" class="btn btn-primary" id="editEvent">저장</button>
						<button type="button" class="btn btn-secondary" id="cancelEdit">취소</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script src="/js/calendar/calendar-depart.js"></script>
	<script>
		document.addEventListener('DOMContentLoaded', function() {
			// 모든 tooltip 초기화
			var tooltipTriggerList = [].slice.call(document
					.querySelectorAll('[data-bs-toggle="tooltip"]'));
			var tooltipList = tooltipTriggerList
					.map(function(tooltipTriggerEl) {
						return new bootstrap.Tooltip(tooltipTriggerEl);
					});
		});
	</script>
</body>
</html>
