<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>
<!-- FilePond & Dragula CSS/JS 추가 -->
<link rel="stylesheet" href="/css/approval-draft-create.css">
<link href="https://unpkg.com/filepond/dist/filepond.css"
	rel="stylesheet" />
<link
	href="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"
	rel="stylesheet" />
<script src="https://unpkg.com/filepond/dist/filepond.js"></script>
<script
	src="https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js"></script>

<link rel="stylesheet"
	href="https://unpkg.com/dragula@3.7.3/dist/dragula.min.css" />
<script src="https://unpkg.com/dragula@3.7.3/dist/dragula.min.js"></script>


<div id="main-content">

	 <div class="page-content d-flex flex-wrap gap-3">
	    <%@include file="/WEB-INF/views/approval/left-menu.jsp" %>


			<!-- 우측 본문(기안 작성 화면 + 결재선) -->
			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
			        <div class="outline-title">기안서작성</div>
			        <div class="outline-subtitle">새로운 문서를 기안합니다.</div>
			    </div>

		<section class="section">
			<div class="row">
				<div class="col-12 col-lg-8">
					<div class="card">
						<div class="card-body">
							<form method="post" action="/approval/create" enctype="multipart/form-data" id="draftFormArea" >
								<input type="hidden" name="atrzDocId" />
								<input type="hidden" id="templateSelect" name="atrzDocTmplId" value="${template.atrzDocTmplId}">
								<input type="hidden" name="atrzTempSqn" value="${atrzTempSqn}">
								<div class="form-group mb-3">
								    <label for="title" class="form-label">제목</label>
								    <input type="text" class="form-control" id="title" name="atrzDocTtl"
       									value="${not empty tempTitle ? tempTitle : template.atrzDocTmplNm}" />
								</div>
								<div class="form-group mb-3">
									<label class="form-label">내용</label>
									<input type="hidden" name="htmlData" />
									<div class="border p-3">

										<!-- 제목 + 상단 정보 -->
										<div id="htmlDataDiv">
											<table
												style="border: 0px solid rgb(0, 0, 0); width: 100%; font-family: malgun gothic, dotum, arial, tahoma; margin-top: 1px; border-collapse: collapse;">
												<colgroup>
													<col width="310">
													<col width="490">
												</colgroup>
												<tbody>
													<tr>
														<td style="background: white; padding: 0px !important; border: 0px currentColor; height: 90px; text-align: center; color: black; font-size: 36px; font-weight: bold; vertical-align: top;"
														colspan="2">${template.atrzDocTmplNm }</td>
													</tr>
													<tr>
														<td style="background: white; padding: 0px !important; border: currentColor; text-align: left; color: black; font-size: 12px; font-weight: normal; vertical-align: top;">
															<table style="border: 1px solid rgb(0, 0, 0); font-family: malgun gothic, dotum, arial, tahoma; margin-top: 1px; border-collapse: collapse; width: 100%">
																<colgroup>
																	<col width="100">
																	<col width="220">
																</colgroup>
																<tbody>
																	<tr>
																		<td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; height: 18px; text-align: center; color: #000; font-size: 12px; font-weight: bold; vertical-align: middle;">기안자</td>
																		<td style="background: #fff; padding: 5px; border: 1px solid black; text-align: left; color: #000; font-size: 12px; vertical-align: middle;">
																			${user.userNm}</td>
																	</tr>
																	<tr>
																		<td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; height: 18px; text-align: center; color: #000; font-size: 12px; font-weight: bold; vertical-align: middle;">기안부서</td>
																		<td style="background: #fff; padding: 5px; border: 1px solid black; text-align: left; color: #000; font-size: 12px; vertical-align: middle;">
																			${user.deptNm}</td>
																	</tr>
																	<tr>
																		<td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; height: 18px; text-align: center; color: #000; font-size: 12px; font-weight: bold; vertical-align: middle;">기안일</td>
																		<td style="background: #fff; padding: 5px; border: 1px solid black; text-align: left; color: #000; font-size: 12px; vertical-align: middle;">
																			${today}</td>
																	</tr>
																	<tr>
																		<td style="background: rgb(221, 221, 221); padding: 5px; border: 1px solid black; height: 18px; text-align: center; color: #000; font-size: 12px; font-weight: bold; vertical-align: middle;">문서번호</td>
																		<td id="docId" style="background: #fff; padding: 5px; border: 1px solid black; text-align: left; color: #000; font-size: 12px; vertical-align: middle;">
																		<span style="color:#adb5bd">결재요청시 부여됩니다</span></td>
																	</tr>
																</tbody>
															</table>
														</td>

														<td style="background: white; padding: 0px !important; border: currentColor; color: black; font-size: 12px; font-weight: normal; vertical-align: top;">
														    <div id="signDiv" style="text-align:right">
															    <p  style="margin: 0;">[결재선]</p>
															    <table style="margin-left: auto; margin-right: 0;">
															    	<tr>
																    	<td>
																			<table id="mySignTable" style="height: 130px; border-collapse: collapse;">
																				<tr>
																					<th rowspan="3" class="header-cell" style="border: 1px solid black; background-color: #f0f0f0; width:20px; vertical-align: middle; text-align: center;"><p style="text-align: center; margin: 0; padding: 2px 0;">신청</p></th>
																					<td style="border: 1px solid black; vertical-align: middle; width: 70px;height:23px"><p style="text-align: center; margin: 0; padding: 2px 0;">${user.jbgdNm}</p></td>
																				</tr>
																				<tr>
																					<td style="border: 1px solid black; vertical-align: middle; width:70px;height:70px">
																						<div style="text-align: center;"><img alt="잘못된 도장 이미지" src="https://starworks-1.s3.ap-northeast-2.amazonaws.com/approval/sign/approval.png" style="height:30px;width:30px"></div>
																						<div><p style="text-align: center; margin: 0; padding: 2px 0;">${user.userNm}</p></div>
																					</td>
																				</tr>
																				<tr>
																					<td style="border: 1px solid black; vertical-align: middle; width: 70px;height:23px"><p id="approverSignDate" style="text-align: center; margin: 0; padding: 2px 0;"></p></td>
																				</tr>
																			</table>
																	    </td>

																	    <td>
																			<table id="approvalerSignTable" style="height: 130px; border-collapse: collapse;">
																				<tr class="sgin-row-1">
																					<th rowspan="3" class="header-cell" style="border: 1px solid black; background-color: #f0f0f0; width:20px; vertical-align: middle; text-align: center;">
																						<p style="text-align: center; margin: 0; padding: 2px 0;">결재</p>
																					</th>
																				</tr>
																				<tr class="sgin-row-2" >
																				</tr>
																				<tr class="sgin-row-3">
																				</tr>
																			</table>
																		</td>
																    </tr>
														     	</table>
													    	</div>
														</td>
													</tr>
												</tbody>
											</table>
											<!-- 여기에 결재양식이 들어감 -->
											<div id="draftContentArea">
											<c:out value="${template.htmlContents }" escapeXml="false" />
										</div> <!-- htmlDataDiv 끝 -->
										</div>
									</div>
								</div>
								<!-- 첨부파일 -->
								<div class="form-group mb-3">
									<input class="form-control" type="file" id="fileList" name="fileList" multiple>
