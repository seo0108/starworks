document.addEventListener('DOMContentLoaded', function() {

    // ===== 조직도 데이터 변수 =====
    let orgTreeData = [];
    let selectedParticipants = [];
    let selectedViewers = [];
    let selectionMode = 'participants';
    let uploadedFiles = [];

    const orgChartModal = new bootstrap.Modal(document.getElementById('org-chart-modal'));

    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');

    // ===== 선택된 인원 수 업데이트 함수 =====
    function updateSelectedCount() {
	    const currentList = selectionMode === 'participants' ? selectedParticipants : selectedViewers;
	    const countElement = document.getElementById('selected-count-number');
	    if (countElement) {
	        countElement.textContent = currentList.length;
	    }
	}

    // ===== 조직도 트리 빌드 함수 =====
    function buildOrgTree(users) {
        let deptMap = {};
        const root = [];

        users.forEach(user => {
            if (!deptMap[user.deptId]) {
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

        Object.values(deptMap).forEach(dept => {
            const upper = deptMap[dept.upDeptId];
            if (upper) {
                upper.subDepartments.push(dept);
            } else {
                root.push(dept);
            }
        });

        return root;
    }

    // ===== 조직도 검색/필터링 함수 =====
    function filterOrgChart(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        // 검색어가 없으면 전체 조직도 표시
        if (!term) {
            renderOrgChart(orgTreeData);
            return;
        }

        // 재귀적으로 부서와 직원 필터링
        function filterDepartments(departments) {
            const results = [];

            for (const dept of departments) {
                const deptMatches = dept.name.toLowerCase().includes(term);
                const matchingEmployees = dept.employees.filter(emp =>
                    emp.name.toLowerCase().includes(term)
                );
                const matchingSubDepts = filterDepartments(dept.subDepartments);

                if (deptMatches || matchingEmployees.length > 0 || matchingSubDepts.length > 0) {
                    results.push({
                        ...dept,
                        employees: deptMatches ? dept.employees : matchingEmployees,
                        subDepartments: matchingSubDepts
                    });
                }
            }

            return results;
        }

        const filteredData = filterDepartments(orgTreeData);

        if (filteredData.length > 0) {
            renderOrgChart(filteredData);
        } else {
            const container = document.getElementById('org-chart-container');
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="bi bi-search" style="font-size: 2.5rem;"></i>
                    <p class="mt-3">검색 결과가 없습니다</p>
                </div>`;
        }
    }

    // ===== 체크박스 포함 조직도 렌더링 =====
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

    // ===== 조직도 렌더링 (단순화) =====
    function renderOrgChart(dataToRender) {
        const container = document.getElementById('org-chart-container');
        container.innerHTML = '';

        if (dataToRender.length === 0) {
            container.innerHTML = '<p class="text-muted">조직도를 불러오는 중...</p>';
            return;
        }

        renderOrgChartWithCheckbox(dataToRender, container);
    }

    // ===== 조직도 데이터 로드 =====
    function loadOrgChartData() {
        fetch('/rest/comm-user')
            .then(res => res.json())
            .then(users => {
                orgTreeData = buildOrgTree(users);
                renderOrgChart(orgTreeData);
            })
            .catch(err => {
                console.error('조직도 로드 실패:', err);
                Swal.fire({
                    icon: 'error',
                    title: '조직도 오류',
                    text: '조직도를 불러오는데 실패했습니다.',
                    confirmButtonText: '확인'
                });
            });
    }

    // ===== 태그 렌더링 =====
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

    // ===== 이벤트 리스너 =====

    // 참여자 추가 버튼
    document.getElementById('add-participant-btn').addEventListener('click', () => {
        selectionMode = 'participants';

        // 검색창 초기화
        const searchInput = document.getElementById('org-search-input');
        if (searchInput) searchInput.value = '';

        if (orgTreeData.length === 0) {
            loadOrgChartData();
        } else {
            renderOrgChart(orgTreeData);
        }
        updateSelectedCount();
        orgChartModal.show();
    });

    // 열람자 추가 버튼
    document.getElementById('add-viewer-btn').addEventListener('click', () => {
        selectionMode = 'viewers';

        // 검색창 초기화
        const searchInput = document.getElementById('org-search-input');
        if (searchInput) searchInput.value = '';

        if (orgTreeData.length === 0) {
            loadOrgChartData();
        } else {
            renderOrgChart(orgTreeData);
        }
        updateSelectedCount();
        orgChartModal.show();
    });

    // 실시간 검색 (input 이벤트 사용)
    document.getElementById('org-search-input').addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        filterOrgChart(searchTerm);
    });

    // 선택 완료 버튼
    document.getElementById('confirm-selection-btn').addEventListener('click', () => {
        const selectedUsers = [];

        document.querySelectorAll('#org-chart-container .employee-checkbox:checked').forEach(checkbox => {
            const userData = JSON.parse(checkbox.dataset.user);
            selectedUsers.push(userData);
        });

        if (selectionMode === 'participants') {
            selectedParticipants = selectedUsers;
            renderTags('participant-list', selectedParticipants);
        } else {
            selectedViewers = selectedUsers;
            renderTags('viewer-list', selectedViewers);
        }

        orgChartModal.hide();
    });

    // ===== 조직도 체크박스 실시간 상태 업데이트 =====
    document.getElementById('org-chart-container').addEventListener('change', (e) => {
        if (e.target.matches('.employee-checkbox')) {
            const checkbox = e.target;
            const userData = JSON.parse(checkbox.dataset.user);
            const userId = userData.id;

            let targetList = selectionMode === 'participants' ? selectedParticipants : selectedViewers;

            if (checkbox.checked) {
                // 체크: 목록에 없으면 추가 (중복 방지)
                if (!targetList.some(u => u.id === userId)) {
                    targetList.push(userData);
                }
            } else {
                // 해제: 목록에서 제거
                targetList = targetList.filter(u => u.id !== userId);
            }

            // 전역 변수 업데이트 (필수)
            if (selectionMode === 'participants') {
                selectedParticipants = targetList;
            } else {
                selectedViewers = targetList;
            }
            updateSelectedCount();
        }
    });

    // 참여자/열람자 삭제
    document.getElementById('participant-list').addEventListener('click', (e) => {
        if (e.target.matches('.btn-close')) {
            const userId = e.target.dataset.userId;
            selectedParticipants = selectedParticipants.filter(u => u.id !== userId);
            renderTags('participant-list', selectedParticipants);
        }
    });

    document.getElementById('viewer-list').addEventListener('click', (e) => {
        if (e.target.matches('.btn-close')) {
            const userId = e.target.dataset.userId;
            selectedViewers = selectedViewers.filter(u => u.id !== userId);
            renderTags('viewer-list', selectedViewers);
        }
    });

    // ===== 더미 데이터 채우기 버튼 이벤트 리스너 추가 =====
	document.getElementById('fill-dummy-data-btn').addEventListener('click', function() {
	    fillDummyProjectData();
	});

	// ===============================================
	// 더미 데이터 채우기 함수
	// ===============================================
	function fillDummyProjectData() {
	    //프로젝트명
	    document.getElementById('project-name-input').value = "[2025 Q4] 시그니처 메뉴 5종 레시피 개선 및 리뉴얼 프로젝트";

	    // 날짜 계산 (현재날짜-4개월 뒤 자동계산)
	    const today = new Date();
	    const endDate = new Date();
	    endDate.setMonth(endDate.getMonth() + 4);

	    const formatDate = (date) => {
	        const y = date.getFullYear();
	        const m = String(date.getMonth() + 1).padStart(2, '0');
	        const d = String(date.getDate()).padStart(2, '0');
	        return `${y}-${m}-${d}`;
	    };

	    // 날짜 입력
	    document.getElementById('start-date-input').value = formatDate(today); //시작일시
	    document.getElementById('end-date-input').value = formatDate(endDate); //마감일시

	    // 프로젝트 유형 B201(신제품 개발)
	    document.getElementById('project-type-select').value = 'B201';
	    //목표
	    document.getElementById('project-goal-input').value = "고객 만족도 3.8→4.5점 향상, 원가율 2% 절감, 재구매율 15% 증가";
	    //상세설명
	    document.getElementById('project-description-textarea').value = "최근 6개월간 고객 VOC 분석 결과, 시그니처 메뉴 5종(아메리카노, 카페라떼, 크림치즈베이글, 초코머핀, 샌드위치)에 대한 개선 요구가 지속적으로 제기되었습니다. 주요 피드백은 '맛의 일관성 부족', '비주얼 개선 필요', '가격 대비 만족도 하락'이었습니다. 본 프로젝트는 이를 해결하기 위해 ①원두 블렌딩 비율 재조정 및 추출 레시피 표준화 ②베이커리 제품의 속재료 비율 증량 및 토핑 고급화 ③원가 효율을 고려한 대체 원재료 테스트를 진행합니다. R&D팀과 협업하여 3차례 테스트 생산을 거친 후, 수도권 5개 테스트 매장에서 2주간 시범 운영하며 고객 반응을 모니터링합니다. 최종 승인된 레시피는 전국 매장 적용을 위한 조리 매뉴얼 및 교육 영상 제작 후 단계적으로 롤아웃할 예정입니다.";
	    //범위
	    document.getElementById('project-scope-input').value = "현 레시피 분석, 개선안 도출, 테스트 생산, 블라인드 테스트, 최종 레시피 확정, 조리 매뉴얼 작성, 전 매장 교육 자료 배포";

	    // 예산(콤마 포맷팅 함수 사용)
	    const budgetInput = document.getElementById('project-budget-input');
	    const dummyBudget = "35000000";

	    // formatNumberWithCommas 함수는 DOMContentLoaded 블록 외부에 정의되어 있으므로 직접 호출
	    if (typeof formatNumberWithCommas === 'function') {
	        budgetInput.value = formatNumberWithCommas(dummyBudget);
	    } else {
	        budgetInput.value = dummyBudget;
	    }

	    // 유효성 검사 경고 제거
	    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
	    document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
	}

	// ===== 조직도 모달 내 더미 멤버 추가 버튼 이벤트 =====
	document.getElementById('fill-dummy-members-btn').addEventListener('click', function() {
	    const dummyUserIds = ['2026049','20261026', '2026050', '2026052'];

	    fetch('/rest/comm-user')
	        .then(res => res.json())
	        .then(users => {
	            const foundUsers = users
	                .filter(user => dummyUserIds.includes(user.userId) && user.userNm != null)
	                .map(user => ({
	                    id: user.userId,
	                    name: user.userNm,
	                    position: user.jbgdNm || user.jbgdCd,
	                    phone: user.userTelno,
	                    email: user.userEmail,
	                    deptId: user.deptId
	                }));

	            if (foundUsers.length === 0) {
	                Swal.fire({
	                    icon: 'warning',
	                    title: '사용자 없음',
	                    text: '해당 사용자를 찾을 수 없습니다.',
	                    confirmButtonText: '확인'
	                });
	                return;
	            }

	            // 현재 선택 모드에 따라 리스트 업데이트
	            if (selectionMode === 'participants') {
	                foundUsers.forEach(user => {
	                    if (!selectedParticipants.some(p => p.id === user.id)) {
	                        selectedParticipants.push(user);
	                    }
	                });
	            } else {
	                foundUsers.forEach(user => {
	                    if (!selectedViewers.some(v => v.id === user.id)) {
	                        selectedViewers.push(user);
	                    }
	                });
	            }

	            // 조직도 다시 렌더링 (체크박스 상태 반영)
	            renderOrgChart(orgTreeData);
	            updateSelectedCount();

	        })
	        .catch(err => {
	            console.error('사용자 조회 실패:', err);
	            Swal.fire({
	                icon: 'error',
	                title: '오류',
	                text: '사용자 정보를 불러오는데 실패했습니다.',
	                confirmButtonText: '확인'
	            });
	        });
	});

    // ===== 파일 업로드 =====
    const fileUploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.backgroundColor = '#f1f5f9';
    });
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.backgroundColor = '#f8f9fa';
    });
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.backgroundColor = '#f8f9fa';
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (uploadedFiles.length >= 10) {
                Swal.fire({
                    icon: 'warning',
                    title: '파일 개수 초과',
                    text: '최대 10개의 파일만 업로드할 수 있습니다.',
                    confirmButtonText: '확인'
                });
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                Swal.fire({
                    icon: 'warning',
                    title: '파일 크기 초과',
                    text: `${file.name}은(는) 10MB를 초과합니다.`,
                    confirmButtonText: '확인'
                });
                return;
            }

            uploadedFiles.push(file);
            displayFile(file);
        });
    }

    function displayFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded';
        fileItem.innerHTML = `
            <div>
                <i class="bi bi-file-earmark"></i>
                <span class="ms-2">${file.name}</span>
                <small class="text-muted ms-2">(${(file.size / 1024).toFixed(1)} KB)</small>
            </div>
            <button type="button" class="btn btn-sm btn-danger remove-file-btn" data-filename="${file.name}">
                <i class="bi bi-x"></i>
            </button>
        `;
        fileList.appendChild(fileItem);
    }

    fileList.addEventListener('click', (e) => {
        if (e.target.closest('.remove-file-btn')) {
            const filename = e.target.closest('.remove-file-btn').dataset.filename;
            uploadedFiles = uploadedFiles.filter(f => f.name !== filename);
            e.target.closest('.file-item').remove();
        }
    });

    // ===== 폼 제출 =====
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();

        // 중복 제출 방지 체크
        if(submitButton.disabled){
			return; //이미 비활성화되어 있다면, 함수 종료
		}

		// 유효성 검사
        if (!validateForm()) {
            // 유효성 검사 실패 시, 버튼을 비활성화하지 않고 함수 종료
            return;
        }

        const formData = new FormData();

        formData.append('bizNm', document.getElementById('project-name-input').value);
        formData.append('bizGoal', document.getElementById('project-goal-input').value);
        formData.append('bizTypeCd', document.getElementById('project-type-select').value);

        const startDate = document.getElementById('start-date-input').value;
		const endDate = document.getElementById('end-date-input').value;
		formData.append('strtBizDt', startDate + 'T00:00:00');
		formData.append('endBizDt', endDate + 'T23:59:59');
        formData.append('bizDetail', document.getElementById('project-description-textarea').value);
        formData.append('bizScope', document.getElementById('project-scope-input').value);
        formData.append('bizPrgrs', 0);
        const budgetValue = document.getElementById('project-budget-input').value.replace(/,/g, '');
        if (budgetValue) {
            formData.append('bizBdgt', budgetValue);
        }

		//파일
        uploadedFiles.forEach(file => {
            formData.append('files', file);
        });

		//멤버
        const members = [
            ...selectedParticipants.map(p => ({ bizUserId: p.id, bizAuthCd: 'B102' })),
            ...selectedViewers.map(v => ({ bizUserId: v.id, bizAuthCd: 'B103' }))
        ];
        formData.append('membersJson', JSON.stringify(members));

        fetch('/projects/create', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const bizId = data.id || data.bizId || data.data?.bizId || data.projectId;
                /*showToast("success", "프로젝트가 등록되었습니다!");*/

                if (bizId) {
                    const actualBizId = bizId.includes('=') ? bizId.split('=')[1].split(':')[0] : bizId;
                    showDraftConfirmModal(actualBizId);
                } else {
                    console.error('bizId를 찾을 수 없습니다:', data);
                    Swal.fire({
                        icon: 'warning',
                        title: '경고',
                        text: '프로젝트는 등록되었으나 bizId를 확인할 수 없습니다.',
                        confirmButtonText: '확인'
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '등록 실패',
                    text: data.message || '프로젝트 등록에 실패했습니다.',
                    confirmButtonText: '확인'
                });
            }
        })
        .catch(error => {
            console.error('프로젝트 등록 오류:', error);
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: '프로젝트 등록 중 오류가 발생했습니다.',
                confirmButtonText: '확인'
            });
        });
    });

    // ===== 유효성 검사 =====
    function validateForm() {
        let isValid = true;

        const requiredFields = [
            { id: 'project-name-input', name: '프로젝트명' },
            { id: 'start-date-input', name: '시작일' },
            { id: 'end-date-input', name: '종료일' },
            { id: 'project-goal-input', name: '목표' }
        ];

        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const value = input.value.trim();

            if (!value) {
                input.classList.add('is-invalid');
                isValid = false;

                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = `${field.name}을(를) 입력해주세요.`;
                    input.parentNode.appendChild(errorDiv);
                }
            } else {
                input.classList.remove('is-invalid');
                const errorDiv = input.nextElementSibling;
                if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                    errorDiv.remove();
                }
            }
        });

        const startDate = new Date(document.getElementById('start-date-input').value);
        const endDate = new Date(document.getElementById('end-date-input').value);

        if (startDate > endDate) {
           Swal.fire({
		        icon: 'warning',
		        title: '기간 오류',
		        text: '종료일은 시작일 이후여야 합니다.',
		        confirmButtonText: '확인'
		    });
		    isValid = false;
        }

        if (selectedParticipants.length === 0) {
            Swal.fire({
		        icon: 'warning',
		        title: '참여자 필요',
		        text: '최소 1명 이상의 참여자를 추가해주세요.',
		        confirmButtonText: '확인'
		    });
		    isValid = false;
        }

        return isValid;
    }

    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
                const errorDiv = this.nextElementSibling;
                if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                    errorDiv.remove();
                }
            }
        });
    });

	// ===== 기안서 작성 확인 모달
    function showDraftConfirmModal(bizId) {
        Swal.fire({
            html: '<i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i><br><br>기안서를 작성하여 결재를 요청하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '요청',
            cancelButtonText: '아니오',
            confirmButtonColor: '#435ebe',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                // 예 클릭
                const url = `/approval/create?formId=ATRZDOC202&bizId=${bizId}`;
                window.location.href = url;
            } else {
                // 아니오 클릭
                showToast('이 프로젝트는 결재 승인 후 사용가능합니다. 기안서를 작성해주세요.', 'success');
                setTimeout(function() {
                    window.location.href = '/projects/main';
                }, 1500);
            }
        });
    }

    function showToast(message, type = 'info') {
        const bgClass = type === 'success' ? 'bg-success' :
                       type === 'error' ? 'bg-danger' : 'bg-info';

        const toastHtml = `
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999">
                <div class="toast ${bgClass} text-white" role="alert">
                    <div class="toast-body">
                        <i class="bi bi-check-circle me-2"></i>${message}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', toastHtml);

        const toastElement = document.querySelector('.toast:last-child');
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });

        toast.show();

        setTimeout(function() {
            toastElement.parentElement.remove();
        }, 3500);
    }
});

// 예산 콤마 포맷팅
function formatNumberWithCommas(number) {
    if (number === null || number === undefined || number === '') {
        return '';
    }
    let numStr = String(number).replace(/[^\d]/g, '');
    if (numStr === '') {
        return '';
    }
    return new Intl.NumberFormat('ko-KR').format(Number(numStr));
}

const budgetInput = document.getElementById('project-budget-input');
if (budgetInput) {
    budgetInput.addEventListener('input', function(event) {
        const rawValue = event.target.value;
        const cleanedValue = rawValue.replace(/[^\d]/g, '');
        const formattedValue = formatNumberWithCommas(cleanedValue);
        event.target.value = formattedValue;
    });
}