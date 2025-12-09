/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자           수정내용
 *  -----------   -------------    ---------------------------
 * 2025. 10. 2.     장어진            최초 생성
 * 2025. 10.23.     장어진            코드 가독성 증가
 *
 * </pre>
 */

// ============================================
// 전역 변수 선언
// ============================================
const bizId = project.id;
const userId = currentUser.id;

const tbody = document.querySelector('#board-list-body');
const noticeCheckbox = document.getElementById('is-notice-checkbox');
const savePostBtn = document.getElementById('save-post-btn');

const actionButtons = document.getElementById('post-action-buttons');
const editBtnInline = document.getElementById('edit-post-btn-inline');
const deleteBtnInline = document.getElementById('delete-post-btn-inline');

const fileList = document.getElementById('post-attachments');
let selectedFiles = []; // 선택된 파일 배열 추가

const pstTtl = document.getElementById('post-title');
const contents = document.getElementById('post-content');
const writePostModal = document.getElementById('write-post-modal');

const searchWord = document.getElementById('searchWordInput');
const searchType = document.getElementById('searchTypeSelect');

const boardListView = document.getElementById('board-list-view');
const boardDetailView = document.getElementById('board-detail-view');
const backToListBtn = document.getElementById('back-to-list-btn');

let currentPostId = null;


// ============================================
// 게시글 목록 관련 함수
// ============================================

/**
 * 게시글 목록 로드
 */
function loadBoardPosts(page = 1, searchWord = '', searchType = '') {
	let url = `/rest/project-board/read?bizId=${encodeURIComponent(bizId)}&page=${page}`;

	if (searchWord) {
		url += `&searchWord=${encodeURIComponent(searchWord)}`;
	}
	if (searchType) {
		url += `&searchType=${encodeURIComponent(searchType)}`;
	}

	fetch(url)
		.then(res => res.json())
		.then(data => {
			renderBoardPosts(data.pbList);
			document.getElementById('paging-area').innerHTML = data.pagingHTML;
		})
		.catch(err => console.error('게시글 목록 로딩 오류:', err));
}

/**
 * 게시글 목록 렌더링
 */
function renderBoardPosts(posts) {
	tbody.innerHTML = '';

	if (!posts || posts.length === 0) {
		tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">게시글이 없습니다.</td></tr>';
		return;
	}

	posts.forEach(post => {
		const tr = document.createElement('tr');
		const dateString = post.frstCrtDt.split('T')[0];
		const isNotice = post.noticeYn === 'Y';

		tr.innerHTML = `
            <td class="text-center">
                ${isNotice ? '<span class="badge bg-danger">공지</span>' : ''}
            </td>
            <td>
                <a href="#" class="post-title-link" data-post-id="${post.bizPstId}">
                    ${post.pstTtl}
                </a>
            </td>
            <td>${post.users.userNm}</td>
            <td>${dateString}</td>
            <td>${post.viewCnt}</td>
        `;

		if (isNotice) tr.classList.add('table-light');
		tbody.appendChild(tr);
	});

	// 제목 클릭 이벤트 등록
	tbody.querySelectorAll('.post-title-link').forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const bizPstId = this.dataset.postId;
			loadPostDetail(bizPstId);
		});
	});
}

/**
 * 페이징 처리
 */
function fnPaging(page, searchWord = '', searchType = '') {
	loadBoardPosts(page, searchWord, searchType);
}

/**
 * 검색 실행
 */
function onSearch() {
	loadBoardPosts(1, searchWord.value.trim(), searchType.value);
}


// ============================================
// 게시글 CRUD 함수
// ============================================

/**
 * 게시글 등록
 */
async function createBoardPost() {
	if (!pstTtl.value || !pstTtl.value.trim()) {
		showAlert('warning', '제목을 입력하세요.');
		return;
	}

	const formData = new FormData();
	const pbVO = {
		'bizId': bizId,
		'pstTtl': pstTtl.value.trim(),
		'contents': contents.value.trim(),
		'crtUserId': userId,
		'noticeYn': noticeCheckbox && noticeCheckbox.checked ? 'Y' : 'N'
	};
	formData.append('pbVO', new Blob([JSON.stringify(pbVO)], { type: 'application/json' }));

	// selectedFiles 배열에서 파일 추가
	selectedFiles.forEach(file => {
		formData.append('files', file);
	});

	const resp = await fetch('/rest/project-board', {
		method: 'POST',
		body: formData
	});

	if (resp.ok) {
		showToast('success', '게시글이 등록되었습니다.');

		// 파일 배열 초기화
		selectedFiles = [];
		renderFileList();

		closeModalAndReload();
	} else {
		showAlert('error', '등록 실패');
	}
}

