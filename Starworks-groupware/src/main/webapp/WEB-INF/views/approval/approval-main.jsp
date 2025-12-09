<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 20.     		임가영            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
<%@ taglib uri="jakarta.tags.functions" prefix="fn" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<div id="main-content">



		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/approval/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">전자결재 홈</div>
					<div class="outline-subtitle">결재 문서를 확인하거나 새 문서를 기안합니다.</div>
				</div>
				<div class="alert alert-light border-start border-primary border-4 d-flex align-items-center" role="alert">
			        <i class="bi bi-lightbulb text-primary me-3" style="font-size: 1.5rem;"></i>
			        <div>
			            <strong>전자결재 안내</strong><br>
			            <small class="text-muted">기안자는 기안한 문서를 결재자가 열람하기 전까지 회수할 수 있습니다.</small><br>
			            <small class="text-muted">회수한 문서는 임시저장하여 다시 재기안할 수 있습니다.</small>
			        </div>
			    </div>

				<section class="section">

					<div class="tab-content" id="myTabContent">
						<!-- 내 결재 -->
						<div class="tab-pane fade show active" id="incoming"
							role="tabpanel" aria-labelledby="incoming-tab">
							<div class="card" style="min-height: 680px;">
								<div class="card-body">
									<div class="row my-3 text-center">
										<div class="col-md-3">
											<div class="d-grid gap-2">
												<a href="<c:url value='/approval/main?filter=all'/>"
													class="btn btn-outline-dark ${filter eq 'all' ? 'active' : ''}">
													전체 (<c:out value="${allCount}" />)
												</a>
											</div>
										</div>
										<div class="col-md-3">
											<div class="d-grid gap-2">
												<a href="<c:url value='/approval/main?filter=drafts'/>"
													class="btn btn-outline-primary ${filter eq 'drafts' ? 'active' : ''}">
													기안 문서 (<c:out value="${draftsCount}" />)
												</a>
											</div>
										</div>
										<div class="col-md-3">
											<div class="d-grid gap-2">
												<a href="<c:url value='/approval/main?filter=inbox'/>"
													class="btn btn-outline-secondary ${filter eq 'inbox' ? 'active' : ''}">
													 결재 요청 문서 (<c:out value="${inboxCount}" />)
												</a>
											</div>
										</div>
										<div class="col-md-3">
											<div class="d-grid gap-2">
												<a href="<c:url value='/approval/main?filter=processed'/>"
													class="btn btn-outline-success ${filter eq 'processed' ? 'active' : ''}">
													결재 완료 문서 (<c:out value="${processedCount}" />)
												</a>
											</div>
										</div>
									</div>

									<!-- Search Form -->
									<div class="row justify-content-end my-3">
										<div class="col-lg-8 col-md-12">
											<form id="searchUI" action="<c:url value='/approval/main'/>"
												class="d-flex justify-content-end align-items-center">
												<input type="hidden" name="page" /> <input type="hidden"
													name="filter" value="${filter}" /> <select
													name="searchType" class="form-select form-select-sm me-2"
													style="width: auto;">
													<option value="title"
														${paging.simpleSearch.searchType eq 'title' ? 'selected' : ''}>제목</option>
													<option value="writer"
														${paging.simpleSearch.searchType eq 'writer' ? 'selected' : ''}>기안자</option>
												</select> <select name="searchStatus"
													class="form-select form-select-sm me-2"
													style="width: auto;">
													<option value="">전체 상태</option>
													<option value="A202"
														${paging.simpleSearch.searchStatus eq 'A202' ? 'selected' : ''}>상신</option>
													<option value="A203"
														${paging.simpleSearch.searchStatus eq 'A203' ? 'selected' : ''}>결재중</option>
													<option value="A204"
														${paging.simpleSearch.searchStatus eq 'A204' ? 'selected' : ''}>반려</option>
													<option value="A205"
														${paging.simpleSearch.searchStatus eq 'A205' ? 'selected' : ''}>회수</option>
													<option value="A206"
														${paging.simpleSearch.searchStatus eq 'A206' ? 'selected' : ''}>최종승인</option>
													<option value="A301"
														${paging.simpleSearch.searchStatus eq 'A301' ? 'selected' : ''}>미열람</option>
													<option value="A302"
														${paging.simpleSearch.searchStatus eq 'A302' ? 'selected' : ''}>미처리</option>
												</select> <input type="text" name="searchWord"
													class="form-control form-control-sm me-2"
													style="width: 200px;"
													value="${paging.simpleSearch.searchWord}"
													placeholder="검색어를 입력하세요">
												<button type="submit" class="btn btn-primary btn-sm">검색</button>
											</form>
										</div>
									</div>

									<div class="table-responsive">
									    <table class="table table-lg approval-table">
									        <thead style="border-top: 2px solid #ddd">
							                    <tr>
							                        <th class="col-title">제목</th>
							                        <th class="col-date">기안일시</th>
							                        <th class="col-author">기안자</th>
							                        <th class="col-status">결재 상태</th>
							                    </tr>
									        </thead>
									        <tbody id="approval-tbody">
									            <c:choose>
													<c:when test="${not empty approvalList}">
														<c:forEach var="row" items="${approvalList}">
															<tr
																data-href="<c:url value='/approval/detail/${row.atrzDocId}'/>" style="cursor: pointer;">
																<td class="col-title"><a
																	href="<c:url value='/approval/detail/${row.atrzDocId}'/>"
																	class="text-decoration-none">
																		<p class="mb-0">${row.atrzDocTmplNm}</p>
																		<c:if test="${row.crntAtrzStepCd eq 'A206' }">
																			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-primary opacity-50" viewBox="0 0 16 16">
																			  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
																			</svg>
																		</c:if>
																		<span class="fw-bold fs-5"><c:out value="${row.atrzDocTtl}" /></span>
																	</a>
																</td>
																<td class="col-date">
																	<c:choose>
																		<c:when test="${not empty row.atrzSbmtDt}">
																			<fmt:formatDate value="${row.atrzSbmtDtAsUtilDate}" pattern="yyyy-MM-dd" />
																			<span style="color:#ccc;font-size:0.9rem;">/</span>
																			<fmt:formatDate value="${row.atrzSbmtDtAsUtilDate}" pattern="HH:mm" />
																		</c:when>
																		<c:otherwise>-</c:otherwise>
																	</c:choose>
																</td>
																<td class="text-bold-500">
																	<div class="approval-line">
															            <div class="approval-status"> <!-- 처리 상태 -->
															               <span class="badge ${row.crntAtrzStepCd eq 'A205' ? 'bg-dark' : 'bg-light-secondary' }">
															               		${row.crntAtrzStepCd eq 'A205' ? '회수' : '기안'}
															               </span>
															            </div>
															            <div class="approval-avatar"> <!-- 프로필 -->
															            	<div class="approval-avatar-wrapper ${row.crntAtrzStepCd eq 'A205' ? 'border-recovery recovery' : 'border-normal' }">
																                <img alt="프로필"
																                     src="${not empty row.drafterFilePath ? row.drafterFilePath : '/images/faces/1.jpg'}"
																                     class="approval-user-avatar">
																            </div>
															            </div>
															            <div class="approval-info"> <!-- 정보(이름+직급+부서) -->
																        	${row.drafterName} ${row.drafterJbgdNm}
																	        	<br /><span>${row.drafterDeptNm}</span>
														            	</div>
														            </div>
																</td>

																		<!-- 결재라인 이미지화 -->
																		<td class="approval-line-td">

																			<div class="approval-line-container">
																	            <!-- 결재자 -->
																			    <c:forEach var="approvalLine" items="${row.approvalLines}">
																			        <div class="approval-line">
																			            <div class="approval-status"> <!-- 처리 상태 -->
