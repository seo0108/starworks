<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>메인 대시보드 - 그룹웨어</title>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="mazer-1.0.0/dist/assets/css/bootstrap.css">
    <link rel="stylesheet" href="mazer-1.0.0/dist/assets/vendors/bootstrap-icons/bootstrap-icons.css">
    <link rel="stylesheet" href="mazer-1.0.0/dist/assets/css/app.css">
    <link rel="shortcut icon" href="assets/compiled/svg/favicon.svg" type="image/x-icon">

</head>

<body>
    <div id="app">
        <div id="sidebar" class="active">
            <div class="sidebar-wrapper active ps">
                <div class="sidebar-header">
                    <div class="d-flex justify-content-between">
                        <div class="logo"><a href="main.html">그룹웨어</a></div>
                        <div class="toggler"><a href="#" class="sidebar-hide d-xl-none d-block"><i class="bi bi-x bi-middle"></i></a></div>
                    </div>
                </div>
                <div class="sidebar-menu">
                     <ul class="menu">
                        <li class="sidebar-title">Menu</li>
                        <li class="sidebar-item"><a href="#" class='sidebar-link'><i class="bi bi-envelope-fill"></i><span>전자메일</span></a></li>
                        <li class="sidebar-item has-sub"><a href="#" class='sidebar-link'><i class="bi bi-file-earmark-check-fill"></i><span>전자결재</span></a>
							<ul class="submenu active">
                                <li class="submenu-item "><a href="approval.html">내 결재</a></li>
                                <li class="submenu-item "><a href="leave_request_v3.html">기안서 작성</a></li>
                                <li class="submenu-item "><a href="#">보관함</a></li>
                            </ul>
						</li>
                        <li class="sidebar-item has-sub active"><a href="#" class='sidebar-link'><i class="bi bi-grid-1x2-fill"></i><span>프로젝트 관리</span></a>
                            <ul class="submenu active">
                                <li class="submenu-item "><a href="project-list.html">전체 프로젝트</a></li>
                                <li class="submenu-item "><a href="my-projects2.html">내 프로젝트</a></li>
                                <li class="submenu-item"><a href="project-create.html">프로젝트 등록</a></li>
                                <li class="submenu-item "><a href="project-archive.html">보관함</a></li>
                            </ul>
                        </li>
						<li class="sidebar-item has-sub"><a href="document_archive_new.html" class='sidebar-link'><i class="bi bi-archive-fill"></i><span>문서 자료실</span></a>
							<ul class="submenu active">
                                <li class="submenu-item "><a href="document_archive_new.html">개인 자료실</a></li>
                                <li class="submenu-item "><a href="">부서 자료실</a></li>
                                <li class="submenu-item"><a href="">전사 자료실</a></li>
                            </ul>
						</li>
                        <li class="sidebar-item"><a href="#" class='sidebar-link'><i class="bi bi-calendar-event-fill"></i><span>일정관리</span></a></li>
                        <li class="sidebar-item"><a href="attendance_management.html" class='sidebar-link'><i class="bi bi-clock-fill"></i><span>근태관리</span></a></li>
                        <li class="sidebar-item"><a href="조직도.html" class='sidebar-link'><i class="bi bi-people-fill"></i><span>조직도</span></a></li>
                        <li class="sidebar-item"><a href="#" class='sidebar-link'><i class="bi bi-rss-fill"></i><span>커뮤니티</span></a></li>
                    </ul>
                </div>
                <button class="sidebar-toggler btn x"><i data-feather="x"></i></button>
            </div>
        </div>

        <div id="main">
            <header class="mb-3">
                <nav class="navbar navbar-expand navbar-light ">
                    <div class="container-fluid">
                        <a href="#" class="burger-btn d-block d-xl-none"><i class="bi bi-justify fs-3"></i></a>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li class="nav-item dropdown me-3">
                                    <a class="nav-link active dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class='bi bi-bell bi-sub fs-4 text-gray-600'></i>
                                    </a>
                                    <!-- Notification dropdown -->
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link active dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                        <div class="user-menu d-flex">
                                            <div class="user-name text-end me-3">
                                                <h6 class="mb-0 text-gray-600">홍길동</h6>
                                                <p class="mb-0 text-sm text-gray-600">개발팀</p>
                                            </div>
                                            <div class="user-img d-flex align-items-center">
                                                <div class="avatar avatar-md">
                                                    <img src="mazer-1.0.0/dist/assets/images/faces/1.jpg">
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <!-- User dropdown -->
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <div class="page-heading">
                <h3>안녕하세요, 홍길동님! 👋</h3>
                <p class="text-muted">오늘의 매장 소식과 업무를 확인하세요.</p>
            </div>
            <div class="page-content">
                <section class="row">
                    <div class="col-12 col-lg">
                        <div class="card kpi-card">
                            <div class="card-body">
                                <div class="kpi-icon" style="background-color: #ffc107;"><i class="bi bi-file-earmark-check-fill"></i></div>
                                <div>
                                    <h6 class="kpi-value">3</h6>
                                    <span class="kpi-text">결재 대기</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg">
                        <div class="card kpi-card">
                            <div class="card-body">
                                <div class="kpi-icon" style="background-color: #17a2b8;"><i class="bi bi-calendar-plus-fill"></i></div>
                                <div>
                                    <h6 class="kpi-value">12일</h6>
                                    <span class="kpi-text">남은 연차</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg">
                        <div class="card kpi-card">
                            <div class="card-body">
                                <div class="kpi-icon" style="background-color: var(--theme-primary);"><i class="bi bi-kanban-fill"></i></div>
                                <div>
                                    <h6 class="kpi-value">8</h6>
                                    <span class="kpi-text">진행중 프로젝트</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg">
                        <div class="card kpi-card">
                            <div class="card-body">
                                <div class="kpi-icon" style="background-color: #6f42c1;"><i class="bi bi-calendar-day-fill"></i></div>
                                <div>
                                    <h6 class="kpi-value">2</h6>
                                    <span class="kpi-text">오늘 일정</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg">
                        <div class="card kpi-card">
                            <div class="card-body">
                                <div class="kpi-icon" style="background-color: #dc3545;"><i class="bi bi-bell-fill"></i></div>
                                <div>
                                    <h6 class="kpi-value">5</h6>
                                    <span class="kpi-text">읽지 않은 알림</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="row">
                    <!-- Left Column: Personal Widgets -->
                    <div class="col-12 col-lg-4">
                        <!-- Calendar Widget -->
                        <div class="card widget-card">
                            <div class="card-header">
                                <h5 class="card-title"><i class="bi bi-calendar-check"></i>2025년 9월</h5>
                            </div>
                            <div class="card-body">
                                <div class="calendar">
                                    <table>
                                        <thead><tr><th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th></tr></thead>
                                        <tbody>
                                            <tr><td></td><td>1</td><td>2</td><td>3</td><td class="event">4</td><td>5</td><td>6</td></tr>
                                            <tr><td>7</td><td>8</td><td>9</td><td class="today">10</td><td>11</td><td>12</td><td class="todo">13</td></tr>
                                            <tr><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td class="event">19</td><td>20</td></tr>
                                            <tr><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td></tr>
                                            <tr><td>28</td><td>29</td><td>30</td><td>31</td><td></td><td></td><td></td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- Attendance Widget -->
                        <div class="card widget-card">
                            <div class="card-header"><h5 class="card-title"><i class="bi bi-clock-history"></i>내 근태 현황</h5></div>
                            <div class="card-body attendance-widget">
                                <div class="text-center mb-3">
                                    <p class="mb-1">출근: <span id="clock-in-time">--:--:--</span></p>
                                    <p class="mb-0">퇴근: <span id="clock-out-time">--:--:--</span></p>
                                </div>
                                <div class="d-grid gap-2 mb-3">
                                    <button class="btn btn-primary" id="clock-in-btn"><i class="bi bi-box-arrow-in-right"></i> 출근</button>
                                    <button class="btn btn-secondary" id="clock-out-btn" disabled><i class="bi bi-box-arrow-right"></i> 퇴근</button>
                                </div>
                                <hr>
                                <div class="total-hours text-center fs-4">
                                    <i class="bi bi-stopwatch"></i>
                                    <span id="total-hours">00:00:00</span>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Shortcuts -->
                        <div class="card widget-card">
                            <div class="card-header"><h5 class="card-title"><i class="bi bi-lightning-fill"></i>빠른 바로가기</h5></div>
                            <div class="card-body shortcuts">
                                <div class="row">
                                    <div class="col-4"><a href="project-create.html" class="shortcut-btn"><i class="bi bi-plus-square-dotted"></i><span>프로젝트</span></a></div>
                                    <div class="col-4"><a href="#" class="shortcut-btn"><i class="bi bi-send"></i><span>휴가 신청</span></a></div>
                                    <div class="col-4"><a href="#" class="shortcut-btn"><i class="bi bi-pencil-square"></i><span>결재 작성</span></a></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Center Column: Organizational Widgets -->
                    <div class="col-12 col-lg-5">
                        <!-- Announcement Board -->
                        <div class="card widget-card">
                            <div class="card-header"><h5 class="card-title"><i class="bi bi-megaphone-fill"></i>공지사항</h5></div>
                            <div class="card-body">
                                <div class="announcement-item">
                                    <div class="icon"><i class="bi bi-cup-straw"></i></div>
                                    <div class="content">
                                        <div class="title">신메뉴 '그린티 크림 프라푸치노' 출시!</div>
                                        <div class="date">2025.09.08</div>
                                    </div>
                                </div>
                                <div class="announcement-item">
                                    <div class="icon"><i class="bi bi-graph-up-arrow"></i></div>
                                    <div class="content">
                                        <div class="title">여름 시즌 프로모션 결과 보고</div>
                                        <div class="date">2025.09.05</div>
                                    </div>
                                </div>
                                <div class="announcement-item">
                                    <div class="icon"><i class="bi bi-shield-check"></i></div>
                                    <div class="content">
                                        <div class="title">위생 관리 및 내부 지침 안내</div>
                                        <div class="date">2025.09.02</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Ongoing Projects -->
                        <div class="card widget-card">
                            <div class="card-header"><h5 class="card-title"><i class="bi bi-kanban-fill"></i>진행 중인 프로젝트</h5></div>
                            <div class="card-body">
                                <div class="project-item">
                                    <div class="info">
                                        <span class="name">2025 하반기 마케팅 캠페인</span>
                                        <span class="manager">김철수</span>
                                    </div>
                                    <div class="progress"><div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div>
                                </div>
                                <div class="project-item">
                                    <div class="info">
                                        <span class="name">신규 원두 소싱 및 테스트</span>
                                        <span class="manager">이영희</span>
                                    </div>
                                    <div class="progress"><div class="progress-bar" role="progressbar" style="width: 40%" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div></div>
                                </div>
                                <div class="project-item">
                                    <div class="info">
                                        <span class="name">모바일 앱 리뉴얼</span>
                                        <span class="manager">박지성</span>
                                    </div>
                                    <div class="progress"><div class="progress-bar" role="progressbar" style="width: 90%" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Sales KPI -->
                        <div class="card widget-card">
                            <div class="card-header"><h5 class="card-title"><i class="bi bi-bar-chart-line-fill"></i>매출 KPI</h5></div>
                            <div class="card-body">
                                <canvas id="sales-chart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Support Widgets -->
                    <div class="col-12 col-lg-3">
                        <!-- Task Status -->
                        <div class="card widget-card">
                            <div class="card-header"><h5 class="card-title"><i class="bi bi-list-task"></i>업무 현황</h5></div>
                            <div class="card-body">
                                <canvas id="task-status-chart"></canvas>
                            </div>
                        </div>

                        <!-- Notifications Panel -->
                        <div class="card widget-card">
                            <div class="card-header"><h5 class="card-title"><i class="bi bi-bell-fill"></i>알림</h5></div>
                            <div class="card-body">
                                <div class="notification-item">
                                    <div class="icon"><i class="bi bi-file-earmark-check"></i></div>
                                    <div class="content">
                                        <strong>'휴가 신청서'</strong>가 승인되었습니다.
                                        <div class="time">방금 전</div>
                                    </div>
                                </div>
                                <div class="notification-item">
                                    <div class="icon"><i class="bi bi-chat-left-text"></i></div>
                                    <div class="content">
                                        <strong>김연아</strong>님이 <strong>'신규 원두...'</strong> 프로젝트에 댓글을 남겼습니다.
                                        <div class="time">15분 전</div>
                                    </div>
                                </div>
                                <div class="notification-item">
                                    <div class="icon"><i class="bi bi-megaphone"></i></div>
                                    <div class="content">
                                        새로운 공지사항 <strong>'신메뉴 출시'</strong>가 등록되었습니다.
                                        <div class="time">1시간 전</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Event Carousel -->
                        <div class="card widget-card overflow-hidden">
                            <div class="card-header">
                                <h5 class="card-title"><i class="bi bi-gift-fill"></i>이벤트 및 프로모션</h5>
                            </div>
                            <div class="card-body p-0">
                                <div id="eventCarousel" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        <div class="carousel-item active">
                                            <img src="1.jpg" class="d-block w-100" alt="Event Image 1">
                                        </div>
                                        <div class="carousel-item">
                                            <img src="2.jpg" class="d-block w-100" alt="Event Image 2">
                                        </div>
                                        <div class="carousel-item">
                                            <img src="3.jpg" class="d-block w-100" alt="Event Image 3">
                                        </div>
                                        <div class="carousel-item">
                                            <img src="4.jpg" class="d-block w-100" alt="Event Image 4">
                                        </div>
                                    </div>
                                    <button class="carousel-control-prev" type="button" data-bs-target="#eventCarousel" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#eventCarousel" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <script src="mazer-1.0.0/dist/assets/js/bootstrap.bundle.min.js"></script>
    <script src="mazer-1.0.0/dist/assets/vendors/chartjs/Chart.min.js"></script>
    <script src="assets/compiled/js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Sales Chart
            var salesCtx = document.getElementById('sales-chart').getContext('2d');
            var salesChart = new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['5월', '6월', '7월', '8월', '9월'],
                    datasets: [{
                        label: '월별 매출 (백만원)',
                        data: [52, 65, 78, 72, 85],
                        backgroundColor: 'rgba(0, 98, 65, 0.1)',
                        borderColor: 'rgba(0, 98, 65, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: 'rgba(0, 98, 65, 1)',
                        pointHoverRadius: 5,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: { legend: { display: false } }
                }
            });

            // Task Status Chart
            var taskStatusCtx = document.getElementById('task-status-chart').getContext('2d');
            var taskStatusChart = new Chart(taskStatusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['미시작', '진행중', '보류', '완료'],
                    datasets: [{
                        data: [5, 12, 3, 20],
                        backgroundColor: ['#6c757d', '#435ebe', '#ffc107', '#198754'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { boxWidth: 12 }
                        }
                    }
                }
            });

            // Attendance Widget Logic
            const clockInBtn = document.getElementById('clock-in-btn');
            const clockOutBtn = document.getElementById('clock-out-btn');
            const clockInTimeSpan = document.getElementById('clock-in-time');
            const clockOutTimeSpan = document.getElementById('clock-out-time');
            const totalHoursSpan = document.getElementById('total-hours');

            let clockInTime = null;
            let timerInterval = null;

            function formatTime(date) {
                return date.toTimeString().split(' ')[0];
            }

            function formatDuration(ms) {
                if (ms < 0) ms = 0;
                const seconds = Math.floor((ms / 1000) % 60);
                const minutes = Math.floor((ms / (1000 * 60)) % 60);
                const hours = Math.floor(ms / (1000 * 60 * 60));
                return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
            }

            clockInBtn.addEventListener('click', () => {
                const now = new Date();
                clockInTime = now.getTime();
                clockInTimeSpan.textContent = formatTime(now);
                clockOutTimeSpan.textContent = '--:--:--';
                
                clockInBtn.disabled = true;
                clockOutBtn.disabled = false;

                if (timerInterval) clearInterval(timerInterval);
                timerInterval = setInterval(() => {
                    const duration = Date.now() - clockInTime;
                    totalHoursSpan.textContent = formatDuration(duration);
                }, 1000);
            });

            clockOutBtn.addEventListener('click', () => {
                const now = new Date();
                clockOutTimeSpan.textContent = formatTime(now);
                
                clockOutBtn.disabled = true;
                clearInterval(timerInterval);
                timerInterval = null;
            });
        });
    </script>
    <!-- Chat Floating Button -->