/**
 * 게시글 수정
 */
async function modifyBoardPost(bizPstId) {
	const formData = new FormData();
	const pbVO = {
		'bizPstId': bizPstId,
		'pstTtl': pstTtl.value.trim(),
		'contents': contents.value.trim(),
		'lastChgUserId': userId,
		'noticeYn': noticeCheckbox.checked ? 'Y' : 'N'
	};
	formData.append('pbVO', new Blob([JSON.stringify(pbVO)], { type: 'application/json' }));

	// selectedFiles 배열에서 파일 추가
	selectedFiles.forEach(file => {
		formData.append('files', file);
	});

	const resp = await fetch('/rest/project-board/modify', {
		method: 'PUT',
		body: formData
	});

	if (resp.ok) {
		showToast('success', '게시글이 수정되었습니다.');

		// 파일 배열 초기화
		selectedFiles = [];
		renderFileList();

		closeModalAndReload();
	} else {
		showAlert('error', '수정 실패');
	}
}


/**
 * 게시글 상세 조회
 */
async function loadPostDetail(bizPstId) {
	try {
		// 조회수 증가
		await fetch(`/rest/project-board/vct/${bizPstId}`, { method: 'PUT' });

		// 게시글 데이터 가져오기
		const resp = await fetch(`/rest/project-board/read/${bizPstId}`);
		if (!resp.ok) throw new Error('상세 조회 실패');

		const data = await resp.json();
		const post = data.pbVO;
		const files = data.fileList;

		currentPostId = bizPstId;

		// 상세 정보 표시
		document.getElementById('detail-post-title').textContent = post.pstTtl;
		document.getElementById('detail-post-author').textContent = post.users.userNm;
		document.getElementById('detail-post-date').textContent = post.frstCrtDt.split('T')[0];
		document.getElementById('detail-post-views').textContent = post.viewCnt;
		document.getElementById('detail-post-content').textContent = post.contents;

		// 첨부파일 목록
		const detailFileList = document.getElementById('detail-file-list');
		detailFileList.innerHTML = '';
		if (files && files.length > 0) {
			files.forEach(file => {
				const li = document.createElement('li');
				li.innerHTML = `<a href="/file/download/${file.saveFileNm}">${file.orgnFileNm}</a>`;
				detailFileList.appendChild(li);
			});
		} else {
			detailFileList.innerHTML = '<li class="text-muted">첨부파일이 없습니다.</li>';
		}

		// 작성자 권한 체크
		if (post.crtUserId === userId) {
			actionButtons.style.display = 'block';
			editBtnInline.dataset.postId = bizPstId;
			deleteBtnInline.dataset.postId = bizPstId;
		} else {
			actionButtons.style.display = 'none';
		}

		// 댓글 로드
		loadBoardComments(bizPstId);

		// 상세 뷰로 전환
		showDetailView();

	} catch (error) {
		showAlert('error', '게시글을 불러오는데 실패했습니다: ' + error);
	}
}

/**
 * 게시글 삭제
 */
async function deletePost(bizPstId) {
	const result = await Swal.fire({
		title: "정말 게시물을 삭제하시겠습니까?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "삭제",
		cancelButtonText: "취소"
	});

	if (result.isConfirmed) {
		const resp = await fetch(`/rest/project-board/remove?bizPstId=${bizPstId}`, {
			method: 'PUT'
		});

		if (resp.ok) {
			await Swal.fire({
				title: "게시물이 삭제되었습니다.",
				icon: "success"
			});
			showListView();
		} else {
			showAlert('error', '삭제 실패');
		}
	}
}


// ============================================
// 모달 관련 함수
// ============================================

/**
 * 수정 모달 열기
 */
async function openEditModal(bizPstId) {
	const resp = await fetch(`/rest/project-board/read/${bizPstId}`);
	const data = await resp.json();
	const post = data.pbVO;

	document.getElementById('post-title').value = post.pstTtl;
	document.getElementById('post-content').value = post.contents;

	savePostBtn.dataset.mode = 'edit';
	savePostBtn.dataset.postId = bizPstId;
	savePostBtn.textContent = '수정';

	const modal = new bootstrap.Modal(writePostModal);
	modal.show();
}