<%-- 																			                  <span class=" ${empty approvalLine.atrzApprStts ? ' ' : --%>
 																			                  <span class=" ${empty approvalLine.atrzApprStts ? 'badge bg-light-secondary' :
																			                  				   approvalLine.atrzApprStts eq 'A301' ? 'badge bg-outline-primary':
																		                  					   approvalLine.atrzApprStts eq 'A302' ? 'badge bg-outline-primary' :
																		                  					   approvalLine.atrzAct eq 'A402' ? 'badge bg-danger' : 'badge bg-primary' }">
<%-- 																			                  	${empty approvalLine.atrzApprStts ? '&nbsp&nbsp' : --%>
 																			                  	${empty approvalLine.atrzApprStts ? '미결' :
																				                  approvalLine.atrzApprStts eq 'A301' ? '미열람' :
																				                  approvalLine.atrzApprStts eq 'A302' ? '처리중' :
																				                  approvalLine.atrzAct eq 'A402' ? '반려' : '승인'}
																			                  </span>
																			            </div>
																			            <div class="approval-avatar"> <!-- 프로필 -->
																			            	<!-- '상태값 없을' 때 / '미열람' 상태 / '미처리' 상태 / '반려' 상태 / '승인' 상태 -->
																			            	<div class="approval-avatar-wrapper ${empty approvalLine.atrzApprStts ? 'border-normal' :
																				                              approvalLine.atrzApprStts eq 'A301' ? 'border-unread' :
																				                              approvalLine.atrzApprStts eq 'A302' ? 'border-unread' :
																				                              approvalLine.atrzAct eq 'A402' ? 'border-reject rejected' : 'border-unprocessed approved'}">
																				                <img alt="프로필"
																				                     src="${not empty approvalLine.filePath ? approvalLine.filePath : '/images/faces/1.jpg'}"
																				                     class="approval-user-avatar" >
																			                </div>
																			            </div>
																			            <div class="approval-info"> <!-- 정보(이름+직급+부서) -->
																			                ${approvalLine.atrzApprUserNm} ${approvalLine.jbgdNm}
																			                <br /><span>${approvalLine.deptNm}</span>
																			            </div>
																			        </div>
																			    </c:forEach>
																			</div>

																		</td> <!-- 상태 UI -->
															</tr>
														</c:forEach>
													</c:when>
													<c:otherwise>
														<tr>
															<td colspan="5" class="text-center text-muted py-5">표시할
																문서가 없습니다.</td>
														</tr>
													</c:otherwise>
												</c:choose>
											</tbody>
										</table>
										<!-- Pagination -->
										<div class="d-flex justify-content-center mt-4">
											${pagingHTML}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>

		<script type="text/javascript" src="/js/approval/approval-main.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function () {

  var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

  function swalInfo(message, icon, title) {
    return Swal.fire({
      icon: icon || 'info',
      title: title || undefined,
      text: String(message),
      confirmButtonText: '확인'
    });
  }

  function swalConfirm(opts) {
    var o = opts || {};
    return Swal.fire({
      icon: o.icon || 'question',
      title: o.title || '확인',
      text: o.text || '',
      showCancelButton: true,
      confirmButtonText: o.confirmText || '확인',
      cancelButtonText: o.cancelText || '취소',
      reverseButtons: true,
      allowOutsideClick: false
    }).then(function(res){ return res.isConfirmed; });
  }

  function toastInfo(msg)    { Toast.fire({ icon: 'info',    title: String(msg) }); }
  function toastSuccess(msg) { Toast.fire({ icon: 'success', title: String(msg) }); }
  function toastError(msg)   { Toast.fire({ icon: 'error',   title: String(msg) }); }
  function toastWarn(msg)    { Toast.fire({ icon: 'warning', title: String(msg) }); }

  // Flash Attribute 메시지 처리
  <c:if test="${not empty message}">
    var message = '${message}';
    var messageType = '${messageType}';
    if (messageType === 'success') {
      toastSuccess(message);
    } else if (messageType === 'danger') {
      swalInfo(message, 'error');
    } else if (messageType === 'warning') {
      swalInfo(message, 'warning');
    } else {
      toastInfo(message);
    }
  </c:if>

});
</script>

</body>
</html>