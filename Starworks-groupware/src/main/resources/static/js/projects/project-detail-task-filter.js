/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 24.     	김주민            담당자 필터링 기능 추가
 * 2025. 10. 24.     	김주민            드롭다운 잘림 방지 추가
 *
 * </pre>
 */

// 필터링 관련 전역 변수
let currentFilteredBizUserId = null; // 현재 선택된 담당자 ID (null이면 전체)

/**
 * 담당자 필터 초기화
 * - 프로젝트 참여자 목록을 드롭다운에 채움
 * - 필터 선택 이벤트 바인딩
 */
function initTaskAssigneeFilter() {
    console.log('담당자 필터 초기화 시작');
    loadAssigneeFilterList();
    bindAssigneeFilterEvents();
    fixDropdownOverflow();
}

/**
 * 담당자 목록을 드롭다운에 추가
 */
function loadAssigneeFilterList() {
    const dropdown = $('#task-assignee-filter-dropdown');

    if (dropdown.length === 0) {
        console.error('드롭다운 요소를 찾을 수 없습니다.');
        return;
    }

    // 기존 담당자 항목 제거 (구분선 이후 항목들)
    dropdown.find('li:not(:first):not(:nth-child(2))').remove();

    // memberList는 project-detail.js에서 전역으로 정의되어 있음
    if (typeof memberList === 'undefined') {
        console.error('memberList가 정의되지 않았습니다.');
        return;
    }

    // 책임자(B101) + 참여자(B102)만 필터 대상
    const assignees = memberList.filter(member =>
        member.authCode === 'B101' || member.authCode === 'B102'
    );

    console.log('필터링할 담당자 수:', assignees.length);

    assignees.forEach(member => {
        let displayName = member.userName;

        // 직급명 추가
        if (member.jobNm) {
            displayName += ` ${member.jobNm}`;
        }

        // 부서명 추가
        if (member.deptNm) {
            displayName += ` (${member.deptNm})`;
        }

        const listItem = `
            <li>
                <a class="dropdown-item assignee-filter-item"
                   href="#"
                   data-biz-user-id="${member.userId}">
                    <i class="bi bi-check2 me-2" style="visibility: hidden;"></i>${displayName}
                </a>
            </li>
        `;

        dropdown.append(listItem);
    });

    console.log('담당자 항목 추가 완료, 총:', $('.assignee-filter-item').length, '개');
}

/**
 * ⭐ 드롭다운 잘림 방지 - body에 드롭다운 추가
 */
function fixDropdownOverflow() {
    const filterBtn = document.getElementById('task-assignee-filter-btn');

    if (!filterBtn) return;

    // Bootstrap 5의 boundary 옵션 사용
    const dropdown = new bootstrap.Dropdown(filterBtn, {
        boundary: 'viewport', // viewport를 기준으로 위치 조정
        popperConfig: {
            strategy: 'fixed', // fixed 포지션 사용
            modifiers: [
                {
                    name: 'preventOverflow',
                    options: {
                        boundary: 'viewport'
                    }
                },
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: ['bottom-end', 'top-end', 'bottom-start', 'top-start']
                    }
                }
            ]
        }
    });
}

/**
 * 필터 이벤트 바인딩
 */
function bindAssigneeFilterEvents() {
    console.log('필터 이벤트 바인딩 시작');

    // 드롭다운 메뉴 자체에 클릭 이벤트 바인딩
    $('#task-assignee-filter-dropdown').off('click').on('click', 'a', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const bizUserId = $(this).data('biz-user-id');

        console.log('클릭된 항목의 bizUserId:', bizUserId, '(타입:', typeof bizUserId, ')');

        // bizUserId가 undefined이거나 빈 문자열이면 null로 처리
        const filterValue = (bizUserId === undefined || bizUserId === '') ? null : bizUserId;

        console.log('필터 적용할 값:', filterValue);

        // 필터 적용
        applyAssigneeFilter(filterValue);

        // 드롭다운 닫기
        closeDropdown();
    });

    console.log('이벤트 바인딩 완료');
}

/**
 * 드롭다운 닫기
 */
function closeDropdown() {
    const dropdownElement = document.getElementById('task-assignee-filter-btn');
    if (dropdownElement) {
        const dropdown = bootstrap.Dropdown.getInstance(dropdownElement);
        if (dropdown) {
            dropdown.hide();
        }
    }
}

/**
 * 담당자 필터 적용
 * @param {string|null} bizUserId - 담당자 ID (null이면 전체)
 */
function applyAssigneeFilter(bizUserId) {
    // 현재 필터 상태 저장
    currentFilteredBizUserId = bizUserId;
    console.log('저장된 필터 상태:', currentFilteredBizUserId);

    // active 클래스 업데이트
    updateFilterActiveState(bizUserId);

    // 필터 아이콘 상태 업데이트
    updateFilterIconState();

    // 업무 목록 재조회 (1페이지부터)
    console.log('loadTaskList(1) 호출');

    if (typeof loadTaskList === 'function') {
        loadTaskList(1);
    } else {
        console.error('loadTaskList 함수를 찾을 수 없습니다!');
    }
}

/**
 * 드롭다운 active 상태 업데이트
 * @param {string|null} bizUserId - 선택된 담당자 ID
 */
function updateFilterActiveState(bizUserId) {
    const dropdown = $('#task-assignee-filter-dropdown');

    // 모든 항목에서 active 제거
    dropdown.find('a').removeClass('active');

    // 체크 아이콘 숨김
    dropdown.find('.bi-check2').css('visibility', 'hidden');

    // 선택된 항목에 active 추가
    if (bizUserId) {
        const selectedItem = dropdown.find(`a[data-biz-user-id="${bizUserId}"]`);
        selectedItem.addClass('active');
        selectedItem.find('.bi-check2').css('visibility', 'visible');
        console.log('담당자 항목 active 설정:', bizUserId);
    } else {
        // 전체 선택
        const allItem = dropdown.find('a[data-biz-user-id=""]');
        allItem.addClass('active');
        allItem.find('.bi-check2').css('visibility', 'visible');
        console.log('전체 항목 active 설정');
    }
}

/**
 * 필터 아이콘 상태 업데이트 (필터 적용 여부 표시)
 */
function updateFilterIconState() {
    const filterBtn = $('#task-assignee-filter-btn');
    const icon = filterBtn.find('i');

    if (currentFilteredBizUserId) {
        // 필터 적용 중
        icon.removeClass('bi-funnel').addClass('bi-funnel-fill');
        filterBtn.removeClass('text-decoration-none').addClass('text-primary');
        console.log('필터 아이콘: 활성화 상태');
    } else {
        // 필터 미적용
        icon.removeClass('bi-funnel-fill').addClass('bi-funnel');
        filterBtn.removeClass('text-primary').addClass('text-decoration-none');
        console.log('필터 아이콘: 비활성화 상태');
    }
}

/**
 * 현재 필터 상태 가져오기
 * @returns {string|null} 현재 선택된 담당자 ID
 */
function getCurrentFilteredBizUserId() {
    console.log('getCurrentFilteredBizUserId 호출됨, 반환값:', currentFilteredBizUserId);
    return currentFilteredBizUserId ? String(currentFilteredBizUserId) : null;
}

/**
 * 필터 초기화
 */
function resetAssigneeFilter() {
    console.log('필터 초기화');
    applyAssigneeFilter(null);
}