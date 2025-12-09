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
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>


<div class="modal fade" id="recurring-booking-list-modal" tabindex="-1" style="padding-right: 15px;" aria-modal="true" role="dialog">
	<div
		class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modal-title">회의실 반복 예약 현황</h5>
			</div>
			<div class="modal-body">
				 <ul class="nav nav-tabs mb-3" id="bookingTab" role="tablist">
				 	<li class="nav-item" role="presentation">
                        <button class="nav-link active" id="all-booking-tab" data-bs-toggle="tab"
                            data-bs-target="#all-booking" type="button" role="tab"
                            aria-controls="all-booking" aria-selected="false">승인된 반복 예약</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="my-booking-tab" data-bs-toggle="tab"
                            data-bs-target="#my-booking" type="button" role="tab"
                            aria-controls="my-booking" aria-selected="true">나의 예약</button>
                    </li>
                </ul>

                <!-- 탭 콘텐츠 -->
                <div class="tab-content" id="bookingTabContent" style="min-height:320px">
                    <!-- 나의 예약 -->
                    <div class="tab-pane fade" id="my-booking" role="tabpanel"
                        aria-labelledby="my-booking-tab">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle rounded-3" style="border-top: 2px solid #dee2e6">
                                <thead class="text-center">
                                    <tr>
                                        <th style="width: 5%;">No</th>
                                        <th style="width: 10%;">회의실</th>
                                        <th>회의명</th>
                                        <th style="width: 15%;">기간</th>
                                        <th style="width: 20%;">반복조건</th>
                                        <th style="width: 15%;">신청일</th>
                                        <th style="width: 9%;">상태</th>
                                    </tr>
                                </thead>
                                <tbody class="text-center">
                                    <c:forEach var="myRecurringBooking" items="${myRecurringBookingList}" varStatus="status">
	                                    <tr>
	                                        <td>${status.count}</td>
	                                        <td>${myRecurringBooking.roomName}</td>
	                                        <td>${myRecurringBooking.title}</td>
	                                        <td>
	                                        	<span class="date-line" style="display: block;margin: 0;line-height: 1.2;">${myRecurringBooking.startDate}</span>
	                                        	<span class="date-line" style="display: block;margin: 0;line-height: 1.2;">-</span>
	                                        	<span class="date-line" style="display: block;margin: 0;line-height: 1.2;">${myRecurringBooking.endDate}</span>
	                                        </td>
	                                        <td>
	                                        	${myRecurringBooking.interval}${myRecurringBooking.frequency eq 'day'? '일마다 ' : '주마다 '}
	                                        	<c:forEach var="weekCheck" items="${myRecurringBooking.weekCheckList }">
                                                     ${weekCheck == '1' ? '월 ' :
	                                                   weekCheck == '2' ? '화 ' :
	                                                   weekCheck == '3' ? '수 ' :
	                                                   weekCheck == '4' ? '목 ' :
	                                                   weekCheck == '5' ? '금 ' : '주말'
	                                                  }
	                                        	</c:forEach>
												<br/>
                                                ${myRecurringBooking.startTime}시 - ${myRecurringBooking.endTime}시
                                            </td>
	                                        <td>${myRecurringBooking.crtDt}</td>
	                                        <td>${myRecurringBooking.status eq 'A401' ? '<span class="badge bg-success">승인</span>' :
	                                        	 myRecurringBooking.status eq 'A402' ? '<span class="badge bg-danger">반려</span>' :
	                                        	 myRecurringBooking.status eq 'B305' ? '<span class="badge bg-danger">취소</span>' : '<span class="badge bg-light-primary">승인대기</span>'}</td>
	                                    </tr>
	                                    <c:if test="${myRecurringBooking.status eq 'A402' }">
	                                   	<tr>
											<td colspan="7" class="text-end fw-bold" style="background-color:#fff0f2">📍반려 사유 : ${myRecurringBooking.rejectReason }</td>
	                                   	</tr>
	                                    </c:if>
                                    </c:forEach>
                                    <c:if test="${empty myRecurringBookingList}">
                                        <tr>
                                            <td colspan="7" class="text-muted py-4 py-5">신청한 반복 예약이 없습니다.</td>
                                        </tr>
                                    </c:if>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 전체 예약 -->
                    <div class="tab-pane fade show active" id="all-booking" role="tabpanel" aria-labelledby="all-booking-tab">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle rounded-3" style="border-top: 2px solid #dee2e6">
                                <thead class="text-center">
                                    <tr>
                                        <th style="width: 5%;">No</th>
                                        <th style="width: 10%;">회의실</th>
                                        <th>회의명</th>
                                        <th style="width: 15%;">기간</th>
                                        <th style="width: 20%;">반복조건</th>
                                        <th style="width: 10%;">예약자</th>
                                        <th style="width: 15%;">신청일</th>
                                    </tr>
                                </thead>
                                <tbody class="text-center">
                                    <c:forEach var="progressRecurringBooking" items="${progressRecurringBookingList}" varStatus="status">
                                        <tr>
                                            <td>${status.count}</td>
                                            <td>${progressRecurringBooking.roomName}</td>
                                            <td>${progressRecurringBooking.title}</td>
                                            <td>
                                            	<span class="date-line" style="display: block;margin: 0;line-height: 1.2;">${progressRecurringBooking.startDate}</span>
	                                        	<span class="date-line" style="display: block;margin: 0;line-height: 1.2;">-</span>
	                                        	<span class="date-line" style="display: block;margin: 0;line-height: 1.2;">${progressRecurringBooking.endDate}</span>
                                            </td>
                                            <td>
                                            	${progressRecurringBooking.interval}${progressRecurringBooking.frequency eq 'day'? '일마다 ' : '주마다 '}
	                                        	<c:forEach var="weekCheck" items="${progressRecurringBooking.weekCheckList }">
                                                     ${weekCheck == '1' ? '월 ' :
	                                                   weekCheck == '2' ? '화 ' :
	                                                   weekCheck == '3' ? '수 ' :
	                                                   weekCheck == '4' ? '목 ' :
	                                                   weekCheck == '5' ? '금 ' : '주말'
	                                                  }
	                                        	</c:forEach>
												<br/>
                                                ${progressRecurringBooking.startTime}시 - ${progressRecurringBooking.endTime}시
                                            </td>
                                            <td>${progressRecurringBooking.userNm}</td>
                                            <td>${progressRecurringBooking.crtDt}</td>
                                        </tr>
                                    </c:forEach>
                                    <c:if test="${empty progressRecurringBookingList}">
                                        <tr>
                                            <td colspan="7" class="text-muted py-4 py-5">진행 중인 반복 예약이 없습니다.</td>
                                        </tr>
                                    </c:if>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

				<div class="alert alert-light-primary color-primary">
					<i class="bi-exclamation-circle"></i> 반복 예약 관련 문의사항은 인사팀
					이민정(010-2000-0002)에게 연락해 주시기 바랍니다.
				</div>

			<div class="modal-footer" style="padding: 3% 0 0 0">
				<button type="button" class="btn icon icon-left btn-danger me-auto"
					id="cancel-btn" style="display: block;" hidden>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
						viewBox="0 0 24 24" fill="none" stroke="currentColor"
						stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
						class="feather feather-alert-circle">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="12" y1="8" x2="12" y2="12"></line>
									<line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
					예약 취소
				</button>

				<button type="button" class="btn btn-light-secondary"
					data-bs-dismiss="modal">닫기</button>
			</div>
		</div>
	</div>
</div>
</div>