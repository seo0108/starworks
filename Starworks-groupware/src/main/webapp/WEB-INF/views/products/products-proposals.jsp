<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>신메뉴 품의 관리</title>
<link rel="stylesheet" href="/css/products-proposals.css">
<style>
.email-application .list-group-item.active {
	background-color: var(--bs-primary);
	color: white;
}
</style>
</head>

<body>
	<div id="main-content">

			<div class="outline-section-5 mb-3"  style="width:80%; margin:0 auto;" >
				<div class="outline-title">신메뉴 품의 관리</div>
				<div class="outline-subtitle">결재 완료된 신메뉴 기안서를 확인하고 메뉴에 추가합니다.</div>
			</div>

			<section class="section">
				<div class="row d-flex justify-content-center" >
					<!-- 결재 완료 목록 -->
					<div class="col-md-3">
						<div class="card" style="min-height:650px">
							<div class="card-header">
								<h5 class="card-title">결재 완료 목록</h5>
							</div>
							<div class="card-body p-0">
								<div class="list-group list-group-flush">
									<c:forEach var="menu" items="${approvedList}">
										<a href="#" class="list-group-item list-group-item-action"
											data-id="${menu.nwmnSqn}">
											<div class="d-flex w-100 justify-content-between">
												<h6 class="mb-1">[${menu.categoryNm}] ${menu.menuNm}</h6>
												<small> ${menu.releaseYmd} </small>
											</div>
											<p class="mb-1 text-sm">문서번호: ${menu.atrzDocId}</p>
										</a>
									</c:forEach>

									<c:if test="${empty approvedList}">
										<div class="p-3 text-center text-muted">결재 완료된 신제품 품의서가
											없습니다.</div>
									</c:if>
								</div>
							</div>
						</div>
					</div>

					<!-- 기안서 상세 -->
					<div class="col-md-6">
						<c:if test="${not empty approvedList}">
							<c:set var="first" value="${approvedList[0]}" />
							<div class="card" style="min-height:650px">
								<div class="card-header">
									<h4 class="card-title">기안서 상세</h4>
								</div>
								<div class="card-body">
									<div class="d-flex justify-content-end mb-3">
										<button class="btn btn-primary" data-bs-toggle="modal"
											data-bs-target="#menuModal">
											<i class="bi bi-plus-circle-fill me-2"></i>메뉴에 바로 추가
										</button>
									</div>

									<h5>[${first.categoryNm}] ${first.menuNm}</h5>

									<hr>
									<div class="row mb-3">
										<div class="col-sm-3">
											<strong class="text-muted">문서번호</strong>
										</div>
										<div class="col-sm-9">${first.atrzDocId}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-3">
											<strong class="text-muted">기안자</strong>
										</div>
										<div class="col-sm-9">${first.userNm}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-3">
											<strong class="text-muted">출시예정일</strong>
										</div>
										<div class="col-sm-9">${first.releaseYmd}</div>
									</div>
									<hr>
									<div class="row mb-3">
										<div class="col-sm-3">
											<strong class="text-muted">제품 카테고리</strong>
										</div>
										<div class="col-sm-9">${first.categoryNm}</div>
									</div>
									<div class="row mb-3">
										<div class="col-sm-3">
											<strong class="text-muted">제안 가격</strong>
										</div>
										<div class="col-sm-9">
											<fmt:formatNumber value="${first.priceAmt}" pattern="#,###원" />
										</div>
									</div>
									<div class="mt-4">
										<h6>
											<strong>제품 설명 및 특징</strong>
										</h6>
										<p id="marketingContent">${first.marketingContent}</p>
									</div>
									<div class="mt-4">
										<h6>
											<strong>레시피 및 원재료</strong>
										</h6>
										<p id="ingredientContent">${first.ingredientContent}</p>
									</div>

								</div>
							</div>
						</c:if>
					</div>
				</div>
			</section>
		</div>

	<!-- 신규 메뉴 등록 모달 -->
	<div class="modal fade" id="menuModal" tabindex="-1">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header bg-primary text-white">
					<h5 class="modal-title text-white">신규 메뉴 등록</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p class="text-muted">기안서 내용을 바탕으로 메뉴 정보를 자동으로 채웠습니다. 확인 후
						저장하세요.</p>
					<form:form id="menuForm" method="post" enctype="multipart/form-data" modelAttribute="menu" action="/rest/product-newmenu/add">
						<div class="mb-3">
							<label class="form-label">메뉴명 <span class="text-danger">*</span></label> <input type="text"
								class="form-control" name="menuNm" value="${first.menuNm}">
						</div>
						<div class="row">
							<div class="col-md-6 mb-3">
							<label class="form-label">카테고리 <span class="text-danger">*</span></label></label> <input type="text"
									class="form-control" name="categoryNm" value="${first.categoryNm}">
						</div>
						<div class="col-md-6 mb-3">
							<label class="form-label">가격 <span class="text-danger">*</span></label></label> <input type="number"
									class="form-control" name="priceAmt" value="${first.priceAmt}">
						</div>
						</div>
						<div class="mb-3">
							<label class="form-label">메뉴 설명</label>
							<textarea class="form-control" name="marketingContent" rows="3">${first.marketingContent}</textarea>
						</div>
						<div class="mb-3">
							<label class="form-label">이미지 업로드 <span class="text-danger">*</span></label></label>
							<input type="file" class="form-control" id="formFileMultiple" name="fileList">
						</div>
						<div class="mb-3">
							<label class="form-label">상태</label> <select class="form-select" name="status">
								<option value="active">판매중</option>
								<option value="sold_out">품절</option>
								<option value="hidden">숨김</option>
							</select>
						</div>
					</form:form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary">메뉴에 추가</button>
				</div>
			</div>
		</div>
	</div>
<script src="/js/products/products-proposals.js"></script>


</body>
</html>
