<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 27.     	임가영            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>


<div class="modal fade" id="recurring-booking-modal" tabindex="-1"
		style="padding-right: 15px;" aria-modal="true" role="dialog">
		<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="recurring-booking-modal-title">회의실 반복 예약 신청</h5>
				</div>
				<div class="modal-body">
					<div class="alert alert-light-warning color-warning">
						<i class="bi-exclamation-triangle"></i>
                            회의실 반복 예약은 관리자 승인 후 최종 등록됩니다.
                    </div>
					<!-- 회의실 반복예약 예약 폼 -->
					<form id="recurring-booking-form">
						<div class="mb-3">
							<label class="form-label">회의실 <span class="text-danger">*</span></label>
							<div style="display: flex; flex-wrap: wrap; gap: 10px 25px; width: 80%">
								<c:forEach var="room" items="${roomList }">
									<label class="form-check-label" for="${room.roomId }">
										<input id="recurring-booking-modal-room-${room.roomId }" value="${room.roomId }"
										class="form-check-input" type="radio" name="roomId" required />
										${room.roomName }
									</label>
								</c:forEach>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col">
								<label class="form-label">반복빈도 <span class="text-danger">*</span></label>
								<select id="modal-frequency" class="form-select" name="frequency" required>
									<option value="day">일 (DAY)</option>
									<option value="week">주 (WEEK)</option>
								</select>
							</div>
							<div class="col">
								<label class="form-label">반복주기 <span class="text-danger">*</span></label>
								<input id="modal-interval" name="interval" type="number" class="form-control" min="1" max="52" placeholder="2"
									required>
							</div>
						</div>

						<div id="modal-week-check" class="row mb-3" hidden>
							<div class="col custom-control custom-checkbox">
								<input type="checkbox" class="form-check-input form-check-primary" name="weekCheck" value="1">
								<label class="form-check-label" for="monday">월</label>
								<input type="checkbox" class="form-check-input form-check-primary" name="weekCheck" value="2">
								<label class="form-check-label" for="tuesday">화</label>
								<input type="checkbox" class="form-check-input form-check-primary" name="weekCheck" value="3">
								<label class="form-check-label" for="wednesday">수</label>
								<input type="checkbox" class="form-check-input form-check-primary" name="weekCheck" value="4">
								<label class="form-check-label" for="tuesday">목</label>
								<input type="checkbox" class="form-check-input form-check-primary" name="weekCheck" value="5">
								<label class="form-check-label" for="friday">금</label>
							</div>
						</div>

						<div class="alert alert-light-info color-info py-2" id="modal-info">
							<i class="bi bi-star"></i> 빈도와 주기를 입력하면 반복 예약 안내가 나타납니다.
                        </div>

						<div class="row mb-3">
							<div class="col">
								<label class="form-label">시작일자 <span class="text-danger">*</span></label>
								<input type="date" name="startDate" class="form-control" id="modal-start-date" required>
							</div>
							<div class="col">
								<label class="form-label">종료일자 <span class="text-danger">*</span></label>
								<input type="date" name="endDate" class="form-control" id="modal-end-date" required>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col">
								<label class="form-label">시작시각 <span class="text-danger">*</span></label> <input type="number"
									name="startTime" class="form-control" id="recurring-booking-modal-start-time"
									min="9" max="17" placeholder="9" required>
							</div>
							<div class="col">
								<label class="form-label">종료시각 <span class="text-danger">*</span></label> <input
									id="recurring-booking-modal-end-time" name="endTime" type="number"
									class="form-control" min="10" max="18" placeholder="10"
									required>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col-4">
								<label class="form-label">예약자 (사번 입력) <span class="text-danger">*</span></label>
								<input
									id="modal-meeting-user" name="userId" type="number"
									class="form-control" value="${realUser.userId }"
									placeholder="예약자 사번을 입력하세요." required readOnly>
							</div>

							<div class="col-8">
								<label class="form-label">회의명</label> <input
									id="recurring-booking-modal-meeting-title" name="title" type="text"
									class="form-control" placeholder="미입력 시 예약자 이름으로 설정됩니다.">
							</div>
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
							<button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">닫기</button>
							<button type="submit" class="btn btn-primary" >예약 신청</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>