/**
 * 모달 닫기 및 목록 새로고침
 */
function closeModalAndReload() {
	const modal = bootstrap.Modal.getInstance(writePostModal);
	if (modal) {
		modal.hide();
	}

	writePostModal.addEventListener('hidden.bs.modal', function handler() {
		document.body.classList.remove('modal-open');
		const backdrops = document.querySelectorAll('.modal-backdrop');
		backdrops.forEach(backdrop => backdrop.remove());
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';

		document.getElementById('write-post-form').reset();

		// 파일 관련 초기화
		selectedFiles = [];
		renderFileList();

		loadBoardPosts();

		writePostModal.removeEventListener('hidden.bs.modal', handler);
	}, { once: true });
}


// ============================================
// 뷰 전환 함수
// ============================================

/**
 * 목록 뷰로 전환
 */
function showListView() {
	boardListView.style.display = 'block';
	boardDetailView.style.display = 'none';
	loadBoardPosts();
}

/**
 * 상세 뷰로 전환
 */
function showDetailView() {
	boardListView.style.display = 'none';
	boardDetailView.style.display = 'block';
}


// ============================================
// 댓글 관련 함수
// ============================================

/**
 * 댓글 목록 로드
 */
async function loadBoardComments(bizPstId) {
	try {
		const resp = await fetch(`/rest/project-board-comment/${bizPstId}`);
		const data = await resp.json();

		const pbcList = data.pbcList;
		const totalCount = data.totalCount;

		// 디버깅: 실제 데이터 구조 확인
		console.log('=== 댓글 데이터 확인 ===');
		console.log('pbcList:', pbcList);
		if (pbcList && pbcList.length > 0) {
			console.log('첫 번째 댓글:', pbcList[0]);
			console.log('댓글 키들:', Object.keys(pbcList[0]));
		}

		document.getElementById('comment-count').textContent = totalCount;

		renderBoardComments(pbcList, bizPstId);
	} catch (error) {
		console.error('댓글 로딩 오류:', error);
	}
}

/**
 * 게시판 댓글 요소 생성
 */
