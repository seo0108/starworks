
<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 9. 27.     	홍현택           로그인한 유저정보 출력
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
<link rel="stylesheet" href="/css/header.css">
<header class="mb-2">
	<security:authorize access="isAuthenticated()">
		<security:authentication property="principal" var="userDetails" />
		<security:authentication property="authorities" var="authorities" />
		<security:authentication property="details" var="webDetails" />
		<security:authentication property="principal.realUser" var="realUser" />
		<!-- HEADER -->
		<nav class="navbar navbar-expand navbar-light navbar-top">
		<div class="container-fluid">
			<a href="#" class="burger-btn d-block d-xl-none"> <i
				class="bi bi-justify fs-3"></i>
			</a>
			<div class="header-title">안녕하세요, ${realUser.userNm }님! 🌟</div>
			<div class="header-actions">
				  <!-- 아이콘 묶음 (네모칸 중앙정렬) -->
				  <div class="icon-grid">
				    <!-- 프로젝트 아이콘 -->
				    <a href="/projects/main" class="icon-box" data-bs-toggle="tooltip" data-bs-placement="bottom" title="프로젝트 바로가기">
				      <i class="fa-regular fa-folder"></i>
				    </a>

				    <!-- 전자결재 아이콘 -->
				    <a href="/approval/main" class="icon-box" data-bs-toggle="tooltip" data-bs-placement="bottom" title="전자결재 바로가기">
				      <i class="fa-solid fa-pen"></i>
				    </a>

				    <!-- 달력 아이콘 -->
				    <a href="/calendar/depart" class="icon-box" data-bs-toggle="tooltip" data-bs-placement="bottom" title="일정관리 바로가기">
				      <i class="fa-regular fa-calendar-days"></i>
				    </a>

				    <!-- 메일 아이콘 -->
				    <a href="/mail/list" class="icon-box" data-bs-toggle="tooltip" data-bs-placement="bottom" title="전자메일 바로가기">
				      <i class="fa-solid fa-envelope"></i>
				    </a>
				  </div>

					<ul class="navbar-nav ms-auto mb-lg-0 notification" id="notification-ul">
					<!-- 알림 드롭다운 -->
					<li class="nav-item dropdown me-2">
							 <a id="notificationIcon" class="nav-link active dropdown-toggle show" href="#" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="true">
								   <i class="fa-regular fa-bell fa-lg" style="font-size:1.5em;"></i>
								</a>

                            <ul class="dropdown-menu dropdown-center shadow-lg dropdown-menu-sm-end notification-dropdown" aria-labelledby="dropdownMenuButton">
 	                            <li class="dropdown-header">
 	                                <h6>Notifications</h6>
 	                            </li>

 	                            <li>
 	                            	<div id="notification-div">
 	                            	<!-- 알림 목록이 들어갈 공간 -->
									</div>
								 </li>

								 <li>
					                <a href="/alarm/all"><p class="text-center py-2 mb-0">알림 모두 보기</p></a>
					             </li>
	                        </ul>
                        </li>
                    </ul>

					<div class="dropdown">
					    <a href="#" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="true">
					        <div class="user-profile">
					            <c:choose>
					                <c:when test="${empty realUser.userImgFileId }">
					                    <img src="/images/faces/1.jpg" alt="기본 이미지" class="user-avatar" />
					                </c:when>
					                <c:otherwise>
					                    <img src="${realUser.filePath }" alt="프로필 이미지" class="user-avatar" />
					                </c:otherwise>
					            </c:choose>
					            <div class="user-info">
					                <h6>${realUser.userNm }</h6>
					                <p style="font-size:0.9rem">${realUser.deptNm } ${realUser.jbgdNm }</p>
					            </div>
					        </div>
					    </a>

					    <ul class="dropdown-menu dropdown-menu-end shadow-lg user-dropdown-menu" aria-labelledby="dropdownMenuButton">

					        <!-- 메뉴 아이템 -->
					        <div class="user-dropdown-body">
					            <li>
					                <a class="user-dropdown-item" href="/mypage">
					                    <i class="bi bi-person"></i> 마이페이지
					                </a>
					            </li>
					            <li>
					                <a class="user-dropdown-item" href="#">
					                    <i class="bi bi-gear"></i> 설정
					                </a>
					            </li>

					            <li><hr class="user-dropdown-divider"></li>

					            <li>
					                <a class="user-dropdown-item logout" href="/logout">
					                    <i class="bi bi-box-arrow-left"></i> 로그아웃
					                </a>
					            </li>
					        </div>
					    </ul>
					</div>
				</div>
			</div>
	</nav>
	</security:authorize>
</header>
