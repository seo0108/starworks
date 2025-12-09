<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *	2025. 10. 14.		홍현택		메시지 전달
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%-- <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%> --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags"
	prefix="security"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>메일 전달</title>
</head>
<body>
	<script>
	    window.contextPath = '${pageContext.request.contextPath}';
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
										<div class="row">
											<%-- 						비활성화			<%@include file="/WEB-INF/views/mail/left-menu.jsp"%> --%>
											<div class="col-md-12" id="email-dynamic-content-area">
												<form id="forwardForm" method="post"
													action="<c:url value='/mail/forward'/>"
													enctype="multipart/form-data">
													<input type="hidden" name="originalEmailContId"
														value="${originalEmail.emailContId}">
													<div class="mb-3">
														<label for="emailTo" class="form-label">받는 사람</label> <input
															type="text" class="form-control" id="emailTo"
															placeholder="여러명에게 보낼 경우 쉼표(,)로 구분해주세요.">
														<div id="autocomplete-suggestions"
															class="list-group position-absolute w-100"
															style="z-index: 1000; max-height: 200px; overflow-y: auto; display: none;"></div>
														<span id="emailToError" class="text-danger"
															style="display: none;"></span>
													</div>

													<input type="hidden" id="emailContId" name="emailContId">

													<div class="mb-3">
														<label for="emailSubject" class="form-label">제목</label> <input
															type="text" class="form-control" id="emailSubject"
															name="subject" value="Fwd: ${originalEmail.subject}"
															required> <span id="emailSubjectError"
															class="text-danger" style="display: none;"></span>
													</div>

													<div class="mb-3">
														<label for="forwardEditor" class="form-label">내용</label>
														<textarea id="forwardEditor" name="content" rows="10"
															required>

						------ Forwarding Message ------<br>
						From: ${originalEmail.senderName}<br>
						To: <c:forEach var="receiver"
																items="${originalEmail.receiverList}" varStatus="status">${receiver.userName}<c:if
																	test="${!status.last}">, </c:if>
												</c:forEach><br>
						Date: <fmt:formatDate value="${originalEmail.sendDateAsUtilDate}"
																pattern="yyyy-MM-dd HH:mm" /><br>
						Subject: ${originalEmail.subject}

						${originalEmail.content}

						----------------------------------
                                </textarea>
														<span id="forwardEditorError" class="text-danger"
															style="display: none;"></span>
													</div>

													<div class="mb-3">
														<label for="formFileMultiple" class="form-label">새로운
															첨부파일</label> <input class="form-control" type="file"
															id="formFileMultiple" name="fileList" multiple>
													</div>

													<div class="mb-3">
														<label class="form-label"> 원본 첨부파일</label>
														<div id="originalAttachments" class="border p-2 rounded">
															<c:choose>
																<c:when test="${not empty originalEmail.attachmentList}">
																	<c:forEach var="attachment"
																		items="${originalEmail.attachmentList}">
																		<p>${attachment.orgnFileNm}(${attachment.fileSize / 1024}KB)</p>
																	</c:forEach>
																</c:when>
																<c:otherwise>
																	<p>첨부파일 없음</p>
																</c:otherwise>
															</c:choose>
														</div>
													</div>

													<div class="mb-3 form-check">
														<input type="checkbox" class="form-check-input"
															id="imptMailYn" name="imptMailYn" value="Y"> <label
															class="form-check-label" for="imptMailYn">중요 메일로
															표시</label>
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
<script type="module" src="/js/mail/mail-list.js"></script>
<script src="/js/mail/mail-forward.js"></script>
<script>
    // CKEditor 5 초기화
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
        .create(document.querySelector('#forwardEditor'), {
            extraPlugins: [MyUploadAdapterPlugin]
        })
        .then(editor => {
            // 에디터 인스턴스를 전역 변수에 저장
            window.forwardEditor = editor;
        })
        .catch(error => {
            console.error('CKEditor 초기화 중 오류 발생:', error);
        });

 // 중요 메일 여부 체크
    <c:if test="${draftEmail.imptMailYn == 'Y'}">
    document.getElementById('imptMailYn').checked = true;
</c:if>
</script>
</body>
</html>