<a href="#" id="chat-fab" class="btn btn-primary btn-lg rounded-pill shadow">
    <i class="bi bi-chat-dots-fill"></i>
</a>

<!-- Chat Container -->
<div id="chat-container" class="card shadow-lg">
    <div id="chat-list-view">
        <div class="card-header d-flex justify-content-between align-items-center" style="cursor: move;">
            <h5 class="card-title mb-0">메신저</h5>
            <div>
                <button id="add-1on1-chat-btn" class="btn btn-outline-primary btn-sm icon" data-bs-toggle="tooltip" title="1:1 채팅 추가"><i class="bi bi-person-plus"></i></button>
                <button id="add-group-chat-btn" class="btn btn-outline-primary btn-sm icon" data-bs-toggle="tooltip" title="그룹채팅 추가"><i class="bi bi-people"></i></button>
                <button id="close-chat-btn" class="btn btn-sm icon" data-bs-toggle="tooltip" title="닫기"><i class="bi bi-x-lg"></i></button>
            </div>
        </div>
        <div class="card-body" id="chat-list-container" style="max-height: 400px; overflow-y: auto;">
            <!-- Chat list items will be dynamically inserted here -->
        </div>
    </div>

    <div id="chat-room-view" style="display: none; flex-direction: column; height: 100%;">
        <div class="card-header d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <button id="back-to-chat-list-btn" class="btn btn-sm me-2"><i class="bi bi-arrow-left"></i></button>
                <div class="avatar me-2" id="chat-room-avatar-wrapper">
                    <img src="mazer-1.0.0/dist/assets/images/faces/1.jpg" alt="User Avatar" id="chat-room-avatar">
                    <span id="chat-room-status" class="avatar-status bg-success"></span>
                </div>
                <div class="name">
                    <h6 class="mb-0" id="chat-room-name">Chat Room</h6>
                </div>
            </div>
            <button id="close-chat-room-btn" class="btn btn-sm"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="card-body pt-4 bg-light" id="chat-room-messages" style="flex-grow: 1; overflow-y: auto;">
            <div class="chat-content">
                <!-- Chat messages will be dynamically inserted here -->
            </div>
        </div>
        <div class="card-footer">
            <div class="message-form d-flex align-items-center">
                <div class="d-flex flex-grow-1 me-2">
                    <input type="text" class="form-control" placeholder="Type your message..">
                </div>
                <button class="btn btn-primary"><i class="bi bi-send"></i> 전송</button>
            </div>
        </div>
    </div>
