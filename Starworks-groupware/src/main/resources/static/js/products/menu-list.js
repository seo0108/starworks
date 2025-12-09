/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자          		 수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 9. 26.     	 김주민           	 최초 생성
 * 2025. 10. 28.     	 김주민       	테이블 + 사이드바 스타일 적용
 *
 * </pre>
 */
let currentMenuId = null;
let currentSidebarMenuId = null;

// 페이징 함수
function fnPaging(page) {
    console.log("페이징 요청 - page:", page);
    const searchForm = document.getElementById('searchForm');
    if (searchForm && searchForm.page) {
        searchForm.page.value = page;
        searchForm.submit();
    } else {
        console.error("searchForm 또는 page 필드를 찾을 수 없습니다.");
    }
}

// 모든 이벤트를 바인딩하는 함수
function bindAllEvents() {
    console.log("이벤트 바인딩 시작");

    // 저장 버튼 이벤트
    const saveMenuBtn = document.getElementById('saveMenuBtn');
    if (saveMenuBtn) {
        saveMenuBtn.removeEventListener('click', saveMenu);
        saveMenuBtn.addEventListener('click', saveMenu);
    }

    // 검색 관련 이벤트 바인딩
    bindSearchEvents();

    // 삭제 확인 모달의 '삭제' 버튼 이벤트 바인딩
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.removeEventListener('click', handleConfirmDelete);
        confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    }

    // 상태 탭 클릭 이벤트
    bindStatusTabs();

    // 전체 선택 체크박스
    bindCheckboxEvents();
}

// 상태 탭 바인딩
function bindStatusTabs() {
    const statusTabs = document.querySelectorAll('.status-tab');
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 모든 탭에서 active 제거
            statusTabs.forEach(t => t.classList.remove('active'));
            // 클릭한 탭에 active 추가
            this.classList.add('active');

            // 필터링 로직 (필요시 구현)
            const status = this.getAttribute('data-status');
            console.log('상태 필터:', status);
        });
    });
}

// 체크박스 이벤트 바인딩
function bindCheckboxEvents() {
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
}

// 검색 관련 이벤트 바인딩
function bindSearchEvents() {
    const searchBtn = document.getElementById('searchBtn');
    const searchWordInput = document.querySelector('#searchUI input[name="searchWord"]');

    if (searchBtn) {
        searchBtn.removeEventListener('click', handleSearch);
        searchBtn.addEventListener('click', handleSearch);
    }

    // 검색 조건 복원
    if (window.searchData) {
        const searchTypeSelect = document.querySelector('#searchUI select[name="searchType"]');
        const searchWordInput = document.querySelector('#searchUI input[name="searchWord"]');

        if (searchTypeSelect) {
            searchTypeSelect.value = window.searchData.searchType || '';
        }
        if (searchWordInput) {
            searchWordInput.value = window.searchData.searchWord || '';
        }
    }
}

// 검색 버튼 클릭 핸들러
function handleSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchTypeSelect = document.querySelector('#searchUI select[name="searchType"]');
    const searchWordInput = document.querySelector('#searchUI input[name="searchWord"]');

    if (searchForm && searchTypeSelect && searchWordInput) {
        searchForm.searchType.value = searchTypeSelect.value || '';
        searchForm.searchWord.value = searchWordInput.value || '';
        searchForm.page.value = 1;
        searchForm.submit();
    }
}

// 엔터키 검색 핸들러
function handleSearchEnter(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
}

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    bindAllEvents();

    // 초기화 버튼 이벤트
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSearch);
    }

    // PDF 다운로드 버튼
    const pdfBtn = document.getElementById('export-pdf');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', downloadPDF);
    }

    // Excel 다운로드 버튼
    const excelBtn = document.getElementById('export-excel');
    if (excelBtn) {
        excelBtn.addEventListener('click', downloadExcel);
    }
});

// 검색 초기화 함수
function resetSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchTypeSelect = document.querySelector('#searchUI select[name="searchType"]');
    const searchWordInput = document.querySelector('#searchUI input[name="searchWord"]');

    // 검색 조건 초기화
    if (searchTypeSelect) searchTypeSelect.value = '';
    if (searchWordInput) searchWordInput.value = '';

    // 폼 초기화 후 제출
    if (searchForm) {
        searchForm.searchType.value = '';
        searchForm.searchWord.value = '';
        searchForm.page.value = 1;
        searchForm.submit();
    }
}

// PDF 다운로드 함수
function downloadPDF() {
    Swal.fire({
        icon: 'info',
        title: '준비 중',
        text: 'PDF 다운로드 기능은 현재 준비중입니다.'
    });
    // 실제 구현 시:
    // window.location.href = '/product-menu/download/pdf';
}

