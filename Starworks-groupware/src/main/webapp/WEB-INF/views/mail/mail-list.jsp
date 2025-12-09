<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 10.     	홍현택            최초 생성
 *	2025. 10. 14.		홍현택			휴지통, 삭제 추가
 *	2025. 10. 15.		홍현택			메일함 카운트 추가
 *	2025. 10. 16.		홍현택			선택삭제, 복원 추가
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
<style>
.email-list-item:hover {
	cursor: pointer;
}
</style>
</head>
<body>
	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/mail/left-menu.jsp"%>

			<div style="flex: 1 1 78%;"class="right-content">
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
												<div
													class="email-list-controls d-flex justify-content-between align-items-center mb-3">
													<div class="form-check">
														<input class="form-check-input" type="checkbox"
															id="select-all-emails"> <label
															class="form-check-label" for="select-all-emails">전체
															선택</label>
													</div>
													<div>
														<button class="btn btn-danger btn-sm me-2"
															id="delete-selected-emails">선택 삭제</button>
														<button class="btn btn-danger btn-sm me-2"
															id="delete-all-emails">전체 삭제</button>
														<button class="btn btn-success btn-sm"
															id="restore-selected-emails" style="display: none;">선택
															복원</button>
													</div>
												</div>

												<!-- 검색 폼 -->
												<div class="row mb-3">
													<div class="col-12">
														<form id="emailSearchForm"
															class="d-flex align-items-center">
															<select name="searchType" id="searchType"
																class="form-select form-select-sm me-2"
																style="width: auto;">
																<option value="subject">제목</option>
																<option value="sender">보낸사람</option>
																<option value="receiver">받은사람</option>
																<option value="content">내용</option>
															</select> <input type="text" name="searchWord" id="searchWord"
																class="form-control form-control-sm me-2"
																placeholder="검색어를 입력하세요" style="width: 200px;">
															<input type="date" name="startDate" id="startDate"
																class="form-control form-control-sm me-2"
																style="width: auto;"> <input type="date"
																name="endDate" id="endDate"
																class="form-control form-control-sm me-2"
																style="width: auto;">
															<button type="submit" class="btn btn-primary btn-sm">검색</button>
														</form>
													</div>
												</div>

												<div class="email-list-item d-flex align-items-center py-2 border-bottom" style="cursor: default;">
													<div class="form-check me-3">
												        <label class="form-check-label"></label>
												    </div>
												    <div class="me-3" style="width: 1.25rem;"></div>
												    <div class="email-sender text-muted me-3" style="width: 150px;">보낸사람</div>
												    <div class="email-subject text-muted flex-grow-1">제목</div>
												    <div class="email-date text-muted" style="width: 100px; white-space: nowrap;">날짜</div>
												</div>
												<div class="email-list"></div>
												<div id="pagination-area" class="mt-3"></div>
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