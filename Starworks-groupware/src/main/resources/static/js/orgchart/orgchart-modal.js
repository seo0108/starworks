/** 
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 9. 30.     	     김주민            최초 생성
 *
 * </pre>
 */

 // 기존 orgchart-list.js의 함수들을 재사용하되, 모달용으로 수정
let modalTreeData = [];
let selectedUsers = new Map(); // userId -> user 객체
let currentSelectionMode = 'participants'; // 'participants' or 'viewers'

// 트리 빌드 함수는 기존 것 재사용
function buildOrgTree(users) {
    // ... 기존 orgchart-list.js의 buildOrgTree 함수 복사
}

// 모달용 트리 렌더링 (체크박스 포함)
function renderOrgTreeWithCheckbox(departments, parentElement) {
    const ul = document.createElement('ul');
    
    departments.forEach(dept => {
        const li = document.createElement('li');
        const totalEmployees = getTotalEmployees(dept);
        
        // 부서명
        const deptDiv = document.createElement('div');
        deptDiv.classList.add('department-item');
        deptDiv.innerHTML = `
            <i class="bi bi-folder-fill text-primary"></i> 
            ${dept.name} (${totalEmployees}명)
        `;
        li.appendChild(deptDiv);
        
        // 직원 목록 (체크박스 포함)
        if (dept.employees.length > 0) {
            const empUl = document.createElement('ul');
            empUl.classList.add('list-unstyled', 'ps-4');
            
            dept.employees.forEach(emp => {
                const empLi = document.createElement('li');
                const isChecked = selectedUsers.has(emp.id);
                
                empLi.innerHTML = `
                    <div class="form-check">
                        <input class="form-check-input employee-checkbox" 
                               type="checkbox" 
                               value="${emp.id}" 
                               id="modal-user-${emp.id}"
                               data-user='${JSON.stringify(emp)}'
                               ${isChecked ? 'checked' : ''}>
                        <label class="form-check-label" for="modal-user-${emp.id}">
                            <i class="bi bi-person-fill"></i> ${emp.name}
                            <span class="badge bg-light text-dark rounded-pill">${emp.position}</span>
                        </label>
                    </div>
                `;
                empUl.appendChild(empLi);
            });
            li.appendChild(empUl);
        }
        
        // 하위 부서
        if (dept.subDepartments.length > 0) {
            const subUl = document.createElement('ul');
            renderOrgTreeWithCheckbox(dept.subDepartments, subUl);
            li.appendChild(subUl);
        }
        
        ul.appendChild(li);
    });
    
    parentElement.appendChild(ul);
}

// 선택된 사용자 목록 업데이트
function updateSelectedUsersList() {
    const container = document.getElementById('modal-selectedUsers');
    const countBadge = document.getElementById('selected-count');
    
    countBadge.textContent = selectedUsers.size;
    
    if (selectedUsers.size === 0) {
        container.innerHTML = '<p class="text-muted">사용자를 체크박스로 선택하세요</p>';
        return;
    }
    
    container.innerHTML = '';
    selectedUsers.forEach((user, userId) => {
        const userItem = document.createElement('div');
        userItem.className = 'selected-user-item';
        userItem.innerHTML = `
            <span>
                <i class="bi bi-person-fill"></i> ${user.name}
                <small class="text-muted">${user.position}</small>
            </span>
            <button type="button" class="btn btn-sm btn-outline-danger" 
                    onclick="removeSelectedUser('${userId}')">
                <i class="bi bi-x"></i>
            </button>
        `;
        container.appendChild(userItem);
    });
}

// 사용자 선택/해제
function removeSelectedUser(userId) {
    selectedUsers.delete(userId);
    
    // 체크박스도 해제
    const checkbox = document.querySelector(`#modal-user-${userId}`);
    if (checkbox) checkbox.checked = false;
    
    updateSelectedUsersList();
}

// 조직도 데이터 로드 및 초기화
function initOrgChartModal() {
    fetch("/rest/comm-user")
        .then(res => res.json())
        .then(users => {
            modalTreeData = buildOrgTree(users);
            
            const container = document.getElementById('modal-orgTreeContainer');
            container.innerHTML = '';
            renderOrgTreeWithCheckbox(modalTreeData, container);
            
            // 체크박스 이벤트 리스너
            container.addEventListener('change', (e) => {
                if (e.target.classList.contains('employee-checkbox')) {
                    const userId = e.target.value;
                    const userData = JSON.parse(e.target.dataset.user);
                    
                    if (e.target.checked) {
                        selectedUsers.set(userId, userData);
                    } else {
                        selectedUsers.delete(userId);
                    }
                    
                    updateSelectedUsersList();
                }
            });
        })
        .catch(err => {
            console.error('조직도 데이터 로드 실패:', err);
        });
}

// 모달이 열릴 때 초기화
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('org-chart-modal');
    
    modal.addEventListener('show.bs.modal', (e) => {
        // 버튼에서 모드 확인 (참여자/열람자)
        const button = e.relatedTarget;
        currentSelectionMode = button?.dataset.mode || 'participants';
        
        // 기존 선택 초기화 (또는 유지)
        // selectedUsers.clear();
        
        // 조직도 로드
        if (modalTreeData.length === 0) {
            initOrgChartModal();
        } else {
            updateSelectedUsersList();
        }
    });
    
    // 검색 기능
    document.getElementById('modal-orgSearchButton')?.addEventListener('click', searchModalOrg);
    document.getElementById('modal-orgSearchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchModalOrg();
    });
});

function searchModalOrg() {
    const searchTerm = document.getElementById('modal-orgSearchInput').value.toLowerCase();
    // 기존 searchOrganization 로직 재사용
}

// 전역 함수로 노출 (project-create.js에서 사용)
window.getSelectedOrgUsers = function() {
    return Array.from(selectedUsers.values());
};

window.clearSelectedOrgUsers = function() {
    selectedUsers.clear();
    document.querySelectorAll('.employee-checkbox').forEach(cb => cb.checked = false);
    updateSelectedUsersList();
};