<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>조직도</title>
<link rel="stylesheet" href="/css/orgchart-user.css">
</head>
<body>
	<div id="main-content">

		<div class="outline-section">
			<div class="outline-title">조직도</div>
			<div class="outline-subtitle">starworks 의 구성원과 부서 정보를 확인합니다.</div>
		</div>
		<div class="page-content">
			<section class="row">
				<div class="col-12">
					<div class="card">
						<div class="card-body">
							<div class="input-group mb-3">
								<input type="text" id="orgSearchInput" class="form-control"
									placeholder="부서명 또는 사원명 검색" aria-label="Search organization">
								<button class="btn btn-primary" type="button"
									id="orgSearchButton">검색</button>
							</div>

							<div class="row">
								<!-- Organization Tree -->
								<div class="col-md-6">
									<h4>조직 구조</h4>
									<div id="orgTreeContainer" class="org-tree border p-3 rounded bg-white" style="min-height: 400px;">
									</div>
								</div>

								<!-- Department Detail -->
								<div class="col-md-6">
									<h4>부서 상세 정보</h4>
									<div id="deptDetailContainer"
										class="border p-3 rounded bg-white" style="min-height: 400px;">
										<p class="text-muted">부서를 클릭하여 상세 정보를 확인하세요.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>


	<!-- user Detail Modal -->
	<div class="modal fade" id="memberDetailModal" tabindex="-1"
		aria-labelledby="memberDetailModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="memberDetailModalLabel">사원 정보</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body text-center">
					<img id="memberPhoto" src="" class="profile-img" alt="프로필 사진">
					<h4>
						<span id="memberName"></span>
						<span class="chat-icon" title="채팅하기"></span>
					</h4>
					<p class="text-muted" id="memberPosition"></p>
					<ul class="list-group list-group-flush text-start">
						<li class="list-group-item"><i class="bi bi-telephone-fill me-2"></i>전화번호: <span id="memberPhone"></span></li>
						<li class="list-group-item"><i class="bi bi-envelope-fill me-2"></i>이메일: <a href="#" id="memberEmailLink"></a></li>
						<li class="list-group-item"><i class="bi bi-person-check-fill me-2"></i>근무현황: <span id="memberStatus" class="badge"></span></li>
					</ul>‍
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">닫기</button>
				</div>
			</div>
		</div>
	</div>

    <script src="/js/orgchart/orgchart-list.js"></script>
</body>

</html>