<!-- 									 <label for="filepond" class="form-label">파일 첨부</label> <input -->
<!-- 										type="file" class="multiple-files-filepond" multiple>  -->
<%-- 									<form:form method="post" enctype="multipart/form-data"> --%>
<!-- 										<input class="form-control" type="file" id="formFileMultiple" name="fileList" multiple> -->
<%-- 									</form:form>	 --%>
								</div>
								<!-- 결재선  -->
								<span id="approvalLinesDiv">

								</span>
							</form>
						</div>
					</div>
				</div>
				<div class="col-12 col-lg-4">
					<div class="card">
						<div class="card-header">
							<h5 class="card-title">결재선</h5>
						</div>
						<div class="card-body">
							<div class="d-flex justify-content-end mb-3">
								<button type="button" class="btn btn-sm btn-success me-1" id="openFavModalBtn">결재선 즐겨찾기</button>
								<button type="button" class="btn btn-sm btn-primary" id="openApprovalModalBtn">결재선 설정</button>
							</div>
							<table class="table table-bordered approval-line-table">
								<tbody>
									<tr>
										<th class="text-center" style="width: 80px;">기안</th>
										<td>
											<div class="d-flex align-items-center">
												<div class="avatar me-2 border">
												<c:choose>
													<c:when test="${empty user.userImgFileId }">
														<img src="/images/faces/1.jpg" alt="Face 1">
													</c:when>
													<c:otherwise>
														<img src="${user.filePath }" alt="Face 1">
													</c:otherwise>
												</c:choose>
												</div>
												<div>
													<p class="mb-0 fw-bold">${user.userNm }</p>
													<p class="text-muted mb-0 text-sm">${user.deptNm } / ${user.jbgdNm }</p>
												</div>
											</div>
										</td>
									</tr>
									<tr>
										<th class="text-center">결재</th>
										<td id="approval-line-display">
										  <p class="fst-italic">결재자를 설정해주세요.</p>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="card-footer">
							<div class="d-grid gap-2">
								<button type="button" class="btn btn-primary" id="btnRequest">결재요청</button>
								<button type="button" class="btn btn-light-secondary"
									data-bs-toggle="modal" data-bs-target="#saveDraftModal">임시저장</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</div>
