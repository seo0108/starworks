document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 				전역 변수 선언
    // ========================================

    /**
	 * 조직도 데이터 (부서 및 사용자 트리 구조)
	 * fetch로 서버에서 받아온 조직도 데이터를 저장
	 */
    let orgTreeData = [];

    let selectedParticipants = []; //선택된 참여자 목록
    let selectedViewers = []; // 선택된 열람자 목록

    /**
     * 현재 선택 모드 ('participants' 또는 'viewers')
     * 조직도 모달에서 참여자를 선택 중인지 열람자를 선택 중인지 구분
     */
    let selectionMode = 'participants';

    // ===== 파일 관련 변수 추가 =====
    let deletedFileIds = [];  // 삭제할 기존 파일 ID 목록
    let newFiles = [];  // 새로 추가할 파일 목록

    const orgChartModal = new bootstrap.Modal(document.getElementById('org-chart-modal'));

    // ===== 기존 멤버 로드 =====
    loadExistingMembers();

	// JSP에서 전달받은 JSON 데이터를 파싱하여 참여자/열람자 목록을 초기화
    function loadExistingMembers() {
        const memberListElement = document.getElementById('member-data');
        if (memberListElement) {
            try {
                const jsonText = memberListElement.textContent.trim();
                console.log('JSON 데이터:', jsonText);

                if (!jsonText || jsonText === '') {
                    console.log('멤버 데이터 없음');
                    return;
                }

                const members = JSON.parse(jsonText);

                // 참여자 필터링 (B102)
                selectedParticipants = members
                    .filter(m => m.bizAuthCd === 'B102')
                    .map(m => ({
                        id: m.bizUserId,
                        name: m.bizUserNm,
                        position: m.bizAuthNm || ''
                    }));

                // 열람자 필터링 (B103)
                selectedViewers = members
                    .filter(m => m.bizAuthCd === 'B103')
                    .map(m => ({
                        id: m.bizUserId,
                        name: m.bizUserNm,
                        position: m.bizAuthNm || ''
                    }));

                // 화면에 태그로 렌더링
                renderTags('participant-list', selectedParticipants);
                renderTags('viewer-list', selectedViewers);
            } catch (e) {
                console.error('멤버 데이터 파싱 실패:', e);
            }
        }
    }

    // ===== 파일 처리 로직 추가 =====

    /**
     * 기존 파일 삭제 버튼 클릭 이벤트
     * - 즉시 삭제하지 않고 deletedFileIds 배열에 추가
     * - 시각적으로 취소선 표시
     * - 실제 삭제는 폼 제출 시 서버에서 처리
     */
	document.addEventListener('click', function(e) {
	    if (e.target.closest('.delete-existing-file')) {
	        const btn = e.target.closest('.delete-existing-file');
	        const fileId = btn.dataset.fileId;
	        const fileSeq = btn.dataset.fileSeq;

	        if (confirm('이 파일을 삭제하시겠습니까?')) {
				// 삭제 목록에 추가
	            deletedFileIds.push({
	                fileId: fileId,
	                fileSeq: fileSeq
	            });

	            // UI에 삭제 표시
	            const fileItem = btn.closest('.existing-file-item');
	            fileItem.style.textDecoration = 'line-through';
	            fileItem.style.opacity = '0.5';
	            btn.disabled = true;
	        }
	    }
	});

    // 파일 입력 요소 및 파일 업로드 영역 가져오기
    const fileInput = document.getElementById('file-input');
    const fileUploadArea = document.getElementById('file-upload-area');
    const newFileList = document.getElementById('new-file-list');

    if (fileUploadArea && fileInput) {
        // 클릭으로 파일 선택창 열기
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // 파일 선택 시 처리
        fileInput.addEventListener('change', (e) => {
            handleNewFiles(Array.from(e.target.files));
        });

        // 드래그 앤 드롭
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.classList.add('dragover');
        });

        // 드래그 영역을 벗어날 때 스타일 원복
        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.classList.remove('dragover');
        });

        // 파일 드롭 시 처리
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.classList.remove('dragover');
            handleNewFiles(Array.from(e.dataTransfer.files));
        });
    }

    /**
     * 새로 추가된 파일들을 처리하는 함수
     * - newFiles 배열에 추가
     * - 화면에 파일 목록 표시 (파일명, 크기, 삭제 버튼)
     *
     * @param {File[]} files - 추가할 파일 배열
     */
	function handleNewFiles(files) {
	    const fileListContainer = document.getElementById('file-list');

	    files.forEach(file => {
	        newFiles.push(file);

	        // 파일 항목 생성
	        const fileItem = document.createElement('p');
	        fileItem.className = 'new-file-item';
	        fileItem.style.fontWeight = 'normal';
	        fileItem.dataset.fileName = file.name;
	        fileItem.innerHTML = `
	            <i class="bi bi-file-earmark-plus me-2 text-primary"></i>
	            <span>${file.name}</span>
	            <span class="text-muted small">(${(file.size / 1024).toFixed(2)} KB)</span>
	            <button type="button" class="btn btn-sm btn-link text-danger remove-new-file p-0 ms-2">
	                <i class="bi bi-x-circle"></i>
	            </button>
	        `;

	        // 삭제 버튼 이벤트
	        fileItem.querySelector('.remove-new-file').addEventListener('click', function() {
	            const fileName = fileItem.dataset.fileName;
	            newFiles = newFiles.filter(f => f.name !== fileName);
	            fileItem.remove();
	        });

	        fileListContainer.appendChild(fileItem);
	    });

	    // input 초기화
	    fileInput.value = '';
	}


    // ========================================
    // 조직도 관련 함수들
    // ========================================

    // 사용자 목록을 조직도 트리구조로 변환
    function buildOrgTree(users) {
        let deptMap = {}; // 부서 ID를 키로 하는 맵
        const root = []; // 최상위 부서 배열

		// 부서별로 그룹화하고 사원 추가
        users.forEach(user => {
            if (deptMap[user.deptId] == undefined) {
                deptMap[user.deptId] = {
                    id: user.deptId,
                    name: user.deptNm || user.deptId,
                    upDeptId: user.upDeptId,
                    employees: [],
                    subDepartments: []
                };
            }

            if (user.userNm != null) {
                deptMap[user.deptId].employees.push({
                    id: user.userId,
                    name: user.userNm,
                    position: user.jbgdNm || user.jbgdCd,
                    phone: user.userTelno,
                    email: user.userEmail,
                    deptId: user.deptId
                });
            }
        });

        let beforeDeptId = '';
        users.forEach(user => {
            const dept = deptMap[user.deptId];
            if (beforeDeptId != user.deptId) {
                beforeDeptId = user.deptId;
                if (dept.upDeptId == null) {
                    root.push(dept);
                } else {
                    let upperDept = deptMap[user.upDeptId];
                    if (upperDept != null) {
                        upperDept.subDepartments.push(dept);
                    }
                }
            }
        });

        return root;
    }

	// 조직도를 체크박스와 함께 HTML로 렌더링
    function renderOrgChartWithCheckbox(departments, parentElement) {
        const currentSelection = selectionMode === 'participants' ? selectedParticipants : selectedViewers;

        function createEmployeeCheckbox(emp) {
            const isChecked = currentSelection.some(u => u.id === emp.id);
            return `
                <li class="employee">
                    <div class="form-check">
                        <input class="form-check-input employee-checkbox"
                               type="checkbox"
                               value="${emp.id}"
                               id="user-${emp.id}"
                               data-user='${JSON.stringify(emp)}'
                               ${isChecked ? 'checked' : ''}>
                        <label class="form-check-label" for="user-${emp.id}">
                            <i class="bi bi-person-fill"></i> ${emp.name}
                            <span class="badge bg-light text-dark">${emp.position}</span>
                        </label>
                    </div>
                </li>`;
        }

        function buildChart(depts) {
            let html = '<ul>';
            depts.forEach(dept => {
                html += '<li>';
                html += `<div class="department-name">
                    <i class="bi bi-folder-fill text-primary"></i> ${dept.name}
                </div>`;

                if (dept.employees.length > 0) {
                    html += '<ul>' + dept.employees.map(createEmployeeCheckbox).join('') + '</ul>';
                }

                if (dept.subDepartments.length > 0) {
                    html += buildChart(dept.subDepartments);
                }

                html += '</li>';
            });
            html += '</ul>';
            return html;
        }

        parentElement.innerHTML = buildChart(departments);
    }

	 /**
     * 선택된 사용자들을 태그 형태로 렌더링
     * - 이름 (직급)
     * - X 버튼으로 개별 삭제 가능
     *
     * @param {string} containerId - 렌더링할 컨테이너 ID
     * @param {Array} userList - 사용자 객체 배열
     */
    function renderTags(containerId, userList) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        userList.forEach(user => {
            const tag = document.createElement('div');
            tag.className = 'participant-tag';
            tag.innerHTML = `
                <i class="bi bi-person-fill"></i>
                <span>${user.name} (${user.position})</span>
                <button type="button" class="btn-close" data-user-id="${user.id}"></button>`;
            container.appendChild(tag);
        });
    }

	// 서버에서 조직도 데이터를 가져오는 함수 (/rest/comm-user API 호출)
    function loadOrgChartData() {
        fetch('/rest/comm-user')
            .then(res => res.json())
            .then(users => {
                orgTreeData = buildOrgTree(users);
                populateOrgChart();
            })
            .catch(err => {
                console.error('조직도 로드 실패:', err);
                alert('조직도를 불러오는데 실패했습니다.');
            });
    }

	// 조직도를 모달에 표시
    function populateOrgChart() {
        const container = document.getElementById('org-chart-container');
        container.innerHTML = '';

        if (orgTreeData.length === 0) {
            container.innerHTML = '<p class="text-muted">조직도를 불러오는 중...</p>';
            return;
        }

        renderOrgChartWithCheckbox(orgTreeData, container);
    }

    // ===== 이벤트 리스너 =====

    /**
	 * 참여자 추가 버튼 클릭
	 * - 모드를 'participants'로 설정
	 * - 조직도 모달 표시
	 */
    document.getElementById('add-participant-btn').addEventListener('click', () => {
        selectionMode = 'participants';
        if (orgTreeData.length === 0) {
            loadOrgChartData();
        } else {
            populateOrgChart();
        }
        orgChartModal.show();
    });

	/**
     * 열람자 추가 버튼 클릭
     * - 모드를 'viewers'로 설정
     * - 조직도 모달 표시
     */
    document.getElementById('add-viewer-btn').addEventListener('click', () => {
        selectionMode = 'viewers';
        if (orgTreeData.length === 0) {
            loadOrgChartData();
        } else {
            populateOrgChart();
        }
        orgChartModal.show();
    });

	// 조직도 모달에서 선택 완료 버튼 클릭
    document.getElementById('confirm-selection-btn').addEventListener('click', () => {
        const selectedUsers = [];

        // 체크된 사용자 수집
        document.querySelectorAll('#org-chart-container .employee-checkbox:checked').forEach(checkbox => {
            const userData = JSON.parse(checkbox.dataset.user);
            selectedUsers.push(userData);
        });

		// 모드에 따라 저장
        if (selectionMode === 'participants') {
            selectedParticipants = selectedUsers;
            renderTags('participant-list', selectedParticipants);
        } else {
            selectedViewers = selectedUsers;
            renderTags('viewer-list', selectedViewers);
        }

        orgChartModal.hide();
    });

	// 참여자 태그의 X 버튼 클릭 (개별삭제)
    document.getElementById('participant-list').addEventListener('click', (e) => {
        if (e.target.matches('.btn-close')) {
            const userId = e.target.dataset.userId;
            selectedParticipants = selectedParticipants.filter(u => u.id !== userId);
            renderTags('participant-list', selectedParticipants);
        }
    });

	// 열람자 태그의 X 버튼 클릭 (개별삭제)
    document.getElementById('viewer-list').addEventListener('click', (e) => {
        if (e.target.matches('.btn-close')) {
            const userId = e.target.dataset.userId;
            selectedViewers = selectedViewers.filter(u => u.id !== userId);
            renderTags('viewer-list', selectedViewers);
        }
    });


    /**
     * 서버에서 받은 유효성 검사 오류를 화면에 표시
     * - 각 필드에 .is-invalid 클래스 추가
     * - 오류 메시지를 .invalid-feedback으로 표시
     *
     * @param {Object|string} errors - 필드별 오류 메시지 객체 또는 단일 오류 문자열
     */
    function displayValidationErrors(errors) {
		// 기존 오류 표시 제거
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // 문자열 오류면 alert로 표시
        if (typeof errors === 'string') {
            alert(errors);
            return;
        }

        // 필드명과 input ID 매핑
        const fieldMap = {
            'bizNm': 'project-name-input',
            'bizGoal': 'project-goal-input',
            'bizTypeCd': 'project-type-select',
            'bizSttsCd': 'project-status-select',
            'strtBizDt': 'start-date-input',
            'endBizDt': 'end-date-input',
            'bizPicId': 'project-manager-input',
            'bizScope': 'project-scope-input',
            'bizBdgt': 'project-budget-input',
            'bizDetail': 'project-description-textarea'
        };

        let errorMessages = [];

        // 각 필드 오류 처리
        for (let field in errors) {
            const inputId = fieldMap[field];
            const message = errors[field];

            if (inputId) {
                const inputElement = document.getElementById(inputId);
                if (inputElement) {
                    inputElement.classList.add('is-invalid');

                    // 오류 메시지 표시
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = message;
                    inputElement.parentElement.appendChild(errorDiv);
                }
            }

            errorMessages.push(message);
        }

        if (errorMessages.length > 0) {
            alert('입력 오류:\n' + errorMessages.join('\n'));
        }
    }

    // ===== 프로젝트 수정 폼 제출 (파일 포함) =====

    /**
     * 프로젝트 수정 데이터를 서버에 전송
     */
    function submitProjectUpdate(projectData) {
	// FormData 객체 생성
    const formData = new FormData();

    // newFiles (새로 첨부한 파일)을 FormData에 추가
    // 백엔드의 ProjectVO.fileList 필드명과 동일하게 'fileList'로 매핑
    newFiles.forEach(file => {
        formData.append('fileList', file);
    });

    // ProjectVO의 일반 필드를 FormData에 추가
    for (const key in projectData) {
        if (key === 'members') {
            continue;
        }
        // 나머지 필드는 일반 값으로 추가
        formData.append(key, projectData[key] === null ? '' : projectData[key]);
    }

    // List<ProjectMemberVO> members 필드 처리
    // 각 멤버 객체를 'members[index].필드명' 형태로 FormData에 추가
    projectData.members.forEach((member, index) => {
        // Spring이 List<ProjectMemberVO>로 바인딩하기 위해 필요한 키 형식
        formData.append(`members[${index}].bizUserId`, member.bizUserId);
        formData.append(`members[${index}].bizAuthCd`, member.bizAuthCd);
        // 필요하다면 다른 필드도 추가 (예: role, status 등)
    });

    // Fetch 요청 전송
    fetch('/projects/edit', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            // 서버에서 보낸 JSON 형태의 에러 메시지를 받기 위함
            return response.json().then(err => {
                throw err;
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
			// SweetAlert로 성공 메시지 표시
            Swal.fire({
                title: '수정 완료!',
                text: '프로젝트가 성공적으로 수정되었습니다.',
                icon: 'success', // 성공 아이콘
                confirmButtonText: '확인',
                confirmButtonColor: '#3085d6'
            }).then(() => {
                // 프로젝트 상세화면으로 이동
                location.href = `/projects/${data.bizId}`;
            });
        } else {
            // 서버에서 받은 validation 오류나 일반 오류 메시지 처리
            displayValidationErrors(data.errors || data.message);
        }
    })
    .catch(error => {
        console.error('프로젝트 수정 오류:', error);
        if (error.errors) {
            displayValidationErrors(error.errors);
        } else {
            alert(error.message || '프로젝트 수정 중 오류가 발생했습니다.');
        }
    });
}

