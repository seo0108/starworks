/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자             	수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 9. 29.     	임가영           	 	최초 생성
 * 2025. 10. 4.			임가영				코드 리팩토링 1차 (이벤트 위임 한 곳에 몰아넣기)
 * </pre>
 */
let commentCount = document.querySelector("#comment-count"); // 댓글 수 UI

// 클릭 이벤트 핸들러 (이벤트 위임 사용)
document.querySelector("#main-content").addEventListener("click", async function(e) {

	const target = e.target;

	// 대댓글 작성
	if(target.classList.contains("reply-btn")) {
		const commentDiv = target.closest(".comment-div");
		const comment = commentDiv.querySelector(".comment");
		let upCmntSqn = comment.dataset["cmntsqn"];
		let pstId = commentDiv.dataset["pstid"];

		// 대댓글 폼 데이터(contents) 가져오기
		const formTag = target.closest("form");
		const formData = new FormData(formTag);

		// 대댓글 작성 비동기 요청 (만약 insert 성공하면 대댓글 UI 와 댓글 수 UI 에 데이터 다시 꽂아넣기)
		let url = `/rest/board-comment/${pstId}?upCmntSqn=${upCmntSqn}`;
		fetch(url, {
			method : "post",
			headers : {
				"accept" : "application/json"
			},
			body : formData
		})
		.then(resp => resp.json())
		.then(data => {
			const success = data.success; // 성공 여부
			const boardComment = data.boardComment; // 방금 등록한 대댓글 정보

			formTag.reset();
			if (success) {
				let replyDiv = document.querySelector("#reply-div-" + upCmntSqn); // 대댓글 UI

				let code = `<div class="ms-5 mt-3 comment" data-cmntsqn=${boardComment.cmntSqn}>
					<div class="d-flex align-items-start">
						<div class="flex-shrink-0">
							<div class="avatar avatar-md">
								<img src="${boardComment.filePath ? boardComment.filePath : '/dist/assets/static/images/faces/1.jpg'}" alt="Avatar">
							</div>
						</div>
						<div class="flex-grow-1 ms-3">
							<h6 class="mt-0">${boardComment.users['userNm'] }</h6>
							<div>
								<p class="mb-0">${boardComment.contents }</p>
								<small class="text-muted me-3">${boardComment.frstCrtDt }</small>
								<a href="javascript:;" class="text-muted delBtn">삭제</a>
							</div>
						</div>
					</div>
				</div>`;

				showToast("success", "댓글이 등록되었습니다!")

				commentCount.innerText = parseInt(commentCount.textContent) + 1;
				replyDiv.innerHTML += code;
			}
		}) // 대댓글 작성 비동기 요청 끝
	} // 대댓글 작성 버튼 로직 끝

	// 댓글 삭제
	if (target.classList.contains("delBtn")) {
        // 현재 게시물의 pstId 와 현재 댓글의 cmntSqn 가져오기
		const commentDiv = target.closest(".comment-div");
		const comment = target.closest(".comment");
		let cmntSqn = comment.dataset["cmntsqn"];
		let pstId = commentDiv.dataset["pstid"];

		// 댓글&대댓글 삭제 비동기 요청 (만약 delete 성공하면 UI 에 데이터 다시 꽂아넣기)
		let url = `/rest/board-comment/${pstId}?cmntSqn=${cmntSqn}`;
		const resp = await fetch(url, {
									method : "delete",
									headers : {
										"accept" : "application/json"
									}
								})
		const data = await resp.json();
		const success = data['success'];

		if(success) {
			const boardComment = data['boardComment']; // 방금 등록한 대댓글 정보

			let code = "";
			if(boardComment['upCmntSqn'] != null) {
				// 상위 댓글이 있다면 대댓글. 대댓글 UI 삽입
				code = `<div class="d-flex align-items-start">
							<div class="flex-shrink-0">
								<div class="avatar avatar-md">
									<img src="/dist/assets/static/images/faces/b.jpg" alt="Avatar">
								</div>
							</div>
							<div class="flex-grow-1 ms-3">
								<h6 class="mt-0"></h6>
								<div>
									<p class="mb-0">삭제된 대댓글입니다.</p>
									<small class="text-muted me-3">${boardComment['frstCrtDt'] }</small>
								</div>
							</div>
						</div>`;
			} else {
				// 상위 댓글이 없다면 댓글. 댓글 UI 삽입
				code = `<div class="avatar avatar-lg">
							<div class="avatar avatar-md">
								<img src="/dist/assets/static/images/faces/b.jpg" alt="Avatar">
							</div>
						</div>
						<div class="flex-grow-1 ms-3">
							<h6 class="mt-0"></h6>
							<p class="mb-0">삭제된 댓글입니다.</p>
							<div>
								<small class="text-muted me-3">${boardComment['frstCrtDt'] }</small>
								<a href="javascript:void(0);" onclick="toggleReplyDiv('reply-form-${boardComment.cmntSqn}')" class="--bs-primary">답글</a>
							</div>
						</div>`;
			}

			showToast("trash", "댓글이 삭제되었습니다.")

			commentCount.innerText = parseInt(commentCount.textContent) - 1;
			comment.innerHTML = code;
		} else {
			showToast("error", "삭제에 실패했습니다.")
		}
	}

	// 게시글 삭제 버튼 클릭
	if (target.classList.contains('btn-delete') || target.closest('.btn-delete')) {
	    const cardTitle = document.getElementsByClassName("card-title");
		const pstId = cardTitle[0].dataset["pstid"];

	    if (pstId) {
	        showDeleteConfirmModal(pstId);
	    } else {
	         showToast("error", "게시글 정보를 얻어오는데 실패했습니다.");
	    }
	}

}) // 클릭 이벤트 핸들러 (이벤트 위임 사용) 끝

// 모달창에서 삭제 버튼 클릭
confirmDeleteBtn.addEventListener("click", (e) => {
	const cardTitle = document.querySelector(".card-title");
	const pstId = cardTitle.dataset["pstid"];

	if (pstId) {
        // 모달 닫기
        const modalElement = document.getElementById('deleteConfirmModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }

        // 실제 삭제 함수 호출
        location.href=`/board/community/${pstId}/remove`;
    } else {
         showToast("error", "삭제할 게시글 ID를 찾을 수 없습니다.");
    }
});

// 답글창 표시 함수
function toggleReplyDiv(formId) {
    const formTag = document.getElementById(formId);
    if (formTag) {
        if (formTag.style.display === 'none') {
        	formTag.style.display = 'block';
        } else {
        	formTag.style.display = 'none';
        }
    }
}

//커스텀 삭제 확인 모달 표시 함수
function showDeleteConfirmModal(pstId) {
    // 삭제할 메뉴 ID를 숨김 필드에 저장
    const pstIdInput = document.getElementById('pstIdToDelete');
    if (pstIdInput) {
        pstIdInput.value = pstId;
    }

    // 모달 표시
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
}