</div>


 <!-- 결재요청 확인 모달 -->
<div class="modal fade" id="approvalConfirmModal" tabindex="-1" aria-labelledby="approvalConfirmModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="approvalConfirmModalLabel">결재 요청</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>결재요청을 진행하시겠습니까?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
        <button type="button" class="btn btn-primary" id="confirmApprovalBtn">확인</button>
      </div>
    </div>
  </div>
</div>

<!-- 결재선 즐겨찾기 모달창 -->
<div class="modal fade" id="favoriteLineModal" tabindex="-1"
	aria-labelledby="favoriteLineModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="favoriteLineModalLabel">결재선 즐겨찾기 생성</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
					aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-md-4">
						<div class="card">
							<div class="card-header">
								<input type="text" id="fav-org-search" class="form-control"
									placeholder="이름, 조직 검색">
							</div>
							<div class="card-body" style="height: 500px; overflow-y: auto; width: 350px">
								<ul id="fav-org-tree" class="list-group">
									<!-- Org tree will be populated by JS -->
								</ul>
							</div>
						</div>
					</div>
					<div class="col-md-2 d-flex flex-column justify-content-center">
						<div class="form-group mb-3">
							<label for="fav-approval-role-select" class="form-label">역할:</label>
							<select class="form-select" id="fav-approval-role-select">
								<option value="approver">결재</option>
							</select>
						</div>
						<button class="btn btn-primary" id="fav-add-to-line-btn">&gt;&gt;</button>
					</div>
					<div class="col-md-6">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title">결재선 (드래그하여 순서 변경)</h5>
							</div>
							<div class="card-body" style="height: 500px; overflow-y: auto;">
								<ul class="list-group" id="fav-approval-line-final-list"></ul>
							</div>
						</div>
					</div>
				</div>
				<div class="form-group mt-3">
					<label for="favorite-line-name" class="form-label">즐겨찾기 이름</label>
					<input type="text" class="form-control" id="favorite-line-name"
						placeholder="저장할 결재선 이름을 입력하세요">
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-light-secondary"
					data-bs-dismiss="modal">취소</button>
				<button type="button" class="btn btn-primary"
					id="save-favorite-line-btn">저장</button>
			</div>
		</div>
	</div>
</div>

<!-- 결재선 설정 모달창 -->
<div class="modal fade" id="approvalLineModal" tabindex="-1"
	aria-labelledby="approvalLineModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="approvalLineModalLabel">결재선 설정</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
					aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<div class="row mb-3">
					<div class="col-md-8">
						<label for="favorite-lines-select" class="form-label">결재선
							즐겨찾기 불러오기</label>
						<div class="input-group">
							<select class="form-select" id="favorite-lines-select">
								<option selected>저장된 즐겨찾기 선택...</option>
							</select>
							<button class="btn btn-outline-danger" type="button"
								id="delete-favorite-line-btn">삭제</button>
						</div>
					</div>
				</div>
				<hr>
				<div class="row">
					<div class="col-md-4">
						<div class="card">
							<div class="card-header">
								<input type="text" id="org-search" class="form-control"
									placeholder="이름, 조직 검색">
							</div>
							<div class="card-body" style="height: 500px; overflow-y: auto; width: 350px;">
								<ul id="org-tree" class="list-group">
									<!-- Org tree will be populated by JS -->
								</ul>
							</div>
						</div>
					</div>
					<div class="col-md-2 d-flex flex-column justify-content-center">
						<div class="form-group mb-3">
							<label for="approval-role-select" class="form-label">역할:</label>
							<select class="form-select" id="approval-role-select">
								<option value="approver">결재</option>
							</select>
						</div>
						<button class="btn btn-primary" id="add-to-line-btn">&gt;&gt;</button>
					</div>
					<div class="col-md-6">
						<div class="card">
							<div class="card-header">
								<h5 class="card-title">결재선 (드래그하여 순서 변경)</h5>
							</div>
							<div class="card-body" style="height: 500px; overflow-y: auto;">
								<ul class="list-group" id="approval-line-final-list"></ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-light-secondary"
					data-bs-dismiss="modal">취소</button>
				<button type="button" class="btn btn-primary"
					id="confirm-approval-line">확인</button>
			</div>
		</div>
	</div>
