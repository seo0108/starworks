<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자       			수정내용
 *  ============   	============== =======================
 *  2025. 9. 26.     	홍현택      			최초 생성
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
		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/community/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">공지사항 새 글 작성</div>
					<!-- 		        <div class="outline-subtitle">새로운 문서를 기안합니다.</div> -->
				</div>

					<div class="card">
						<div class="card-body">

							<button type="button" id="demoNoticeBtn" class="btn btn-sm" style="position: absolute; top: 10px;
								right: 10px; z-index: 9999; opacity: 0.2;"></button>

							<form:form method="post" enctype="multipart/form-data" modelAttribute="board">
								<c:if test="${not empty board }">
									<input name="pstId" value="${board['pstId' ]}" type="hidden" />
									<input name="crtUserId" value="${board['crtUserId' ]}"	type="hidden" />
								</c:if>

								<div class="mb-3">
									<label for="postTitle" class="form-label">
										제목
									 </label>
									 <input	type="text" class="form-control" id="postTitle" name="pstTtl"
										value="${board['pstTtl'] }" placeholder="제목을 입력하세요">
									<form:errors path="pstTtl" cssClass="text-danger" />
								</div>
									<form:hidden path="bbsCtgrCd" />

								<div class="mb-3 form-check">
									<form:checkbox path="fixedYn" value="Y" id="fixedNotice" cssClass="form-check-input" />
									<label class="form-check-label" for="fixedNotice">공지사항 상단 고정</label>
								</div>

								<div class="mb-3">
									<label for="content" class="form-label">내용</label>
									<textarea id="editor" name="contents">${board["contents"] }</textarea>
									<form:errors path="contents" cssClass="text-danger" />
								</div>

								<div class="mb-3">
									<label for="formFile" class="form-label">첨부파일</label>
									<input class="form-control" type="file" id="formFileMultiple" name="fileList" multiple>
								</div>

								<div class="d-flex justify-content-end mt-4">
									<a href="/board/notice" class="btn btn-light me-2">취소</a>
									<button type="submit" class="btn btn-primary">저장</button>
								</div>
							</form:form>
						</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const demoNoticeBtn = document.getElementById('demoNoticeBtn');
    if (demoNoticeBtn) {
        demoNoticeBtn.addEventListener('click', function() {
            // 1. 제목
            const postTitleInput = document.getElementById('postTitle');
            if (postTitleInput) {
                postTitleInput.value = '신메뉴 개발 방향성 논의를 위한 전사 아이디어 공모';
            }

            // 2. 내용
            if (window.editor5) {
                window.editor5.setData(`
                    <p>안녕하십니까, 메뉴개발팀 부장입니다.</p>
                    <p>2026년 상반기 신메뉴 개발의 방향성을 설정하고, 전사적인 참여를 통해 혁신적인 아이디어를 발굴하고자 아래와 같이 아이디어 공모를 진행합니다.</p><br>

                    <p><strong>- 공모 주제:</strong> "고객의 일상에 새로운 활력을 불어넣을 창의적인 메뉴"</p>
                    <p><strong>- 공모 기간:</strong> 2025년 11월 10일(월) ~ 2025년 11월 28일(금)</p>
                    <p><strong>- 참여 대상:</strong> 전 임직원</p>
                    <p><strong>- 제출 방법:</strong> 그룹웨어 게시판 내 '아이디어 제안' 카테고리에 양식에 맞춰 등록</p><br>

                    <p>이번 공모를 통해 선정된 우수 아이디어 제안자에게는 소정의 포상이 지급될 예정이며, 실제 메뉴 개발 과정에 참여할 기회도 부여됩니다.</p>
                    <p>임직원 여러분의 참신하고 대담한 아이디어가 우리 회사의 새로운 성장 동력이 될 것입니다. 많은 관심과 적극적인 참여를 부탁드립니다.</p>

                    <p>감사합니다.</p>
                `);
            }
        });
    }
});
</script>
					</div>
				</div>
			</div>
		</div>
	</div>

</body>
</html>