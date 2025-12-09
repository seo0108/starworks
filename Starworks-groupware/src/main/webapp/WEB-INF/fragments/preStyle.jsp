<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!-- <link rel="shortcut icon" href="/dist/assets/compiled/svg/favicon.svg" type="image/x-icon"> -->
<link rel="shortcut icon" href="/dist/assets/compiled/svg/favicon2.png" type="image/x-icon">

<!-- Font Awesome(가영 추가) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet">

<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/dist/assets/compiled/css/app.css">
<!-- <link rel="stylesheet" href="/dist/assets/compiled/css/app2.css"> -->
<link rel="stylesheet" href="/css/user-main.css">
<!-- <link rel="stylesheet" href="/css/user-main2.css"> -->
<link rel="stylesheet" href="/css/orgchart.css">
<link rel="stylesheet" href="/css/approval.css">

<!-- CKEditor -->
<script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script>

<!-- sweetAlert -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<!-- <link rel="stylesheet" href="/dist/assets/extensions/sweetalert2/sweetalert2.min.css"> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">

<!-- PDF.js 라이브러리 -->
<script src="https://mozilla.github.io/pdf.js/build/pdf.js"></script>

<!-- toastify-js -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">

<!-- DropZONE -->
<script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css"/>

<style>
/* UI 렌더링 애니메이션 */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-on-load {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }


 /* CKEditor 5 에디터 전역 */
 .ck.ck-editor{
 max-width: 100%;
 }
 .ck-editor__editable {
       min-height: 400px;
 }
 /* CKEditor 5 편집 영역 */
.ck-content figure.image {
  max-width: 800px;      /* 원하는 상한 (px/%) */
  margin: 1rem auto;     /* 가운데 정렬 */
}
.ck-content figure.image > img {
  width: 100%;           /* figure 너비에 맞춰 축소 */
  height: auto;          /* 비율 유지 */
  display: block;
}
/* 글 보기 화면의 본문 컨테이너 (예: .editor-content) */
.editor-content figure.image {
  max-width: 800px;      /* 동일한 상한 적용 */
  margin: 1rem auto;
}
.editor-content figure.image > img {
  width: 100%;
  height: auto;
  display: block;
}

.editor-content { overflow: hidden; }
.editor-content img { max-width: 100%; height: auto; }
.email-content .image img{
width: 100%;
}
</style>
