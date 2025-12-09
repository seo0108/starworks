/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 10.     	장어진            최초 생성
 * 2025. 10. 11.        Gemini           폴더 생성 및 드래그앤드롭 기능 추가
 *
 * </pre>
 */

// 기존 요소
const searchBtn = document.getElementById('searchBtn');
const searchForm = document.getElementById('searchForm');
const selectAll = document.getElementById('selectAll');
const batchDownloadBtn = document.getElementById('batch-download');
const batchDeleteBtn = document.getElementById('batch-delete');

// 새 기능 요소
const createFolderBtn = document.getElementById('createFolderBtn');
const driveContainer = document.getElementById('drive-container');

// ===================================================================
// 기존 기능 이벤트 리스너
// ===================================================================

if (selectAll) {
	selectAll.addEventListener('change', function() {
		const checked = this.checked;
		// 폴더의 체크박스는 disabled이므로 자동으로 제외됨
		document.querySelectorAll('.file-checkbox').forEach(cb => cb.checked = checked);
	});
}

if (searchBtn) {
	searchBtn.addEventListener('click', function() {
		searchForm.requestSubmit();
	});
}

if (batchDownloadBtn) {
	batchDownloadBtn.addEventListener('click', function() {
		const checkedFiles = Array.from(document.querySelectorAll('.file-checkbox:checked'))
			.map(cb => cb.value); // value에 saveFileNm이 있음

		if (checkedFiles.length === 0) {
			alert('선택된 파일이 없습니다.');
			return;
		}

		checkedFiles.forEach(fileName => {
			const link = document.createElement('a');
			link.href = `/file/download/${fileName}`;
			link.download = '';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		});
	});
}

if (batchDeleteBtn) {
	batchDeleteBtn.addEventListener('click', function() {
		const form = document.getElementById('deleteForm');
		form.innerHTML = '';

		const checkedBoxes = document.querySelectorAll('.file-checkbox:checked');
		if (checkedBoxes.length === 0) {
			alert('선택된 파일이 없습니다.');
			return;
		}

		checkedBoxes.forEach(cb => {
			const userFileIdInput = document.createElement('input');
			userFileIdInput.type = 'hidden';
			userFileIdInput.name = 'fileId';
			userFileIdInput.value = cb.dataset.fileId;

			const userFileSqnInput = document.createElement('input');
			userFileSqnInput.type = 'hidden';
			userFileSqnInput.name = 'fileSeq';
			userFileSqnInput.value = cb.dataset.fileSeq;

			form.appendChild(userFileIdInput);
			form.appendChild(userFileSqnInput);
		});

		if (confirm(`선택한 ${checkedBoxes.length}개의 파일을 삭제하시겠습니까?`)) {
			form.submit();
		}
	});
}

function fnPaging(page) {
	searchForm.page.value = page;
	searchForm.requestSubmit();
}

// ===================================================================
// 신규 기능 (폴더, 드래그앤드롭)
// ===================================================================

document.addEventListener("DOMContentLoaded", () => {

	if (!driveContainer) return;

	// [MODIFIED] - 드래그 앤 드롭 기능 활성화
	new Sortable(driveContainer, {
		animation: 150,
		group: 'shared',
		draggable: '.draggable-item', // 드래그 가능한 요소
		onEnd: function(evt) {
			const item = evt.item; // 드래그된 요소
			const toEl = evt.to;   // 드롭된 컨테이너

			// 드롭된 곳이 폴더가 아니면 이동시키지 않음
			if (!toEl.classList.contains('droppable-folder') && toEl.id !== 'drive-container') {
				// 원래 위치로 되돌리는 효과 (라이브러리가 자동으로 처리)
				return;
			}

			const itemType = item.dataset.itemType;
			// 드롭된 곳이 최상위 컨테이너이면 upFolderSqn은 null, 폴더 안이면 해당 폴더의 sqn
			const upFolderSqn = toEl.id === 'drive-container' ? null : toEl.dataset.folderSqn;

			if (itemType === 'file') {
				const userFileId = item.dataset.fileId;
				const userFileSqn = item.dataset.fileSeq;
				// 파일을 폴더로 이동
				moveFile(userFileId, userFileSqn, upFolderSqn, item);
			} else if (itemType === 'folder') {
				const folderSqn = item.dataset.folderSqn;
				// 폴더를 다른 폴더로 이동
				moveFolder(folderSqn, upFolderSqn, item);
			}
		}
	});

	// [MODIFIED] - "새 폴더 만들기" 버튼 이벤트
	if (createFolderBtn) {
		createFolderBtn.addEventListener('click', async () => {
			const folderNm = prompt("새 폴더의 이름을 입력하세요:");
			if (!folderNm || folderNm.trim() === '') return;

			// 현재 폴더의 sqn을 hidden input에서 가져옴
			const upFolderSqn = document.querySelector("input[name='folderSqn']").value;

			const response = await fetch('/rest/document/user/folder', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					folderNm: folderNm,
					upFolderSqn: upFolderSqn ? parseInt(upFolderSqn) : null // 값이 없으면 null
				})
			});

			if (response.ok) {
				const result = await response.json();
				if (result.success) {
					alert("폴더가 생성되었습니다.");
					window.location.reload();
				} else {
					alert("폴더 생성에 실패했습니다.");
				}
			} else {
				alert("폴더 생성 중 오류가 발생했습니다.");
			}
		});
	}

	// [NEW] - 파일 이동 API 호출 함수
	async function moveFile(userFileId, userFileSqn, folderSqn, itemElement) {
		const response = await fetch('/rest/document-user-file/move', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userFileId: userFileId,
				userFileSqn: parseInt(userFileSqn),
				folderSqn: folderSqn ? parseInt(folderSqn) : null
			})
		});

		const result = await response.json();
		if (result.success) {
			itemElement.remove(); // 화면에서 요소 제거
			console.log("파일을 이동했습니다.");
		} else {
			alert("파일 이동에 실패했습니다.");
			// 실패 시 원래 위치로 되돌리는 로직이 필요하지만, SortableJS가 자동으로 처리해줄 수 있음 (revertClone 옵션 등)
			// 여기서는 간단하게 새로고침으로 처리
			window.location.reload();
		}
	}

	// [NEW] - 폴더 이동 API 호출 함수
	async function moveFolder(folderSqn, upFolderSqn, itemElement) {
		if (folderSqn === upFolderSqn) return; // 같은 폴더로 이동 방지

		const response = await fetch(`/rest/document/user/folder/move`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				folderSqn: parseInt(folderSqn),
				upFolderSqn: upFolderSqn ? parseInt(upFolderSqn) : null
			})
		});

		const result = await response.json();
		if (result.success) {
			itemElement.remove(); // 화면에서 요소 제거
			console.log("폴더를 이동했습니다.");
		} else {
			alert("폴더 이동에 실패했습니다.");
			window.location.reload();
		}
	}
});
