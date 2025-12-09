<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 21.     	임가영            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="/css/meeting.css">
<!-- 회의 메뉴 전용 css -->
</head>
<body>
	<security:authentication property="principal.realUser" var="realUser" />
	<div id="main-content">

		<div class="outline-section">
			<div class="outline-title">회의실 예약 & 나의 회의 관리</div>
			<div class="outline-subtitle">회의실을 예약하고 메모를 저장할 수 있습니다.</div>
		</div>

		<!-- 타임라인 캘린더 -->
		<div class="card">
			<div class="card-header d-flex flex-column" style="padding: 1.5rem 1.5rem 0 1.5rem ">
				<h4>회의실 예약 현황</h4>
 			</div>
				  <div class="d-flex justify-content-between align-items-center">
				    <div class="d-flex align-items-center mx-auto">
				      <h5 class="mb-0">${day}</h5>
				       <button class="btn" id="date-picker-btn">
					        <i class="bi-calendar-event"></i>
					      </button>
					      <!-- 숨겨진 date input -->
					      <input type="date" id="date-picker" style="opacity:0; width:0; height:-25px; position:absolute;">
				    </div>
			    </div>


			<div class="card-body">
 				<div class="timeline-wrapper" style="position: relative;">
 					<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
	 					<div>
							<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#435ebe" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
							<span style="color:#435ebe;font-size: 1.1rem;font-weight:500">빈칸을 눌러 회의실을 예약하세요</span>
							&nbsp
							<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
							<span style="font-size: 1.1rem;font-weight:500">예약 수정을 통해 연장 가능합니다</span>
						</div>
						<div style="display: flex; align-items: center; gap: 5px;">
							<button class="btn btn-dark" id="read-reservation-btn"  data-bs-toggle="modal" data-bs-target="#recurring-booking-list-modal" style="background-color:rgb(48 45 58)">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
					        	반복 예약 현황
					        </button>
							<button class="btn btn-primary" id="new-reservation-btn"  data-bs-toggle="modal" data-bs-target="#recurring-booking-modal">
					        	+ 반복 예약 신청
					        </button>
					   	</div>
			        </div>

					<!-- 회의실 예약 현황 테이블 -->
					<table id="timeline-container" class="table table-bordered table-responsive mt-1">
    					<thead>
					        <tr>
					            <th class="timeline-header-blank"></th>
					            <c:forEach begin="9" end="17" var="hour">
					                <th class="timeline-header">${hour}:00 - ${hour + 1}:00</th>
					            </c:forEach>
					        </tr>
					    </thead>
					    <tbody>
					        <c:forEach var="room" items="${roomList}">
					            <tr>
					                <td class="room-label">${room.roomName}</td>

					                <!-- 선택한 날짜가 없거나 선택한 날짜가 오늘이라면.. -->
					                <c:if test="${empty selectedDay or selectedDay eq today }">
						                <c:forEach begin="9" end="17" var="hour">
						                    <c:choose>

						                     	<c:when test="${room.useYn eq 'N' or currentHour > hour }">
						                            <td class="time-slot disabled-slot"
						                                data-room="${room.roomId}" data-hour="${hour}">
						                            </td>
						                        </c:when>

						                        <c:otherwise>
						                            <td class="time-slot"
						                                data-room="${room.roomId}" data-hour="${hour}"
						                                data-bs-toggle="modal" data-bs-target="#reservation-modal">
						                            </td>
						                        </c:otherwise>

						                    </c:choose>
						                </c:forEach>
					                </c:if>

					                <!-- 선택한 날짜가 있고, 선택한 날짜가 오늘이 아니라면.. -->
					                <c:if test="${not empty selectedDay and selectedDay ne today }">
					                	<c:forEach begin="9" end="17" var="hour">
				                            <td class="time-slot disabled-slot"
				                                data-room="${room.roomId}" data-hour="${hour}">
				                            </td>
						                </c:forEach>
					                </c:if>

					            </tr> <!-- 예약테이블 한줄 끝 -->
					        </c:forEach>
					    </tbody>
					</table>


					<!-- 회의실 예약 현황 띄우기 -->
					<c:forEach var="reservation" items="${reservationList }" varStatus="status">
						<!-- 회의 시작 시각에 따라 reservation-bar 시작 지점 구하기 -->
						<c:set var="leftStartTime" value="${(reservation.startTime % 9) * 10.1 }" />
						<!-- 회의 시간에 따라 reservation-bar 너비 구하기 -->
						<c:set var="widthHour" value="${(reservation.endTime - reservation.startTime) * 10 }" />

						<!-- 예약 현황 -->
						<div
							class="reservation-bar ${reservation.userId eq realUser.userId ? 'is-mine' : 'bg-light'}"
							data-id="${reservation.reservationId	 }"
							style="top: ${22 + reservation.rnum * 67}px;
			        			    left: calc(9% + ${leftStartTime }% ); width: calc(${widthHour }%);"
							data-bs-toggle="modal" data-bs-target="#reservation-modal">
							${reservation.title } (${reservation.startTime }:00-${reservation.endTime }:00)
						</div>
					</c:forEach>
				</div>
				<!-- timeline-container 끝 -->
			</div>
			<!-- card-body 끝 -->
		</div>
		<!-- card 끝 -->


		<!-- 나의 회의 메모 -->
		<div class="card" id="memo-container">
		  <div class="card-header d-flex justify-content-between align-items-center">
		    <h4 class="mb-0">나의 회의 메모</h4>
		    <button class="btn btn-primary" id="new-memo-btn">
		      + 새 메모
		    </button>
		  </div>

			<div class="card-body" style="min-height:280px">
				<div class="input-group mb-3" style="width: 400px;">
				    <input type="text" id="memoSearchInput" class="form-control" placeholder="검색어 입력" aria-label="Search organization">
				    <button class="btn btn-primary" type="button" id="memoSearchButton">검색</button>
				</div>
				<div class="row" id="memolist-row">

					<c:if test="${not empty memoList }">
						<c:forEach var="memo" items="${memoList}">
							<div class="col-lg-3 col-md-6 mb-4 memo-card" data-memoid="${memo.memoId }">
								<div class="card meeting-note-card h-100 category-work">
									<div class="card-body">
										<div class="d-flex justify-content-between align-items-start">
											<div>
												<h5 class="editable title">${memo.title }</h5>
												<p class="card-subtitle mb-2">
													<span class="editable date">${memo.crtDt }</span>
												</p>
											</div>
											<div class="dropdown">
												<a href="#" data-bs-toggle="dropdown" aria-expanded="false"
													class="btn btn-sm btn-light-secondary icon rounded-pill">
													<i class="bi bi-three-dots-vertical"></i>
												</a>
												<div class="dropdown-menu dropdown-menu border">
													 <button class="dropdown-item text-danger delete-note">
													 	<i class="bi bi-trash-fill me-2"></i>삭제
													 </button>
												</div>
											</div>
										</div>
										<p class="card-text memo-snippet editable contents ${empty memo.contents ? 'fs-6 text-muted' : ' ' }">${not empty memo.contents ? memo.contents : '본문을 더블클릭하여 내용을 입력하세요.'}</p>
									</div>
								</div>
							</div>
						</c:forEach>
					</c:if>
					<c:if test="${empty memoList }">
						<div class="col-lg col-md py-5" style="width: 100%; text-align: center">
							<span> 나의 회의 메모가 없습니다.<br /> 회의 후 기억해야할 내용을 기록해 보세요.</span>
						</div>
					</c:if>

				</div>
			</div>
			<!-- card-body 끝 -->
		</div>
		<!-- 나의 회의 card 끝 -->

	</div>
	<!-- main-content 끝 -->

	<!-- 새 예약 모달 -->
	<div class="modal fade" id="reservation-modal" tabindex="-1"
		style="padding-right: 15px;" aria-modal="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="modal-title">새 예약</h5>
					<button id="my-meeting-btn" type="button" class="btn rounded-pill"
						style="background: var(--bg-gradient); color: white" hidden>
						✎ 나의 회의에 추가
					</button>
				</div>
				<div class="modal-body">
					<!-- 회의실 예약 폼 -->
					<form id="reservation-form">
						<input type="hidden" id="meeting-id" name="reservationId" value="">
						<input type="hidden" id="meeting-date" name="meetingDate" value="">
						<div class="mb-3">
							<label class="form-label">회의실 <span class="text-danger">*</span></label>
							<div style="display: flex; flex-wrap: wrap; gap: 10px 25px; width: 80%">
								<c:forEach var="room" items="${roomList }">
									<label class="form-check-label" for="${room.roomId }">
										<input id="modal-room-${room.roomId }" value="${room.roomId }"
										class="form-check-input" type="radio" name="roomId" required />
										${room.roomName }
									</label>
								</c:forEach>
							</div>
						</div>
						<div class="row mb-3">
							<div class="col">
								<label class="form-label">시작시각 <span class="text-danger">*</span></label> <input type="number"
									name="startTime" class="form-control" id="modal-start-time"
									min="9" max="17" placeholder="9" required>
							</div>
							<div class="col">
								<label class="form-label">종료시각 <span class="text-danger">*</span></label> <input
									id="modal-end-time" name="endTime" type="number"
									class="form-control" min="10" max="18" placeholder="10"
									required>
							</div>
						</div>
						<div class="mb-3">
							<label class="form-label">예약자 (사번 입력) <span class="text-danger">*</span></label> <input
								id="modal-meeting-user" name="userId" type="number"
								class="form-control" value="${realUser.userId }"
								placeholder="예약자 사번을 입력하세요." required readOnly>
						</div>
						<div class="mb-3">
							<label class="form-label">회의명</label> <input
								id="modal-meeting-title" name="title" type="text"
								class="form-control" placeholder="미입력 시 예약자 이름으로 설정됩니다.">
						</div>

						<div class="modal-footer" style="padding: 3% 0 0 0">
							<button type="button"
								class="btn icon icon-left btn-danger me-auto" id="cancel-btn"
								style="display: block;" hidden>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
									viewBox="0 0 24 24" fill="none" stroke="currentColor"
									stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
									class="feather feather-alert-circle">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="8" x2="12" y2="12"></line>
									<line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
								 예약 취소
							</button>
							<span id="infoMsg" class="text-muted small me-auto"></span>
							<button type="button" class="btn btn-light-secondary"
								data-bs-dismiss="modal">닫기</button>
							<button type="button" class="btn btn-primary" id="modify-btn" hidden>수정</button>
							<button type="submit" class="btn btn-primary" id="save-btn">예약</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	<%@include file="/WEB-INF/views/meeting/recurring-booking-modal.jsp"%>
	<%@include file="/WEB-INF/views/meeting/recurring-booking-list-modal.jsp"%>

	<!-- JS -->
	<script>
		const currentHour = "${currentHour}";
		const selectedDay = "${selectedDay}";
		const today = "${today}"
	</script>
	<script type="text/javascript" src="/js/meeting/meeting.js"></script>
</body>
</html>