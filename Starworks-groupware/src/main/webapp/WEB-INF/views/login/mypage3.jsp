<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>마이페이지</title>
    <link rel="stylesheet" href="/mazer-1.0.0/dist/assets/css/bootstrap.css">
</head>
<body>
    <div class="container mt-5">
        <h3>마이페이지</h3>
        <p class="text-muted">내 정보를 수정할 수 있습니다.</p>

        <div class="card">
            <div class="card-body">
                <form action="/mypage/update" method="post">
                    <div class="mb-3 d-flex align-items-center">
                        <img src="${user.userImgFileId != null ? user.userImgFileId : '/mazer-1.0.0/dist/assets/images/faces/1.jpg'}"
                             alt="프로필사진" class="rounded-circle me-3" width="80" height="80">
                        <div>
                            <h5 class="fw-bold">${user.userNm}</h5>
                            <small class="text-muted">${user.deptNm}</small>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label>이름</label>
                        <input type="text" class="form-control" name="userNm" value="${user.userNm}">
                    </div>

                    <div class="mb-3">
                        <label>내선번호</label>
                        <input type="text" class="form-control" name="extTel" value="${user.extTel}">
                    </div>

                    <div class="mb-3">
                        <label>연락처</label>
                        <input type="text" class="form-control" name="userTelno" value="${user.userTelno}">
                    </div>

                    <div class="mb-3">
                        <label>이메일</label>
                        <input type="email" class="form-control" name="userEmail" value="${user.userEmail}">
                    </div>

                    <button type="submit" class="btn btn-primary">정보 수정</button>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
