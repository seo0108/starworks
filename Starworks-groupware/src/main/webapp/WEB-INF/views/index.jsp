<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 15.     	임가영            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<style>
    /* 날짜/시간 UI를 welcome-section 내부 오른쪽으로 이동시키기 위한 스타일 */
    .welcome-section-inner {
        display: flex;
        justify-content: space-between;
        align-items: flex-start; /* 상단 정렬 */
    }

    #time-icon {
        width: 2rem; /* 아이콘 너비를 고정하여 UI 크기 변경 방지 */
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: 0.5rem; /* 아이콘과 시간 사이 간격 */
    }

</style>
</head>
<body>
<security:authentication property="principal.realUser" var="realUser"/>

 <div class="main-container">

        <!-- Main Content -->
        <div class="main-content">


            <!-- Content -->
            <div class="content">
                <!-- Welcome Section -->

                <div class="welcome-section mb-4 animate-on-load" style="animation-delay: 0.2s;">
                    <div class="welcome-section-inner">
                        <div> <!-- 왼쪽 텍스트 컨텐츠 -->
                            <div class="welcome-title">좋은 하루 시작하세요!</div>
                            <div class="welcome-subtitle">오늘도 화이팅입니다 <i class="fa-solid fa-hand-fist text-warning"></i></div>
	                        <div id="datetime-container" class="mt-3">
	                        <!-- 날짜/시간 -->
	                            <div class="welcome-title" id="time-display">
	                            <span class="welcome-title" id="time-icon"></span>
	                            <span class="welcome-title" id="time-text">--:--:--</span></div>
	                            <div class="welcome-subtitle" id="date-display">----년 --월 --일 --요일</div>
							</div>
                        </div>

						<!-- <div id="weather-box" style="color:#f5f5f5; text-align:left;">
						  아이콘
						  <img id="weather-icon" src="" alt="날씨 아이콘"
						       style="width:75px;height:75px;margin-bottom:5px;">
						  텍스트 영역
						  <div id="weather-text" style="line-height:1.6;">
						    <div id="weather-temp" style="font-size:1.4rem;font-weight:700;">--°C</div>
						    <div id="weather-desc" style="font-size:1rem;">날씨 정보를 불러오는 중...</div>
						    <div id="weather-detail" style="font-size:0.9rem;opacity:0.9;"></div>
						    <div id="weather-sun" style="font-size:0.85rem;margin-top:3px;"></div>
						  </div>
                        </div> -->
                    </div>
                </div>

                <div class="row">
                    <!-- Left Column -->
                    <div class="col-lg-8">
                        <!-- Attendance Card -->
                        <div class="card attendance-card mb-4 animate-on-load" style="animation-delay: 0.2s;">
                            <div class="card-header">
                                <i class="bi bi-clock-fill me-2"></i>출퇴근 관리
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="time-display" id="current-time">
                                        	<c:if test="${not empty attendanceRecord.workStartTime }">
                                        		${attendanceRecord.workStartTime }
                                        	</c:if>
                                        	<c:if test="${empty attendanceRecord.workinghours }">
                                        		--:--:--
                                        	</c:if>
                                        </div>
                                        <div class="work-duration">오늘 근무시간: <span id="work-timer">00:00:00</span></div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="attendance-buttons">
                                            <button class="attendance-btn" id="clock-in-btn" ${not empty attendanceRecord.workStartTime ? 'disabled' : ' '}>
                                                <i class="bi bi-box-arrow-in-right me-2"></i>출근
                                            </button>
                                            <button class="attendance-btn" id="clock-out-btn" ${(not empty attendanceRecord.workStartTime and empty attendanceRecord.workEndTime) ? ' ' : 'disabled'}>
                                                <i class="bi bi-box-arrow-left me-2"></i>퇴근
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Stats Grid -->
                        <div class="stats-grid mb-0">
                            <div class="card stat-card animate-on-load" style="animation-delay: 0.3s;">
                                <i class="bi bi-check-circle-fill stat-icon"></i>
                                <a href="/projects/main">
	                                <div class="stat-value">${cntCard.mainTaskCnt }</div>
	                                <div class="stat-label">진행 중인 업무</div>
                                </a>
                            </div>
                            <div class="card stat-card animate-on-load" style="animation-delay: 0.4s;">
                               <i class="bi bi-pen-fill stat-icon"></i>
                                <a href="/approval/main?filter=inbox">
	                                <div class="stat-value">${cntCard.waitApprovalCnt }</div>
	                                <div class="stat-label">결재 대기 건</div>
                                </a>
                            </div>
                            <div class="card stat-card animate-on-load" style="animation-delay: 0.5s;">
                            	<i class="bi bi-calendar stat-icon"></i>
                                <a href="/calendar/depart">
	                                <div class="stat-value">${cntCard.weekScheduleCnt }</div>
	                                <div class="stat-label">이번 주 일정</div>
                                </a>
                            </div>
                            <div class="card stat-card animate-on-load" style="animation-delay: 0.6s;">
                                <i class="bi bi-envelope-fill stat-icon"></i>
                                <a href="/mail/list">
	                                <div class="stat-value">${cntCard.unreadMailCnt }</div>
	                                <div class="stat-label">읽지 않은 메일</div>
                                </a>
                            </div>
                        </div>

                        <div class="card mb-4 animate-on-load" style="animation-delay: 0.7s;">
                            <div class="card-header mb-3">
                                <i class="bi bi-calendar-check-fill me-2"></i>오늘의 일정
                            </div>
                            <div class="card-body">
                            	<c:if test="${not empty todayScheduleList }">
	                                <c:forEach var="todaySchedule" items="${todayScheduleList }">
	                            		<c:if test="${not empty todaySchedule.startTime }">
			                                <div class="schedule-item">
			                                	<div class="schedule-time me-4">
			                                		${fn:substringAfter((todaySchedule.startTime), 'T')} - ${fn:substringAfter((todaySchedule.endTime), 'T')}
			                                   </div>
			                                    <div class="schedule-content">
			                                        <div class="schedule-title">${todaySchedule.scheduleNm }</div>
			                                        <div class="schedule-location">${todaySchedule.description }</div>
			                                    </div>
			                                    <c:if test="${todaySchedule.scheduleType eq 'personal' }">
			                                    	 <span class="schedule-badge bg-primary text-white">개인</span>
			                                    </c:if>
			                                    <c:if test="${todaySchedule.scheduleType eq 'department' }">
			                                    	 <span class="schedule-badge bg-info text-white">부서</span>
			                                    </c:if>
			                                </div>
		                                </c:if>
	                                </c:forEach>
	                                <c:forEach var="todaySchedule" items="${todayScheduleList }">
	                            		<c:if test="${empty todaySchedule.startTime }">
			                                <div class="schedule-item">
			                                	<div class="schedule-time ms-1 me-4">
														하루종일
			                                   </div>
			                                    <div class="schedule-content">
			                                        <div class="schedule-title">${todaySchedule.scheduleNm }</div>
			                                         <c:if test="${todaySchedule.scheduleType eq 'department' }">
			                                    	 	<div class="schedule-location">등록자 : ${todaySchedule.userNm } ${todaySchedule.jbgdNm} (${todaySchedule.deptNm })</div>
			                                    	 </c:if>
			                                    	 <c:if test="${todaySchedule.scheduleType eq 'personal' }">
				                                    <div class="schedule-location">${todaySchedule.description }</div>
				                                    </c:if>
			                                    </div>
			                                    <c:if test="${todaySchedule.scheduleType eq 'personal' }">
			                                    	 <span class="schedule-badge bg-primary text-white">개인</span>
			                                    </c:if>
			                                    <c:if test="${todaySchedule.scheduleType eq 'department' }">
			                                    	 <span class="schedule-badge bg-info text-white">부서</span>
			                                    </c:if>
			                                </div>
		                                </c:if>
	                                </c:forEach>
	                              </c:if>
	                              <c:if test="${empty todayScheduleList}">
									<div class="my-5" style="text-align: center">오늘의 일정이 없습니다</div>
	                              </c:if>
                            </div>
                        </div>

                        <div class="card animate-on-load" style="animation-delay: 0.8s;">
                            <div class="card-header mb-3">
                                <i class="bi bi-bar-chart-line-fill me-2"></i>진행중인 프로젝트
                            </div>
                            <div class="card-body">
                            	<c:choose>
	                            	<c:when test="${not empty currentProjectList }">
		                            	<c:forEach var="currentProject" items="${currentProjectList }">
		                            		<a style="color : #607080" href="/projects/${currentProject.pk }">
			                            		<div class="progress-item">
				                                    <div style="width: 75%">
				                                        <div class="progress-label">${currentProject.projectNm }</div>
				                                        <div class="progress">
				                                            <div class="progress-bar" style="width: ${currentProject.progress }%"></div>
				                                        </div>
				                                    </div>
			                                    <div class="progress-value ms-3 me-3">${currentProject.progress }%</div>
			                                    <div>종료일 ${fn:substringBefore((currentProject.endDate), 'T')}</div>
			                                	</div>
			                                </a>
		                            	</c:forEach>
	                            	</c:when>
	                            	<c:otherwise>
										<div class="my-5" style="text-align: center">참여중인 프로젝트가 없습니다</div>
	                            	</c:otherwise>
                            	</c:choose>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="col-lg-4">
                        <!-- Quick Actions -->
                        <div class="card mb-4 animate-on-load" style="animation-delay: 0.9s;">
                            <div class="card-header mb-3">
                                <i class="bi bi-lightning-fill me-2"></i>바로가기
                            </div>
                            <div class="card-body">
                                <div class="quick-actions">
                                    <a href="/approval/main" class="quick-action">
                                        <i class="bi bi-pencil-square"></i>
                                        <span>결재 홈</span>
                                    </a>
                                    <a href="/calendar/depart" class="quick-action">
                                        <i class="bi bi-calendar-plus"></i>
                                        <span>일정 등록</span>
                                    </a>
                                    <a href="/projects/main" class="quick-action">
                                        <i class="bi bi-easel2"></i>
                                        <span>나의 프로젝트</span>
                                    </a>
                                    <a href="/mail/send" class="quick-action">
                                        <i class="bi bi-envelope-plus"></i>
                                        <span>메일 작성</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Notices -->
                        <div class="card mb-4 animate-on-load" style="animation-delay: 0.9s;">
                            <div class="card-header mb-3">
                                <i class="bi bi-megaphone-fill me-2"></i>최근 공지사항
                            </div>
                            <c:if test="${not empty recentBoardList }">
                            <div class="card-body">
	                            <c:forEach var="recentBoard" items="${recentBoardList }">
		                            	<a href="board/notice/${recentBoard.pk }" >
			                                <div class="notice-item">
			                                    <div class="notice-title">${recentBoard.boardTitle }</div>
			                                    <div class="notice-meta">
			                                        <span>
			                                        	${recentBoard.crtUserVO.userNm }