function createBoardCommentElement(comment, bizPstId) {
	const commentDiv = document.createElement('div');
	commentDiv.className = 'comment-div mb-3';
	commentDiv.dataset.pstid = bizPstId;

	const isDeleted = comment.delYn === 'Y';
	const currentUserId = userId;
	const isAuthor = comment.crtUserId === currentUserId;

	const dateField = comment.frstCrtDt || '';
	const formattedDate = formatDateTime(dateField);

	// 사용자명 처리
	let userName = (comment.users && comment.users.userNm)
		? comment.users.userNm
		: comment.crtUserId;

	let jobNm = '';
	let deptNm = (comment.users && comment.users.deptNm) ? comment.users.deptNm : '';

	// 프로필 사진 경로 처리
	let userFilePath = '/images/faces/1.jpg';

	if (comment.users && comment.users.filePath) {
		userFilePath = comment.users.filePath;
	} else if (comment.crtUserId) {
		const memberListEl = document.getElementById('member-list');
		if (memberListEl) {
			const memberItems = memberListEl.querySelectorAll('li');
			memberItems.forEach(item => {
				if (item.dataset.userId === comment.crtUserId) {
					const memberFilePath = item.dataset.filePath;
					if (memberFilePath && memberFilePath !== '/images/faces/1.jpg') {
						userFilePath = memberFilePath;
					}

					if (item.dataset.jobNm) {
						jobNm = item.dataset.jobNm;
					}

					if (!deptNm && item.dataset.deptNm) {
						deptNm = item.dataset.deptNm;
					}
				}
			});
		}

		if (userFilePath === '/images/faces/1.jpg') {
			userFilePath = `/assets/images/faces/${comment.crtUserId}.jpg`;
		}
	}

	// 사용자 표시명 생성: 이름 직급 (부서)
	let userDisplay = userName;
	if (jobNm) {
		userDisplay += ` ${jobNm}`;
	}
	if (deptNm) {
		userDisplay += `(${deptNm})`;
	}

	const contents = isDeleted ? '삭제된 댓글입니다.' : (comment.contents || '');

	const avatarHtml = `<img src="${userFilePath}"
                             alt="${userName}"
                             onerror="this.src='/images/faces/1.jpg'"
                             style="object-fit: cover; width: 40px; height: 40px; border-radius: 50%;">`;

	const html = `
        <div class="comment" data-cmntsqn="${comment.bizCmntId}">
            <div class="d-flex gap-3">
                <div class="avatar avatar-md">
                    ${avatarHtml}
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0">${isDeleted ? '' : userDisplay}</h6>
                        <div class="d-flex align-items-center gap-2">
                            <small class="text-muted">${formattedDate}</small>
                            ${!isDeleted && isAuthor ? `
                                <button class="btn btn-sm btn-outline-danger delete-task-comment-btn"
                                        data-comment-id="${comment.bizCmntId}"
                                        title="삭제">
                                    <i class="bi bi-trash"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <p class="mb-0 text-muted">${escapeHtml(contents).split('\n').join('<br>')}</p>
                    ${!isDeleted ? `
                        <div class="mt-2">
                            <a href="javascript:void(0);" class="reply-toggle text-muted small"
                               data-target="reply-form-${comment.bizCmntId}">
                                <i class="bi bi-reply"></i> 답글
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>

        <div id="reply-div-${comment.bizCmntId}" class="ms-5 mt-2"></div>

        ${!isDeleted ? `
        <div id="reply-form-${comment.bizCmntId}" class="ms-5 mt-2" style="display: none;">
            <form class="reply-form">
                <div class="input-group">
                    <input type="text" class="form-control" name="contents" placeholder="대댓글을 입력하세요" required>
                    <button class="btn btn-primary reply-submit-btn" type="submit">등록</button>
                </div>
            </form>
        </div>
        ` : ''}
    `;

	commentDiv.innerHTML = html;
	return commentDiv;
}

/**
 * 게시판 대댓글 요소 생성
 */
function createBoardReplyElement(reply, bizPstId) {
	const replyDiv = document.createElement('div');
	replyDiv.className = 'comment mt-2';
	replyDiv.dataset.cmntsqn = reply.bizCmntId;
	replyDiv.dataset.pstid = bizPstId;

	const isDeleted = reply.delYn === 'Y';
	const currentUserId = userId;
	const isAuthor = reply.crtUserId === currentUserId;

	const dateField = reply.frstCrtDt || '';
	const formattedDate = formatDateTime(dateField);

	let userName = (reply.users && reply.users.userNm)
		? reply.users.userNm
		: reply.crtUserId;

	let jobNm = '';
	let deptNm = (reply.users && reply.users.deptNm) ? reply.users.deptNm : '';

	let userFilePath = '/images/faces/1.jpg';

	if (reply.users && reply.users.filePath) {
		userFilePath = reply.users.filePath;
	} else if (reply.crtUserId) {
		const memberListEl = document.getElementById('member-list');
		if (memberListEl) {
			const memberItems = memberListEl.querySelectorAll('li');
			memberItems.forEach(item => {
				if (item.dataset.userId === reply.crtUserId) {
					const memberFilePath = item.dataset.filePath;
					if (memberFilePath && memberFilePath !== '/images/faces/1.jpg') {
						userFilePath = memberFilePath;
					}

					if (item.dataset.jobNm) {
						jobNm = item.dataset.jobNm;
					}

					if (!deptNm && item.dataset.deptNm) {
						deptNm = item.dataset.deptNm;
					}
				}
			});
		}

		if (userFilePath === '/images/faces/1.jpg') {
			userFilePath = `/assets/images/faces/${reply.crtUserId}.jpg`;
		}
	}

	let userDisplay = userName;
	if (jobNm) {
		userDisplay += ` ${jobNm}`;
	}
	if (deptNm) {
		userDisplay += `(${deptNm})`;
	}

	const contents = isDeleted ? '삭제된 대댓글입니다.' : (reply.contents || '');

	const avatarHtml = `<img src="${userFilePath}"
                             alt="${userName}"
                             onerror="this.src='/images/faces/1.jpg'"
                             style="object-fit: cover; width: 32px; height: 32px; border-radius: 50%;">`;

	const html = `
        <div class="d-flex gap-3">
            <div class="avatar avatar-sm">
                ${avatarHtml}
            </div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <h6 class="mb-0 small">${isDeleted ? '' : userDisplay}</h6>
                    <div class="d-flex align-items-center gap-2">
                        <small class="text-muted">${formattedDate}</small>
                        ${!isDeleted && isAuthor ? `
                            <button class="btn btn-sm btn-outline-danger delete-task-comment-btn"
                                    data-comment-id="${reply.bizCmntId}"
                                    title="삭제">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                <p class="mb-0 text-muted small">${escapeHtml(contents).split('\n').join('<br>')}</p>
            </div>
        </div>
    `;

	replyDiv.innerHTML = html;
	return replyDiv;
}

/**
 * 댓글 목록 렌더링
 */
function renderBoardComments(pbcList, bizPstId) {
	const commentListEl = document.getElementById('comment-list');
	commentListEl.innerHTML = '';

	if (!pbcList || pbcList.length === 0) {
		commentListEl.innerHTML = '<p class="text-muted">댓글이 없습니다.</p>';
		return;
	}

	const comments = pbcList.filter(c => !c.upBizCmntId);
	const replies = pbcList.filter(c => c.upBizCmntId);

	comments.forEach(comment => {
		const commentDiv = createBoardCommentElement(comment, bizPstId);
		commentListEl.appendChild(commentDiv);

		const commentReplies = replies.filter(r => r.upBizCmntId === comment.bizCmntId);
		if (commentReplies.length > 0) {
			const replyContainer = document.getElementById(`reply-div-${comment.bizCmntId}`);
			if (replyContainer) {
				commentReplies.forEach(reply => {
					const replyEl = createBoardReplyElement(reply, bizPstId);
					replyContainer.appendChild(replyEl);
				});
			}
		}
	});
}

/**
 * 댓글 등록
 */
async function submitBoardComment() {
	const commentInput = document.getElementById('comment-input');
	const contents = commentInput.value.trim();

	if (!contents) {
		showAlert('warning', '댓글을 입력하세요.');
		return;
	}

	const resp = await fetch(`/rest/project-board-comment/${currentPostId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ contents: contents })
	});

	if (resp.ok) {
		const data = await resp.json();
		if (data.success) {
			commentInput.value = '';
			loadBoardComments(currentPostId);
		}
	} else {
		showAlert('error', '댓글 등록 실패');
	}
}

