<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.functions" prefix="fn" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>
<security:authentication property="principal.username" var="loginId"/>
<div id="main-content">

<%-- Action Result Message Display --%>
<c:if test="${not empty param.message}">
  <div class="alert alert-${empty param.messageType ? 'info' : param.messageType} alert-dismissible fade show" role="alert">
    ${param.message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</c:if>

<!--   <div class="page-heading"> -->
<!--     <div class="page-title"> -->
<!--       <div class="row"> -->
<!--         <div class="col-12 col-md-6 order-md-1 order-last"> -->
<!--           <h3>전자결재</h3> -->
<!--           <p class="text-subtitle">결재 문서를 확인하거나 새 문서를 기안합니다.</p> -->
<!--         </div> -->
<!--         <div class="col-12 col-md-6 order-md-2 order-first d-flex align-items-center justify-content-end"> -->
<!--           <a href="#" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#selectFormModal"> -->
<!--             <i class="bi bi-pencil-fill me-2"></i>기안서 작성 -->
<!--           </a> -->
<!--         </div> -->
<!--       </div> -->
<!--     </div> -->


    <div class="page-content d-flex flex-wrap gap-3">
    <%@include file="/WEB-INF/views/approval/left-menu.jsp" %>

	 <div style="flex: 1 1 78%;">
	 
	 	<div class="outline-section">
	        <div class="outline-title">전자결재 홈</div>
	        <div class="outline-subtitle">결재 문서를 확인하거나 새 문서를 기안합니다.</div>
	    </div>
		    
    <section class="section">

      <div class="tab-content" id="myTabContent">
        <!-- 내 결재 -->
        <div class="tab-pane fade show active" id="incoming" role="tabpanel" aria-labelledby="incoming-tab">
          <div class="card">
            <div class="card-body">
             <div class="row my-3 text-center">
              	  <div class="col-md-3">
				    <div class="d-grid gap-2">
				      <a href="<c:url value='/approval/main?filter=all'/>"
						   class="btn btn-outline-dark ${filter eq 'all' ? 'active' : ''}">
						  전체 (<c:out value="${allCount}"/>)
						</a>
				    </div>
				  </div>
				  <div class="col-md-3">
				    <div class="d-grid gap-2">
				      <a href="<c:url value='/approval/main?filter=drafts'/>"
				         class="btn btn-outline-primary ${filter eq 'drafts' ? 'active' : ''}">
				        나의 기안 문서 (<c:out value="${draftsCount}"/>)
				      </a>
				    </div>
				  </div>
				  <div class="col-md-3">
				    <div class="d-grid gap-2">
				      <a href="<c:url value='/approval/main?filter=inbox'/>"
				         class="btn btn-outline-secondary ${filter eq 'inbox' ? 'active' : ''}">
				        나에게 온 결재 (<c:out value="${inboxCount}"/>)
				      </a>
				    </div>
				  </div>
                  <div class="col-md-3">
    			    <div class="d-grid gap-2">
    			      <a href="<c:url value='/approval/main?filter=processed'/>"
    			         class="btn btn-outline-success ${filter eq 'processed' ? 'active' : ''}">
    			        내가 결재한 문서 (<c:out value="${processedCount}"/>)
    			      </a>
    			    </div>
    			  </div>
				</div>

				<!-- Search Form -->
				<div class="row justify-content-end my-3">
				  <div class="col-lg-8 col-md-12">
				    <form id="searchUI" action="<c:url value='/approval/main'/>" class="d-flex justify-content-end align-items-center">
				      <input type="hidden" name="page" />
				      <input type="hidden" name="filter" value="${filter}" />
				      <select name="searchType" class="form-select form-select-sm me-2" style="width: auto;">
				        <option value="title" ${paging.simpleSearch.searchType eq 'title' ? 'selected' : ''}>제목</option>
				        <option value="writer" ${paging.simpleSearch.searchType eq 'writer' ? 'selected' : ''}>기안자</option>
				      </select>
				      <select name="searchStatus" class="form-select form-select-sm me-2" style="width: auto;">
						  <option value="">전체 상태</option>
						  <option value="A202" ${paging.simpleSearch.searchStatus eq 'A202' ? 'selected' : ''}>상신</option>
						  <option value="A203" ${paging.simpleSearch.searchStatus eq 'A203' ? 'selected' : ''}>결재중</option>
						  <option value="A204" ${paging.simpleSearch.searchStatus eq 'A204' ? 'selected' : ''}>반려</option>
						  <option value="A205" ${paging.simpleSearch.searchStatus eq 'A205' ? 'selected' : ''}>회수</option>
						  <option value="A206" ${paging.simpleSearch.searchStatus eq 'A206' ? 'selected' : ''}>최종승인</option>
						  <option value="A301" ${paging.simpleSearch.searchStatus eq 'A301' ? 'selected' : ''}>미열람</option>
						  <option value="A302" ${paging.simpleSearch.searchStatus eq 'A302' ? 'selected' : ''}>미처리</option>
					  </select>
				      <input type="text" name="searchWord" class="form-control form-control-sm me-2" style="width: 200px;" value="${paging.simpleSearch.searchWord}" placeholder="검색어를 입력하세요">
				      <button type="submit" class="btn btn-primary btn-sm">검색</button>
				    </form>
				  </div>
				</div>

              <div class="table-responsive">
                <table class="table table-lg" id="approval-table">
                  					  					  					  					  <thead>
                  					  					  					  					    <c:choose>
                  					  					  					  					      <c:when test="${filter eq 'all'}">
                  					  					  					  					        <tr>
                  					  					  					  					          <th>문서종류</th>
                  					  					  					  					          <th>제목</th>
                  					  					  					  					          <th>기안자</th>
                  					  					  					  					          <th>기안일</th>
                  					  					  					  					          <th>문서상태</th>
                  					  					  					  					          <th>결재상태</th>
                  					  					  					  					        </tr>
                  					  					  					  					      </c:when>
                  					  					  					  					      <c:otherwise>
                  					  					  					  					        <tr>
                  					  					  					  					          <th>문서종류</th>
                  					  					  					  					          <th>제목</th>
                  					  					  					  					          <th>기안자</th>
                  					  					  					  					          <th>기안일</th>
                  					  					  					  					          <th>상태</th>
                  					  					  					  					        </tr>
                  					  					  					  					      </c:otherwise>
                  					  					  					  					    </c:choose>
                  					  					  					  					  </thead>					<tbody id="approval-tbody">
					  <c:choose>
					    <c:when test="${not empty approvalList}">
					      <c:forEach var="row" items="${approvalList}">
					        <tr data-href="<c:url value='/approval/detail/${row.atrzDocId}'/>" style="cursor:pointer;">
					          <td class="text-bold-500"><c:out value="${row.atrzDocTmplNm}"/></td>
					          <td>
					            <a href="<c:url value='/approval/detail/${row.atrzDocId}'/>" class="text-decoration-none">
					              <c:out value="${row.atrzDocTtl}"/>
					            </a>
					          </td>
					          <td class="text-bold-500"><c:out value="${row.drafterName}"/></td>
					          <td>
					            <c:choose>
					              <c:when test="${not empty row.atrzSbmtDt}">
					                <fmt:formatDate value="${row.atrzSbmtDtAsUtilDate}" pattern="yyyy-MM-dd HH:mm" />
					              </c:when>
					              <c:otherwise>-</c:otherwise>
					            </c:choose>
					          </td>
					        <!-- 상태 표시 -->
														<!-- 상태 표시 -->
														<c:choose>
														  <c:when test="${filter eq 'all'}">
														    <!-- '전체' 필터일 경우 처리상태와 결재상태를 분리하여 표시 -->
															<td>
															  <!-- 처리상태 (문서 전체 상태) -->
															  <span class="badge ${row.crntAtrzStepCd eq 'A201' ? 'bg-secondary' :
															           row.crntAtrzStepCd eq 'A202' ? 'bg-info' :
															           row.crntAtrzStepCd eq 'A203' ? 'bg-warning text-dark' :
															           row.crntAtrzStepCd eq 'A204' ? 'bg-danger' :
															           row.crntAtrzStepCd eq 'A205' ? 'bg-dark' :
															           row.crntAtrzStepCd eq 'A206' ? 'bg-success' :
															           'bg-light-secondary'}">
															    <c:out value="${row.crntAtrzStepNm}"/>
															  </span>
															</td>
															<td>
															  <!-- 결재상태 (사용자별 결재선 상태) -->
															  <c:if test="${not empty row.myApprSttsNm}">
															    <span class="badge ${row.myApprStts eq 'A201' ? 'bg-secondary' :
															             row.myApprStts eq 'A202' ? 'bg-info' :
															             row.myApprStts eq 'A203' ? 'bg-warning text-dark' :
															             row.myApprStts eq 'A204' ? 'bg-danger' :
															             row.myApprStts eq 'A205' ? 'bg-dark' :
															             row.myApprStts eq 'A206' ? 'bg-success' :
															             row.myApprStts eq 'A301' ? 'bg-secondary' :
															             row.myApprStts eq 'A302' ? 'bg-warning text-dark' :
															             row.myApprStts eq 'A303' ? 'bg-success' :
															             'bg-light-secondary'}">
															      <c:out value="${row.myApprSttsNm}"/>
															    </span>
															  </c:if>
															  <c:if test="${empty row.myApprSttsNm}">
															    <!-- 사용자의 결재선 상태가 없는 경우 (예: 기안자 본인) -->
															    <span class="badge bg-light-secondary">해당 없음</span>
															  </c:if>
															</td>
														  </c:when>
														  <c:otherwise>
														    <!-- '전체' 필터가 아닐 경우 기존 단일 상태 표시 -->
															<td>
															  <c:set var="inboxLike" value="${(filter eq 'inbox') or (filter eq 'all' and not empty row.myApprStts)}"/>
															  <c:set var="effectiveCode" value="${inboxLike ? row.myApprStts : row.crntAtrzStepCd}"/>
															  <c:set var="effectiveName" value="${row.crntAtrzStepNm}"/>
															  <c:if test="${empty effectiveName}">
															    <c:set var="effectiveName" value="${
															             effectiveCode eq 'A201' ? '임시저장' :
															             effectiveCode eq 'A202' ? '상신' :
															             effectiveCode eq 'A203' ? '결재중' :

															             effectiveCode eq 'A204' ? '반려' :
															             effectiveCode eq 'A205' ? '회수' :
															             effectiveCode eq 'A206' ? '최종승인' :
															             effectiveCode eq 'A301' ? '미열람' :
															             effectiveCode eq 'A302' ? '미처리' :
															             effectiveCode eq 'A303' ? '처리완료' :
															             effectiveCode
															           }"/>
															  </c:if>
															  <c:set var="badgeClass" value="${
															           effectiveCode eq 'A201' ? 'bg-secondary' :
															           effectiveCode eq 'A202' ? 'bg-info' :
															           effectiveCode eq 'A203' ? 'bg-warning text-dark' :
															           effectiveCode eq 'A204' ? 'bg-danger' :
															           effectiveCode eq 'A205' ? 'bg-dark' :
															           effectiveCode eq 'A206' ? 'bg-success' :
															           effectiveCode eq 'A301' ? 'bg-secondary' :
															           effectiveCode eq 'A302' ? 'bg-warning text-dark' :
															           effectiveCode eq 'A303' ? 'bg-success' :
															           'bg-light-secondary'
															         }"/>
															  <span class="badge ${badgeClass}">
															    <c:out value="${effectiveName}"/>
															  </span>
															</td>
														  </c:otherwise>
														</c:choose>
						</tr>
				      </c:forEach>
				    </c:when>
				    <c:otherwise>
				      <tr>
				        <td colspan="5" class="text-center text-muted py-5">표시할 문서가 없습니다.</td>
				      </tr>
				    </c:otherwise>
				  </c:choose>
				</tbody>
                </table>
                <!-- Pagination -->
                <div class="d-flex justify-content-center mt-4">
				  ${pagingHTML}
				</div>
              </div>
            </div>
    </div>
  </div>
