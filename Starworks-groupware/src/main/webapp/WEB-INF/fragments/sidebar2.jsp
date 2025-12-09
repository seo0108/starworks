<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<div id="sidebar" class="active">
	<div class="sidebar-wrapper active">
		<div class="sidebar-header">
			<div class="d-flex justify-content-between align-items-center">
				<div class="logo">
					<a href="<c:url value='/' />">Starbucks GW</a>
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

				<li class="sidebar-item"><a href="#" class='sidebar-link'>
						<i class="bi bi-envelope-fill"></i> <span>전자메일</span>
				</a></li>

				<li class="sidebar-item has-sub ${currentMenu == 'approval' ? 'active' : ''}"><a href="#" class='sidebar-link'>
						<i class="bi bi-file-earmark-check-fill"></i> <span>전자결재</span>
				</a>
				<ul class="submenu ${currentMenu == 'approval' ? 'active' : ''}">
					<li class="submenu-item ${currentSubMenu == 'myApprovals' ? 'active' : ''}"><a href="<c:url value='/approval/main'/>">내 결재</a></li>
					<li class="submenu-item ${currentSubMenu == 'drafts' ? 'active' : ''}"><a href="<c:url value='/approval/drafts'/>">임시저장</a></li>
					<li class="submenu-item ${currentSubMenu == 'archive' ? 'active' : ''}"><a href="<c:url value='/approval/archive'/>">보관함</a></li>
				</ul>
			</li>

				<li class="sidebar-item has-sub ${currentMenu == 'project' ? 'active' : ''}"><a href="#" class='sidebar-link'>
						<i class="bi bi-grid-fill"></i> <span>프로젝트</span>
				</a>
				<ul class="submenu ${currentMenu == 'project' ? 'active' : ''}">
					<li class="submenu-item ${currentSubMenu == 'main' ? 'active' : ''}"><a href="<c:url value='/project/main'/>">메인</a></li>
					<li class="submenu-item ${currentSubMenu == 'list' ? 'active' : ''}"><a href="<c:url value='/project/list'/>">목록</a></li>
					<li class="submenu-item ${currentSubMenu == 'myproject' ? 'active' : ''}"><a href="<c:url value='/project/myproject'/>">내 프로젝트</a></li>
					<li class="submenu-item ${currentSubMenu == 'create' ? 'active' : ''}"><a href="<c:url value='/project/create'/>">생성</a></li>
					<li class="submenu-item ${currentSubMenu == 'detail' ? 'active' : ''}"><a href="<c:url value='/project/detail'/>">상세</a></li>
					<li class="submenu-item ${currentSubMenu == 'edit' ? 'active' : ''}"><a href="<c:url value='/project/edit'/>">수정</a></li>
					<li class="submenu-item ${currentSubMenu == 'archive' ? 'active' : ''}"><a href="<c:url value='/project/archive'/>">보관함</a></li>
				</ul>
				</li>

				<li class="sidebar-item has-sub ${currentMenu == 'document' ? 'active' : ''}"><a href="#" class='sidebar-link'>
						<i class="bi bi-archive-fill"></i> <span>문서함</span>
				</a>
				<ul class="submenu ${currentMenu == 'document' ? 'active' : ''}">
					<li class="submenu-item ${currentSubMenu == 'list' ? 'active' : ''}"><a href="<c:url value='/document/list'/>">목록</a></li>
					<li class="submenu-item ${currentSubMenu == 'upload' ? 'active' : ''}"><a href="<c:url value='/document/upload'/>">업로드</a></li>
				</ul>
				</li>

				<li class="sidebar-item has-sub ${currentMenu == 'calendar' ? 'active' : ''}"><a href="#" class='sidebar-link'>
						<i class="bi bi-calendar-event-fill"></i> <span>상품관리</span>
				</a></li>
				
				<li class="sidebar-item"><a href="#" class='sidebar-link'>
						<i class="bi bi-calendar-event-fill"></i> <span>일정관리</span>
				</a>
				<ul class="submenu ${currentMenu == 'calendar' ? 'active' : ''}">
					<li class="submenu-item ${currentSubMenu == 'depart' ? 'active' : ''}"><a href="<c:url value='/calendar/depart'/>">부서 일정</a></li>
					<li class="submenu-item ${currentSubMenu == 'team' ? 'active' : ''}"><a href="<c:url value='/calendar/team'/>">팀 일정</a></li>
				</ul>
				</li>

				<li class="sidebar-item has-sub ${currentMenu == 'attendance' ? 'active' : ''}"><a href="#" class='sidebar-link'>
						<i class="bi bi-clock-fill"></i> <span>근태관리</span>
				</a>
				<ul class="submenu ${currentMenu == 'attendance' ? 'active' : ''}">
					<li class="submenu-item ${currentSubMenu == 'main' ? 'active' : ''}"><a href="<c:url value='/attendance/main'/>">메인</a></li>
				</ul>
				</li>

				<li class="sidebar-item has-sub ${currentMenu == 'orgchart' ? 'active' : ''}"><a href="#" class='sidebar-link'>
						<i class="bi bi-people-fill"></i> <span>조직도</span>
				</a>
				<ul class="submenu ${currentMenu == 'orgchart' ? 'active' : ''}">
					<li class="submenu-item ${currentSubMenu == 'user' ? 'active' : ''}"><a href="<c:url value='/orgchart/user'/>">사용자</a></li>
					<li class="submenu-item ${currentSubMenu == 'userV2' ? 'active' : ''}"><a href="<c:url value='/orgchart/user/v2'/>">사용자 V2</a></li>
				</ul>
				</li>

				<li class="sidebar-item has-sub ${currentMenu == 'community' ? 'active' : ''}"><a href="#" class='sidebar-link'>
						<i class="bi bi-rss-fill"></i> <span>사내 커뮤니티</span>
				</a>
				<ul class="submenu ${currentMenu == 'community' ? 'active' : ''}">
					<li class="submenu-item ${currentSubMenu == 'board' ? 'active' : ''}"><a href="<c:url value='/community/board'/>">게시판</a></li>
					<li class="submenu-item ${currentSubMenu == 'boardDetail' ? 'active' : ''}"><a href="<c:url value='/community/board/detail'/>">게시글 상세</a></li>
					<li class="submenu-item ${currentSubMenu == 'boardCreate' ? 'active' : ''}"><a href="<c:url value='/community/board/create'/>">게시글 작성</a></li>
					<li class="submenu-item ${currentSubMenu == 'notice' ? 'active' : ''}"><a href="<c:url value='/community/notice'/>">공지사항</a></li>
				</ul>
				</li>

				<li class="sidebar-item"><a href="http://localhost:5173" class='sidebar-link' target="_blank">
						<i class="bi bi-gear-fill"></i> <span>관리자페이지</span>
				</a></li>
			</ul>
		</div>
		<button class="sidebar-toggler btn x">
			<i data-feather="x"></i>
		</button>
	</div>
</div>
