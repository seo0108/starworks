<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 6.     	임가영            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>

<!-- 로그인 css -->
<link rel="shortcut icon" href="/dist/assets/compiled/svg/favicon2.png" type="image/x-icon">

<!-- Font Awesome(가영 추가) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet">

<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/dist/assets/compiled/css/app.css">
<link rel="stylesheet" href="/dist/assets/compiled/css/auth.css">

<style>
#demoUserSelect:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: transparent !important;
}
</style>
</head>
<body>
	<div id="auth">
		<div class="row h-100">
			<div class="col-lg-5 col-12">
				<div id="auth-left">
<!-- 					<div class="auth-logo"> -->
<!-- 						<a href="index.html"><img src="dist/assets/compiled/svg/logo.svg" alt="Logo"></a> -->
<!-- 					</div> -->
					<h1 class="auth-title mb-5"><a href="/"><img src="/images/logo/starworks_logo_5.png" alt="Logo" style="width: 380px; height: auto;"></a></h1>
					<p class="auth-subtitle mb-4">사원 아이디와 비밀번호를 입력해주세요.</p>

					 <!-- 스프링 시큐리티 설정과 일치하는 폼 -->
        			<form method="post" id="loginForm">
						<div class="form-group position-relative has-icon-left mb-4">
							<!-- 아이디 -->
							<input type="text" id="username" name="username" class="form-control form-control-xl" placeholder="사원 ID">
							<div class="form-control-icon">
								<i class="bi bi-person"></i>
							</div>
						</div>
						<div class="form-group position-relative has-icon-left mb-4">
							<!-- 비밀번호 -->
							<input type="password" id="password" name="password" class="form-control form-control-xl"
								placeholder="비밀번호">
							<div class="form-control-icon">
								<i class="bi bi-shield-lock"></i>
							</div>
						</div>
						<div class="form-check form-check-lg d-flex align-items-end">
							<input class="form-check-input me-2" type="checkbox" value=""
								id="flexCheckDefault"> <label
								class="form-check-label text-gray-600" for="flexCheckDefault">
								로그인 상태 유지 </label>
						</div>
						<div id="login-error" class="text-danger mt-3" style="display: none; text-align: center;"></div>
						<!-- 시연용 자동 로그인 -->

						<!-- 일반 로그인 버튼 -->
						<button type="submit" id="generalLoginBtn" class="btn btn-primary btn-block btn-lg shadow-lg mt-5">Log in</button>
						<!--  자동 로그인 메뉴개발팀 임선아 -->
						<button type="button" id="menuLoginBtn" class="btn btn-secondary btn-block btn-lg shadow-lg mt-2">메뉴개발팀 임선아 차장</button>
						<!--  자동 로그인 인사팀 이민정 -->
						<button type="button" id="insaLoginBtn" class="btn btn-secondary btn-block btn-lg shadow-lg mt-2">인사팀 이민정 차장</button>
						<div class="form-group position-relative mb-4">

						<!--  숨겨진 시연용 셀렉트 박스 로그인 버튼 좌측 하단에 있음! -->
							<select id="demoUserSelect" class="form-select form-select-sm" style="font-size: 0.7rem;
							padding-top: 0.2rem; padding-bottom: 0.2rem; height: auto; width: 9%;
							background-color: transparent; border-color: transparent; background-image: none;">
								<option value="" style="position: absolute; top: 10px;
										right: 10px; z-index: 9999; opacity: 0.2;"></option>
								<option value="2026078,java">부장 </option>
								<option value="20260419,java">차장 </option>
								<option value="2026049,java">대리 </option>
								<option value="2026050,java">대리2 </option>
								<option value="2026052,java">사원 </option>
								<option value="2026009,java">김주민 </option>
								<option value="2026064,java">윤서현 </option>
								<option value="2026063,java">임가영 </option>
								<option value="2026066,java">장어진 </option>
								<option value="2026006,java">홍현택 </option>
							</select>
						</div>

					</form>
					<div class="text-center mt-5">
						<p class="text-gray-600">Copyright © STARWORKS GROUPWARE. All rights reserved.</p>
					</div>
				</div>
			</div>
			<div class="col-lg-7 d-none d-lg-block">
				<div id="auth-right">
				    <video autoplay muted loop class="bg-video">
				        <source src="https://www.pexels.com/ko-kr/download/video/6774633/" type="video/mp4">
				    </video>
				    <!-- 오버레이 -->
    				<div class="overlay-purple"></div>
				</div>
			</div>
		</div>
	</div>
