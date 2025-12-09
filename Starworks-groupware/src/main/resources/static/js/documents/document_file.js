/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 10.     	장어진            최초 생성
 *
 * </pre>
 */
const searchBtn = document.getElementById('searchBtn');
const searchForm = document.getElementById('searchForm');
const selectAll = document.getElementById('selectAll');
const batchDownloadBtn = document.getElementById('batch-download');
const batchDeleteBtn = document.getElementById('batch-delete');
const batchRestoreBtn = document.getElementById('batch-restore');

/* 체크 박스 컨트롤 */
selectAll.addEventListener('change', function() {
	const checked = this.checked;
	document.querySelectorAll('.file-checkbox').forEach(cb => cb.checked = checked);
});


searchBtn.addEventListener('click', function() {
	searchUI.requestSubmit();
});

function fnPaging(page) {
	searchForm.page.value = page;
	searchForm.requestSubmit();
}

if (batchDownloadBtn != null) {
	/* 파일 다운로드 */
	batchDownloadBtn.addEventListener('click', function() {
		const checkedBoxes = document.querySelectorAll('.file-checkbox:checked');

		if (checkedBoxes.length === 0) {
			showToast("info", '선택된 파일이 없습니다.')
			return;
		}
		/* .file-checkbox 클래스의 check 된 것들만 모아서 반복문 들림 */
		checkedBoxes.forEach(cb => {
			let fileId = cb.dataset.fileid ?? null;
			let fileSeq = cb.dataset.fileseq ?? null;
			let folderSqn = cb.dataset.foldersqn ?? null;


			let link = document.createElement("a"); // 여러 건 다운로드 하기 위한..
			link.setAttribute("download", ""); // 다운로드 속성
			link.style.display = "none";

			if (fileSeq != null) {
				fetch(`/rest/comm-file/${fileSeq}`)
					.then(resp => resp.json())
					.then(data => {
						link.href = `/file/download/${data.saveFileNm}`;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					})
			}

			if (folderSqn != null) {
				link.href = `/folder/download/${folderSqn}`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}

		});
	})
}

if (batchDeleteBtn != null) {
	/* 파일 삭제 */
	batchDeleteBtn.addEventListener('click', function() {
		const form = document.getElementById('deleteForm');
		form.innerHTML = '';

		const checkedBoxes = document.querySelectorAll('.file-checkbox:checked');
		if (checkedBoxes.length === 0) {
			showToast("info", '선택된 파일이 없습니다.')
			return;
		}

		const modalElement = document.getElementById("deleteConfirmModal");
		const modal = new bootstrap.Modal(modalElement);
		modal.show(); // 모달 열기

	})
}

if (confirmDeleteBtn != null) {
	confirmDeleteBtn.addEventListener("click", () => {
		/* .file-checkbox 클래스의 check 된 것들만 모아서 반복문 들림 */
		const checkedBoxes = document.querySelectorAll('.file-checkbox:checked');

		checkedBoxes.forEach(cb => {
			/* input 태그 생성 */
			const fileIdInput = document.createElement('input');
			/* hidden 속성 부여 */
			fileIdInput.type = 'hidden';
			/* name 속성은 fileId로 부여 */
			fileIdInput.name = 'fileId';
			/* value 는 checkbox 의 dataset에 있는 filedid */
			fileIdInput.value = cb.dataset.fileid ?? null;

			/* input 태그 생성 */
			const fileSeqInput = document.createElement('input');
			/* hidden 속성 부여 */
			fileSeqInput.type = 'hidden';
			/* name 속성은 fileSqn 으로 부여 */
			fileSeqInput.name = 'fileSeq';
			/* value 는 checkbox 의 dataset에 있는 fileseq */
			fileSeqInput.value = cb.dataset.fileseq ?? null;

			/* input 태그 생성 */
			const folderSqnInput = document.createElement('input');
			/* hidden 속성 부여 */
			folderSqnInput.type = 'hidden';
			/* name 속성은 fileSqn 으로 부여 */
			folderSqnInput.name = 'folderSqn';
			/* value 는 checkbox 의 dataset에 있는 fileseq */
			folderSqnInput.value = cb.dataset.foldersqn ?? null;

			/* form 에 input 태그 추가 */
			if (cb.dataset.fileid != null) {
				deleteForm.appendChild(fileIdInput);
			}

			if (cb.dataset.fileseq != null) {
				deleteForm.appendChild(fileSeqInput);
			}

			if (cb.dataset.foldersqn != null) {
				deleteForm.appendChild(folderSqnInput);
			}
		});

		deleteForm.submit();
	})
}

if (batchRestoreBtn != null) {
	/* 파일 복구 */
	batchRestoreBtn.addEventListener('click', function() {
		const form = document.getElementById('restoreForm');
		form.innerHTML = '';

		const checkedBoxes = document.querySelectorAll('.file-checkbox:checked');
		if (checkedBoxes.length === 0) {
			showToast('info', '선택된 파일이 없습니다.');
			return;
		}

		/* .file-checkbox 클래스의 check 된 것들만 모아서 반복문 들림 */
		checkedBoxes.forEach(cb => {
			/* input 태그 생성 */
			const fileIdInput = document.createElement('input');
			/* hidden 속성 부여 */
			fileIdInput.type = 'hidden';
			/* name 속성은 fileId로 부여 */
			fileIdInput.name = 'fileId';
			/* value 는 checkbox 의 dataset에 있는 filedid */
			fileIdInput.value = cb.dataset.fileid ?? null;

			/* input 태그 생성 */
			const fileSeqInput = document.createElement('input');
			/* hidden 속성 부여 */
			fileSeqInput.type = 'hidden';
			/* name 속성은 fileSqn 으로 부여 */
			fileSeqInput.name = 'fileSeq';
			/* value 는 checkbox 의 dataset에 있는 fileseq */
			fileSeqInput.value = cb.dataset.fileseq ?? null;

			/* input 태그 생성 */
			const folderSqnInput = document.createElement('input');
			/* hidden 속성 부여 */
			folderSqnInput.type = 'hidden';
			/* name 속성은 fileSqn 으로 부여 */
			folderSqnInput.name = 'folderSqn';
			/* value 는 checkbox 의 dataset에 있는 fileseq */
			folderSqnInput.value = cb.dataset.foldersqn ?? null;

			/* form 에 input 태그 추가 */
			if (cb.dataset.fileid != null) {
				form.appendChild(fileIdInput);
			}

			if (cb.dataset.fileseq != null) {
				form.appendChild(fileSeqInput);
			}

			if (cb.dataset.foldersqn != null) {
				form.appendChild(folderSqnInput);
			}
		});

		form.submit();
	})
}