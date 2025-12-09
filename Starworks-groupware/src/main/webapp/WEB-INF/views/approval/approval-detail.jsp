<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 4.     	임가영            최초 생성
 *	2025. 10. 10. 		홍현택			반려, 회수 기능 추가
 *  2025. 10. 21.       홍현택          OTP 인증 기능 추가
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
		<c:if test="${not empty message and not isOtpError}">
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
					<div class="outline-title">전자결재 문서 상세</div>
				</div>

				<section class="section">
					<div class="row">
						<!-- 우측 본문 -->
						<div class="col-12 col-lg-8">
							<div class="card">
								<div class="card-body">
									<fieldset disabled>
										<div class="form-group mb-3">
											<label for="title" class="form-label">제목</label> <input
												type="text" class="form-control" id="title" readonly
												value="${approval.atrzDocTtl}">
										</div>

										<div class="form-group mb-3">
											<label class="form-label">내용</label>
											<div class="border p-3">
												<form id="htmlDataFormArea">
													<!-- 본문 HTML -->
													<div class="mt-3">
														<c:out value="${approval.htmlData}" escapeXml="false" />
													</div>
												</form>
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
													<div class="d-flex align-items-center">
														<div class="avatar me-2 border">
															<c:choose>
																<c:when test="${not empty approval.drafterFilePath}">
																	<img src="${approval.drafterFilePath}" alt="Face 1">
																</c:when>
																<c:otherwise>
																	<img src="/images/faces/1.jpg" alt="Face 1">
																</c:otherwise>
															</c:choose>
														</div>
														<div>
															<p class="mb-0 fw-bold">${approval.drafterName}
																<span class="text-muted fw-normal"></span>
															</p>
															<p class="text-muted mb-0 text-sm">${approval.drafterDeptNm}
																/ ${approval.drafterJbgdNm}</p>
														</div>
													</div>
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
																	<div class="avatar me-2 border">
																		<c:choose>
																			<c:when test="${not empty line.filePath}">
																				<img src="${line.filePath}" alt="Face 1">
																			</c:when>
																			<c:otherwise>
																				<img src="/images/faces/1.jpg" alt="Face 1">
																			</c:otherwise>
																		</c:choose>
																	</div>
																	<div>
																		<p class="mb-0 fw-bold">
																			${line.atrzApprUserNm} <span
																				class="badge
														<c:choose>
															<c:when test="${line.atrzAct eq 'A401'}">bg-success</c:when>
															<c:when test="${line.atrzAct eq 'A402'}">bg-danger</c:when>
															<c:when test="${line.atrzAct eq 'A403'}">bg-info</c:when>
															<c:otherwise>bg-light-secondary</c:otherwise>
														</c:choose>
													">
																				<c:choose>
																					<c:when test="${line.atrzAct eq 'A401'}">승인</c:when>
																					<c:when test="${line.atrzAct eq 'A402'}">반려</c:when>
																					<c:when test="${line.atrzAct eq 'A403'}">전결</c:when>
																					<c:otherwise>대기</c:otherwise>
																				</c:choose>
																			</span>
																		</p>
																		<p class="text-muted mb-0 text-sm">${line.deptNm}
																			/ ${line.jbgdNm}</p>
																		<c:if test="${not empty line.atrzOpnn}">
																			<p class="small text-muted mb-0">의견:
																				${line.atrzOpnn}</p>
																		</c:if>
																	</div>
																</div>
															</c:forEach>
														</c:otherwise>
													</c:choose></td>
											</tr>
										</tbody>
									</table>
								</div>
								<!-- 결재 처리 / 회수 버튼 -->
								<security:authentication property="principal.realUser.userId"
									var="currentUserId" />
								<%-- 현재 사용자가 이미 이 문서를 처리했는지 확인 --%>
								<c:set var="currentUserProcessed" value="${false}" />
								<c:forEach var="line" items="${approval.approvalLines}">
									<c:if
										test="${line.atrzApprUserId eq currentUserId and line.atrzApprStts eq 'A303'}">
										<c:set var="currentUserProcessed" value="${true}" />
									</c:if>
								</c:forEach>

								<div class="card-footer">
									<div class="d-grid gap-2">
										<c:choose>
											<%-- 1. 현재 사용자가 기안자인 경우 --%>
											<c:when test="${approval.atrzUserId eq currentUserId}">
												<c:choose>
													<%-- 1a. 문서 상태가 '반려'(A204) -> '반려 문서 회수' 버튼 --%>
													<c:when test="${approval.crntAtrzStepCd eq 'A204'}">
														<button type="button" class="btn btn-info"
															data-bs-toggle="modal"
															data-bs-target="#retractRejectedModal">반려 문서 회수</button>
													</c:when>
													<%-- 1b. 문서 상태가 '상신'(A202) -> '회수' 버튼 --%>
													<c:when test="${approval.crntAtrzStepCd eq 'A202'}">
														<button type="button" class="btn btn-warning"
															data-bs-toggle="modal" data-bs-target="#retractModal">회수</button>
													</c:when>
													<%-- 1c. 그 외 상태(회수, 결재중, 최종승인)에서는 기안자가 누를 버튼 없음 --%>
												</c:choose>
											</c:when>

											<%-- 2. 현재 사용자가 기안자가 아닌 경우 (결재자인 경우) --%>
											<c:otherwise>
												<%-- 2a. 아직 현재 결재자가 처리하지 않았고, 문서가 결재 가능한 상태일 때만 '결재 처리' 버튼 표시 --%>
												<c:if
													test="${not currentUserProcessed and (approval.crntAtrzStepCd eq 'A202' or approval.crntAtrzStepCd eq 'A203')}">
													<button type="button" class="btn btn-primary"
														data-bs-toggle="modal"
														data-bs-target="#requestApprovalModal">결재 처리</button>
												</c:if>
											</c:otherwise>
										</c:choose>

										<!-- PDF 다운로드 버튼 (항상 표시) -->
										<a href="/approval/downloadPdf/${approval.atrzDocId}"
											class="btn btn-outline-danger" target="_blank">PDF 다운로드</a>
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




	<!-- 결재 처리 모달 -->
	<security:authentication property="principal.realUser.userId"
		var="username" />
	<div class="modal fade" id="requestApprovalModal" tabindex="-1"
		aria-labelledby="requestApprovalModalLabel" aria-hidden="true"
		data-id="${username}">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="requestApprovalModalLabel">결재 처리</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<label class="form-label">처리 의견</label>
						<div class="form-check">
							<input class="form-check-input" type="radio"
								name="approvalAction" id="action-approve" value="approve"
								checked> <label class="form-check-label"
								for="action-approve">승인</label>
						</div>
						<div class="form-check">
							<input class="form-check-input" type="radio"
								name="approvalAction" id="action-reject" value="reject">
							<label class="form-check-label" for="action-reject">반려</label>
						</div>
						<div class="form-check">
							<input class="form-check-input" type="radio"
								name="approvalAction" id="action-finalize" value="finalize">
							<label class="form-check-label" for="action-finalize">전결</label>
						</div>
					</div>

					<div class="form-group mt-3">
						<label for="approval-comment">코멘트 (선택)</label>
						<textarea class="form-control" id="approval-comment" rows="3"></textarea>
					</div>

					<!-- OTP 입력 필드 (OTP 활성화 시에만 표시) -->
					<c:if test="${isOtpEnabled}">
						<div class="form-group mt-3">
							<label for="otpCode">OTP 인증 코드</label> <input type="number"
								class="form-control" id="otpCode" placeholder="6자리 숫자 입력"
								required>
						</div>
					</c:if>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary"
						id="confirm-approval-action">확인</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 승인 시 필요한 전송 폼 -->
	<form id="approval-approve-form" action="/approval/approve"
		method="post" class="d-none">
		<input type="hidden" name="docId" value="${approval.atrzDocId}">
		<input type="hidden" name="lineSqn" value=""> <input
			type="hidden" name="currentSeq" value=""> <input
			type="hidden" name="opinion" value=""> <input type="hidden"
			name="signFileId" value=""> <input type="hidden"
			name="htmlData" value=""> <input type="hidden" name="otpCode"
			value="">
		<!-- OTP 코드 필드 추가 -->
		<c:if test="${not empty _csrf}">
			<input type="hidden" name="${_csrf.parameterName}"
				value="${_csrf.token}" />
		</c:if>
	</form>

	<!-- 전결 시 필요한 전송 폼 -->
	<form id="approval-delegate-form" action="/approval/delegate"
		method="post" class="d-none">
		<input type="hidden" name="docId" value="${approval.atrzDocId}">
		<input type="hidden" name="lineSqn" value=""> <input
			type="hidden" name="opinion" value=""> <input type="hidden"
			name="signFileId" value=""> <input type="hidden"
			name="htmlData" value=""> <input type="hidden" name="otpCode"
			value="">
		<!-- OTP 코드 필드 추가 -->
		<c:if test="${not empty _csrf}">
			<input type="hidden" name="${_csrf.parameterName}"
				value="${_csrf.token}" />
		</c:if>
	</form>

	<!-- 회수 시 필요한 전송 폼 -->
	<form id="approval-retract-form" action="/approval/retract"
		method="post" class="d-none">
		<input type="hidden" name="docId" value="${approval.atrzDocId}">
		<c:if test="${not empty _csrf}">
			<input type="hidden" name="${_csrf.parameterName}"
				value="${_csrf.token}" />
		</c:if>
	</form>

	<!-- 반려 시 필요한 전송 폼 -->
	<form id="approval-reject-form" action="/approval/reject" method="post"
		class="d-none">
		<input type="hidden" name="docId" value="${approval.atrzDocId}">
		<input type="hidden" name="lineSqn" value=""> <input
			type="hidden" name="opinion" value=""> <input type="hidden"
			name="otpCode" value="">
		<!-- OTP 코드 필드 추가 -->
		<c:if test="${not empty _csrf}">
			<input type="hidden" name="${_csrf.parameterName}"
				value="${_csrf.token}" />
		</c:if>
	</form>

	<!-- 상신 문서 회수 모달 -->
	<div class="modal fade" id="retractModal" tabindex="-1"
		aria-labelledby="retractModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="retractModalLabel">문서 회수</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>상신한 문서를 회수하시겠습니까?</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary" id="confirm-retract">확인</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 반려 문서 회수 모달 -->
	<div class="modal fade" id="retractRejectedModal" tabindex="-1"
		aria-labelledby="retractRejectedModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="retractRejectedModalLabel">반려 문서
						회수</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>반려된 문서를 회수하시겠습니까?</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary"
						id="confirm-retract-rejected">확인</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 회수한 문서 임시 저장 모달 -->
	<div class="modal fade" id="saveRetractedAsTempModal" tabindex="-1"
		aria-labelledby="saveRetractedAsTempModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="saveRetractedAsTempModalLabel">회수
						문서 임시 저장</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p>회수한 문서를 임시 저장함에 저장하시겠습니까?</p>
					<p class="text-muted small">저장 시 해당 문서는 목록에서 삭제됩니다.</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-light-secondary"
						data-bs-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary"
						id="confirm-save-retracted-as-temp">확인</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 회수한 문서 임시 저장 시 필요한 전송 폼 -->
	<form id="save-retracted-as-temp-form"
		action="/approval/saveRetractedAsTemp" method="post" class="d-none">
		<input type="hidden" name="docId" value="${approval.atrzDocId}">
		<input type="hidden" name="htmlData" value="">
		<!-- html 추출 폼 -->
		<c:if test="${not empty _csrf}">
			<input type="hidden" name="${_csrf.parameterName}"
				value="${_csrf.token}" />
		</c:if>
	</form>


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

  // OTP 에러가 있을 경우 SweetAlert2 모달을 띄웁니다.
  <c:if test="${isOtpError}">
    swalInfo('${message}', 'error', 'OTP 인증 실패');
  </c:if>

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

  // ===== 엘리먼트 참조 (DOM만 사용) =====
  var confirmBtn = document.getElementById('confirm-approval-action');
  var approveForm = document.getElementById('approval-approve-form');
  var delegateForm = document.getElementById('approval-delegate-form');
  var rejectForm  = document.getElementById('approval-reject-form');
  var commentEl   = document.getElementById('approval-comment');

  var retractForm = document.getElementById('approval-retract-form');
  var confirmRetractBtn = document.getElementById('confirm-retract');
  var confirmRetractRejectedBtn = document.getElementById('confirm-retract-rejected');

  var confirmSaveRetractedAsTempBtn = document.getElementById('confirm-save-retracted-as-temp');
  var saveRetractedAsTempForm = document.getElementById('save-retracted-as-temp-form');

  // OTP 인풋(있으면) 숫자 6자리 제한
  var otpInput = document.getElementById('otpCode');
  if (otpInput) {
    otpInput.addEventListener('input', function(e){
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    });
  }

  // 아직 처리되지 않은 첫 결재 라인 (기존 DOM 구조 이용)
  function findFirstPendingLine() {
    return document.querySelector('.approval-line-table .d-flex[data-line-sqn][data-processed="false"]');
  }

  // ===== 회수 확인 모달을 SweetAlert2로 대체 =====
  if (confirmRetractBtn) {
    confirmRetractBtn.addEventListener('click', function(){
      swalConfirm({ title: '문서 회수', text: '상신한 문서를 회수하시겠습니까?' }).then(function(ok){
        if (!ok) return;
        toastInfo('회수 처리 중...');
        if (retractForm) retractForm.submit();
      });
    });
  }

  if (confirmRetractRejectedBtn) {
    confirmRetractRejectedBtn.addEventListener('click', function(){
      // 부트스트랩 모달이 이미 확인 역할을 하므로, 중복되는 SweetAlert 확인 창을 제거합니다.
      toastInfo('회수 처리 중...');
      if (retractForm) retractForm.submit();
    });
  }

  // ===== 회수 문서 임시 저장 (DOM에서 본문 읽기) =====
  if (confirmSaveRetractedAsTempBtn) {
    confirmSaveRetractedAsTempBtn.addEventListener('click', function(){
      // 화면에 렌더된 본문을 그대로 사용 (EL/리터럴 없음)
      var htmlDataArea = document.querySelector('#htmlDataFormArea');
      var fullHtmlContent = htmlDataArea ? htmlDataArea.innerHTML : '';

      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = fullHtmlContent;

      var draftContentArea = tempDiv.querySelector('#draftContentArea');
      if (!draftContentArea) {
        swalInfo('본문(draftContentArea)을 찾을 수 없습니다.', 'warning');
        return;
      }

      // changeInput → input 치환 (기존 로직 유지)
      var clone = draftContentArea.cloneNode(true);
      var nodes = clone.querySelectorAll('.changeInput');
      for (var i=0; i<nodes.length; i++) {
        var el = nodes[i];
        var spanValue = el.textContent;
        var inputTag = document.createElement('input');
        inputTag.classList.add('form-control', 'num-' + i);
        inputTag.setAttribute('value', spanValue);
        el.replaceWith(inputTag);
      }

      var htmlContent = clone.innerHTML;
      var htmlDataInput = saveRetractedAsTempForm ? saveRetractedAsTempForm.querySelector('input[name="htmlData"]') : null;
      if (!htmlDataInput) {
        swalInfo('임시 저장용 htmlData 필드를 찾지 못했습니다.', 'error');
        return;
      }

      htmlDataInput.value = htmlContent;
      toastInfo('임시 저장 중...');
      saveRetractedAsTempForm.submit();
    });
  }

  // ===== 결재 처리(승인/전결/반려) confirm 교체 =====
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      var action = (document.querySelector('input[name="approvalAction"]:checked') || {}).value;
      var firstPending = findFirstPendingLine();
      var otpCode = otpInput ? otpInput.value : '';

    // --- START: OTP 클라이언트 측 유효성 검사 추가 ---
    // isOtpEnabled는 JSP 변수이므로, JavaScript에서 직접 접근할 수 없습니다.
    // 대신, otpInput 엘리먼트의 존재 여부로 OTP 활성화 여부를 판단합니다.
    if (otpInput) { // OTP 입력 필드가 존재하면 (즉, OTP가 활성화된 사용자)
      if (!otpCode || otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
        swalInfo('6자리 OTP 인증 코드를 정확히 입력해주세요.', 'warning', 'OTP 입력 오류');
        return; // 폼 제출 방지
      }
    }
    // --- END: OTP 클라이언트 측 유효성 검사 추가 ---
      if (!firstPending) {
        swalInfo('처리할 결재 라인을 찾을 수 없습니다.', 'warning');
        return;
      }

      var lineSqn    = firstPending.getAttribute('data-line-sqn') || '';
      var currentSeq = firstPending.getAttribute('data-current-seq') || '';
      var opinion    = (commentEl && commentEl.value ? commentEl.value : '').trim();

      if (!lineSqn) {
        swalInfo('결재 라인 식별자(lineSqn)가 없습니다.', 'warning');
        return;
      }

      // 공통: htmlData 생성용 함수 (현재 화면의 본문을 그대로 사용)
      function setHtmlDataTo(formEl) {
        var area = document.querySelector('#htmlDataFormArea');
        var htmlDataHidden = formEl ? formEl.querySelector('input[name="htmlData"]') : null;
        if (area && htmlDataHidden) {
          htmlDataHidden.value = area.innerHTML;
        }
      }

      // ===== 승인 =====
      if (action === 'approve') {
        swalConfirm({ title: '승인', text: '승인하시겠습니까?' }).then(function(ok){
          if (!ok) return;

          var form = approveForm;
          if (!form) return;
          var f = form.querySelector.bind(form);
          f('input[name="lineSqn"]').value     = lineSqn;
          f('input[name="currentSeq"]').value  = currentSeq;
          f('input[name="opinion"]').value     = opinion;
          var otpFieldA = f('input[name="otpCode"]');
          if (otpFieldA) otpFieldA.value = otpCode;

          // 도장/날짜(존재할 때만)
          var modal = document.getElementById('requestApprovalModal');
          var rid = (modal && modal.dataset) ? modal.dataset['id'] : '';
          var signDiv  = document.getElementById('approverSignDiv-' + rid);
          var signDate = document.getElementById('approverSignDate-' + rid);
          if (signDiv) {
            signDiv.innerHTML += '<img alt="결재 도장" src="https://starworks-1.s3.ap-northeast-2.amazonaws.com/approval/sign/approval.png" style="height:30px;width:30px">';
          }
          if (signDate) {
            var d = new Date();
            var yyyy = d.getFullYear();
            var mm   = String(d.getMonth()+1).padStart(2,'0');
            var dd   = String(d.getDate()).padStart(2,'0');
            signDate.textContent = yyyy + '/' + mm + '/' + dd;
          }

          setHtmlDataTo(form);
          toastInfo('승인 처리 중...');
          form.submit();
        });
        return;
      }

      // ===== 전결 =====
      if (action === 'finalize') {
        swalConfirm({ title: '전결', text: '전결 처리하시겠습니까? 이후 결재선은 자동 승인됩니다.' }).then(function(ok){
          if (!ok) return;

          var form = delegateForm;
          if (!form) return;
          var f = form.querySelector.bind(form);
          f('input[name="lineSqn"]').value = lineSqn;
          f('input[name="opinion"]').value = opinion;
          var otpFieldD = f('input[name="otpCode"]');
          if (otpFieldD) otpFieldD.value = otpCode;

          var modal = document.getElementById('requestApprovalModal');
          var rid = (modal && modal.dataset) ? modal.dataset['id'] : '';
          var signDiv  = document.getElementById('approverSignDiv-' + rid);
          var signDate = document.getElementById('approverSignDate-' + rid);
          if (signDiv) {
            signDiv.innerHTML += '<img alt="전결 도장" src="https://starworks-1.s3.ap-northeast-2.amazonaws.com/approval/sign/finalApproval.png" style="height:30px;width:30px">';
          }
          if (signDate) {
            var d = new Date();
            var yyyy = d.getFullYear();
            var mm   = String(d.getMonth()+1).padStart(2,'0');
            var dd   = String(d.getDate()).padStart(2,'0');
            signDate.textContent = yyyy + '/' + mm + '/' + dd;
          }

          setHtmlDataTo(form);
          toastInfo('전결 처리 중...');
          form.submit();
        });
        return;
      }

      // ===== 반려 =====
      if (action === 'reject') {
        if (!opinion) {
          swalInfo('반려 시에는 처리 의견을 반드시 입력해야 합니다.', 'warning').then(function(){
            if (commentEl) commentEl.focus();
          });
          return;
        }
        swalConfirm({ title: '반려', text: '반려 처리하시겠습니까?' }).then(function(ok){
          if (!ok) return;

          var form = rejectForm;
          if (!form) return;
          var f = form.querySelector.bind(form);
          f('input[name="lineSqn"]').value = lineSqn;
          f('input[name="opinion"]').value = opinion;
          var otpFieldR = f('input[name="otpCode"]');
          if (otpFieldR) otpFieldR.value = otpCode;

          toastInfo('반려 처리 중...');
          form.submit();
        });
        return;
      }
    });
  }
});
</script>
<!-- 회수 상태일 때 임시 저장 모달을 표시하는 스크립트 -->
<c:if test="${approval.crntAtrzStepCd eq 'A205'}">
<script>
document.addEventListener('DOMContentLoaded', function() {
    var saveModalEl = document.getElementById('saveRetractedAsTempModal');
    if (saveModalEl) {
        var saveModal = new bootstrap.Modal(saveModalEl);
        saveModal.show();
    }
});
</script>
</c:if>
</body>
</html>