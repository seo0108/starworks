<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *	2025. 10. 21.		홍현택		메시지 전달
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<div id="main-content">
<div class="page-heading">
    <h3>Google OTP 설정</h3>
</div>
<div class="page-content">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4>2단계 인증(OTP) 설정</h4>
                    <p>보안 강화를 위해 Google OTP를 설정해주세요.</p>
                </div>
                <div class="card-body">
                    <c:if test="${not empty message}">
                        <div class="alert alert-success">${message}</div>
                    </c:if>
                    <c:if test="${not empty error}">
                        <div class="alert alert-danger">${error}</div>
                    </c:if>

                    <div class="row">
                        <div class="col-md-6 text-center">
                            <h5>1. Authenticator 앱으로 QR 코드 스캔</h5>
                            <p>Google Authenticator 앱을 열고 아래 QR 코드를 스캔하세요.</p>
                            <img src="${qrCodeDataUrl}" alt="OTP QR Code" class="img-fluid">
                            <p class="mt-3">QR 코드 스캔이 불가능한 경우, 아래 비밀 키를 직접 입력하세요.</p>
                            <p><strong>비밀 키: </strong> <code>${secretKey}</code></p>
                        </div>
                        <div class="col-md-6">
                            <h5>2. 인증 코드 입력</h5>
                            <p>앱에 표시된 6자리 인증 코드를 입력하여 설정을 완료하세요.</p>
                            <form action="/mypage/otp/verify" method="post">
                                <input type="hidden" name="secretKey" value="${secretKey}">
                                <div class="form-group">
                                    <label for="otpCode">OTP 인증 코드</label>
                                    <input type="number" class="form-control" id="otpCode" name="otpCode" placeholder="6자리 숫자 입력" required autofocus>
                                </div>
                                <button type="submit" class="btn btn-primary">인증 및 활성화</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         </div>
</div>
