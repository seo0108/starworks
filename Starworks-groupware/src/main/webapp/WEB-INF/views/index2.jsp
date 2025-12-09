<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Groupware Main - Improved Design</title>

</head>
<body>
    <div class="main-container">


        <!-- Main Content -->
        <div class="main-content">


            <!-- Content -->
            <div class="content">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <div class="welcome-title">좋은 하루 시작하세요!</div>
                    <div class="welcome-subtitle">오늘도 화이팅입니다 💪</div>
                </div>

                <div class="row">
                    <!-- Left Column -->
                    <div class="col-lg-8">
                        <!-- Attendance Card -->
                        <div class="card attendance-card mb-4">
                            <div class="card-header">
                                <i class="bi bi-clock-fill me-2"></i>출퇴근 관리
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="time-display" id="current-time">--:--:--</div>
                                        <div class="work-duration">오늘 근무시간: <span id="work-timer">00:00:00</span></div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="attendance-buttons">
                                            <button class="attendance-btn" id="clock-in-btn">
                                                <i class="bi bi-box-arrow-in-right me-2"></i>출근
                                            </button>
                                            <button class="attendance-btn" id="clock-out-btn" disabled>
                                                <i class="bi bi-box-arrow-left me-2"></i>퇴근
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Stats Grid -->
                        <div class="stats-grid mb-4">
                            <div class="card stat-card">
                                <i class="bi bi-check-circle-fill stat-icon"></i>
                                <div class="stat-value">12</div>
                                <div class="stat-label">완료한 업무</div>
                            </div>
                            <div class="card stat-card">
                                <i class="bi bi-hourglass-split stat-icon"></i>
                                <div class="stat-value">3</div>
                                <div class="stat-label">대기중인 결재</div>
                            </div>
                            <div class="card stat-card">
                                <i class="bi bi-calendar-event stat-icon"></i>
                                <div class="stat-value">8</div>
                                <div class="stat-label">이번 주 일정</div>
                            </div>
                            <div class="card stat-card">
                                <i class="bi bi-envelope-fill stat-icon"></i>
                                <div class="stat-value">2</div>
                                <div class="stat-label">읽지 않은 메일</div>
                            </div>
                        </div>

                        <!-- Today's Schedule -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="bi bi-calendar-check-fill me-2"></i>오늘의 일정
                            </div>
                            <div class="card-body">
                                <div class="schedule-item">
                                    <div class="schedule-time">10:00</div>
                                    <div class="schedule-content">
                                        <div class="schedule-title">주간 정기 회의</div>
                                        <div class="schedule-location">대회의실 A</div>
                                    </div>
                                    <span class="schedule-badge bg-primary text-white">회의</span>
                                </div>
                                <div class="schedule-item">
                                    <div class="schedule-time">14:00</div>
                                    <div class="schedule-content">
                                        <div class="schedule-title">신제품 기획안 리뷰</div>
                                        <div class="schedule-location">온라인 미팅</div>
                                    </div>
                                    <span class="schedule-badge bg-success text-white">리뷰</span>
                                </div>
                                <div class="schedule-item">
                                    <div class="schedule-time">16:00</div>
                                    <div class="schedule-content">
                                        <div class="schedule-title">개발팀 스크럼</div>
                                        <div class="schedule-location">개발팀 회의실</div>
                                    </div>
                                    <span class="schedule-badge bg-info text-white">스크럼</span>
                                </div>
                            </div>
                        </div>

                        <!-- Project Progress -->
                        <div class="card">
                            <div class="card-header">
                                <i class="bi bi-bar-chart-line-fill me-2"></i>진행중인 프로젝트
                            </div>
                            <div class="card-body">
                                <div class="progress-item">
                                    <div>
                                        <div class="progress-label">신메뉴 개발 프로젝트</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 75%"></div>
                                        </div>
                                    </div>
                                    <div class="progress-value ms-3">75%</div>
                                </div>
                                <div class="progress-item">
                                    <div>
                                        <div class="progress-label">매장 리뉴얼 프로젝트</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 50%"></div>
                                        </div>
                                    </div>
                                    <div class="progress-value ms-3">50%</div>
                                </div>
                                <div class="progress-item">
                                    <div>
                                        <div class="progress-label">마케팅 캠페인</div>
                                        <div class="progress">
                                            <div class="progress-bar" style="width: 88%"></div>
                                        </div>
                                    </div>
                                    <div class="progress-value ms-3">88%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="col-lg-4">
                        <!-- Quick Actions -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="bi bi-lightning-fill me-2"></i>바로가기
                            </div>
                            <div class="card-body">
                                <div class="quick-actions">
                                    <a href="#" class="quick-action">
                                        <i class="bi bi-pencil-square"></i>
                                        <span>새 결재</span>
                                    </a>
                                    <a href="#" class="quick-action">
                                        <i class="bi bi-calendar-plus"></i>
                                        <span>일정 등록</span>
                                    </a>
                                    <a href="#" class="quick-action">
                                        <i class="bi bi-plus-circle"></i>
                                        <span>업무 생성</span>
                                    </a>
                                    <a href="#" class="quick-action">
                                        <i class="bi bi-envelope-plus"></i>
                                        <span>메일 작성</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Recent Notices -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="bi bi-megaphone-fill me-2"></i>최근 공지사항
                            </div>
                            <div class="card-body p-0">
                                <div class="notice-item">
                                    <a href="#" class="notice-title">[전사] 2025년 추석 연휴 근무 안내</a>
                                    <div class="notice-meta">
                                        <span>인사팀</span>
                                        <span>09-20</span>
                                    </div>
                                </div>
                                <div class="notice-item">
                                    <a href="#" class="notice-title">[개발팀] 서버 정기 점검 안내</a>
                                    <div class="notice-meta">
                                        <span>개발팀</span>
                                        <span>09-19</span>
                                    </div>
                                </div>
                                <div class="notice-item">
                                    <a href="#" class="notice-title">[인사] 하반기 워크샵 장소 투표</a>
                                    <div class="notice-meta">
                                        <span>인사팀</span>
                                        <span>09-18</span>
                                    </div>
                                </div>
                                <div class="notice-item">
                                    <a href="#" class="notice-title">[총무] 사무용품 신청 마감 안내</a>
                                    <div class="notice-meta">
                                        <span>총무팀</span>
                                        <span>09-17</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Team Status -->
                        <div class="card">
                            <div class="card-header">
                                <i class="bi bi-people-fill me-2"></i>팀 현황
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span>전체 팀원</span>
                                    <strong>12명</strong>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span>현재 접속</span>
                                    <strong>8명</strong>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span>휴가</span>
                                    <strong>1명</strong>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span>외근</span>
                                    <strong>2명</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