// Excel 다운로드 함수
function downloadExcel() {
    // Excel 다운로드 요청
    window.location.href = '/product-menu/download/excel';
}

// 가격에 천 단위 콤마 추가
document.addEventListener('DOMContentLoaded', function() {
    // 테이블의 가격 셀 포맷팅
    document.querySelectorAll('.price-cell').forEach(cell => {
        const text = cell.textContent;
        const price = text.replace(/[^\d]/g, ''); // 숫자만 추출
        if (price) {
            cell.textContent = Number(price).toLocaleString() + '원';
        }
    });
});

// 사이드바에 메뉴 상세 정보 표시
function showMenuDetail(menuId) {
    if (!menuId || menuId.length === 0) {
        Swal.fire('Error', '메뉴 정보를 불러올 수 없습니다 (ID 없음).', 'error');
        return;
    }

	// 해당 상품 목록 클릭하면 사이드바 닫힘
    if (currentSidebarMenuId === menuId) {
        closeSidebar();
        return;
    }

    currentSidebarMenuId = menuId;
    const url = '/rest/product-menu/' + menuId;

    console.log("조회", currentSidebarMenuId)

    fetch(url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 사이드바에 데이터 채우기
            document.getElementById('sidebarMenuId').textContent = data.menuId || '';
            document.getElementById('sidebarMenuNm').textContent = data.menuNm || '';
            document.getElementById('sidebarCategoryNm').textContent = data.categoryNm || '';
            document.getElementById('sidebarPriceAmt').textContent = Number(data.priceAmt || 0).toLocaleString() + '원';
            document.getElementById('sidebarCostRatioAmt').textContent = (data.costRatioAmt || '') + '%';
            document.getElementById('sidebarReleaseYmd').textContent = data.releaseYmd || '';

            // 상태
            const delYnElement = document.getElementById('sidebarDelYn');
            if (data.delYn === 'N') {
                delYnElement.innerHTML = '<span class="status-badge status-active">판매중</span>';
            } else {
                delYnElement.innerHTML = '<span class="status-badge status-inactive">단종</span>';
            }

            // 설명
            document.getElementById('sidebarIngredientContent').textContent = data.ingredientContent || '정보 없음';
            document.getElementById('sidebarMarketingContent').textContent = data.marketingContent || '정보 없음';

            // 이미지
            const sidebarImage = document.getElementById('sidebarImage');
            const sidebarImagePlaceholder = document.getElementById('sidebarImagePlaceholder');

            let imageUrl = null;

			// data.imageUrl 사용
			if (data.imageUrl && data.imageUrl.startsWith('http')) {
			    imageUrl = data.imageUrl;
			} else {
			    console.log('디버그: imageUrl 필드에 S3 URL이 없음');
			}


			if (imageUrl) {
			    // 이미지 로드 테스트
			    const testImg = new Image();
			    testImg.onload = function() {
			        sidebarImage.src = imageUrl;
			        sidebarImage.style.display = 'block';
			        sidebarImagePlaceholder.style.display = 'none';
			    };
			    testImg.onerror = function() {
			        sidebarImage.style.display = 'none';
			        sidebarImagePlaceholder.style.display = 'flex';
			    };
			    testImg.src = imageUrl;
			} else {
			    // URL이 없다면 플레이스홀더 표시
			    sidebarImage.style.display = 'none';
			    sidebarImagePlaceholder.style.display = 'flex';
			}

            // 사이드바 열기
            const sidebar = document.getElementById('sidebarDetail');
            const tableSection = document.getElementById('tableSection');

            sidebar.classList.add('active');
            tableSection.classList.add('sidebar-open');

            // 선택된 행 하이라이트
            document.querySelectorAll('.table-row').forEach(row => {
                row.classList.remove('selected');
                if (row.getAttribute('data-menu-id') === menuId) {
                    row.classList.add('selected');
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('메뉴 상세 정보를 불러오는데 실패했습니다: ' + error.message);
        });
}

// 사이드바 닫기
function closeSidebar() {
    const sidebar = document.getElementById('sidebarDetail');
    const tableSection = document.getElementById('tableSection');

    sidebar.classList.remove('active');
    tableSection.classList.remove('sidebar-open');

    // 선택된 행 하이라이트 제거
    document.querySelectorAll('.table-row').forEach(row => {
        row.classList.remove('selected');
    });

    currentSidebarMenuId = null;
}

// 사이드바에서 수정 버튼 클릭
function editMenuFromSidebar() {
    if (currentSidebarMenuId) {
        loadMenuData(currentSidebarMenuId);
    }
}

// 사이드바에서 삭제 버튼 클릭
function deleteMenuFromSidebar() {
    if (currentSidebarMenuId) {
        showDeleteConfirmModal(currentSidebarMenuId);
    }
}

const menuEditBtn = document.querySelector("#menu-edit-btn");
menuEditBtn.addEventListener("click", () => {
	loadMenuData(currentSidebarMenuId)
})

// 메뉴 데이터 로드 함수 (수정용)
function loadMenuData(menuId) {
    if (!menuId || menuId.length === 0) {
        console.error("오류: loadMenuData에 유효한 메뉴 ID가 전달되지 않았습니다.");
        Swal.fire('오류', '메뉴 정보를 불러올 수 없습니다 (ID 없음).', 'error');
        return;
    }

    currentMenuId = menuId;

    const url = '/rest/product-menu/' + menuId;

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("응답 상태:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} (요청 URL: ${url})`);
        }
        return response.json();
    })
    .then(data => {
        console.log("불러온 데이터:", data);

        // 폼에 데이터 채우기
        const fields = ['menuId', 'menuNm', 'categoryNm', 'priceAmt', 'costRatioAmt',
         'releaseYmd', 'ingredientContent', 'marketingContent', 'delYn', 'menuFileId'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.value = data[field] || '';
            }
        });

        // 모달 열기
//        const modal = new bootstrap.Modal(document.getElementById('menuEditModal'));
//        modal.show();
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('오류', '메뉴 정보를 불러오는데 실패했습니다: ' + error.message, 'error');
    });
}