/**
 * 댓글 삭제
 */
async function removeBoardComment(bizPstId, bizCmntId) {
	console.log('=== removeComment 함수 시작 ===');
	console.log('bizPstId:', bizPstId);
	console.log('bizCmntId:', bizCmntId);

	const url = `/rest/project-board-comment/${bizPstId}/remove?bizCmntId=${bizCmntId}`;
	console.log('요청 URL:', url);

	try {
		const resp = await fetch(url, {
			method: 'PUT'
		});

		console.log('서버 응답 상태:', resp.status, resp.ok);

		if (resp.ok) {
			const data = await resp.json();
			console.log('서버 응답 데이터:', data);

			if (data.success) {
				await Swal.fire({
					title: "댓글이 삭제되었습니다.",
					icon: "success"
				});
				loadBoardComments(bizPstId);
			} else {
				console.error('서버에서 success: false 반환');
				showAlert('error', '댓글 삭제 실패: ' + (data.message || '알 수 없는 오류'));
			}
		} else {
			const errorText = await resp.text();
			console.error('서버 오류 응답:', errorText);
			showAlert('error', '댓글 삭제 실패: ' + resp.status);
		}
	} catch (error) {
		console.error('댓글 삭제 오류:', error);
		showAlert('error', '댓글 삭제 중 오류 발생: ' + error.message);
	}
}

