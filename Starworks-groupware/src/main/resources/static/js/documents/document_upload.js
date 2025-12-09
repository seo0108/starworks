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

document.addEventListener('DOMContentLoaded', function() {
	const archiveSelect = document.getElementById('archiveSelect');
	const fileForm = document.getElementById('fileForm');

	function updateAction() {
		const selected = archiveSelect.value;
		let actionUrl = '';
		switch (selected) {
			case 'personal':
				actionUrl = '/document/upload/user';
				break;
			case 'department':
				actionUrl = '/document/upload/department';
				break;
			case 'company':
				actionUrl = '/document/upload/company';
				break;
			default:
				actionUrl = '/document/upload/user';
		}
		fileForm.action = actionUrl;
	}
	archiveSelect.addEventListener('change', updateAction);

	// 최초 로딩 시에도 세팅
	updateAction();

	const folderSelectContainer = document.getElementById('folderSelectContainer');

	function toggleFolderSelect() {
		if (archiveSelect.value === 'personal') {
			folderSelectContainer.style.display = 'block';
		} else {
			folderSelectContainer.style.display = 'none';
		}
	}

	// 페이지 로드 시 초기 상태 설정
	toggleFolderSelect();

	// 자료실 선택 변경 시 이벤트 리스너 등록
	archiveSelect.addEventListener('change', toggleFolderSelect);
});