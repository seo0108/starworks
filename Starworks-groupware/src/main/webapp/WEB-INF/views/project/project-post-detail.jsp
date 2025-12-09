<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시글 상세 - Gemini</title>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&amp;display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../mazer-1.0.0/dist/assets/css/bootstrap.css">

    <link rel="stylesheet" href="../mazer-1.0.0/dist/assets/vendors/perfect-scrollbar/perfect-scrollbar.css">
    <link rel="stylesheet" href="../mazer-1.0.0/dist/assets/vendors/bootstrap-icons/bootstrap-icons.css">
    <link rel="stylesheet" href="../mazer-1.0.0/dist/assets/css/app.css">
    <link rel="shortcut icon" href="../mazer-1.0.0/dist/assets/images/logo/logo.png" type="image/png">
    
</head>

<body>
    <div id="app">
        <div id="sidebar" class="active">
            <div class="sidebar-wrapper active ps">
                <div class="sidebar-header">
                    <div class="d-flex justify-content-between">
                        <div class="logo"><a href="../main.html">그룹웨어</a></div>
                        <div class="toggler"><a href="#" class="sidebar-hide d-xl-none d-block"><i class="bi bi-x bi-middle"></i></a></div>
                    </div>
                </div>
                <div class="sidebar-menu">
                     <ul class="menu">
                        <li class="sidebar-title">Menu</li>
                        <li class="sidebar-item"><a href="#" class='sidebar-link'><i class="bi bi-envelope-fill"></i><span>전자메일</span></a></li>
                        <li class="sidebar-item has-sub"><a href="#" class='sidebar-link'><i class="bi bi-file-earmark-check-fill"></i><span>전자결재</span></a>
							<ul class="submenu">
                                <li class="submenu-item "><a href="../approvalMain_v2.html">내 결재</a></li>
                                <li class="submenu-item "><a href="../approvalDrafts.html">임시 보관함</a></li>
                                <li class="submenu-item "><a href="../approvalArchive.html">보관함</a></li>
                            </ul>
						</li>
                        <li class="sidebar-item has-sub active"><a href="#" class='sidebar-link'><i class="bi bi-grid-1x2-fill"></i><span>프로젝트 관리</span></a>
                            <ul class="submenu active">
                                <li class="submenu-item "><a href="../project-list.html">전체 프로젝트</a></li>
                                <li class="submenu-item "><a href="../my-projects2.html">내 프로젝트</a></li>
                                <li class="submenu-item"><a href="../project-create.html">프로젝트 등록</a></li>
                                <li class="submenu-item "><a href="../project-archive.html">보관함</a></li>
                            </ul>
                        </li>
						<li class="sidebar-item has-sub"><a href="../document_archive_new.html" class='sidebar-link'><i class="bi bi-archive-fill"></i><span>문서 자료실</span></a>
							<ul class="submenu">
                                <li class="submenu-item "><a href="../document_archive_new.html">개인 자료실</a></li>
                                <li class="submenu-item "><a href="">부서 자료실</a></li>
                                <li class="submenu-item"><a href="">전사 자료실</a></li>
                            </ul>
						</li>
                        <li class="sidebar-item has-sub"><a href="#" class='sidebar-link'><i class="bi bi-calendar-event-fill"></i><span>일정관리</span></a>
							<ul class="submenu">
                                <li class="submenu-item "><a href="../calendar-depart.html">부서 일정</a></li>
                                <li class="submenu-item "><a href="../calendar-team.html">팀 일정</a></li>
                            </ul>
						</li>
                        <li class="sidebar-item"><a href="../attendance_management.html" class='sidebar-link'><i class="bi bi-clock-fill"></i><span>근태관리</span></a></li>
                        <li class="sidebar-item"><a href="../조직도.html" class='sidebar-link'><i class="bi bi-people-fill"></i><span>조직도</span></a></li>
                        <li class="sidebar-item has-sub"><a href="#" class='sidebar-link'><i class="bi bi-rss-fill"></i><span>커뮤니티</span></a>
							<ul class="submenu">
                                <li class="submenu-item "><a href="../notice-board-standalone.html">공지사항</a></li>
                                <li class="submenu-item "><a href="../community-board-v2.html">사내 커뮤니티</a></li>
                            </ul>
						</li>
                    </ul>
                </div>
                <button class="sidebar-toggler btn x"><i data-feather="x"></i></button>
            </div>
        </div>
        <div id="main" class="layout-navbar">
            <header class='mb-3'>
                <nav class="navbar navbar-expand navbar-light ">
                    <div class="container-fluid">
                        <a href="#" class="burger-btn d-block">
                            <i class="bi bi-justify fs-3"></i>
                        </a>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li class="nav-item dropdown me-3">
                                     <a class="nav-link active dropdown-toggle" href="#" data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                        <i class='bi bi-bell bi-sub fs-4 text-gray-600'></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                        <li><h6 class="dropdown-header">Notifications</h6></li>
                                        <li><a class="dropdown-item">No notification available</a></li>
                                    </ul>
                                </li>
                            </ul>
                            <div class="dropdown">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div class="user-menu d-flex">
                                        <div class="user-name text-end me-3">
                                            <h6 class="mb-0 text-gray-600">김차장</h6>
                                            <p class="mb-0 text-sm text-gray-600">인사팀</p>
                                        </div>
                                        <div class="user-img d-flex align-items-center">
                                            <div class="avatar avatar-md">
                                                <img src="../mazer-1.0.0/dist/assets/images/faces/1.jpg">
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                    <li><a class="dropdown-item" href="#"><i class="icon-mid bi bi-person me-2"></i> My Profile</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="#"><i class="icon-mid bi bi-box-arrow-left me-2"></i> Logout</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <div id="main-content">
                <div class="page-heading d-flex justify-content-between align-items-center">
                    <h3>게시글 상세</h3>
                    <a href="project-detail4.jsp?id=1#board-pane" class="btn btn-light">목록으로</a>
                </div>
                <div class="page-content">
                    <div class="card">
                        <div class="card-header border-bottom">
                            <h4 class="card-title" id="post-title-detail">9월 3주차 주간 업무 보고</h4>
                            <div class="d-flex align-items-center mt-2">
                                <div class="avatar avatar-sm me-2">
                                    <img src="../mazer-1.0.0/dist/assets/images/faces/1.jpg" alt="Avatar">
                                </div>
                                <small class="text-muted">
                                    <span class="me-2" id="post-author-detail">김관리</span> | 
                                    <span class="mx-2" id="post-date-detail">2025-09-19</span> | 
                                    <span class="ms-2">조회수: 15</span>
                                </small>
                            </div>
                        </div>
                        <div class="card-body post-content" id="post-content-detail">
                            <p>안녕하세요, 김관리입니다.</p>
                            <p>9월 3주차 주간 업무 보고 드립니다. 주요 진행 사항은 아래와 같습니다.</p>
                            <ul>
                                <li>UI/UX 디자인: 프로토타입 제작 완료 (90%)</li>
                                <li>API 서버 개발: 인증/권한 부여 기능 구현 중</li>
                            </ul>
                            <p>아래는 지난 주말 워크샵에서 찍은 사진입니다.</p>
                            <p><img src="../images/아포가토.jpg" class="img-fluid rounded my-3" alt="Affogato"></p>
                            <p>상세 내용은 첨부된 보고서를 확인해주시기 바랍니다.</p>
                            <p>감사합니다.</p>
                        </div>
                        <div class="card-footer border-top">
                            <h5><i class="bi bi-paperclip me-2"></i>첨부파일</h5>
                            <a href="#" class="btn btn-light d-block text-start mt-2"><i class="bi bi-download me-2"></i>주간업무보고_9월3주차.pdf <span class="text-muted small">(1.2MB)</span></a>
                            <a href="#" class="btn btn-light d-block text-start mt-2"><i class="bi bi-download me-2"></i>워크샵_사진.zip <span class="text-muted small">(15.8MB)</span></a>
                        </div>
                    </div>

                    <!-- Comments Card -->
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">댓글 (3)</h4>
                        </div>
                        <div class="card-body">
                            <!-- Comment Form -->
                            <div class="comment-form mb-5">
                                <div class="d-flex gap-3">
                                    <div class="avatar"><img src="../mazer-1.0.0/dist/assets/images/faces/1.jpg"></div>
                                    <div class="flex-grow-1">
                                        <div class="input-group">
                                            <textarea class="form-control" rows="1" placeholder="댓글을 입력하세요..."></textarea>
                                            <button class="btn btn-primary btn-sm" type="button">등록</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Comment List -->
                            <div class="comment-list">
                                <!-- Comment Item -->
                                <div class="comment" data-user-id="2">
                                    <div class="avatar"><img src="../mazer-1.0.0/dist/assets/images/faces/2.jpg" alt="avatar"></div>
                                    <div class="comment-body">
                                        <div class="d-flex justify-content-between">
                                            <h6 class="mb-1 comment-author">이책임</h6>
                                            <small class="text-muted">2025-09-19 14:30</small>
                                        </div>
                                        <p class="comment-text">확인했습니다. 고생하셨습니다.</p>
                                        <div class="edit-form" style="display: none;">
                                            <textarea class="form-control mb-2" rows="2"></textarea>
                                            <button class="btn btn-sm btn-primary btn-save">저장</button>
                                            <button class="btn btn-sm btn-light btn-cancel">취소</button>
                                        </div>
                                        <div class="comment-actions">
                                            <a href="#" class="btn-reply">답글 달기</a>
                                            <a href="#" class="btn-edit ms-2" style="display: none;">수정</a>
                                            <a href="#" class="btn-delete ms-2" style="display: none;">삭제</a>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Comment Item with Reply -->
                                <div class="comment" data-user-id="3">
                                    <div class="avatar"><img src="../mazer-1.0.0/dist/assets/images/faces/3.jpg" alt="avatar"></div>
                                    <div class="comment-body">
                                        <div class="d-flex justify-content-between">
                                            <h6 class="mb-1 comment-author">박참여</h6>
                                            <small class="text-muted">2025-09-19 15:05</small>
                                        </div>
                                        <p class="comment-text">워크샵 사진 멋지네요! 공유 감사합니다 :)</p>
                                        <div class="edit-form" style="display: none;">
                                            <textarea class="form-control mb-2" rows="2"></textarea>
                                            <button class="btn btn-sm btn-primary btn-save">저장</button>
                                            <button class="btn btn-sm btn-light btn-cancel">취소</button>
                                        </div>
                                        <div class="comment-actions">
                                            <a href="#" class="btn-reply">답글 달기</a>
                                            <a href="#" class="btn-edit ms-2" style="display: none;">수정</a>
                                            <a href="#" class="btn-delete ms-2" style="display: none;">삭제</a>
                                        </div>
                                        
                                        <!-- Reply -->
                                        <div class="comment reply" data-user-id="1">
                                            <div class="avatar"><img src="../mazer-1.0.0/dist/assets/images/faces/1.jpg" alt="avatar"></div>
                                            <div class="comment-body">
                                                <div class="d-flex justify-content-between">
                                                    <h6 class="mb-1 comment-author">김관리</h6>
                                                    <small class="text-muted">2025-09-19 15:10</small>
                                                </div>
                                                <p class="comment-text">감사합니다. 박참여님도 사진 잘 나왔어요!</p>
                                                <div class="edit-form" style="display: none;">
                                                    <textarea class="form-control mb-2" rows="2"></textarea>
                                                    <button class="btn btn-sm btn-primary btn-save">저장</button>
                                                    <button class="btn btn-sm btn-light btn-cancel">취소</button>
                                                </div>
                                                <div class="comment-actions">
                                                    <!-- No reply button on a reply -->
                                                    <a href="#" class="btn-edit ms-2" style="display: none;">수정</a>
                                                    <a href="#" class="btn-delete ms-2" style="display: none;">삭제</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal fade" id="delete-confirm-modal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteConfirmModalLabel">댓글 삭제</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            정말로 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                            <button type="button" class="btn btn-danger" id="confirm-delete-btn">삭제</button>
                        </div>
                    </div>
                </div>
            </div>

            <footer>
                <div class="footer clearfix mb-0 text-muted">
                    <div class="float-start"><p>2025 &copy; Gemini</p></div>
                    <div class="float-end"><p>Crafted with <span class="text-danger"><i class="bi bi-heart"></i></span> by You</p></div>
                </div>
            </footer>
        </div>
    </div>
    <script src="../mazer-1.0.0/dist/assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js"></script>
    <script src="../mazer-1.0.0/dist/assets/js/bootstrap.bundle.min.js"></script>
    <script src="../mazer-1.0.0/dist/assets/js/main.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const currentUser = { id: 1, name: "김관리" };
        const deleteConfirmModal = new bootstrap.Modal(document.getElementById('delete-confirm-modal'));
        let commentToDelete = null;

        document.querySelectorAll('.comment').forEach(comment => {
            const authorId = parseInt(comment.dataset.userId);
            
            if (currentUser.id === authorId) {
                const editBtn = comment.querySelector('.btn-edit');
                const deleteBtn = comment.querySelector('.btn-delete');
                if(editBtn) editBtn.style.display = 'inline-block';
                if(deleteBtn) deleteBtn.style.display = 'inline-block';
            }
        });

        document.querySelector('.comment-list').addEventListener('click', function(e) {
            const target = e.target;
            const comment = target.closest('.comment');
            if (!comment) return;

            const commentText = comment.querySelector('.comment-text');
            const editForm = comment.querySelector('.edit-form');
            const editTextArea = editForm.querySelector('textarea');

            // Edit button click
            if (target.classList.contains('btn-edit')) {
                e.preventDefault();
                commentText.style.display = 'none';
                editTextArea.value = commentText.innerText;
                editForm.style.display = 'block';
            }

            // Cancel button click
            if (target.classList.contains('btn-cancel')) {
                e.preventDefault();
                commentText.style.display = 'block';
                editForm.style.display = 'none';
            }

            // Save button click
            if (target.classList.contains('btn-save')) {
                e.preventDefault();
                commentText.innerText = editTextArea.value;
                commentText.style.display = 'block';
                editForm.style.display = 'none';
            }

            // Delete button click
            if (target.classList.contains('btn-delete')) {
                e.preventDefault();
                commentToDelete = comment;
                deleteConfirmModal.show();
            }
        });

        document.getElementById('confirm-delete-btn').addEventListener('click', function() {
            if (commentToDelete) {
                commentToDelete.remove();
                commentToDelete = null;
                deleteConfirmModal.hide();
            }
        });
    });
    </script>
</body>

</html>
