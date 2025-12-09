<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *	2025. 10. 14.		홍현택		메시지 전송
 *
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
<title>메일 작성</title>
</head>
<body>
	<script>
  // 전역 컨텍스트/공유 객체
  window.contextPath = '${pageContext.request.contextPath}';
  window.selectedRecipients = window.selectedRecipients || [];
</script>

	<div id="main-content">

		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/mail/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">
				<div class="outline-section">
					<div class="outline-title">메일 쓰기</div>
					<div class="outline-subtitle">소식과 업무 메일을 작성해주세요.</div>
				</div>

				<div class="page-content">
					<section class="section">
						<div class="row">
							<div class="col-12">
								<div class="card">
									<div class="card-body px-5">

											<!-- 시연용으로 숨겨진 버튼! "받는 사람" 맨 오른쪽에 있음 -->
										<button type="button" id="demoMailBtn" class="btn btn-sm" style="position: absolute; top: 10px;
										right: 10px; z-index: 9999; opacity: 0.2;"></button>

										<div class="row">
											<%-- 						비활성화			<%@include file="/WEB-INF/views/mail/left-menu.jsp"%> --%>
											<div class="col-md-12" id="email-dynamic-content-area">
												<form id="sendForm" method="post"
													action="${pageContext.request.contextPath}/mail/send"
													enctype="multipart/form-data">
													<!-- 초안 수정 시 사용 -->
													<input type="hidden" id="emailContId" name="emailContId"
														value="${draftEmail.emailContId}" />

													<div class="mb-3 position-relative">
														<label for="emailTo" class="form-label">받는 사람</label> <input
															type="text" class="form-control" id="emailTo"
															placeholder="여러명은 쉼표(,)로 구분">
														<div id="autocomplete-suggestions"
															class="list-group position-absolute w-100"
															style="z-index: 1000; max-height: 200px; overflow-y: auto; display: none;"></div>
														<span id="emailToError" class="text-danger"
															style="display: none;"></span>
													</div>

													<div class="mb-3">
														<label for="emailSubject" class="form-label">제목</label> <input
															type="text" class="form-control" id="emailSubject"
															name="subject" placeholder="메일 제목"
															value="${draftEmail.subject}" /> <span
															id="emailSubjectError" class="text-danger"
															style="display: none;"></span>
													</div>

													<div class="mb-3">
														<label for="composeEditor" class="form-label">내용</label>
														<!-- NOTE: id를 composeEditor로 변경하여 외부 #editor 초기화와 충돌 차단 -->
														<textarea id="composeEditor" name="content"></textarea>
														<span id="composeEditorError" class="text-danger"
															style="display: none;"></span>
													</div>

													<div class="mb-3">
														<label for="formFileMultiple" class="form-label">첨부파일</label>
														<input class="form-control" type="file"
															id="formFileMultiple" name="fileList" multiple>
														<div id="existing-attachments" class="mt-2"></div>
													</div>

													<div class="mb-3 form-check">
														<input type="checkbox" class="form-check-input"
															id="imptMailYn" name="imptMailYn" value="Y"
															<c:if test="${draftEmail.imptMailYn == 'Y'}">checked</c:if>>
														<label class="form-check-label" for="imptMailYn">중요
															메일로 표시</label>
													</div>

													<div class="d-flex justify-content-end">
														<button type="button" id="saveDraftBtn"
															class="btn btn-info me-2">임시저장</button>
														<button type="button" id="sendBtn"
															class="btn btn-primary me-2">보내기</button>
														<button type="button" class="btn btn-secondary"
															id="cancel-compose-btn">취소</button>
													</div>
												</form>
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
	</div>

	<!-- 초안 본문 안전 전달(CKEditor5로 setData할 원본) -->
	<textarea id="draft-content-storage" style="display: none;"><c:out
			value="${draftEmail.content}" escapeXml="true" /></textarea>
	<script type="module" src="/js/mail/mail-boxrenderer.js"></script>
	<script type="module" src="/js/mail/mail-list.js"></script>
	<script>
  // ===== CKEditor5 초기화 (reply 패턴 적용, 한 번만) =====

  // 업로드 어댑터 (reply와 동일 구조)
  function MyUploadAdapter(loader){ this.loader = loader; }
  MyUploadAdapter.prototype.upload = function () {
    return this.loader.file.then(file => new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('upload', file);
      fetch(window.contextPath + '/ckeditor/imageUpload', { method:'POST', body:data })
        .then(r => r.json())
        .then(res => res.uploaded ? resolve({ default: res.url }) : reject(res.error?.message||'Upload failed'))
        .catch(err => reject('Upload failed: ' + err));
    }));
  };
  MyUploadAdapter.prototype.abort = function(){};
  function MyUploadAdapterPlugin(editor){
    editor.plugins.get('FileRepository').createUploadAdapter = loader => new MyUploadAdapter(loader);
  }

  // 중복 초기화 가드
  window.__COMPOSE_EDITOR5_INIT__ = window.__COMPOSE_EDITOR5_INIT__ || false;

  document.addEventListener('DOMContentLoaded', function(){
    const ta = document.querySelector('#composeEditor');
    if (!ta) return;

    // 외부에서 이미 래퍼(.ck-editor)를 만들었다면 재생성 금지
    const wrapper = ta.closest('.ck-editor') || ta.parentElement.querySelector('.ck-editor');
    if (wrapper) return;

    if (window.__COMPOSE_EDITOR5_INIT__ || ta.dataset.initialized === 'true') return;
    window.__COMPOSE_EDITOR5_INIT__ = true;
    ta.dataset.initialized = 'true';

    ClassicEditor
      .create(ta, { extraPlugins: [MyUploadAdapterPlugin] })
      .then(editor => {
        // reply와 동일: 전역 보관
        window.editor5 = editor;

        // 초안 본문 주입
        const draft = document.getElementById('draft-content-storage');
        if (draft) editor.setData(draft.value || '');

        // 수신자 배열 초기화
        window.selectedRecipients = [];

        // 1. 초안 수신자 주입
        <c:if test="${not empty draftEmail.recipientUserList}">
          <c:forEach var="r" items="${draftEmail.recipientUserList}">
            window.selectedRecipients.push({
              userId: "${r.userId}",
              userNm: "${r.userNm}",
              displayText: "${r.userNm}(" + "${r.deptNm}" + ")<" + "${r.userEmail}" + ">"
            });
          </c:forEach>
        </c:if>

        // 2. URL 파라미터 수신자 주입
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('recipientId');
        const name = urlParams.get('recipientName');
        const dept = urlParams.get('recipientDept');
        const email = urlParams.get('recipientEmail');

        if (id && name && dept && email) {
            const decodedName = decodeURIComponent(name);
            const decodedDept = decodeURIComponent(dept);
            const decodedEmail = decodeURIComponent(email);
            const formattedRecipient = decodedName + '(' + decodedDept + ')<' + decodedEmail + '>';

            const isDuplicate = window.selectedRecipients.some(r => r.userId === id);
            if (!isDuplicate) {
                window.selectedRecipients.push({
                    userId: id,
                    userNm: decodedName,
                    displayText: formattedRecipient
                });
            }
        }

        // 3. 최종 수신자 목록을 인풋 필드에 렌더링
        if (window.selectedRecipients.length > 0) {
          const emailToInput = document.getElementById('emailTo');
          if (emailToInput) {
            emailToInput.value = window.selectedRecipients.map(r => r.displayText).join(', ') + ', ';
          }
        }

        // 기존 첨부 표시 (임시저장 데이터에서 제외 정책에 따라 표시하지 않음)
        const wrap = document.getElementById('existing-attachments');
        if (wrap) {
          wrap.innerHTML = ''; // 항상 비워둠
        }
      })
      .catch(err => console.error('CKEditor5 init error:', err));
  });

  // 뒤로가기 캐시로 복귀 시 재초기화 방지
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') window.__COMPOSE_EDITOR5_INIT__ = true;
  });