/**
     * 프로젝트 수정 폼 제출 이벤트 핸들러
     *
     * 처리 흐름:
     * 1. 폼 데이터 수집
     * 2. 상태가 '취소(B305)'로 변경되었는지 확인
     * 3. 취소 상태면 SweetAlert 확인 모달 표시
     * 4. 확인 시 submitProjectUpdate() 호출
     */
	const projectForm = document.querySelector('form');

	projectForm.addEventListener('submit', function(e) {
    e.preventDefault(); // 기본 폼 제출 방지

    // 필수 데이터 가져오기
    const bizId = document.getElementById('project-id').value;
    const bizPicId = document.getElementById('project-manager-id').value;
    const newBizSttsCd = document.getElementById('project-status-select').value;

    //JSP에서 설정한 기존 상태 코드 값
    const originalStatusElement = document.getElementById('original-status-cd');
    const originalBizSttsCd = originalStatusElement ? originalStatusElement.value : 'B302';

    // 전송할 프로젝트 데이터 객체 생성
    const projectData = {
        bizId: bizId,
        bizNm: document.getElementById('project-name-input').value,
        bizPicId: bizPicId,
        bizTypeCd: document.getElementById('project-type-select').value,
        bizSttsCd: newBizSttsCd, // 새로 선택된 상태 코드
        bizGoal: document.getElementById('project-goal-input').value,
        bizDetail: document.getElementById('project-description-textarea').value || '',
        bizScope: document.getElementById('project-scope-input').value || '',
        bizBdgt: document.getElementById('project-budget-input').value ?
                  parseInt(document.getElementById('project-budget-input').value) : null,
        strtBizDt: document.getElementById('start-date-input').value + 'T00:00:00',
        endBizDt: document.getElementById('end-date-input').value + 'T23:59:59',
        members: [
            // 책임자 추가 (B101)
            { bizUserId: bizPicId, bizAuthCd: 'B101' },
            // 참여자 (B102)
            ...selectedParticipants.map(p => ({ bizUserId: p.id, bizAuthCd: 'B102' })),
            // 열람자 (B103)
            ...selectedViewers.map(v => ({ bizUserId: v.id, bizAuthCd: 'B103' }))
        ]
        // deletedFileIds, newFiles 등의 파일 데이터도 필요하면 이 객체에 추가하거나 별도 전송 처리
    };

    //취소 상태 변경 감지 및 모달 처리
    const CANCELLATION_CODE = 'B305'; // 취소 상태 코드 (DB 값과 일치해야 함)

    // 새로운 상태가 '취소'이고, 기존 상태가 '취소'가 아닐 때만 모달을 띄움
    if (newBizSttsCd === CANCELLATION_CODE && originalBizSttsCd !== CANCELLATION_CODE) {

        Swal.fire({
            title: '프로젝트 취소 및 보관 처리 확인',
            html: `
                <p>프로젝트를 취소하고 보관함으로 이동합니다.</p>
                <p class="text-danger" style="font-weight: bold;">이 결정은 되돌릴 수 없으며, 이후 수정할 수 없습니다.</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // 위험한 행동은 빨간색
            cancelButtonColor: '#6c757d',
            confirmButtonText: '확인, 취소 진행',
            cancelButtonText: '아니오, 상태 유지'
        }).then((result) => {
            if (result.isConfirmed) {
                // 사용자가 확인을 누르면, 실제 폼 제출 함수 호출
                submitProjectUpdate(projectData);
            }
            // 취소 버튼을 누르면 폼 제출이 중단됨
        });

        // 모달을 띄웠으므로 여기서 함수 종료 (서버 전송 방지)
        return;
    }

    // 3. 취소 상태 변경이 아닌 경우: 즉시 제출
    submitProjectUpdate(projectData);
	});

}); // DOMContentLoaded 종료