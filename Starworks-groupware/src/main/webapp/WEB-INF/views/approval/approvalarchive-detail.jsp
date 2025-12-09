<!-- 
 * == 개정이력(Modification Information) ==
 *   
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 3.     	임가영            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<div id="main-content">

		<%-- Flash-Attribute 메시지 표시 --%>
		<c:if test="${not empty message}">
			<div
				class="alert alert-${empty messageType ? 'info' : messageType} alert-dismissible fade show"
				role="alert">
				${message}
				<button type="button" class="btn-close" data-bs-dismiss="alert"
					aria-label="Close"></button>
			</div>
		</c:if>

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/approval/left-menu.jsp"%>


			<!-- 우측 본문(기안 작성 화면 + 결재선) -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">보관문서 상세</div>
				</div>

				<section class="section">
					<div class="row">
						<!-- 좌측 본문 -->
						<div class="col-12 col-lg-8">
							<div class="card">
								<div class="card-body">
									<form>
										<fieldset disabled>
											<div class="form-group mb-3">
												<label for="title" class="form-label">제목</label> <input
													type="text" class="form-control" id="title" readonly
													value="${approval.atrzDocTtl}">
											</div>

											<div class="form-group mb-3">
												<label class="form-label">내용</label>
												<div class="border p-3">
													<!-- 본문 HTML -->
													<div class="mt-3">
														<object data="${approvalPdf['filePath'] }"
															type="application/pdf" width="100%" height="700">
															<p>PDF 뷰어를 지원하지 않는 브라우저입니다.
														</object>
													</div>
												</div>
											</div>

											<!-- 첨부파일 -->
											<c:if test="${not empty approval.atrzFileId}">
												<div class="form-group mb-3">
													<label class="form-label">첨부파일</label>
													<c:forEach items="${fileList }" var="file">
														<a href="/file/download/${file.saveFileNm}">${file.orgnFileNm }</a>
													</c:forEach>
												</div>
											</c:if>
										</fieldset>
									</form>
								</div>
							</div>
						</div>

						<!-- 우측 결재선 -->
						<div class="col-12 col-lg-4">
							<div class="card">
								<div class="card-header">
									<h5 class="card-title">결재선</h5>
								</div>
								<div class="card-body">
									<table class="table table-bordered approval-line-table">
										<tbody>
											<!-- 기안자 -->
											<tr>
												<th class="text-center" style="width: 80px;">기안</th>
												<td>
													<p class="mb-0 fw-bold">${approval.drafterName}</p>
													<p class="text-muted mb-0 text-sm">${approval.atrzUserId}</p>
												</td>
											</tr>

											<!-- 결재선 -->
											<tr>
												<th class="text-center">결재</th>
												<td id="approval-line-display"><c:choose>
														<c:when test="${empty approval.approvalLines}">
															<p class="fst-italic text-muted">결재선 정보가 없습니다.</p>
														</c:when>
														<c:otherwise>
															<c:forEach var="line" items="${approval.approvalLines}">
																<div class="d-flex align-items-center mb-2"
																	data-line-sqn="${line.atrzLineSqn}"
																	data-current-seq="${line.atrzLineSeq}"
																	data-processed="${not empty line.atrzAct}">
																	<div>
																		<p class="mb-0 fw-bold">
																			${line.atrzApprUserNm} <span
																				class="badge
                            <c:choose>
                              <c:when test="${line.atrzAct eq 'A401'}"> bg-success">승인</c:when>
																				<c:when test="${line.atrzAct eq 'A402'}"> bg-danger">반려</c:when>
																				<c:when test="${line.atrzAct eq 'A403'}"> bg-info">전결</c:when>
																				<c:otherwise> bg-light-secondary">대기</c:otherwise>
													</c:choose> </span>
													</p> <c:if test="${not empty line.atrzOpnn}">
														<p class="small text-muted mb-0">의견: ${line.atrzOpnn}</p>
													</c:if>
													</div>
													</div> </c:forEach> </c:otherwise> </c:choose></td>
											</tr>
										</tbody>
									</table>
								</div>
								<!-- 결재 처리 버튼 -->
								<div class="card-footer">
									<div class="d-grid gap-2">
										<!-- PDF 다운로드 버튼 -->
										<a href="/approval/downloadPdf/${approval.atrzDocId}"
											class="btn btn-outline-danger" target="_blank"> PDF 다운로드
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
</body>
</html>
