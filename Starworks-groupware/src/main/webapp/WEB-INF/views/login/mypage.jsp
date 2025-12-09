<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="sec"%>

<!DOCTYPE html>
<html lang="ko">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>마이페이지</title>
</head>

<body>
	<div id="main-content" style="padding: 2rem 10rem">

		<div class="page-heading">

			<div class="outline-section-4">
				<div class="outline-title">마이페이지</div>
				<div class="outline-subtitle">회원님의 정보를 관리합니다.</div>
			</div>

			<%-- Flash-Attribute 메시지 표시 --%>
			<c:if test="${not empty message}">
				<div class="alert alert-success alert-dismissible fade show"
					role="alert">
					${message}
					<button type="button" class="btn-close" data-bs-dismiss="alert"
						aria-label="Close"></button>
				</div>
			</c:if>

			<section class="section">
				<div class="row">
					<div class="col-12 col-lg-4">
						<div class="card mb-3">
							<div class="card-body">
								<div
									class="d-flex justify-content-center align-items-center flex-column">
									<div class="avatar avatar-2xl">
										<c:choose>
											<c:when test="${not empty userInfo.userImgFileId}">
												<img src="${fileList[0].filePath }" alt="Profile"
													class="border hoverZoomLink"
													style="width: 180px; height: 180px">
											</c:when>
											<c:otherwise>
												<div class="avatar avatar-xl">
													<img src="/images/faces/1.jpg" alt="Face 1"
														class="hoverZoomLink">
												</div>
											</c:otherwise>
										</c:choose>
									</div>

									<h3 class="mt-3">${userInfo.userNm}</h3>
									<p class="text-small">${userInfo.deptNm}${userInfo.jbgdNm}</p>
								</div>
							</div>
						</div>

						<div class="card mb-0">
							<div class="card-header">
								<h4 class="card-title">보안 설정</h4>
							</div>
							<div class="card-body">
								<c:choose>
									<c:when test="${isOtpEnabled}">
										<p>2단계 인증(OTP)이 활성화되어 있습니다.</p>
										<form action="/mypage/otp/disable" method="post"
											onsubmit="return confirm('OTP를 비활성화하시겠습니까? 비활성화 후에는 앱에서 해당 계정을 삭제해야 합니다.');">
											<sec:csrfInput />
											<button type="submit" class="btn btn-danger">OTP
												비활성화</button>
										</form>
									</c:when>
									<c:otherwise>
										<p>2단계 인증(OTP)을 설정하여 계정을 안전하게 보호하세요.</p>
										<a href="/mypage/otp/setup" class="btn btn-warning">OTP 설정
											페이지로 이동</a>
									</c:otherwise>
								</c:choose>
							</div>
						</div>

					</div>
					<div class="col-12 col-lg-8">
						<div class="card" style="height: 100%">
							<div class="card-body">
								<form:form method="post" action="/mypage/update"
									enctype="multipart/form-data">
									<input type="hidden" name="userId" value="${userInfo.userId}">
									<input type="hidden" name="deptId" value="${userInfo.deptId}">
									<input type="hidden" name="jbgdCd" value="${userInfo.jbgdCd}">
									<input type="hidden" name="userPswd"
										value="${userInfo.userPswd}">

									<div class="form-group">
										<label for="photo">프로필 사진</label> <input type="file"
											class="form-control" id="formFileMultiple" name="fileList">
									</div>

									<div class="form-group">
										<label for="name">이름</label> <input type="text"
											class="form-control" id="userNm" name="userNm"
											value="${userInfo.userNm}">
									</div>
									<div class="form-group">
										<label for="dob">내선번호</label> <input type="text"
											class="form-control" id="extTel" name="extTel"
											value="${userInfo.extTel}">
									</div>
									<div class="form-group">
										<label for="phone">연락처</label> <input type="text"
											class="form-control" id="userTelno" name="userTelno"
											value="${userInfo.userTelno}">
									</div>
									<div class="form-group">
										<label for="email">이메일</label> <input type="email"
											class="form-control" id="userEmail" name="userEmail"
											value="${userInfo.userEmail}">
									</div>

									<div class="col-12 d-flex justify-content-end">
										<button type="submit" class="btn btn-primary me-1 mb-1">
											정보 수정
										</button>
									</div>

								</form:form>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>


	</div>
<script>
document.addEventListener('DOMContentLoaded', function () {
  // ===== SweetAlert2 helpers =====
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

  function swalConfirm(opts = {}) {
    const {
      icon = 'question',
      title = '확인',
      text = '',
      confirmText = '확인',
      cancelText = '취소'
    } = opts;
    return Swal.fire({
      icon, title, text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      allowOutsideClick: false
    }).then(res => res.isConfirmed);
  }

  function toastSuccess(msg) { Toast.fire({ icon: 'success', title: String(msg) }); }

//===== OTP 비활성화 폼 =====
  const otpDisableForm = document.querySelector('form[action="/mypage/otp/disable"]');

  // 1. '/mypage/otp/disable' 경로로 지정된 form 요소를 선택한다.
  if (otpDisableForm) {
    try {
      // 2. 기존에 연결된 onsubmit 이벤트 핸들러가 있을 경우 제거하여 중복 실행을 방지한다.
      otpDisableForm.onsubmit = null;
    } catch (e) {
      // 3. 예외 발생 시 무시
    }
    // 4. 폼 제출(submit) 이벤트를 감지한다.
    otpDisableForm.addEventListener('submit', function (e) {
      // 5. 기본 폼 제출 동작(페이지 리로드 등)을 막음.
      e.preventDefault();
      // 6. SweetAlert2를 이용하여 OTP 비활성화 여부를 사용자에게 확인한다.
      swalConfirm({
        title: 'OTP 비활성화',
        text: 'OTP를 비활성화하시겠습니까? 비활성화 후에는 앱에서 해당 계정을 삭제해야 합니다.'
      }).then(ok => {
        // 7. 사용자가 "확인"을 누르지 않은 경우 아무 동작도 수행하지 않는다.
        if (!ok) return;
        // 8. 사용자가 확인을 누른 경우, 실제 폼을 전송한다.
        otpDisableForm.submit();
      });
    });
  }


  // Flash alert -> 토스트로 대체
  const flashAlert = document.querySelector('.alert.alert-success.alert-dismissible');
  if (flashAlert) {
    const msg = flashAlert.textContent.trim();
    if (msg) {
      flashAlert.style.display = 'none'; // 기존 alert 숨김
      toastSuccess(msg);
    }
  }
});
</script>

</body>

<c:if test="${updateSuccess}">
  <script>
    // 간단 알림 후 새로고침
    Swal.fire({
      icon: 'success',
      title: '완료',
      text: '회원 정보가 수정되었습니다.',
      confirmButtonText: '확인'
    }).then(function(){ location.reload(); });
  </script>
</c:if>

</html>