</div>

<!-- 결재요청 모달창 -->
<!-- <div class="modal fade" id="requestApprovalModal" tabindex="-1" -->
<!-- 	aria-labelledby="requestApprovalModalLabel" aria-hidden="true"> -->
<!-- 	<div class="modal-dialog modal-dialog-centered"> -->
<!-- 		<div class="modal-content"> -->
<!-- 			<div class="modal-header"> -->
<!-- 				<h5 class="modal-title" id="requestApprovalModalLabel">결재 요청</h5> -->
<!-- 				<button type="button" class="btn-close" data-bs-dismiss="modal" -->
<!-- 					aria-label="Close"></button> -->
<!-- 			</div> -->
<!-- 			<div class="modal-body"> -->
<!-- 				<label for="approval-comment">결재 코멘트</label> -->
<!-- 				<textarea class="form-control" id="approval-comment" rows="3"></textarea> -->
<!-- 			</div> -->
<!-- 			<div class="modal-footer"> -->
<!-- 				<button type="button" class="btn btn-light-secondary" -->
<!-- 					data-bs-dismiss="modal">취소</button> -->
<!-- 				<button type="button" class="btn btn-primary" -->
<!-- 					id="confirm-approval-action">기안</button> -->
<!-- 			</div> -->
<!-- 		</div> -->
<!-- 	</div> -->
<!-- </div> -->


<!-- 임시저장 Modal -->
<div class="modal fade" id="saveDraftModal" tabindex="-1"
	aria-labelledby="saveDraftModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="saveDraftModalLabel">임시 저장</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal"
					aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<p>작성 중인 문서를 임시 저장하시겠습니까?</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-light-secondary"
					data-bs-dismiss="modal">취소</button>
				<button type="button" id="btnConfirmTempSave" class="btn btn-primary">확인</button>
			</div>
		</div>
	</div>
</div>

<!--
<c:if test="${not empty tempDraft}">
<script>
    document.addEventListener('DOMContentLoaded', function() {

        // 1. 제목 복원 (기존 유지)
        const titleInput = document.getElementById('title');
        if(titleInput) {
            titleInput.value = '${tempDraft.atrzDocTtl}';
        }

        // 2. HTML 본문 복원
        // 변경: document.getElementById('htmlDataDiv') -> document.getElementById('draftContentArea')
        const contentArea = document.getElementById('draftContentArea');
        if(contentArea) {
            contentArea.innerHTML = `<c:out value="${tempDraft.htmlData}" escapeXml="false"/>`;
        }

        // 3. 임시저장 일련번호 숨겨서 보관 (기존 유지)
        const hiddenSqnInput = document.createElement('input');
        hiddenSqnInput.type = 'hidden';
        hiddenSqnInput.name = 'atrzTempSqn';
        hiddenSqnInput.value = '${tempDraft.atrzTempSqn}';

        document.getElementById('draftFormArea').appendChild(hiddenSqnInput);

		const tempLinesJson = '${tempDraft.tempApprovalLinesJson}';

        if (tempLinesJson && tempLinesJson.trim() !== '') {
            try {
                // JSON 문자열을 JavaScript 객체(배열)로 파싱
                const tempLines = JSON.parse(tempLinesJson);

                if (tempLines && tempLines.length > 0) {
                    // JS 파일에 정의할 결재선 화면 업데이트 함수 호출
                    loadApprovalLineDisplay(tempLines);
                }
            } catch (e) {
                console.error("결재선 JSON 파싱 오류:", e);
            }
        }

    });
</script>
</c:if>
 -->

<script>
const loginUserId = "${user.userId}";
const loginUserNm = "${user.userNm}";
const loginDeptNm = "${user.deptNm}";
</script>
<script src="${pageContext.request.contextPath}/js/approval/approval-draft-create.js"></script>

<c:if test="${template.atrzDocCd eq 'A101'}">
	<style>
	  /* 휴가신청서 일정 글자 크기 변경 */
	  #draftContentArea .input-group .form-control[type="date"],
	  #draftContentArea .input-group .input-group-text {
	    font-size: 0.83rem !important;
	  }
	</style>
</c:if>