</div>

<!-- Organization Chart Modal -->
<div class="modal fade" id="org-chart-modal-chat" tabindex="-1" aria-labelledby="orgChartModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="orgChartModalLabelChat">사용자 선택</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="chat-org-chart" id="org-chart-container-chat"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
                <button type="button" class="btn btn-primary" id="confirm-chat-selection-btn">선택 완료</button>
            </div>
        </div>
    </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Mock Data
    const mockChatRooms = [
        { id: 1, name: '개발팀 전체', avatar: null, lastMessage: '네 확인했습니다. 내일까지 전달 드릴게요.', time: '10:45', unread: 2, type: 'group', messages: [{sender: 'other', text: '시안 검토 부탁드립니다.'}, {sender: 'me', text: '네 확인했습니다. 내일까지 전달 드릴게요.'}] },
        { id: 2, name: '김철수', avatar: 'mazer-1.0.0/dist/assets/images/faces/2.jpg', lastMessage: '점심 같이 드실래요?', time: '10:30', unread: 0, type: '1on1', messages: [{sender: 'other', text: '점심 같이 드실래요?'}] },
        { id: 3, name: '디자인팀', avatar: null, lastMessage: '시안 공유드립니다.', time: '09:15', unread: 0, type: 'group', messages: [{sender: 'other', text: '시안 공유드립니다.'}] },
        { id: 4, name: '박지성', avatar: 'mazer-1.0.0/dist/assets/images/faces/4.jpg', lastMessage: '파일 확인 부탁드립니다.', time: '어제', unread: 1, type: '1on1', messages: [{sender: 'other', text: '파일 확인 부탁드립니다.'}] },
    ];

    const orgDataChat = {
        '경영지원팀': [
            { id: 'user1', name: '홍길동', avatar: 'mazer-1.0.0/dist/assets/images/faces/1.jpg' },
        ],
        '개발팀': {
            '프론트엔드': [
                { id: 'user2', name: '김철수', avatar: 'mazer-1.0.0/dist/assets/images/faces/2.jpg' },
                { id: 'user3', name: '이영희', avatar: 'mazer-1.0.0/dist/assets/images/faces/3.jpg' },
            ],
            '백엔드': [
                { id: 'user4', name: '박지성', avatar: 'mazer-1.0.0/dist/assets/images/faces/4.jpg' },
                { id: 'user5', name: '김연아', avatar: 'mazer-1.0.0/dist/assets/images/faces/5.jpg' },
            ]
        }
    };

    // DOM Elements
    const chatFab = document.getElementById('chat-fab');
    const chatContainer = document.getElementById('chat-container');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatListView = document.getElementById('chat-list-view');
    const chatRoomView = document.getElementById('chat-room-view');
    const chatListContainer = document.getElementById('chat-list-container');
    const backToChatListBtn = document.getElementById('back-to-chat-list-btn');
    const closeChatRoomBtn = document.getElementById('close-chat-room-btn');
    const add1on1Btn = document.getElementById('add-1on1-chat-btn');
    const addGroupBtn = document.getElementById('add-group-chat-btn');
    const orgChartModalEl = document.getElementById('org-chart-modal-chat');
    const orgChartModal = new bootstrap.Modal(orgChartModalEl);
    const orgChartContainer = document.getElementById('org-chart-container-chat');
    const confirmSelectionBtn = document.getElementById('confirm-chat-selection-btn');
    let chatSelectionMode = '1on1';

    // Render chat list
    function renderChatList() {
        chatListContainer.innerHTML = '';
        mockChatRooms.forEach(room => {
            const roomEl = document.createElement('div');
            roomEl.className = 'chat-list-item';
            roomEl.dataset.roomId = room.id;

            let avatarHtml = '';
            if (room.type === 'group') {
                avatarHtml = 
                    `<div class="avatar me-3 bg-light-secondary">
                        <span class="avatar-content"><i class="bi bi-people-fill"></i></span>
                    </div>`;
            } else {
                avatarHtml = 
                    `<div class="avatar me-3">
                        <img src="${room.avatar}" alt="avatar" style="width:40px; height:40px;">
                        <span class="avatar-status bg-success"></span>
                    </div>`;
            }

            roomEl.innerHTML = 
                `${avatarHtml}
                <div class="chat-info">
                    <h6 class="name mb-0">${room.name}</h6>
                    <p class="last-message mb-0">${room.lastMessage}</p>
                </div>
                <div class="chat-meta">
                    <p class="time mb-1">${room.time}</p>
                    ${room.unread > 0 ? `<span class="badge bg-danger rounded-pill unread-count">${room.unread}</span>` : ''}
                </div>
            `;
            roomEl.addEventListener('click', () => openChatRoom(room.id));
            chatListContainer.appendChild(roomEl);
        });
    }

    // Open a chat room
    function openChatRoom(roomId) {
        const room = mockChatRooms.find(r => r.id === parseInt(roomId));
        if (!room) return;

        document.getElementById('chat-room-name').textContent = room.name;
        const avatarWrapper = document.getElementById('chat-room-avatar-wrapper');
        
        if (room.type === 'group') {
            avatarWrapper.innerHTML = `<div class="avatar bg-light-secondary"><span class="avatar-content"><i class="bi bi-people-fill"></i></span></div>`;
        } else {
            avatarWrapper.innerHTML = `<img src="${room.avatar}" alt="User Avatar" id="chat-room-avatar"><span id="chat-room-status" class="avatar-status bg-success"></span>`;
        }
        
        const messagesContainer = document.querySelector('#chat-room-messages .chat-content');
        messagesContainer.innerHTML = '';
        room.messages.forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.className = 'chat' + (msg.sender === 'me' ? ' chat-left' : '');
            msgEl.innerHTML = 
                `<div class="chat-body"><div class="chat-message">
                    	${msg.text}
                    </div></div>`;
            messagesContainer.appendChild(msgEl);
        });

        chatListView.style.display = 'none';
        chatRoomView.style.display = 'flex';
    }

    // Populate organization chart
    function populateChatOrgChart() {
        orgChartContainer.innerHTML = '';
        const inputType = chatSelectionMode === '1on1' ? 'radio' : 'checkbox';
        
        function createEmployeeCheckbox(user) {
            return 
                `<li class="employee">
                    <div class="form-check">
                        <input class="form-check-input" type="${inputType}" name="chatUser" value="${user.id}" id="chat-user-${user.id}">
                        <label class="form-check-label" for="chat-user-${user.id}">
                            <img src="${user.avatar}" alt="${user.name}">
                            ${user.name}
                        </label>
                    </div>
                </li>`;
        }

        function buildChatOrgChart(data) {
            let html = '<ul>';
            for (const key in data) {
                html += '<li>';
                html += 
                    `<div class="form-check department">
                        <input type="checkbox" class="form-check-input">
                        <label class="form-check-label">${key}</label>
                     </div>`;
                if (Array.isArray(data[key])) {
                    html += '<ul>' + data[key].map(createEmployeeCheckbox).join('') + '</ul>';
                } else {
                    html += buildChatOrgChart(data[key]);
                }
                html += '</li>';
            }
            html += '</ul>';
            return html;
        }
        orgChartContainer.innerHTML = buildChatOrgChart(orgDataChat);
    }

    // Event Listeners
    chatFab.addEventListener('click', (e) => {
        e.preventDefault();
        if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
            chatContainer.style.display = 'flex';
            chatRoomView.style.display = 'none';
            chatListView.style.display = 'block';
            renderChatList();
        } else {
            chatContainer.style.display = 'none';
        }
    });

    closeChatBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });
    
    closeChatRoomBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });

    backToChatListBtn.addEventListener('click', () => {
        chatRoomView.style.display = 'none';
        chatListView.style.display = 'block';
    });

    add1on1Btn.addEventListener('click', () => {
        chatSelectionMode = '1on1';
        document.getElementById('orgChartModalLabelChat').textContent = '1:1 채팅 상대 선택';
        populateChatOrgChart();
        orgChartModal.show();
    });

    addGroupBtn.addEventListener('click', () => {
        chatSelectionMode = 'group';
        document.getElementById('orgChartModalLabelChat').textContent = '그룹 채팅 상대 선택';
        populateChatOrgChart();
        orgChartModal.show();
    });

    confirmSelectionBtn.addEventListener('click', () => {
        console.log(`Creating ${chatSelectionMode} chat`);
        orgChartModal.hide();
    });
    
    // Make chat container draggable
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const chatHeader = document.querySelector("#chat-container #chat-list-view .card-header");
    if (chatHeader) {
        chatHeader.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        chatContainer.style.top = (chatContainer.offsetTop - pos2) + "px";
        chatContainer.style.left = (chatContainer.offsetLeft - pos1) + "px";
        chatContainer.style.bottom = 'auto';
        chatContainer.style.right = 'auto';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});
</script>
</body>

</html>