</script>

	<!-- 동작 스크립트 -->
	<script src="/js/mail/mail-send.js"></script>
	<script>
		document.addEventListener('DOMContentLoaded', function() {
			const urlParams = new URLSearchParams(window.location.search);
			const id = urlParams.get('recipientId');
			const name = urlParams.get('recipientName');
			const dept = urlParams.get('recipientDept');
			const email = urlParams.get('recipientEmail');

			if (id && name && dept && email) {
				const emailToInput = document.getElementById('emailTo');
				const decodedName = decodeURIComponent(name);
				const decodedDept = decodeURIComponent(dept);
				const decodedEmail = decodeURIComponent(email);

				const formattedRecipient = `${decodedName}(${decodedDept})<${decodedEmail}>`;

				// 전역 수신자 배열에 추가 (중복 방지)
				const isDuplicate = window.selectedRecipients.some(r => r.userId === id);
				if (!isDuplicate) {
					window.selectedRecipients.push({
						userId: id,
						userNm: decodedName,
						displayText: formattedRecipient
					});
				}

				// 입력 필드 값을 전역 배열 기준으로 다시 렌더링
				if (emailToInput) {
					emailToInput.value = window.selectedRecipients.map(r => r.displayText).join(', ') + ', ';
				}
			}
		});
	</script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const demoMailBtn = document.getElementById('demoMailBtn');
    if (demoMailBtn) {
        demoMailBtn.addEventListener('click', function() {
            // 1.시연 메일 입력 요소 받는사람.
            const recipient = {
                userId: '',
                userNm: '',
                deptNm: '',
                userEmail: '',
                displayText: ''
            };

            const isDuplicate = window.selectedRecipients.some(r => r.userId === recipient.userId);
            if (!isDuplicate) {
                window.selectedRecipients.push(recipient);
            }

            const emailToInput = document.getElementById('emailTo');
            if (emailToInput) {
                emailToInput.value = window.selectedRecipients.map(r => r.displayText).join();
            }

            // 2. 제목
            const emailSubjectInput = document.getElementById('emailSubject');
            if (emailSubjectInput) {
                emailSubjectInput.value = '재직증명서 발급 요청드립니다.';
            }

         // 3. 내용
            if (window.editor5) {
                window.editor5.setData(`
                    <p>안녕하세요, 인사팀 담당자님.</p>
                    <p>메뉴개발팀 이주현 사원입니다.<br>
                    개인 용도로 재직증명서 발급을 요청드리고자 메일드립니다.</p><br>

                    <p>- 용도: 은행 제출용<br>
                    - 제출처: 농협은행<br>
                    - 발급매수: 1부<br>
                    - 필요일시: 2025년 11월 6일까지</p><br>

                    <p>가능하신 경우 PDF 형태로 메일 회신 부탁드립니다.<br>
                    추가로 필요한 절차나 서류가 있다면 알려주시면 바로 준비하겠습니다.</p>

                    <p>감사합니다.<br>
                    메뉴개발팀 이주현 드림</p>
                `);
            }
        });
    }
});
</script>
</body>
</html>
