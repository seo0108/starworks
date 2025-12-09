<!-- 
 * == 개정이력(Modification Information) ==
 *   
 *   수정일      			수정자       			수정내용
 *  ============   	============== =======================
 *  2025. 9. 27.     	홍현택      			최초 생성, id="" 추가
 *
--
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<!-- [Head] start -->
<head>
  <meta charset="UTF-8">
  <title>로그인 - Mazer Admin Dashboard</title>
  <%@ include file="/WEB-INF/fragments/preStyle.jsp" %>
  <style>
    html, body {
      height: 100%;
    }
    #auth {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<!-- [Head] end -->
<!-- [Body] Start -->
<body>
  <div id="auth">
    <div class="col-lg-5 col-12">
      <div id="auth-left">
        <div class="auth-logo">
          <a href="#"><img src="/images/logo/logo.png" alt="Logo"></a>
        </div>
        <h1 class="auth-title">로그인</h1>
        <p class="auth-subtitle mb-5">아이디와 비밀번호를 입력해주세요.</p>

        <!-- 스프링 시큐리티 설정과 일치하는 폼 -->
        <form method="post" id="loginForm">
          <div class="form-group position-relative has-icon-left mb-4">
            <input type="text" id="username" name="username" class="form-control form-control-xl" placeholder="아이디" required>
            <div class="form-control-icon"><i class="bi bi-person"></i></div>
          </div>
          <div class="form-group position-relative has-icon-left mb-4">
            <input type="password" id="password" name="password" class="form-control form-control-xl" placeholder="비밀번호" required>
            <div class="form-control-icon"><i class="bi bi-shield-lock"></i></div>
          </div>
          <!-- 일반 로그인 버튼 -->
          <button type="submit" class="btn btn-primary btn-block btn-lg shadow-lg mt-5">로그인</button>
          <!-- 개발용 자동 로그인 버튼 -->
 		 <button type="button" id="autoLoginBtn" class="btn btn-outline-secondary btn-block btn-lg shadow-lg mt-3">
    		자동 로그인 (개발용)</button>
        </form>

        <div class="text-center mt-5 text-lg fs-4">
          <p class="text-gray-600">계정이 없으신가요? <a href="#" class="font-bold">회원가입</a></p>
          <p><a class="font-bold" href="#">비밀번호를 잊으셨나요?</a></p>
        </div>
      </div>
    </div>
  </div>
  <%@ include file="/WEB-INF/fragments/postScript.jsp" %>
</body>
<script>
	//자동 로그인 상수
  const autologin = {
    form: null,
    usernameInput: null,
    passwordInput: null,
    autoBtn: null,

    init() {
      this.form = document.getElementById("loginForm");
      this.usernameInput = document.getElementById("username");
      this.passwordInput = document.getElementById("password");
      this.autoBtn = document.getElementById("autoLoginBtn");

      if (this.form && this.usernameInput && this.passwordInput && this.autoBtn) {
        this.bindEvents();
      } else {
        console.warn("자동 로그인  실패");
      }
    },

    bindEvents() {
      this.autoBtn.addEventListener("click", () => this.login());
    },

    login() {
      this.usernameInput.value = "a001"; 
      this.passwordInput.value = "asdf";
      this.form.submit();
    }
  };

  // DOM 로드 후 초기화
  document.addEventListener("DOMContentLoaded", () => {
	  autologin.init();
  });
</script>

</html>