// 메뉴 저장 함수
function saveMenu() {
    if (!currentMenuId) {
        Swal.fire('오류', '메뉴 ID가 없습니다.', 'warning');
        return;
    }

    const formData = {
        menuId: currentMenuId,
        menuNm: document.getElementById('menuNm').value,
        categoryNm: document.getElementById('categoryNm').value,
        priceAmt: document.getElementById('priceAmt').value,
        costRatioAmt: document.getElementById('costRatioAmt').value,
        releaseYmd: document.getElementById('releaseYmd').value,
        ingredientContent: document.getElementById('ingredientContent').value,
        marketingContent: document.getElementById('marketingContent').value,
        menuFileId: document.getElementById('menuFileId').value,
        delYn: document.getElementById('delYn').value
    };

    // 필수 필드 체크
    if (!formData.menuNm || !formData.categoryNm || !formData.priceAmt) {
        Swal.fire('필수 입력 항목 누락', '메뉴명, 카테고리, 판매가는 필수 입력 항목입니다.', 'warning');
        return;
    }

    const url = '/rest/product-menu/' + currentMenuId;
    console.log("저장 요청 URL:", url);
    console.log("저장 데이터:", formData);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("저장 응답:", data);
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '성공',
                text: '메뉴가 성공적으로 수정되었습니다.'
            }).then(() => {
                // 모달 닫기
                const modal = bootstrap.Modal.getInstance(document.getElementById('menuEditModal'));
                if (modal) {
                    modal.hide();
                }

                // 페이지 새로고침
                location.reload();
            });
        } else {
            Swal.fire('Error', '메뉴 수정에 실패했습니다: ' + (data.message || '알 수 없는 오류'), 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('메뉴 수정 중 오류가 발생했습니다: ' + error.message);
    });
}

// 커스텀 삭제 확인 모달 표시 함수
function showDeleteConfirmModal(menuId) {
    const menuIdInput = document.getElementById('menuIdToDelete');
    if (menuIdInput) {
        menuIdInput.value = menuId;
    }

    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
}

// 모달 내 '삭제' 버튼 클릭 핸들러
function handleConfirmDelete() {
//    const menuId = document.getElementById('menuIdToDelete').value;

	const menuId = currentSidebarMenuId;

    if (menuId) {
        // 모달 닫기
        const modalElement = document.getElementById('deleteConfirmModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }

        // 실제 삭제 함수 호출
        deleteMenu(menuId);
    } else {
        alert("삭제할 메뉴 ID를 찾을 수 없습니다.");
    }
}

// 메뉴 삭제 함수
function deleteMenu(menuId) {
    if (!menuId || menuId.length === 0) {
        alert("메뉴 정보를 불러올 수 없습니다 (ID 없음).");
        return;
    }

    const url = '/rest/product-menu/' + menuId;

    fetch(url, {method : 'DELETE'})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('메뉴가 성공적으로 삭제되었습니다.');

            // 사이드바가 열려있으면 닫기
            closeSidebar();

            // 페이지 새로고침
            setTimeout(() => location.reload(), 500);
        } else {
            alert('메뉴 삭제에 실패했습니다: ' + (data.message || '알 수 없는 오류'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('메뉴 삭제 중 오류가 발생했습니다: ' + error.message);
    });
}