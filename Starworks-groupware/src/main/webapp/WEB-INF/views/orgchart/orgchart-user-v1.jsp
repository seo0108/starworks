<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>조직도 - Mazer Admin Dashboard</title>

<!--     <link rel="preconnect" href="https://fonts.gstatic.com"> -->
<!--     <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet"> -->
<!--     <link rel="stylesheet" href="mazer-1.0.0/dist/assets/css/bootstrap.css"> -->
<!--     <link rel="stylesheet" href="mazer-1.0.0/dist/assets/vendors/bootstrap-icons/bootstrap-icons.css"> -->
<!--     <link rel="stylesheet" href="mazer-1.0.0/dist/assets/css/app.css"> -->
<!--     <link rel="shortcut icon" href="assets/compiled/svg/favicon.svg" type="image/x-icon"> -->

<!-- >_<~~ --><!-- 어케하는거지 정답을 아ㅓㄹ려줘우어ㅓㅓ~!-->
<style>
:root {
	--theme-primary: #006241;
	--theme-secondary: #D4E9E2;
	--theme-light: #F0FDF4;
	--theme-dark: #1E3932;
}

.page-heading, .section {
	margin-left: auto;
	margin-right: auto;
	max-width: 1200px;
}

.search-section {
	background: white;
	border-radius: .7rem;
	padding: 1.5rem;
	margin-bottom: 2rem;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-container {
	position: relative;
}

.search-input {
	padding-left: 50px;
	border-radius: 25px;
	border: 2px solid #e9ecef;
	height: 50px;
	font-size: 1rem;
	transition: all 0.3s ease;
}

.search-input:focus {
	border-color: var(--bs-primary);
	box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.search-icon {
	position: absolute;
	left: 18px;
	top: 50%;
	transform: translateY(-50%);
	color: #6c757d;
	font-size: 1.2rem;
	z-index: 5;
}

.search-filters {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	margin-top: 1rem;
}

.filter-btn {
	padding: 0.5rem 1rem;
	border: 1px solid #dce7f1;
	background: white;
	color: var(--bs-body-color);
	border-radius: 20px;
	cursor: pointer;
	transition: all 0.3s ease;
	font-size: 0.9rem;
	text-decoration: none;
}

.filter-btn:hover, .filter-btn.active {
	background: var(--bs-primary);
	color: white;
	border-color: var(--bs-primary);
	text-decoration: none;
}

.org-container {
	background: white;
	border-radius: .7rem;
	box-shadow: var(--bs-card-box-shadow, -8px 12px 18px 0 rgba(25, 42, 70, .13));
	overflow: hidden;
}

.org-header {
	background: var(--bs-card-cap-bg, white);
	color: var(--bs-body-color);
	padding: 1.5rem 1.5rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #eee;
}

.org-title {
	margin: 0;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1.2rem;
}

.view-controls {
	display: flex;
	gap: 0.5rem;
}

.view-btn {
	background: var(--bs-light);
	border: 1px solid #dce7f1;
	color: var(--bs-body-color);
}

.view-btn:hover, .view-btn.active {
	background: var(--bs-primary);
	color: white;
	border-color: var(--bs-primary);
}

.org-tree {
	padding: 1.5rem;
	max-height: 70vh;
	overflow-y: auto;
}

.tree-node {
	margin-bottom: 0.5rem;
}

.tree-node ul {
	list-style: none;
	padding-left: 0;
	margin: 0;
}

.tree-node>ul {
	padding-left: 2rem;
	position: relative;
}

.tree-node>ul::before {
	content: '';
	position: absolute;
	left: 1rem;
	top: 0;
	bottom: 2rem;
	width: 2px;
	background: #e9ecef;
}

.tree-node>ul>li::before {
	content: '';
	position: absolute;
	left: -1rem;
	top: 1.5rem;
	width: 1rem;
	height: 2px;
	background: #e9ecef;
}

.tree-node>ul>li {
	position: relative;
}

.dept-item {
	background: #f8f9fa;
	border-radius: 12px;
	padding: 1rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
	border-left: 4px solid #e9ecef;
	position: relative;
}

.dept-item:hover {
	background: #e9ecef;
	border-left-color: var(--bs-primary);
	transform: translateX(3px);
}

.dept-item.expanded {
	border-left-color: var(--bs-primary);
}

.dept-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.dept-info {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex: 1;
}

.dept-icon {
	width: 40px;
	height: 40px;
	background: var(--bs-primary);
	color: white;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.2rem;
}

.dept-details h6 {
	margin: 0 0 0.25rem 0;
	font-weight: 600;
	color: var(--bs-body-color);
}

.dept-meta {
	font-size: 0.85rem;
	color: #6c757d;
}

.expand-btn {
	background: transparent;
	border: none;
	color: var(--bs-primary);
	font-size: 1.2rem;
	cursor: pointer;
	transition: transform 0.3s ease;
	padding: 0.25rem;
	border-radius: 50%;
}

.expand-btn:hover {
	background: rgba(var(--bs-primary-rgb), 0.1);
}

.expand-btn.expanded {
	transform: rotate(90deg);
}

.employee-list {
	margin-top: 1rem;
	display: none;
}

.employee-list.show {
	display: block;
}

.employee-item {
	background: white;
	border: 1px solid #e9ecef;
	border-radius: 10px;
	padding: 0.75rem;
	margin-bottom: 0.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.employee-item:hover {
	border-color: var(--bs-primary);
	box-shadow: 0 2px 8px rgba(var(--bs-primary-rgb), 0.15);
	transform: translateY(-1px);
}

.employee-info {
	flex: 1;
}

.employee-name {
	font-weight: 600;
	margin-bottom: 0.25rem;
	color: var(--bs-body-color);
}

.employee-position {
	font-size: 0.85rem;
	color: #6c757d;
}

.employee-status {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.status-badge {
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
	border-radius: 12px;
	font-weight: 500;
	flex-shrink: 0;
}

.status-working {
	background: var(--bs-blue-100);
	color: var(--bs-blue-800);
}

.status-vacation {
	background: var(--bs-yellow-100);
	color: var(--bs-yellow-800);
}

.status-business {
	background: var(--bs-green-100);
	color: var(--bs-green-800);
}

.quick-actions {
	display: flex;
	gap: 0.25rem;
}

.action-btn {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	border: none;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.9rem;
}

.action-chat {
	background: var(--bs-blue-100);
	color: var(--bs-blue);
}

.action-email {
	background: var(--bs-orange-100);
	color: var(--bs-orange);
}

.action-btn:hover {
	transform: scale(1.1);
}

.card-view {
	display: none;
	padding: 1.5rem;
}

.card-view.active {
	display: block;
}

.employee-card {
	background: white;
	border: 1px solid #e9ecef;
	border-radius: .7rem;
	padding: 1.5rem;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.employee-card:hover {
	border-color: var(--bs-primary);
	transform: translateY(-3px);
	box-shadow: 0 8px 25px rgba(var(--bs-primary-rgb), 0.15);
}

.card-name {
	font-size: 1.25rem;
	font-weight: 600;
	margin-bottom: 0.5rem;
	color: var(--bs-body-color);
}

.card-position {
	color: #6c757d;
	margin-bottom: 0.75rem;
}

.card-dept {
	font-size: 0.9rem;
	color: var(--bs-primary);
	margin-bottom: 1rem;
}

.card-actions {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
}

.modal-header-custom {
	background: var(--bs-primary);
	color: white;
}

.loading {
	text-align: center;
	padding: 2rem;
	color: #6c757d;
}

.loading-spinner {
	width: 40px;
	height: 40px;
	border: 4px solid #f3f3f3;
	border-top: 4px solid var(--bs-primary);
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin: 0 auto 1rem;
}

@
keyframes spin {
0% {
	transform: rotate(0deg);
}

100
%
{
transform
:
rotate(
360deg
);
}
}
.highlight {
	background-color: yellow;
	padding: 0.1rem 0.2rem;
	border-radius: 3px;
}

.empty-state {
	text-align: center;
	padding: 3rem 1rem;
	color: #6c757d;
}

.empty-icon {
	font-size: 4rem;
	margin-bottom: 1rem;
	opacity: 0.3;
}

.favorite-btn {
	background: none;
	border: none;
	color: #ffc107;
	font-size: 1.2rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.favorite-btn:hover {
	transform: scale(1.1);
}

.favorite-btn.active {
	color: #ff9800;
}
</style>
</head>

<body>
	<div id="main-content">
		<div class="page-heading">
			<div class="page-title">
				<div class="row">
					<div class="col-12 col-md-6 order-md-1 order-last">
						<h3>조직도</h3>
						<p class="text-subtitle text-muted">우리 회사의 조직 구조와 구성원 정보를
							확인하세요</p>
					</div>
					<div class="col-12 col-md-6 order-md-2 order-first">
						<nav aria-label="breadcrumb"
							class="breadcrumb-header float-start float-lg-end">
							<ol class="breadcrumb">
								<li class="breadcrumb-item"><a href="index.html">Dashboard</a></li>
								<li class="breadcrumb-item active" aria-current="page">조직도</li>
							</ol>
						</nav>
					</div>
				</div>
			</div>
		</div>

		<section class="section">
			<div class="card">
				<div class="card-body">
					<div class="search-container">
						<i class="bi bi-search search-icon"></i> <input type="text"
							class="form-control search-input" id="searchInput"
							placeholder="이름, 부서, 직급으로 검색하세요...">
					</div>

					<div class="search-filters">
						<a href="#" class="filter-btn active" data-filter="all">전체</a> <a
							href="#" class="filter-btn" data-filter="dept">부서별</a> <a
							href="#" class="filter-btn" data-filter="position">직급별</a> <a
							href="#" class="filter-btn" data-filter="status">상태별</a> <a
							href="#" class="filter-btn" data-filter="favorites">즐겨찾기</a>
					</div>
				</div>
			</div>

			<div class="card org-container">
				<div class="card-header org-header">
					<h5 class="org-title">
						<i class="bi bi-building"></i> 스타웍스
					</h5>
					<div class="view-controls">
						<button class="btn btn-sm view-btn active" data-view="tree">
							<i class="bi bi-diagram-2"></i> 트리뷰
						</button>
						<button class="btn btn-sm view-btn" data-view="card">
							<i class="bi bi-grid"></i> 카드뷰
						</button>
					</div>
				</div>

				<div class="card-body">
					<!-- 트리 뷰 -->
					<div class="org-tree" id="treeView">
						<div class="loading">
							<div class="loading-spinner"></div>
							<p>조직도를 불러오는 중...</p>
						</div>
					</div>

					<!-- 카드 뷰 -->
					<div class="card-view" id="cardView">
						<div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4"
							id="employeeCards">
							<!-- 카드들이 여기에 동적으로 생성됩니다 -->
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>

	<!-- 직원 상세 정보 모달 -->
	<div class="modal fade" id="employeeModal" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered modal-lg">
			<div class="modal-content">
				<div class="modal-header modal-header-custom">
					<h5 class="modal-title">
						<i class="bi bi-person-circle"></i> 직원 정보
					</h5>
					<button type="button" class="btn-close btn-close-white"
						data-bs-dismiss="modal"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-4 text-center">
							<div class="avatar avatar-xl mx-auto mb-3" id="modalAvatar">
								<span class="avatar-content bg-primary rounded-circle"
									id="modalInitial"></span>
							</div>
							<button class="favorite-btn" id="favoriteBtn" title="즐겨찾기">
								<i class="bi bi-star"></i>
							</button>
						</div>
						<div class="col-md-8">
							<div class="row">
								<div class="col-md-6">
									<div class="detail-section">
										<div class="detail-label">이름</div>
										<div class="detail-value" id="modalName">-</div>

										<div class="detail-label">직급</div>
										<div class="detail-value" id="modalPosition">-</div>

										<div class="detail-label">부서</div>
										<div class="detail-value" id="modalDepartment">-</div>
									</div>
								</div>
								<div class="col-md-6">
									<div class="detail-section">
										<div class="detail-label">전화번호</div>
										<div class="detail-value" id="modalPhone">-</div>

										<div class="detail-label">이메일</div>
										<div class="detail-value" id="modalEmail">-</div>

										<div class="detail-label">현재 상태</div>
										<div class="detail-value">
											<span class="status-badge" id="modalStatus">-</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-bs-dismiss="modal">닫기</button>
					<button type="button" class="btn btn-primary" id="emailBtn">
						<i class="bi bi-envelope"></i> 이메일 보내기
					</button>
					<button type="button" class="btn btn-info" id="chatBtn">
						<i class="bi bi-chat-dots"></i> 메시지 보내기
					</button>
				</div>
			</div>
		</div>
	</div>

	<script>
        const organizationData = [
            {
                id: 1,
                name: "CEO",
                employees: [
                    { id: 101, name: "홍길동", position: "대표이사", phone: "010-1111-1111", email: "ceo@starbucks.kr", status: "근무중", department: "CEO"}
                ],
                subDepartments: [
                    {
                        id: 2,
                        name: "경영관리본부",
                        employees: [
                            { id: 201, name: "김영희", position: "본부장", phone: "010-2222-2222", email: "kim@starbucks.kr", status: "근무중", department: "경영관리본부"}
                        ],
                        subDepartments: [
                            {
                                id: 4,
                                name: "인사팀",
                                employees: [
                                    { id: 401, name: "박철수", position: "팀장", phone: "010-4444-4444", email: "park@starbucks.kr", status: "근무중", department: "인사팀"},
                                    { id: 402, name: "이하나", position: "대리", phone: "010-4444-5555", email: "leehn@starbucks.kr", status: "휴가", department: "인사팀"},
                                    { id: 403, name: "정민수", position: "사원", phone: "010-4444-6666", email: "jung@starbucks.kr", status: "근무중", department: "인사팀"}
                                ],
                                subDepartments: []
                            },
                            {
                                id: 5,
                                name: "총무팀",
                                employees: [
                                    { id: 501, name: "최민준", position: "과장", phone: "010-5555-6666", email: "choi@starbucks.kr", status: "근무중", department: "총무팀"},
                                    { id: 502, name: "강서연", position: "사원", phone: "010-5555-7777", email: "kang@starbucks.kr", status: "출장", department: "총무팀"}
                                ],
                                subDepartments: []
                            }
                        ]
                    },
                    {
                        id: 3,
                        name: "매장운영본부",
                        employees: [
                            { id: 301, name: "정순이", position: "본부장", phone: "010-3333-3333", email: "jung@starbucks.kr", status: "출장", department: "매장운영본부"}
                        ],
                        subDepartments: [
                            {
                                id: 6,
                                name: "강남지점",
                                employees: [
                                    { id: 601, name: "윤지후", position: "점장", phone: "010-6666-7777", email: "yoon@starbucks.kr", status: "근무중", department: "강남지점"},
                                    { id: 602, name: "송가인", position: "부점장", phone: "010-6666-8888", email: "song@starbucks.kr", status: "근무중", department: "강남지점"},
                                    { id: 603, name: "김바리스타", position: "바리스타", phone: "010-6666-9999", email: "kim.barista@starbucks.kr", status: "근무중", department: "강남지점"}
                                ],
                                subDepartments: []
                            },
                            {
                                id: 7,
                                name: "홍대지점",
                                employees: [
                                    { id: 701, name: "이수진", position: "점장", phone: "010-7777-8888", email: "leesj@starbucks.kr", status: "근무중", department: "홍대지점"}
                                ],
                                subDepartments: []
                            }
                        ]
                    }
                ]
            }
        ];

        document.addEventListener('DOMContentLoaded', () => {
            const treeView = document.getElementById('treeView');
            const cardView = document.getElementById('cardView');
            const employeeCardsContainer = document.getElementById('employeeCards');
            const searchInput = document.getElementById('searchInput');
            const employeeModal = new bootstrap.Modal(document.getElementById('employeeModal'));
            const viewButtons = document.querySelectorAll('.view-btn');

            let allEmployees = [];
            let isCardViewRendered = false;

            function flattenDepts(depts) {
                let employeeList = [];
                depts.forEach(dept => {
                    employeeList = employeeList.concat(dept.employees);
                    if (dept.subDepartments && dept.subDepartments.length > 0) {
                        employeeList = employeeList.concat(flattenDepts(dept.subDepartments));
                    }
                });
                return employeeList;
            }

            function renderTree(departments, container) {
                const ul = document.createElement('ul');
                departments.forEach(dept => {
                    const li = document.createElement('li');
                    li.className = 'tree-node';
                    li.innerHTML = `
                        <div class="dept-item" data-dept-id="${dept.id}">
                            <div class="dept-header">
                                <div class="dept-info">
                                    <div class="dept-icon"><i class="bi bi-folder2-open"></i></div>
                                    <div class="dept-details">
                                        <h6>${dept.name}</h6>
                                        <span class="dept-meta">${dept.employees.length} 명</span>
                                    </div>
                                </div>
                                <button class="expand-btn"><i class="bi bi-chevron-right"></i></button>
                            </div>
                        </div>
                        <div class="employee-list"></div>
                    `;
                    if (dept.subDepartments && dept.subDepartments.length > 0) {
                        renderTree(dept.subDepartments, li);
                    }
                    ul.appendChild(li);
                });
                container.appendChild(ul);
            }

            function renderEmployee(employee, container) {
                const div = document.createElement('div');
                div.className = 'employee-item';
                div.dataset.employeeId = employee.id;
                div.innerHTML = `
                    <div class="avatar me-2">
                        <span class="avatar-content bg-primary rounded-circle">${employee.name.charAt(0)}</span>
                    </div>
                    <div class="employee-info">
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-position">${employee.position}</div>
                    </div>
                    <div class="employee-status">
                        <span class="status-badge status-${employee.status === '근무중' ? 'working' : (employee.status === '휴가' ? 'vacation' : 'business')}">${employee.status}</span>
                    </div>
                    <div class="quick-actions">
                        <button class="action-btn action-chat" title="메시지 보내기"><i class="bi bi-chat-dots"></i></button>
                    </div>
                `;
                container.appendChild(div);
            }

            function renderCardView(employees) {
                employeeCardsContainer.innerHTML = '';
                if (employees.length === 0) {
                    employeeCardsContainer.innerHTML = '<div class="col-12"><div class="empty-state"><i class="bi bi-search empty-icon"></i><p>검색 결과가 없습니다.</p></div></div>';
                    return;
                }
                employees.forEach(employee => {
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'col';
                    cardWrapper.innerHTML = `
                        <div class="card employee-card h-100">
                            <div class="card-body">
                                <div class="avatar avatar-xl mx-auto mb-3">
                                    <span class="avatar-content bg-primary rounded-circle">${employee.name.charAt(0)}</span>
                                </div>
                                <h5 class="card-name">${employee.name}</h5>
                                <p class="card-position text-muted">${employee.position}</p>
                                <p class="card-dept">${employee.department}</p>
                                <span class="status-badge status-${employee.status === '근무중' ? 'working' : (employee.status === '휴가' ? 'vacation' : 'business')}">${employee.status}</span>
                                <div class="card-actions mt-3">
                                    <button class="btn btn-outline-primary icon action-btn" title="메시지 보내기"><i class="bi bi-chat-dots"></i></button>
                                    <button class="btn btn-outline-info icon action-btn" title="이메일 보내기"><i class="bi bi-envelope"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    cardWrapper.querySelector('.employee-card').addEventListener('click', (e) => {
                        if (!e.target.closest('.action-btn')) { 
                            showEmployeeModal(employee);
                        }
                    });
                    employeeCardsContainer.appendChild(cardWrapper);
                });
            }

            setTimeout(() => {
                treeView.innerHTML = '';
                renderTree(organizationData, treeView);
                allEmployees = flattenDepts(organizationData);
            }, 500);

            treeView.addEventListener('click', e => {
                const deptItem = e.target.closest('.dept-item');
                if (deptItem) {
                    const deptId = parseInt(deptItem.dataset.deptId, 10);
                    const employeeList = deptItem.nextElementSibling;
                    const expandBtn = deptItem.querySelector('.expand-btn');

                    const findDept = (depts, id) => {
                        for (const dept of depts) {
                            if (dept.id === id) return dept;
                            if (dept.subDepartments) {
                                const found = findDept(dept.subDepartments, id);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    if (employeeList.classList.toggle('show')) {
                        deptItem.classList.add('expanded');
                        expandBtn.classList.add('expanded');
                        if (!employeeList.hasChildNodes()) {
                            const dept = findDept(organizationData, deptId);
                            if (dept) {
                                dept.employees.forEach(emp => renderEmployee(emp, employeeList));
                            }
                        }
                    } else {
                        deptItem.classList.remove('expanded');
                        expandBtn.classList.remove('expanded');
                    }
                }

                const empItem = e.target.closest('.employee-item');
                if(empItem) {
                    const empId = parseInt(empItem.dataset.employeeId, 10);
                    const employee = allEmployees.find(e => e.id === empId);
                    if(employee) showEmployeeModal(employee);
                }
            });

            viewButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const currentActive = document.querySelector('.view-btn.active');
                    if(currentActive) currentActive.classList.remove('active');
                    button.classList.add('active');

                    const view = button.dataset.view;
                    if (view === 'card') {
                        treeView.style.display = 'none';
                        cardView.style.display = 'block';
                        if (!isCardViewRendered) {
                            renderCardView(allEmployees);
                            isCardViewRendered = true;
                        }
                    } else {
                        cardView.style.display = 'none';
                        treeView.style.display = 'block';
                    }
                });
            });

            function showEmployeeModal(employee) {
                document.getElementById('modalName').textContent = employee.name;
                document.getElementById('modalPosition').textContent = employee.position;
                document.getElementById('modalDepartment').textContent = employee.department;
                document.getElementById('modalPhone').textContent = employee.phone;
                document.getElementById('modalEmail').textContent = employee.email;
                const statusBadge = document.getElementById('modalStatus');
                statusBadge.textContent = employee.status;
                statusBadge.className = `status-badge status-${employee.status === '근무중' ? 'working' : (employee.status === '휴가' ? 'vacation' : 'business')}`;
                document.getElementById('modalInitial').textContent = employee.name.charAt(0);
                employeeModal.show();
            }
        });
    </script>
</body>

</html>