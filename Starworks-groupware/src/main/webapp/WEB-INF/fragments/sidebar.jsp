<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>

<script>
  (function() {
    const savedScroll = sessionStorage.getItem("sidebarScroll");
    if (savedScroll) {
      // DOM이 다 그려지기 전에 복원할 수 있도록 저장
      window._sidebarSavedScroll = savedScroll;
    }
  })();
</script>


<!-- Sidebar -->
<div id="sidebar" class="active">
	<div class="sidebar-wrapper active">
<!-- 		<div class="sidebar-scroll"> -->
			<div class="sidebar-header">
				<div class="logo">
					<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27"
						fill="currentColor" class="bi-grid-3x3-gap-fill"
						viewBox="0 0 16 16">
			  			<path
							d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" />
						</svg>
					<!-- 			<i>STARWORK</i> -->

					<div class="sidebar-toggler  x">
						<a href="#" class="sidebar-hide d-xl-none d-block"> <i
							class="bi bi-x bi-middle"></i>
						</a>
					</div>
				</div>
			</div>

			<div class="sidebar-menu" id="sidebarMenu">
				<div class="menu-section">
					<div class="menu-item ${currentMenu == 'dashboard' ? 'active' : ''}">
						<a href="<c:url value='/'/>"
							class="menu-link ${currentMenu == 'dashboard' ? 'active' : ''}">
							<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
								fill="currentColor" class="bi-house-fill" viewBox="0 0 16 16">
					  			<path
									d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
					  			<path
									d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
								</svg>
							<p>메인화면</p>
						</a>
					</div>
				</div>

				<!-- 프로젝트 관리 -->
				<div class="menu-section">
					<div
						class="menu-item has-submenu ${currentMenu == 'projects' ? 'active' : ''}"  data-menu="projects">
						<a href="/projects/main"
							class="menu-link submenu-toggle ${currentMenu == 'projects' ? 'active' : ''}">
							<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
								fill="currentColor" class="bi-folder-fill" viewBox="0 0 16 16">
	        					<path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z" />
	      						</svg>
							<p>프로젝트</p>
						</a>

<!-- 						서브메뉴: hover 시 오른쪽에 뜨도록 -->
<!-- 						<ul class="submenu"> -->
<!-- 							<li><a href="/projects/main">나의 업무</a></li> -->
<!-- 							<li><a href="/projects/my/progress">나의 프로젝트 현황</a></li> -->
<!-- 							<li><a href="/projects/all">전사 프로젝트</a></li> -->
<!-- 						</ul> -->
					</div>
				</div>


				<!-- 전자결재 -->
				<div class="menu-section">
					<div class="menu-item ${currentMenu == 'approval' ? 'active' : ''}" data-menu="approval">
						<a href="<c:url value='/approval/main'/>"
							class="menu-link ${currentMenu == 'approval' ? 'active' : ''}">
							<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
								fill="currentColor" class="bi-pen-fill" viewBox="0 0 16 16">
					  			<path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001" />
							</svg>
							<p>전자결재</p>
						</a>

					</div>
				</div>

				<!-- 일정관리 -->
				<div class="menu-section">
					<div class="menu-item has-submenu" data-menu="calendar">
						<a href="<c:url value='/calendar/depart'/>"
							class="menu-link ${currentMenu == 'calendar' ? 'active' : ''}">
							<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
								fill="currentColor" class="bi-calendar-fill" viewBox="0 0 16 16">
					  			<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5" />
							</svg>
							<p>일정관리</p>
						</a>

					</div>
				</div>

				<!-- 근태현황 -->
				<div class="menu-section">
					<div class="menu-item has-submenu ${currentMenu == 'attendance' ? 'active' : ''}" data-menu="attendance">
						<a href="<c:url value='/attendance/main'/>"
							class="menu-link ${currentMenu == 'attendance' ? 'active' : ''}">
							<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
								fill="currentColor" class="bi-clock-fill" viewBox="0 0 16 16">
					  			<path
									d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
								</svg>
							<p>근태현황</p>
						</a>
					</div>
				</div>

				<!-- 전자메일 -->
				<div class="menu-section">
					<div class="menu-item">
						<a href="/mail/list"
							class="menu-link ${currentMenu == 'mail' ? 'active' : ''}"> <svg
								xmlns="http://www.w3.org/2000/svg" width="23" height="23"
								fill="currentColor" class="bi-envelope-fill" viewBox="0 0 16 16">
				 				 <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
							</svg>
							<p>전자메일</p>
						</a>
					</div>
				</div>

				<!-- 회의 -->
				<div class="menu-section">
					<div class="menu-item" ${currentMenu == 'meeting' ? 'active' : ''}>
						<a href="<c:url value='/meeting/main'/>"
							class="menu-link ${currentMenu == 'meeting' ? 'active' : ''}">
							<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
								fill="currentColor" class="bi-person-workspace"
								viewBox="0 0 16 16">
					  			<path
									d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
					  			<path
									d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
							</svg>
							<p>회의</p>
						</a>
					</div>
				</div>

				<!-- 상품 관리 -->
				<div class="menu-section">
					<div class="menu-item has-submenu ${currentMenu == 'products' ? 'active' : ''}" data-menu="products">
						<a href="<c:url value='/products'/>"
							class="menu-link ${currentMenu == 'products' ? 'active' : ''}"
							data-feature-id="M009-01"> <svg
								xmlns="http://www.w3.org/2000/svg" width="23" height="23"
								fill="currentColor" class="bi-box-fill" viewBox="0 0 16 16">
					  <path fill-rule="evenodd"
									d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z" />
					</svg>
							<p>상품관리</p>
						</a>
					</div>
				</div>

				<!-- 조직도 -->
				<div class="menu-section">
					<div class="menu-item" ${currentMenu == 'orgchart' ? 'active' : ''}>
						<a href="<c:url value='/orgchart/user'/>"
							class="menu-link ${currentMenu == 'orgchart' ? 'active' : ''}"
							role="button" data-feature-id="M007"> <svg
								xmlns="http://www.w3.org/2000/svg" width="23" height="23"
								fill="currentColor" class="bi-diagram-3-fill"
								viewBox="0 0 16 16">
					  <path fill-rule="evenodd"
									d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5z" />
					</svg>
							<p>조직도</p>
						</a>
					</div>
				</div>

				<!-- 자료실 -->
				<div class="menu-section">
					<div class="menu-item" ${currentMenu == 'documents' ? 'active' : ''}>
						<a href="<c:url value='/document/user'/>"
							class="menu-link ${currentMenu == 'documents' ? 'active' : ''}">
							<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
								fill="currentColor" class="bi-file-text-fill"
								viewBox="0 0 16 16">
					 		 	<path
									d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1" />
								</svg>
							<p>자료실</p>
						</a>
					</div>
				</div>

				<!-- 사내 커뮤니티 -->
				<div class="menu-section">
					<div class="menu-item  has-submenu" data-menu="community">
						<a href="<c:url value='/board/notice'/>"
							class="menu-link ${currentMenu == 'community' ? 'active' : ''}" >
							<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23"
								fill="currentColor" class="bi-chat-fill" viewBox="0 0 16 16">
					  			<path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15" />
							</svg>
							<p>커뮤니티</p>
						</a>
					</div>
				</div>

				<!-- 관리자 페이지-->
				<!-- 이동url 수정 현택추가(10.20) -->
				<div class="menu-section">
					<div class="menu-item">
						<a href="http://localhost:5173/admin" class="menu-link"
							target="_blank"> <svg xmlns="http://www.w3.org/2000/svg"
								width="23" height="23" fill="currentColor"
								class="bi-person-lines-fill" viewBox="0 0 16 16">
					  <path
									d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
					</svg>
							<p>관리자</p>
						</a>
					</div>
				</div>

			</div>
		</div>

	</div>

