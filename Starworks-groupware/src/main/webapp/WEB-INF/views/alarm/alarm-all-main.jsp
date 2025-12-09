<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 24.     	임가영            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

	<div id="main-content" style="padding: 2rem 10rem">
		<div class="page-heading">

			<div class="outline-section-4">
				<div class="outline-title">알림 모두 보기</div>
				<div class="outline-subtitle">받은 모든 알림을 한곳에서 확인할 수 있습니다.</div>
			</div>
		</div>

		<section class="section">
			<div class="card" style="min-height:680px">
				<div class="card-body">
					<div class="table-responsive">
						<table class="table table-bordered mb-0">
							<thead>
								<tr>
									<th class="text-center">번호</th>
									<th class="text-center">알림 카테고리</th>
									<th>알림 내용</th>
									<th>알림 상세 내용 </th>
									<th class="text-center">알림 수신 시각</th>
									<th class="text-center">바로가기</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach var="alarmLog" items="${alarmLogList }" varStatus="status">
									<tr>
										<td class="text-bold-500 text-center">${status.count }</td>
										<td class="text-center">${alarmLog.alarmCategory }</td>
										<td class="text-bold-500">${fn:substringBefore(alarmLog.alarmMessage, '<br/>') }</td>
										<td >${fn:substringAfter(alarmLog.alarmMessage, '<br/>') }</td>
										<td class="text-center">${fn:replace(fn:substring(alarmLog.createdDt, 0, 16), 'T', ' ')}</td>
										<td>
											<a href="${alarmLog.relatedUrl }">
											<div class="text-center">
												<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi-box-arrow-up-right" viewBox="0 0 16 16">
												  <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
												  <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
												</svg>
											</div>
											</a>
										</td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	</div>

<script>
	const pTags = document.querySelectorAll("p");
	pTags.forEach((p) => {
		p.classList.remove("notification-subtitle", "text-sm")
		p.classList.add("mb-0")
	})
</script>
</body>
</html>