<%-- 			                                        	${recentBoard.crtUserVO.jbgdNm } --%>
			                                        	(${recentBoard.crtUserVO.deptNm })
			                                        	| ${fn:substringBefore((recentBoard.crtDt), 'T') }
			                                       	</span>
			                                    </div>
			                                </div>
		                                </a>
	                            </c:forEach>
                            </div>
                            </c:if>
                            <c:if test="${empty recentBoardList }">
                            	<div class="card-body">
                            		등록된 공지사항이 없습니다.
		                        </div>
                            </c:if>
                        </div>

                        <!-- Team Status -->
                        <div class="card animate-on-load" style="animation-delay: 0.9s;">
                            <div class="card-header mb-3">
                                <i class="bi bi-people-fill me-2"></i>${realUser.deptNm } 근무 현황
                            </div>
                            <div class="card-body animate-on-load" style="animation-delay: 0.9s;">
                                <div class="d-flex justify-content-between align-items-center mb-3 animate-on-load" style="animation-delay: 0.9s;">
                                    <span>전체 팀원</span>
                                    <strong>${departStatus.departCnt }명</strong>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3 animate-on-load" style="animation-delay: 0.9s;">
                                    <span>현재 근무 중</span>
                                    <strong>${departStatus.workingUserCnt }명</strong>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3 animate-on-load" style="animation-delay: 0.9s;">
                                    <span>휴가</span>
                                    <strong>${departStatus.vacationUserCnt }명</strong>
                                </div>
                                <div class="d-flex justify-content-between align-items-center animate-on-load" style="animation-delay: 0.9s;">
                                    <span>외근</span>
                                    <strong>${departStatus.businessTripCnt }명</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 <script src="/js/index/index.js"></script>
</body>
</html>