<ul id="submenu-projects" class="submenu">
  <li><a href="/projects/main">나의 업무</a></li>
  <li><a href="/projects/my/progress">나의 프로젝트 현황</a></li>
  <li><a href="/projects/all">전체 프로젝트</a></li>
</ul>

<ul id="submenu-approval" class="submenu">
	<li><a href="/projects/main">전자결재 홈</a></li>
	<li><a href="/projects/my/progress">임시저장함</a></li>
	<li><a href="/projects/all">개인보관함</a></li>
	<li><a href="/projects/all">부서보관함</a></li>
</ul>

<ul id="submenu-calendar" class="submenu">
	<li><a href="/calendar/depart">부서 일정</a></li>
	<li><a href="/calendar/team">프로젝트팀 일정</a></li>
</ul>

<ul id="submenu-attendance" class="submenu">
	<li><a href="/attendance/main">개인 근태현황</a></li>
	<li><a href="/attendance/depart">부서 근태현황</a></li>
</ul>

<ul id="submenu-products" class="submenu">
	<li><a href="/products">판매중인 상품 관리</a></li>
	<li><a href="/products/proposals">신메뉴 품의 관리</a></li>
</ul>

<ul id="submenu-community" class="submenu">
	<li><a href="/board/notice">공지사항</a></li>
	<li><a href="/board/community">자유게시판</a></li>
</ul>

<script>
  const sidebar = document.querySelector(".sidebar-wrapper");
  if (window._sidebarSavedScroll) {
    sidebar.scrollTop = window._sidebarSavedScroll;
  }

  sidebar.addEventListener("scroll", () => {
    sessionStorage.setItem("sidebarScroll", sidebar.scrollTop);
  });

  document.addEventListener('DOMContentLoaded', () => {
	  document.querySelectorAll('.menu-item.has-submenu').forEach(item => {
	    const submenuId = 'submenu-' + item.dataset.menu;
	    const submenu = document.getElementById(submenuId);
	    if (!submenu) return;

	    let hideTimeout;

	    const showSubmenu = () => {
	      clearTimeout(hideTimeout);

	      // 현재 rect, scroll 값 계산 (스크롤 반영)
	      const rect = item.getBoundingClientRect();
	      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

	      submenu.style.top = rect.top + scrollTop  + 50 + 'px';
	      submenu.style.left = rect.right + scrollLeft + 'px';
	      submenu.classList.add('show');
	    };

	    const hideSubmenu = () => {
	      hideTimeout = setTimeout(() => {
	        // 마우스가 item이나 submenu 내부에 있으면 닫지 않음
	        if (!item.matches(':hover') && !submenu.matches(':hover')) {
	          submenu.classList.remove('show');
	        }
	      }, 100); // 0.1초 딜레이
	    };

	    item.addEventListener('mouseenter', showSubmenu);
	    item.addEventListener('mouseleave', hideSubmenu);
	    submenu.addEventListener('mouseenter', showSubmenu);
	    submenu.addEventListener('mouseleave', hideSubmenu);
	  });
	});


</script>