</div>
</section>
  </div>
</div>

<!-- Select Form Modal) -->
<div class="modal fade" id="selectFormModal" tabindex="-1" aria-labelledby="selectFormModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-xl">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="selectFormModalLabel">결재 양식 선택</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="row">
						<!-- Left Column: Categories -->
						<div class="col-md-3 border-end">
							<h6 class="mb-3">양식 분류</h6>
							<div class="list-group list-group-flush" id="form-categories">
								<a href="#"
									class="list-group-item list-group-item-action active"
									data-category="all">전체</a> <a href="#"
									class="list-group-item list-group-item-action"
									data-category="hr">인사</a> <a href="#"
									class="list-group-item list-group-item-action"
									data-category="finance">재무/회계</a> <a href="#"
									class="list-group-item list-group-item-action"
									data-category="sales">영업/마케팅</a> <a href="#"
									class="list-group-item list-group-item-action"
									data-category="it">개발/IT</a> <a href="#"
									class="list-group-item list-group-item-action"
									data-category="pro">신제품/프로젝트</a> <a href="#"
									class="list-group-item list-group-item-action"
									data-category="logistics">물류</a> <a href="#"
									class="list-group-item list-group-item-action"
									data-category="trip">출장/외근</a>
							</div>
						</div>
						<!-- Middle Column: Form List -->
						<div class="col-md-5 border-end">
							<div class="input-group mb-3">
								<input type="text" class="form-control" placeholder="양식명 검색"
									id="form-search-input"> <span class="input-group-text"><i
									class="bi bi-search"></i></span>
							</div>
							<div class="list-group list-group-flush" id="form-list"
								style="height: 400px; overflow-y: auto;">
								<!-- JS will populate this -->
							</div>
						</div>
						<!-- Right Column: Details -->
						<div class="col-md-4">
							<div class="d-flex justify-content-between align-items-center">
								<h6 class="mb-3">상세정보</h6>
								<!-- <button class="btn btn-sm btn-outline-secondary mb-3">자주 쓰는 양식으로 추가</button> -->
							</div>
							<div id="form-details">
								<div class="card-body text-center text-muted pt-5">
									<i class="bi bi-card-list" style="font-size: 4rem;"></i>
									<p class="mt-3">목록에서 양식을 선택하세요.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary"
						id="confirm-form-selection" disabled>확인</button>
				</div>
			</div>
		</div>
	</div>
<script type="text/javascript" src="/js/approval/approval-main.js"></script>

