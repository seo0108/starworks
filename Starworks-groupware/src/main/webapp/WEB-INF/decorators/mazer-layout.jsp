<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="_csrf" content="${_csrf.token}" />
<meta name="_csrf_header" content="${_csrf.headerName}" />
<title>STARWORK 그룹웨어</title>

<%@include file="/WEB-INF/fragments/preStyle.jsp"%>
<sitemesh:write property="head" />
</head>

<body>
	<script src="/dist/assets/static/js/initTheme.js"></script>
	<div id="app">
		<!-- [ SIDEBAR MENU ] Start-->
		<%@include file="/WEB-INF/fragments/sidebar.jsp"%>
<%-- 		<%@include file="/WEB-INF/fragments/sidebar3.jsp"%> --%>
		<!-- [ SIDEBAR MENU ] End -->
		<div id="main">

			<!-- [ HEADER ] START -->
			<%@include file="/WEB-INF/fragments/header.jsp"%>
			<!-- [ HEADER ] END -->

			<!-- [ MAIN CONTENT ] START -->

			<sitemesh:write property="body" />

			<!-- [ MAIN CONTENT ] END -->

		</div>
		<!-- [ FOOTER ] START -->
		<%@include file="/WEB-INF/fragments/footer.jsp"%>
		<!-- [ FOOTER ] END -->
	</div>
	</div>
	<%@include file="/WEB-INF/fragments/postScript.jsp"%>

	<!-- 2025. 09. 30 가영 추가 -->
	<c:if test="${not empty toastMessage }">
		<script>
			showToast("${icon}", "${toastMessage}");
		</script>
		<%-- 메시지 삭제 --%>
	    <c:remove var="toastMessage" scope="session"/>
	</c:if>
	<c:if test="${not empty alertMessage }">
		<script>
			showAlert("${icon}", "${alertMessage}");
		</script>
	</c:if>

	<!-- 2025.10.14 채팅 추가 (주민) -->
	<%@include file="/WEB-INF/views/groupware-chat.jsp"%>
	<!-- 2025.10.21 AI 채팅 추가 (어진) -->
	<%@include file="/WEB-INF/views/ai-chat.jsp"%>

</body>
</html>