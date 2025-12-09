<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<link rel="preconnect" href="https://fonts.gstatic.com">
<link
	href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap"
	rel="stylesheet">
<link rel="stylesheet" href="mazer-1.0.0/dist/assets/css/bootstrap.css">
<link rel="stylesheet"
	href="mazer-1.0.0/dist/assets/vendors/bootstrap-icons/bootstrap-icons.css">
<link rel="stylesheet"
	href="mazer-1.0.0/dist/assets/vendors/perfect-scrollbar/perfect-scrollbar.css">
<link rel="stylesheet" href="mazer-1.0.0/dist/assets/css/app.css">
<link rel="shortcut icon"
	href="mazer-1.0.0/dist/assets/images/favicon.svg" type="image/x-icon">


	<div id="app">
		<div id="sidebar" class="active">
			<div class="sidebar-wrapper active">
				<div class="sidebar-header">
					<div class="d-flex justify-content-between">
						<div class="logo">
							<a href="index.html"><img
								src="mazer-1.0.0/dist/assets/images/logo/logo.png" alt="Logo"
								srcset=""></a>
						</div>
						<div class="toggler">
							<a href="#" class="sidebar-hide d-xl-none d-block"><i
								class="bi bi-x bi-middle"></i></a>
						</div>
					</div>
				</div>
				<div class="sidebar-menu">
					<ul class="menu">
						<li class="sidebar-title">Menu</li>
						<li class="sidebar-item"><a href="index.html"
							class='sidebar-link'> <i class="bi bi-grid-fill"></i> <span>Dashboard</span>
						</a></li>
						<li class="sidebar-item active has-sub"><a href="#"
							class='sidebar-link'> <i class="bi bi-pen-fill"></i> <span>전자결재</span>
						</a>
							<ul class="submenu active">
								<li class="submenu-item "><a href="approvalMain_v2.html">결재
										홈</a></li>
								<li class="submenu-item "><a href="approvalDrafts.html">임시저장</a></li>
								<li class="submenu-item "><a href="approvalArchive.html">보관함</a></li>
							</ul></li>
					</ul>
				</div>
				<button class="sidebar-toggler btn x">
					<i data-feather="x"></i>
				</button>
			</div>
		</div>
		<div id="main" class="layout-navbar">
			<header class='mb-3'>
				<nav class="navbar navbar-expand navbar-light ">
					<div class="container-fluid">
						<a href="#" class="burger-btn d-block"> <i
							class="bi bi-justify fs-3"></i>
						</a>
						<div class="collapse navbar-collapse" id="navbarSupportedContent">
							<ul class="navbar-nav ms-auto mb-2 mb-lg-0">
								<li class="nav-item dropdown me-3"><a
									class="nav-link active dropdown-toggle" href="#"
									data-bs-toggle="dropdown" aria-expanded="false"> <i
										class='bi bi-bell bi-sub fs-4 text-gray-600'></i>
								</a>
									<ul class="dropdown-menu dropdown-menu-end"
										aria-labelledby="dropdownMenuButton">
										<li><h6 class="dropdown-header">Notifications</h6></li>
										<li><a class="dropdown-item">No notification
												available</a></li>
									</ul></li>
							</ul>
							<div class="dropdown">
								<a href="#" data-bs-toggle="dropdown" aria-expanded="false">
									<div class="user-menu d-flex">
										<div class="user-name text-end me-3">
											<h6 class="mb-0 text-gray-600">김차장</h6>
											<p class="mb-0 text-sm text-gray-600">인사팀</p>
										</div>
										<div class="user-img d-flex align-items-center">
											<div class="avatar avatar-md">
												<img src="mazer-1.0.0/dist/assets/images/faces/1.jpg">
											</div>
										</div>
									</div>
								</a>
								<ul class="dropdown-menu dropdown-menu-end"
									aria-labelledby="dropdownMenuButton">
									<li><a class="dropdown-item" href="#"><i
											class="icon-mid bi bi-person me-2"></i> My Profile</a></li>
									<li><hr class="dropdown-divider"></li>
									<li><a class="dropdown-item" href="#"><i
											class="icon-mid bi bi-box-arrow-left me-2"></i> Logout</a></li>
								</ul>
							</div>
						</div>
					</div>
				</nav>
			</header>
			<div id="main-content">

				<div class="page-heading">
					<div class="page-title">
						<div class="row">
							<div class="col-12 col-md-6 order-md-1 order-last">
								<h3>지출결의서</h3>
								                    <p class="text-subtitle">결재 문서 상세내용입니다.</p>							</div>
							<div class="col-12 col-md-6 order-md-2 order-first">
								<nav aria-label="breadcrumb"
									class="breadcrumb-header float-start float-lg-end">
									<ol class="breadcrumb">
										<li class="breadcrumb-item"><a href="index.html">전자결재</a></li>
										<li class="breadcrumb-item active" aria-current="page">지출결의서</li>
									</ol>
								</nav>
							</div>
						</div>
					</div>

					<section class="section">
						<div class="row">
							<div class="col-12 col-lg-8">
								<div class="card">
									<div class="card-body">
										<div class="form-group mb-3">
											<h4 class="card-title">지출결의서</h4>
										</div>
										<div class="form-group mb-3">
											<div class="border p-3">
												<!-- Document content from expense_report_form.html, but as static text -->
												<table
													style="width: 800px; border-collapse: collapse !important; color: black; background: white; border: 1px solid black; font-size: 12px; font-family: malgun gothic, dotum, arial, tahoma;">
													<tbody>
														<tr>
															<td
																style="padding: 3px; border: 1px solid black; height: 90px !important; font-size: 27px; font-weight: bold; text-align: center; vertical-align: middle;"
																colspan="2">지출결의서<br>(통신비 지원)
															</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: top; border: 1px solid black; text-align: right;"
																colspan="4">[결재선]</td>
														</tr>
														<tr>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">기안부서</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">인사팀</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">기
																안 일</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">2025-09-18</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">문서번호</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left; font-size: 12px;">EXP-20250918-001</td>
														</tr>
														<tr>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">기
																안 자</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">김차장</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">보존년한</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">5년</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">비밀등급</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">일반</td>
														</tr>
													</tbody>
												</table>
												<table
													style="width: 800px; border-collapse: collapse; border-spacing: 0px; border: 1px solid black;">
													<tbody>
														<tr>
															<td
																style="padding: 0px !important; height: 10px; vertical-align: middle; border: 1px solid black; font-size: 9px;"><p
																	style="font-family: &amp; quot; 맑은 고딕&amp;quot;; font-size: 7pt; line-height: 14px; margin-top: 0px; margin-bottom: 0px;">
																	<br>
																</p></td>
														</tr>
													</tbody>
												</table>
												<table
													style="width: 800px; border-collapse: collapse !important; color: black; background: white; border: 1px solid black; font-size: 12px; font-family: malgun gothic, dotum, arial, tahoma;">
													<tbody>
														<tr>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">제
																&nbsp;&nbsp;&nbsp; 목</td>
															<td
																style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">지출결의서
																(통신비 지원)</td>
														</tr>
														<tr>
															<td
																style="padding: 3px; vertical-align: top; border: 0px solid black;"
																colspan="2"
																class="dext_table_border_t dext_table_border_r dext_table_border_b dext_table_border_l">
																<br>
																<table
																	style="width: 770px; margin: 9px; border-collapse: collapse !important; color: black; background: white; border: 2px solid black; font-size: 12px; font-family: &amp; quot;malgun gothic&amp;quot;, dotum, arial, tahoma;">
																	<tbody>
																		<tr>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: font-weight: bold;"
																				colspan="4">신청자 정보</td>
																		</tr>
																		<tr>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">팀/그룹</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">인사팀</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">성명</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">김차장</td>
																		</tr>
																		<tr>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">사번</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">2021001</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">직위</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">차장</td>
																		</tr>
																		<tr>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">연락처</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">010-1234-5678</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">신청일</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;">2025-09-18</td>
																		</tr>
																	</tbody>
																</table> <br>
																<table
																	style="width: 770px; margin: 9px; color: black; background: white; border: 2px solid black; font-size: 12px; font-family: &amp; quot; malgun gothic&amp;quot; , dotum , arial, tahoma; border-collapse: collapse !important;">
																	<tbody>
																		<tr>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">팀/그룹</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">사원번호</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">직위/성명</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">휴대폰번호</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">지원금액</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;">비고</td>
																		</tr>
																		<tr>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center;">인사팀</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center;">2021001</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center;">차장/김차장</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center;">010-1234-5678</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: right;">50,000</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;"></td>
																		</tr>
																		<tr>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;"
																				colspan="4">합계</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: right; font-weight: bold;">50,000</td>
																			<td
																				style="padding: 3px; height: 20px; vertical-align: middle; border: 1px solid black; text-align: left;"></td>
																		</tr>
																		<tr>
																			<td
																				style="padding: 3px; height: 40px; vertical-align: middle; border: 1px solid black; text-align: center; font-weight: bold;"
																				colspan="6"><br>- 지원대상 : 팀장 및 및 그룹장, 지원대상
																				팀원(할부금, 개인 물품구입대, 유료 부가서비스 등 제외)<br>
																			<br></td>
																		</tr>
																	</tbody>
																</table> <br>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
										<div class="form-group mb-3">
											<label for="file-display" class="form-label">첨부 파일</label>
											<div id="file-display">
												<a href="#">증빙자료.zip</a>
											</div>
										</div>
									</div>
								</div>
								<div class="card">
									<div class="card-header">
										<h5 class="card-title">결재 정보</h5>
									</div>
									<div class="card-body">
										<ul class="list-group list-group-flush">
											<li class="list-group-item">
												<div class="d-flex w-100 justify-content-between">
													<h6 class="mb-1">
														김차장 (기안) <span class="badge bg-primary">상신</span>
													</h6>
													<small>2025-09-18 09:30</small>
												</div>
												<p class="mb-1">결재를 요청합니다.</p>
											</li>
											<li class="list-group-item">
												<div class="d-flex w-100 justify-content-between">
													<h6 class="mb-1">
														이부장 (결재) <span class="badge bg-success">승인</span>
													</h6>
													<small>2025-09-18 10:05</small>
												</div>
												<p class="mb-1">확인했습니다.</p>
											</li>
											<li class="list-group-item">
												<div class="d-flex w-100 justify-content-between">
													<h6 class="mb-1">
														박대표 (결재) <span class="badge bg-light-secondary">대기</span>
													</h6>
													<small>-</small>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="col-12 col-lg-4">
								<div class="card">
									<div class="card-header">
										<h5 class="card-title">결재선</h5>
									</div>
									<div class="card-body">
										<table class="table table-bordered approval-line-table">
											<tbody>
												<tr>
													<th class="text-center" style="width: 80px;">기안</th>
													<td>
														<div class="d-flex align-items-center">
															<div class="avatar me-2">
																<img src="mazer-1.0.0/dist/assets/images/faces/1.jpg"
																	alt="Face 1">
															</div>
															<div>
																<p class="mb-0 fw-bold">김차장</p>
																                                        <p class="mb-0 text-sm">인사팀</p>															</div>
														</div>
													</td>
												</tr>
												<tr>
													<th class="text-center">결재</th>
													<td>
														<div class="d-flex align-items-center mb-2">
															<div class="avatar avatar-sm me-2">
																<img src="mazer-1.0.0/dist/assets/images/faces/2.jpg"
																	alt="Face">
															</div>
															<div>
																<p class="mb-0 fw-bold">
																	이부장 <span class="badge bg-success">승인</span>
																</p>
																                                        <p class="mb-0 text-sm">경영지원팀</p>																<small class="text-muted">2025-09-18 10:05</small>
															</div>
														</div>
														<div class="d-flex align-items-center">
															<div class="avatar avatar-sm me-2">
																<img src="mazer-1.0.0/dist/assets/images/faces/3.jpg"
																	alt="Face">
															</div>
															<div>
																<p class="mb-0 fw-bold">
																	박대표 <span class="badge bg-light-secondary">대기</span>
																</p>
																                                        <p class="mb-0 text-sm">대표이사</p>															</div>
														</div>
													</td>
												</tr>
												<tr>
													<th class="text-center">합의</th>
													<td>
														<div class="d-flex align-items-center">
															<div class="avatar avatar-sm me-2">
																<img src="mazer-1.0.0/dist/assets/images/faces/4.jpg"
																	alt="Face">
															</div>
															<div>
																<p class="mb-0 fw-bold">
																	윤회계 <span class="badge bg-success">승인</span>
																</p>
																                                        <p class="mb-0 text-sm">회계팀</p>																<small class="text-muted">2025-09-18 09:45</small>
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
									<div class="card-footer d-flex justify-content-end">
										<button type="button" class="btn btn-light-secondary me-1">회수</button>
										<button type="button" class="btn btn-light-secondary me-1">전결</button>
										<button type="button" class="btn btn-danger me-1">반려</button>
										<button type="button" class="btn btn-primary">승인</button>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>

	<script
		src="mazer-1.0.0/dist/assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js"></script>
	<script src="mazer-1.0.0/dist/assets/js/bootstrap.bundle.min.js"></script>
	<script src="mazer-1.0.0/dist/assets/js/main.js"></script>