<%-- 	<%@ include file="/WEB-INF/fragments/postScript.jsp" %> --%>
<%-- 	<security:authentication property="principal"/> --%>
</body>

<script>
//자동 로그인 상수
 const autologin = {
   form: null,
   usernameInput: null,
   passwordInput: null,
   generalLoginBtn: null, // 일반 로그인 버튼 추가
   menuLoginBtn: null, // 임선아 자동 로그인 버튼 추가
   insaLoginBtn: null, // 이민정 자동 로그인 버튼 추가
   demoUserSelect: null,

   init() {
     this.form = document.getElementById("loginForm");
     this.usernameInput = document.getElementById("username");
     this.passwordInput = document.getElementById("password");
     this.generalLoginBtn = document.getElementById("generalLoginBtn"); // 일반 로그인 버튼 초기화
     this.menuLoginBtn = document.getElementById("menuLoginBtn"); // 임선아 자동 로그인 버튼 초기화
     this.insaLoginBtn = document.getElementById("insaLoginBtn"); // 이민정 자동 로그인 버튼 초기화
     this.demoUserSelect = document.getElementById("demoUserSelect");

     if (this.form && this.usernameInput && this.passwordInput && this.generalLoginBtn && this.menuLoginBtn && this.insaLoginBtn && this.demoUserSelect) {
       this.bindEvents();
     } else {
       console.warn("로그인 요소 초기화 실패");
     }
   },

   bindEvents() {
     // 폼 제출 이벤트
     this.form.addEventListener("submit", (event) => {
       event.preventDefault(); // 기본 폼 제출 방지
       this.login(this.usernameInput.value, this.passwordInput.value);
     });

     // 홍현택 자동 로그인 버튼 이벤트
     this.menuLoginBtn.addEventListener("click", () => {
       this.login('20260419', 'java'); // 임선아 계정 정보로 로그인
     });
     this.insaLoginBtn.addEventListener("click", () => {
       this.login('2026002', 'java'); // 이민정 계정 정보로 로그인
     });

     // 시연용 계정 선택 이벤트
     this.demoUserSelect.addEventListener("change", (event) => {
        const selectedValue = event.target.value;
        if(selectedValue){
            const [username, password] = selectedValue.split(',');
            this.usernameInput.value = username;
            this.passwordInput.value = password;
            // 선택 후 글자색 투명 처리
            event.target.style.color = 'transparent';
        } else {
            this.usernameInput.value = '';
            this.passwordInput.value = '';
            // 선택 해제 시 글자색 원래대로
            event.target.style.color = '';
        }
     });
     // 포커스 시 글자색 표시
     this.demoUserSelect.addEventListener("focus", (event) => {
        event.target.style.color = '';
     });
   },

   // 로그인 비동기 처리 폼전송 (10.20현택 추가)
   async login(id, pw) {
	 const errorDiv = document.getElementById('login-error');
     try {
       const response = await fetch('/common/auth', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',

         },
         credentials : "include",
         body: JSON.stringify({ username: id, password: pw }),
       });

       if (response.ok) {
    	 errorDiv.style.display = 'none';
         // 로그인 성공 시 React 앱으로 리디렉션
         // 서버에서 HttpOnly 쿠키로 JWT를 설정했으므로, 클라이언트에서는 별도 처리 없이 리디렉션만 하면 됨
         window.location.href = '/'; // Spring 앱의 기본 URL로 리디렉션
       } else {
         // 로그인 실패 처리
         const errorData = await response.json();
         errorDiv.innerText = errorData.message;
         errorDiv.style.display = 'block';
         console.error('Login failed:', errorData);
       }
     } catch (error) {
       errorDiv.innerText = '로그인 중 오류가 발생했습니다.';
       errorDiv.style.display = 'block';
       console.error('Login request error:', error);
     }
   }
 };

 // DOM 로드 후 초기화
 document.addEventListener("DOMContentLoaded", () => {
  autologin.init();
 });
</script>
</html>
