<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 13.     		홍현택            최초 생성
 *	2025. 10. 13. 			홍현택			파일 업로드 추가
 *	2025. 10. 14.			홍현택			답장, 전달 추가
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="jakarta.tags.functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body>
	<!-- 		<div id="main-content"> -->
	<!-- 		<div class="outline-section"> -->
	<!-- 			<div class="outline-title">전자메일</div> -->
	<!-- 			<div class="outline-subtitle">오늘의 매장 소식과 업무를 확인하세요.</div> -->
	<!-- 		</div> -->

	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<!--편지함 네비게이터 부분 -->
			<%@include file="/WEB-INF/views/mail/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">
				<div class="outline-section">
					<div class="outline-title">전자메일</div>
					<div class="outline-subtitle">오늘의 매장 소식과 업무를 확인하세요.</div>
				</div>

				<div class="page-content">
					<section class="section">
						<div class="row">
							<div class="col-12">
								<div class="card" style="min-height: 680px;">
									<div class="card-body px-5">
										<div class="row">

											<div class="col-md-12" id="email-dynamic-content-area">
												<div class="email-detail-header mb-4">

													<h4 class="card-title">${email.subject}</h4>
													<div>
														<strong>보낸 사람 : </strong>
														${email.senderName}(${email.senderDeptName})&lt;${email.senderEmail}&gt;
													</div>
													<div class="text-muted">
														<span id="formatted-send-date"></span>
													</div>
												</div>
												<div class="d-flex justify-content-between align-items-center mt-2">
													<div>
														<strong>받는 사람 : </strong>
														<c:choose>
															<c:when test="${fn:length(email.recipientUserList) le 1}">
																<c:forEach var="recipientUser"
																	items="${email.recipientUserList}" varStatus="status">
                                        ${recipientUser.userNm}(${recipientUser.deptNm})&lt;${recipientUser.userEmail}&gt;<c:if
																	test="${not status.last}">, </c:if>
															</c:forEach>
														</c:when>
														<c:otherwise>
                                    ${email.recipientUserList[0].userNm}(${email.recipientUserList[0].deptNm})&lt;${email.recipientUserList[0].userEmail}&gt;
                                    <a href="#"
																id="show-more-recipients" data-bs-toggle="dropdown"
																aria-expanded="false"
																class="dropdown-toggle text-decoration-none"> 외
																${fn:length(email.recipientUserList) - 1}명 </a>
															<ul class="dropdown-menu"
																aria-labelledby="show-more-recipients">
																<c:forEach var="recipientUser"
																	items="${email.recipientUserList}" varStatus="status">
																	<c:if test="${status.index gt 0}">
																		<li><a class="dropdown-item" href="#">${recipientUser.userNm}(${recipientUser.deptNm})&lt;${recipientUser.userEmail}&gt;</a></li>
																	</c:if>
																</c:forEach>
															</ul>
														</c:otherwise>
													</c:choose>
													</div>
													<div> <!-- Date info -->
														<strong><fmt:formatDate value="${email.sendDateAsUtilDate}" pattern="yyyy-MM-dd HH:mm:ss"/></strong>
													</div>
												</div>
												<div class="d-flex justify-content-between align-items-center">
													<%-- 첨부파일 목록 표시 --%>
													<c:if test="${not empty email.attachmentList}">
										<div class="mt-3 d-flex align-items-center">
											<strong>첨부파일:</strong>
											<ul class="list-group list-group-flush">
												<c:forEach var="file" items="${email.attachmentList}">
													<li
														class="list-group-item d-flex justify-content-between align-items-center">
														<a href="/file/download/${file.saveFileNm}">${file.orgnFileNm}</a>
													</li>
												</c:forEach>
											</ul>
										</div>													</c:if>
									</div>
												<hr>
												<div class="email-content" style="min-height: 300px;">${email.content}</div>
												<hr>
												<div class="d-flex justify-content-end">
													<a href="<c:url value='/mail/list'/>"
														class="btn btn-light me-2">목록으로</a> <a
														href="<c:url value='/mail/reply?originalEmailContId=${email.emailContId}'/>"
														class="btn btn-primary me-2">답장</a> <a
														href="<c:url value='/mail/forward?originalEmailContId=${email.emailContId}'/>"
														class="btn btn-info me-2">전달</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
	<script type="module" src="/js/mail/mail-boxrenderer.js"></script>
	<script type="module" src="/js/mail/mail-list.js"></script>
</body>
</html>
