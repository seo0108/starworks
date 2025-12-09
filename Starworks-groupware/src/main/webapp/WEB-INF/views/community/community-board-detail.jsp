<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자       			수정내용
 *  ============   	============== =======================
 *  2025. 9. 26.     	임가영      			최초 생성
 *  2025. 9. 29.		임가영				댓글 작성 UI 생성
 *	2025.10. 17. 		홍현택				제목 카테고리 표시, 날짜 포맷팅 추가
-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
<security:authentication property="principal.realUser" var="realUser"/>


	<div id="main-content">
		<div class="page-content d-flex flex-wrap gap-3">
			<%@include file="/WEB-INF/views/community/left-menu.jsp"%>

			<div style="flex: 1 1 78%;" class="right-content">

				<div class="outline-section">
					<div class="outline-title">자유게시판 상세</div>
					<!-- 		        <div class="outline-subtitle">새로운 문서를 기안합니다.</div> -->
				</div>

				<section class="section">
					<div class="card">
						<div class="card-header">
							<h3 class="card-title" data-pstid="${board['pstId'] }">
								<c:if test="${not empty categoryMap[board.bbsCtgrCd]}">[${categoryMap[board.bbsCtgrCd]}] </c:if>${board["pstTtl"] }
							</h3>
						</div>
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
								<div>
									<small class="text-muted me-3"><i class="bi bi-person"></i> 작성자: ${board.users["userNm"] }</small>
									<small class="text-muted"><i class="bi bi-calendar-date"></i> 작성일: <fmt:formatDate value="${board['frstCrtDtAsUtilDate']}" pattern="yyyy-MM-dd HH:mm"/></small>
								</div>
								<small class="text-muted"><i class="bi bi-eye"></i> 조회수: ${board["viewCnt"] }</small>
							</div>
							<div class="post-content mb-4">
								${board["contents"] }
								<c:forEach items="${fileList }" var="file">
									<c:if
										test="${file['extFile'] eq '.png' or file['extFile'] eq '.JPG' or file['extFile'] eq '.jpg'}">
										<%-- 										<img alt="파일이 존재하지 않거나 잘못된 경로" src="/starworks_medias/${fileDetail['filePath'] }/${fileDetail['saveFileNm'] }" /> --%>
										<img alt="파일이 존재하지 않거나 잘못된 경로" src="${file['filePath']}" style="max-width: 100%; height: auto; border-radius: 8px;"/>
										<br />
									</c:if>
								</c:forEach>
							</div>
							<c:if test="${not empty fileList  }">
								<hr class="my-4">
								<h5>첨부파일</h5>
								<div class="d-flex align-items-center">
									<c:forEach items="${fileList }" var="file">
										<i class="bi bi-paperclip me-2"></i>
										<a href="/file/download/${file.saveFileNm }">${file.orgnFileNm }</a>
									</c:forEach>
								</div>
							</c:if>

							<!-- detail card 끝 -->
							<div class="d-flex justify-content-end mt-4">
								<c:url value="/board/community/${board['pstId'] }/edit"
									var="modifyUrl" />
								<c:url value="/board/community/${board['pstId'] }/remove"
									var="deleteUrl" />
								<c:if test="${board.crtUserId eq realUser.userId}">
									<a href="${modifyUrl }" class="btn btn-light-secondary me-2">수정</a>
									<button type="button" class="btn btn-danger btn-delete  me-2">삭제</button>
								</c:if>
								<a href="/board/community" class="btn btn-primary">목록으로</a>
							</div>
						</div>
					</div>

					<!-- Comment Form -->
					<div class="card" id="comment-list">
						<div class="card-body">
							<form:form action="/board/community/${board['pstId'] }/comment"
								method="post" modelAttribute="boardComment">

								<div class="d-flex align-items-end gap-2">

									<input type="hidden" value="${board['pstId'] }" name="pstId" />

									<div class="flex-grow-1">
										<textarea class="form-control" id="comment-content" rows="3"
											placeholder="댓글을 입력하세요" name="contents"></textarea>
										<form:errors path="contents" cssClass="text-danger" />
									</div>

									<button type="submit" class="btn btn-primary">등록</button>
								</div>

							</form:form>
						</div>

						<!-- Comments section -->
						<div class="card-header">
							<h4 class="card-title">
								<span id="comment-count">${totalCount }</span>개의 댓글
							</h4>
						</div>
						<div class="card-body">
							<c:if test="${empty boardCommentList }">
								<p>댓글이 없습니다. 댓글을 달아보세요.</p>
							</c:if>

							<c:if test="${not empty boardCommentList }">
								<c:forEach items="${boardCommentList }" var="boardComment">
									<!-- Comment -->
									<!-- 상위 댓글이 null 일때만 보여야함 -->
									<c:if test="${empty boardComment['upCmntSqn'] }">
										<div data-pstid="${board['pstId'] }" class="comment-div"} >
											<hr>
											<div class="d-flex align-items-start mt-3 comment"
												data-cmntsqn="${boardComment['cmntSqn'] }">

												<!-- 삭제된 댓글일 경우 -->
												<c:if test="${boardComment['delYn'] eq 'Y'}">
													<div class="avatar avatar-lg">
														<div class="avatar avatar-md">
															<img src="/dist/assets/static/images/faces/b.jpg" alt="Avatar">
														</div>
													<div class="flex-grow-1 ms-3">
														<h6 class="mt-0"></h6> <p class="mb-0">삭제된 댓글입니다.</p>
														<small class="text-muted me-3"><fmt:formatDate value="${boardComment.frstCrtDtAsUtilDate}" pattern="yyyy-MM-dd HH:mm"/></small>															<a href="javascript:void(0);"
																onclick="toggleReplyDiv('reply-form-${boardComment.cmntSqn}')"
																class="--bs-primary">답글</a>
														</div>
													</div>
												</c:if>

												<!-- 삭제되지 않은 댓글일 경우 -->
												<c:if test="${boardComment['delYn'] eq 'N'}">
													<div class="avatar avatar-lg">
														<!-- 프로필 보이게 하는 코드 (나중에 수정 예정) -->
													    <c:choose>
													        <c:when test="${not empty boardComment.filePath}">
													            <img src="${boardComment.filePath}" alt="Avatar">
													        </c:when>
													        <c:otherwise>
													            <img src="/dist/assets/static/images/faces/1.jpg" alt="Avatar">
													        </c:otherwise>
													    </c:choose>
													</div>
													<div class="flex-grow-1 ms-3">
														<h6 class="mt-0">${boardComment.users['userNm'] }</h6>
														<p class="mb-0">${boardComment['contents'] }</p>
														<div>
															<small class="text-muted me-3"><fmt:formatDate value="${boardComment.frstCrtDtAsUtilDate}" pattern="yyyy-MM-dd HH:mm"/></small>
															<a href="javascript:void(0);"
																onclick="toggleReplyDiv('reply-form-${boardComment.cmntSqn}')"
																class="--bs-primary">답글</a>
																<c:if test="${boardComment.crtUserId eq realUser.userId}">
																	<a href="javascript:;"
																	class="text-muted delBtn">삭제</a>
																</c:if>
														</div>
													</div>
												</c:if>

											</div>
									</c:if>

									<!-- Replies -->
									<!-- 상위 댓글이 있을때만 보여야함 -->
									<div id="reply-div-${boardComment.cmntSqn}">
										<c:forEach items="${boardCommentList }"
											var="boardComment_reply">
											<c:if
												test="${boardComment['cmntSqn'] eq boardComment_reply['upCmntSqn']}">
												<div class="ms-5 mt-3 comment"
													data-cmntsqn="${boardComment_reply['cmntSqn'] }">
													<div class="d-flex align-items-start">

														<!-- 삭제된 대댓글일 경우 -->
														<c:if test="${boardComment_reply['delYn'] eq 'Y'}">
															<div class="flex-shrink-0">
																<div class="avatar avatar-md">
																	<img src="/dist/assets/static/images/faces/b.jpg"
																		alt="Avatar">
																</div>
															</div>
															<div class="flex-grow-1 ms-3">
																<h6 class="mt-0"></h6>
																<div>
                                                <p class="mb-0">삭제된 대댓글입니다.</p>
                                                <small class="text-muted me-3"><fmt:formatDate value="${boardComment_reply.frstCrtDtAsUtilDate}" pattern="yyyy-MM-dd HH:mm"/></small>																</div>
															</div>
														</c:if>

														<!-- 삭제되지 않은 대댓글일 경우 -->
														<c:if test="${boardComment_reply['delYn'] eq 'N'}">
															<div class="flex-shrink-0">
																<div class="avatar avatar-md">
																	<!-- 프로필 보이게 하는 코드 (나중에 수정 예정) -->
																	<%-- <c:if
																		test="${empty boardComment_reply.users['userImgFileId'] }">
																		<img src="/dist/assets/static/images/faces/1.jpg"
																			alt="Avatar">
																	</c:if>
																	<c:if
																		test="${not empty boardComment_reply.users['userImgFileId'] }">
																		<img src="/dist/assets/static/images/faces/2.jpg"
																			alt="Avatar">
																	</c:if> --%>
																	<c:choose>
																        <c:when test="${not empty boardComment.filePath}">
																            <img src="${boardComment_reply.filePath}" alt="Avatar">
																        </c:when>
																        <c:otherwise>
																            <img src="/dist/assets/static/images/faces/1.jpg" alt="Avatar">
																        </c:otherwise>
																    </c:choose>
																</div>
															</div>
															<div class="flex-grow-1 ms-3">
																<h6 class="mt-0">${boardComment_reply.users['userNm'] }</h6>
																<div>
																	<p class="mb-0">${boardComment_reply['contents'] }</p>
																	<small class="text-muted me-3"><fmt:formatDate value="${boardComment.frstCrtDtAsUtilDate}" pattern="yyyy-MM-dd HH:mm"/></small>
																	<c:if test="${boardComment_reply.crtUserId eq realUser.userId}">
																		<a href="javascript:;" class="text-muted delBtn">삭제</a>
																	</c:if>
																</div>
															</div>
														</c:if>
													</div>
												</div>
											</c:if>
										</c:forEach>
									</div>

									<!-- Reply Div (Hidden by default) -->
									<!-- 상위 댓글이 null 일때만 보여야함 -->
									<c:if test="${empty boardComment['upCmntSqn'] }">
										<div id="reply-form-${boardComment.cmntSqn}" class="ms-5 mt-3"
											style="display: none;">
											<form:form id="reply-form" method="post"
												modelAttribute="commentReply">
												<div class="input-group">
													<input type="text" class="form-control" name="contents"
														placeholder="대댓글을 입력하세요">
													<button class="btn btn-outline-secondary reply-btn"
														type="button">등록</button>
													<form:errors path="contents" cssClass="text-danger" />
												</div>
											</form:form>
										</div>
										<!-- cmntSqn dataset 있는 div 끝 -->
									</c:if>
								</c:forEach>
							</c:if>
						</div>
						<!-- card-body 끝 -->
					</div>
					<!-- card 끝 -->
				</section>
			</div>
		</div>
		<!-- page-content 끝 -->
	</div>
	<!-- main-content 끝 -->


<!--  커스텀 삭제 확인 모달 : 삭제 확인 모달창 -->
<div class="modal fade" id="deleteConfirmModal" tabindex="-1"
	aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
	<div
		class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-header bg-danger">
				<h5 class="modal-title text-white" id="deleteConfirmModalLabel">
					<i class="bi bi-exclamation-triangle-fill me-2"></i> 삭제 확인
				</h5>
				<button type="button" class="btn-close btn-close-white"
					data-bs-dismiss="modal" aria-label="Close"></button>
			</div>

			<div class="modal-body">
				<p>정말 삭제하시겠습니까?</p>
				<p class="text-danger small">삭제된 데이터는 복구할 수 없습니다.</p>
				<!-- 삭제될 메뉴 ID를 저장할 숨김 필드 (JS에서 사용) -->
				<input type="hidden" id="menuIdToDelete" value="">
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary"
					data-bs-dismiss="modal">취소</button>
				<button type="button" class="btn btn-danger" id="confirmDeleteBtn">
					<i class="bi bi-trash-fill"></i> 삭제
				</button>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript"
	src="/js/community/community-board-detail.js"></script>
</body>
</html>