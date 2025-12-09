<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 10.     		홍현택            CKEditor 부분 수정
 *	2025. 10. 14.			홍현택			CKEditor 2차 수정
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>

<style>
/* CKEditor5 내용의 단락 간격을 좁게 조정 */
.ck-editor__editable_inline p {
    margin: 0; /* 단락의 위아래 마진을 제거하여 줄 간격을 좁힘 */
}
</style>

<!-- app.js 와 충돌 발생 -->
<!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script> -->

<!-- 기본 js 리소스 -->
<script src="/dist/assets/static/js/components/dark.js"></script>
<!-- <script src="/dist/assets/extensions/perfect-scrollbar/perfect-scrollbar.min.js"></script> -->
<script src="/dist/assets/compiled/js/app.js"></script>

<!-- FullCalendar JS -->
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.19/index.global.min.js'></script>
<script src='https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.19/locales/ko.global.js'></script>

<!-- CKEditor  -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const editorEl = document.querySelector('#editor');
    if (editorEl && typeof ClassicEditor !== 'undefined') {
        // CKEditor 5 커스텀 업로드 어댑터
        function MyUploadAdapter(loader) {
            this.loader = loader;
        }

        MyUploadAdapter.prototype.upload = function() {
            return this.loader.file
                .then(file => new Promise((resolve, reject) => {
                    const data = new FormData();
                    data.append('upload', file); // 서버에서 'upload' 파라미터로 받음

                    fetch('${pageContext.request.contextPath}/ckeditor/imageUpload', {
                        method: 'POST',
                        body: data
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.uploaded) {
                            resolve({
                                default: result.url // CKEditor 5는 'default' 속성에 이미지 URL을 기대
                            });
                        } else {
                            reject(result.error.message);
                        }
                    })
                    .catch(error => {
                        reject('Upload failed: ' + error);
                    });
                }));
        };

        MyUploadAdapter.prototype.abort = function() {
            // 업로드 취소 로직 (필요시 구현)
        };

        // CKEditor 5 플러그인
        function MyUploadAdapterPlugin(editor) {
            editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                return new MyUploadAdapter(loader);
            };
        }

        ClassicEditor
            .create(editorEl, {
                extraPlugins: [MyUploadAdapterPlugin]
            })
            .then(editor => {
                console.log('Editor was initialized', editor);
                window.editor5 = editor; // 전역 변수에 에디터 인스턴스 저장
            })
            .catch(error => {
                console.error(error.stack);
            });
    } else if (editorEl) {
        console.error("ClassicEditor is not loaded. Please ensure CKEditor 5 is correctly included.");
    }
});
</script>

<!-- 공통 유틸 js -->
<script>
	const policiesList = JSON.parse('${policiesList}');
</script>
<script src="/js/module/comm.js"></script>

<!-- WebSocket (로그인 사용자만 실행) -->
<security:authorize access="isAuthenticated()">
    <security:authentication property="principal.realUser.userId" var="username" />
    <script>
        window.username = "${username}"; // websocket.js 에서 사용하기 위한 username 설정
        console.log("웹소켓 확인용 로그인 사용자:", window.username);
    </script>
	<!-- STOMP JS 및 WebSocket 로직 -->
	<script src="https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.0.0/bundles/stomp.umd.min.js"></script>
	<script src="/js/websocket/websocket.js"></script>
</security:authorize>

<!-- toastify-js -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>

<!-- FilePond JS -->
<script src="https://unpkg.com/filepond/dist/filepond.js"></script>
<script>
// input 태그를 찾아서 FilePond 적용
const inputElement = document.querySelector('.filepond');
FilePond.create(inputElement, {
  allowMultiple: true,
  allowReorder: true,
  allowRemove: true
  // 필요하면 서버 업로드 옵션 추가 가능
});
</script>