// ============================================
// 이벤트 리스너 등록 (DOMContentLoaded)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
	// 초기 게시글 목록 로드
	loadBoardPosts();

	// 파일 선택 이벤트
	if (fileList) {
		fileList.addEventListener('change', handleFileSelect);
	}

	// 모달 닫기 이벤트 수정
	if (writePostModal) {
		writePostModal.addEventListener('show.bs.modal', function() {
			const noticeCheckbox = document.getElementById('is-notice-checkbox');

			if (currentUser.id === project.managerId) {
				noticeCheckbox.disabled = false;
			} else {
				noticeCheckbox.disabled = true;
			}
		});

		writePostModal.addEventListener('hidden.bs.modal', function() {
			savePostBtn.dataset.mode = 'create';
			savePostBtn.textContent = '저장';
			delete savePostBtn.dataset.postId;

			// 파일 목록 초기화
			selectedFiles = [];
			renderFileList();
		});
	}

	// 검색 버튼
	const searchBtn = document.getElementById('searchBtn');
	if (searchBtn) {
		searchBtn.addEventListener('click', onSearch);
	}

	// 목록으로 돌아가기 버튼
	if (backToListBtn) {
		backToListBtn.addEventListener('click', showListView);
	}

	// 게시글 수정 버튼
	if (editBtnInline) {
		editBtnInline.addEventListener('click', function() {
			const bizPstId = this.dataset.postId;
			openEditModal(bizPstId);
		});
	}

	// 게시글 삭제 버튼
	if (deleteBtnInline) {
		deleteBtnInline.addEventListener('click', function() {
			const bizPstId = this.dataset.postId;
			deletePost(bizPstId);
		});
	}

	// 게시글 저장 버튼
	if (savePostBtn) {
		savePostBtn.addEventListener('click', () => {
			if (savePostBtn.dataset.mode === 'edit') {
				const bizPstId = savePostBtn.dataset.postId;
				modifyBoardPost(bizPstId);
			} else {
				createBoardPost();
			}
		});
	}

	// ============================================
	// 댓글 관련 이벤트 (존재 여부 확인 필수!)
	// ============================================
	const commentSection = document.getElementById('comment-section');

	if (commentSection) {
		// 댓글 섹션 이벤트 위임
		commentSection.addEventListener('click', async function(e) {
			// 답글 토글
			if (e.target.classList.contains('reply-toggle')) {
				const targetId = e.target.dataset.target;
				const replyForm = document.getElementById(targetId);
				if (replyForm) {
					replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
				}
			}

			// 댓글 삭제
			const deleteBtn = e.target.closest('.delete-task-comment-btn');
			if (deleteBtn) {
				// 디버깅: 값 확인
				console.log('=== 댓글 삭제 디버깅 ===');
				console.log('deleteBtn:', deleteBtn);
				console.log('deleteBtn.dataset:', deleteBtn.dataset);
				console.log('deleteBtn.dataset.commentId:', deleteBtn.dataset.commentId);

				const bizCmntId = deleteBtn.dataset.commentId;
				const bizPstId = currentPostId;

				console.log('bizCmntId:', bizCmntId);
				console.log('bizPstId:', bizPstId);

				// undefined 체크
				if (!bizCmntId) {
					console.error('댓글 ID를 찾을 수 없습니다.');
					showAlert('error', '댓글 ID를 찾을 수 없습니다.');
					return;
				}

				if (!bizPstId) {
					console.error('게시글 ID를 찾을 수 없습니다.');
					showAlert('error', '게시글 ID를 찾을 수 없습니다.');
					return;
				}

				const result = await Swal.fire({
					title: "정말 댓글을 삭제하시겠습니까?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#3085d6",
					cancelButtonColor: "#d33",
					confirmButtonText: "삭제",
					cancelButtonText: "취소"
				});

				if (result.isConfirmed) {
					console.log('removeComment 호출:', bizPstId, bizCmntId);
					removeBoardComment(bizPstId, bizCmntId);
				}
			}

		});

		// 대댓글 작성 폼 제출
		commentSection.addEventListener('submit', async function(e) {
			if (e.target.classList.contains('reply-form')) {
				e.preventDefault();

				const formData = new FormData(e.target);
				const contents = formData.get('contents');

				if (!contents.trim()) {
					showAlert('warning', '대댓글을 입력하세요.');
					return;
				}

				const comment = e.target.closest('.comment-div').querySelector('.comment');
				const upBizCmntId = comment.dataset.cmntsqn;
				const commentDiv = e.target.closest('.comment-div');
				const bizPstId = commentDiv.dataset.pstid;

				const resp = await fetch(`/rest/project-board-comment/${bizPstId}?upBizCmntId=${upBizCmntId}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ contents: contents })
				});

				if (resp.ok) {
					const data = await resp.json();
					if (data.success) {
						e.target.reset();
						e.target.parentElement.style.display = 'none';
						loadBoardComments(bizPstId);
					}
				} else {
					showAlert('error', '대댓글 등록 실패');
				}
			}
		});
	}

	// 댓글 등록 버튼
	const submitCommentBtn = document.getElementById('submit-comment-btn');
	if (submitCommentBtn) {
		submitCommentBtn.addEventListener('click', submitBoardComment);
	}

	// 시연 데이터 추가 버튼 (모달 내 버튼)
	const demoDataBtn = document.getElementById('demo-data-btn');
	if (demoDataBtn) {
		demoDataBtn.addEventListener('click', openDemoModal);
	}
});

/**
 * HTML 이스케이프 처리
 */
function escapeHtml(text) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 날짜 포맷팅 (상대 시간)
 */
function formatDateTime(dateString) {
	if (!dateString) return '';

	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now - date;
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return '방금 전';
	if (diffMins < 60) return `${diffMins}분 전`;
	if (diffHours < 24) return `${diffHours}시간 전`;
	if (diffDays < 7) return `${diffDays}일 전`;

	// 7일 이상이면 날짜 표시
	return date.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * 파일 크기 포맷팅
 */
function formatFileSize(bytes) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 파일 목록 렌더링
 */
function renderFileList() {
	const fileListContainer = document.getElementById('file-list-preview');
	if (!fileListContainer) return;

	fileListContainer.innerHTML = '';

	if (selectedFiles.length === 0) {
		fileListContainer.innerHTML = '<p class="text-muted small mb-0">선택된 파일이 없습니다.</p>';
		return;
	}

	selectedFiles.forEach((file, index) => {
		const fileItem = document.createElement('div');
		fileItem.className = 'file-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded';

		// 파일 아이콘 결정
		const extension = file.name.split('.').pop().toLowerCase();
		let iconClass = 'bi-file-earmark';
		if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
			iconClass = 'bi-file-earmark-image';
		} else if (['pdf'].includes(extension)) {
			iconClass = 'bi-file-earmark-pdf';
		} else if (['doc', 'docx'].includes(extension)) {
			iconClass = 'bi-file-earmark-word';
		} else if (['xls', 'xlsx'].includes(extension)) {
			iconClass = 'bi-file-earmark-excel';
		} else if (['zip', 'rar', '7z'].includes(extension)) {
			iconClass = 'bi-file-earmark-zip';
		}

		fileItem.innerHTML = `
            <div class="d-flex align-items-center flex-grow-1">
                <i class="bi ${iconClass} text-primary me-2 fs-5"></i>
                <div>
                    <div class="file-name small">${escapeHtml(file.name)}</div>
                    <div class="file-size text-muted" style="font-size: 0.75rem;">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger remove-file-btn" data-index="${index}">
                <i class="bi bi-x-lg"></i>
            </button>
        `;

		fileListContainer.appendChild(fileItem);
	});

	// 파일 삭제 버튼 이벤트
	document.querySelectorAll('.remove-file-btn').forEach(btn => {
		btn.addEventListener('click', function() {
			const index = parseInt(this.dataset.index);
			removeFile(index);
		});
	});
}

/**
 * 파일 제거
 */
function removeFile(index) {
	selectedFiles.splice(index, 1);
	updateFileInput();
	renderFileList();
}

/**
 * FileList를 배열로 변환하고 파일 input 업데이트
 */
function updateFileInput() {
	// DataTransfer를 사용하여 FileList 재생성
	const dataTransfer = new DataTransfer();
	selectedFiles.forEach(file => {
		dataTransfer.items.add(file);
	});
	fileList.files = dataTransfer.files;
}

/**
 * 파일 선택 시 처리
 */
function handleFileSelect(event) {
	const files = Array.from(event.target.files);

	// 기존 파일 배열에 새 파일 추가
	files.forEach(file => {
		// 중복 체크 (파일명과 크기로)
		const isDuplicate = selectedFiles.some(
			f => f.name === file.name && f.size === file.size
		);
		if (!isDuplicate) {
			selectedFiles.push(file);
		}
	});

	updateFileInput();
	renderFileList();
}

// ============================================
// 시연용 데이터 관련 함수
// ============================================
function openDemoModal(event) {
	event.preventDefault();

	const demoData = {
		title: '📌 Q3 마케팅 전략 회의',
		content: `안녕하세요!

이번 Q3 분기 마케팅 전략에 대해 회의를 진행하고자 합니다.

📋 주요 안건:
- 신제품 출시 홍보 전략
- SNS 마케팅 강화 계획
- 이벤트 마케팅 일정 조율

🗓️ 예정 일시: 2025.11.10 (금) 10:00 ~ 11:30
장소: 회의실 B

많은 참석 부탁드립니다.`,
		isNotice: false
	};

	// 제목 입력
	pstTtl.value = demoData.title;

	// 내용 입력
	contents.value = demoData.content;

	// 공지사항 설정 (권한 있을 경우만)
	if (noticeCheckbox && !noticeCheckbox.disabled) {
		noticeCheckbox.checked = demoData.isNotice;
	}
}

