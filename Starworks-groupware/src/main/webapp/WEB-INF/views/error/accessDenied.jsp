<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *	2025. 10.25.		홍현택			최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Access Denied</title>
<%@ include file="/WEB-INF/fragments/preStyle.jsp" %>
</head>
<body>
<script>
	Swal.fire({
		  icon: "error",
		  title: "접근 권한 없음",
		  text: "${message}",
		  showConfirmButton: true
		}).then((result) => {
			if (result.isConfirmed) {
				history.back();
			}
		});
</script>
</body>
</html>