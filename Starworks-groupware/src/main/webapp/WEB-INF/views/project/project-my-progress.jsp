<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>진행 중인 프로젝트</title>
<link rel="stylesheet" href="/css/project.css">
<link rel="stylesheet" href="/css/project-timeline.css">
</head>
<body>
	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/project/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">진행 중인 프로젝트</div>
					<div class="outline-subtitle">내가 담당하거나 참여 중인 [승인대기, 진행, 보류]
						상태의 프로젝트를 시간순으로 확인합니다.</div>
				</div>


				<section class="section">
					<div class="card">
						<div class="card-body p-4">

							<!-- 타임라인 섹션 -->
							<div class="timeline-section-header">
								<h3 class="timeline-section-title">
									<i class="bi bi-calendar-week"></i>
									프로젝트 타임라인
								</h3>
								<p class="timeline-section-subtitle">프로젝트 일정을 한눈에 확인하세요</p>
							</div>

							<!-- 타임라인 컨테이너 -->
							<div class="timeline-container">
								<!-- 월별 헤더 -->
								<div class="timeline-header" id="timeline-header">
									<!-- JavaScript로 동적 생성 -->
								</div>

								<!-- 타임라인 그리드 -->
								<div class="timeline-grid" id="timeline-grid">
									<!-- 그리드 라인 -->
									<div class="timeline-grid-lines" id="timeline-grid-lines"></div>

									<!-- 프로젝트 바들은 JavaScript로 동적 생성 -->
									<c:if test="${empty projectList}">
										<div class="timeline-empty">
											<i class="bi bi-calendar-x"></i>
											<p>현재 진행 중인 프로젝트가 없습니다.</p>
										</div>
									</c:if>
								</div>

								<!-- 범례 -->
								<div class="timeline-legend" id="timeline-legend">
									<!-- JavaScript로 동적 생성 -->
								</div>
							</div>

							<!-- 카드 그리드 섹션 -->
							<div class="card-grid-header">
								<h3 class="card-grid-title">
									<i class="bi bi-grid-3x3-gap"></i>
									프로젝트 목록
								</h3>
							</div>

							<!-- 카드 그리드 컨테이너 -->
							<div class="card-grid-container">
								<div class="project-cards-grid" id="card-grid">
									<!-- JavaScript로 동적 생성 -->
								</div>
							</div>

							<!-- 페이지네이션 -->
							<div id="pagination-container"
								class="d-flex justify-content-center mt-4">${pagingHTML}</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>

	<!-- JavaScript 파일들 -->
	<script>
		// 서버에서 전달받은 프로젝트 데이터를 JavaScript 변수로 변환
		window.serverProjectData = [
			<c:forEach items="${projectList}" var="project" varStatus="status">
				{
					bizId: '${project.bizId}',
					bizNm: '${fn:escapeXml(project.bizNm)}',
					bizSttsCd: '${project.bizSttsCd}',
					strtBizDt: '${project.strtBizDt}',
					endBizDt: '${project.endBizDt}',
					bizPrgrs: ${project.bizPrgrs},
					members: [
						<c:forEach items="${project.members}" var="member" varStatus="memberStatus">
							{
								bizUserNm: '${fn:escapeXml(member.bizUserNm)}',
								filePath: '${not empty member.filePath ? member.filePath : "/images/faces/1.jpg"}'
							}<c:if test="${!memberStatus.last}">,</c:if>
						</c:forEach>
					]
				}<c:if test="${!status.last}">,</c:if>
			</c:forEach>
		];

		console.log('서버 프로젝트 데이터:', window.serverProjectData);
	</script>

	<script src="/js/projects/project-timeline.js"></script>
</body>
</html>
