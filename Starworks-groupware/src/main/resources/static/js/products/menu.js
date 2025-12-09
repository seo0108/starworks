/** 
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 9. 26.     	     김주민            컨트롤러 연동으로 수정
 *
 * </pre>
 */

document.addEventListener('DOMContentLoaded', function () {
    const { jsPDF } = window.jspdf;
    let currentlyDisplayedItems = [];
    let originalMenuData = [];
    let currentPage = 1;
    const itemsPerPage = 12;

    // DOM에서 메뉴 데이터 추출 (JSP에서 렌더링된 카드들로부터)
    function extractMenuDataFromDOM() {
        const menuCards = document.querySelectorAll('.menu-item');
        const extractedData = [];
        
        menuCards.forEach(card => {
            const menuId = card.querySelector('[data-menu-id]')?.getAttribute('data-menu-id') || 
                          card.querySelector('[onclick*="showMenuDetail"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            const menuName = card.getAttribute('data-name') || card.querySelector('.menu-title')?.textContent?.trim();
            const category = card.getAttribute('data-category') || card.querySelector('.category-text')?.textContent?.trim();
            const priceText = card.querySelector('.menu-price')?.textContent?.trim();
            const price = priceText ? parseInt(priceText.replace(/[^\d]/g, '')) : 0;
            const status = card.getAttribute('data-status') || '판매중';
            const releaseDate = card.querySelector('.release-date')?.textContent?.replace('출시예정:', '')?.trim();
            const costRatio = card.querySelector('[class*="cost-ratio"]')?.textContent?.replace(/[^\d.]/g, '');
            const imageUrl = card.querySelector('.menu-image')?.src || '';

            if (menuId && menuName) {
                extractedData.push({
                    id: menuId,
                    name: menuName,
                    category: category || '기타',
                    price: price,
                    status: status,
                    releaseDate: releaseDate || '',
                    costRatio: costRatio || '',
                    imageUrl: imageUrl,
                    description: menuName + '에 대한 설명입니다.' // 기본 설명
                });
            }
        });

        return extractedData;
    }

    // DOM 요소들
    const menuGrid = document.getElementById('menu-grid');
    const noResultsDiv = document.getElementById('no-results');
    const paginationContainer = document.getElementById('pagination-container');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortOptions = document.getElementById('sort-options');
    const statusTabs = document.querySelectorAll('#statusTab .nav-link');
    const resetBtn = document.getElementById('reset-filters');
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportExcelBtn = document.getElementById('export-excel');
    const menuDetailModal = new bootstrap.Modal(document.getElementById('menu-detail-modal'));
    const menuEditModal = new bootstrap.Modal(document.getElementById('menu-edit-modal'));
    const menuEditForm = document.getElementById('menu-edit-form');

    const statusColors = {
        '판매중': 'success',
        '시즌 한정': 'info',
        '단종': 'danger'
    };

    function renderMenuItems(items) {
        if (!menuGrid) return;
        
        // 기존 메뉴 아이템들만 제거 (no-results div는 유지)
        const existingMenuItems = menuGrid.querySelectorAll('.menu-item');
        existingMenuItems.forEach(item => item.remove());

        if (items.length === 0) {
            if (noResultsDiv) noResultsDiv.style.display = 'block';
            return;
        }
        if (noResultsDiv) noResultsDiv.style.display = 'none';

        items.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-xl-4 col-md-6 col-sm-12 menu-item';
            col.setAttribute('data-category', item.category);
            col.setAttribute('data-status', item.status);
            col.setAttribute('data-name', item.name);

            col.innerHTML = `
                <div class="card">
                    <div class="card-content">
                        <div class="menu-image-container">
                            ${item.imageUrl ? 
                                `<img src="${item.imageUrl}" class="menu-image menu-card-image" alt="${item.name}" data-id="${item.id}">` :
                                `<div class="menu-image-placeholder menu-card-image" data-id="${item.id}">
                                    <i class="bi bi-cup-hot" style="font-size: 3rem; color: #6c757d;"></i>
                                </div>`
                            }
                            <span class="badge bg-${statusColors[item.status] || 'secondary'} menu-status-badge">${item.status}</span>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title menu-title">${item.name}</h5>
                            <p class="text-muted category-text">${item.category}</p>
                            
                            <div class="price-info">
                                <h4 class="menu-price">${item.price.toLocaleString()}원</h4>
                                ${item.costRatio ? `<small class="text-muted">원가율: ${item.costRatio}%</small>` : ''}
                            </div>
                            
                            ${item.releaseDate ? 
                                `<div class="release-date">
                                    <i class="bi bi-calendar-event"></i>
                                    <small class="text-muted">출시예정: ${item.releaseDate}</small>
                                </div>` : 
                                ''
                            }
                            
                            <div class="menu-actions mt-3">
                                <button class="btn btn-outline-primary btn-sm btn-detail" data-id="${item.id}">
                                    <i class="bi bi-eye"></i> 상세보기
                                </button>
                                <button class="btn btn-outline-warning btn-sm btn-edit" data-id="${item.id}">
                                    <i class="bi bi-pencil"></i> 수정
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            menuGrid.appendChild(col);
        });
    }

    function setupPagination(items) {
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(items.length / itemsPerPage);
        if (pageCount <= 1) return;

        const ul = document.createElement('ul');
        ul.className = 'pagination';

        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.innerText = i;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                displayPage(i, items);
            });
            li.appendChild(a);
            ul.appendChild(li);
        }
        paginationContainer.appendChild(ul);
    }

    function displayPage(page, items) {
        currentPage = page;
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = items.slice(start, end);
        renderMenuItems(paginatedItems);
        setupPagination(items);
    }

    function applyFiltersAndSort() {
        let filteredData = [...originalMenuData];
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const category = categoryFilter ? categoryFilter.value : 'all';
        const activeStatusTab = document.querySelector('#statusTab .nav-link.active');
        const activeStatus = activeStatusTab ? activeStatusTab.dataset.statusFilter : 'all';
        const sort = sortOptions ? sortOptions.value : 'latest';

        // 검색 필터
        if (searchTerm) {
            filteredData = filteredData.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
        }

        // 카테고리 필터
        if (category !== 'all') {
            filteredData = filteredData.filter(item => item.category === category);
        }
        
        // 상태 필터
        if (activeStatus !== 'all') {
            filteredData = filteredData.filter(item => item.status === activeStatus);
        }

        // 정렬
        switch (sort) {
            case 'price-asc':
                filteredData.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredData.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                // 인기순은 이름순으로 대체 (인기도 데이터가 없으므로)
                filteredData.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
                break;
            case 'latest':
            default:
                // 최신순은 출시예정일 기준 또는 이름순
                filteredData.sort((a, b) => {
                    if (a.releaseDate && b.releaseDate) {
                        return new Date(b.releaseDate) - new Date(a.releaseDate);
                    }
                    return a.name.localeCompare(b.name, 'ko');
                });
                break;
        }

        currentlyDisplayedItems = filteredData;
        displayPage(1, currentlyDisplayedItems);
    }
    
    function resetAllFilters() {
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = 'all';
        if (sortOptions) sortOptions.value = 'latest';
        
        // 상태 탭 초기화
        statusTabs.forEach(tab => tab.classList.remove('active'));
        const allTab = document.querySelector('#statusTab .nav-link[data-status-filter="all"]');
        if (allTab) allTab.classList.add('active');
        
        applyFiltersAndSort();
    }

    function showMenuDetails(id) {
        const item = originalMenuData.find(m => m.id == id);
        if (!item) return;

        const titleEl = document.getElementById('menu-detail-title');
        const imageEl = document.getElementById('menu-detail-image');
        const descEl = document.getElementById('menu-detail-description');
        const priceEl = document.getElementById('menu-detail-price');
        const categoryEl = document.getElementById('menu-detail-category');
        const releaseDateEl = document.getElementById('menu-detail-release-date');
        const periodDiv = document.getElementById('menu-detail-period');

        if (titleEl) titleEl.textContent = item.name;
        if (imageEl) {
            imageEl.src = item.imageUrl || '/images/default-menu.jpg';
            imageEl.alt = item.name;
        }
        if (descEl) descEl.textContent = item.description;
        if (priceEl) priceEl.textContent = `${item.price.toLocaleString()}원`;
        if (categoryEl) categoryEl.textContent = item.category;

        if (periodDiv && releaseDateEl) {
            if (item.releaseDate) {
                releaseDateEl.textContent = item.releaseDate;
                periodDiv.style.display = 'block';
            } else {
                periodDiv.style.display = 'none';
            }
        }

        menuDetailModal.show();
    }

    function openEditModal(id) {
        const item = originalMenuData.find(m => m.id == id);
        if (!item) return;

        const editIdEl = document.getElementById('edit-menu-id');
        const editNameEl = document.getElementById('edit-menu-name');
        const editCategoryEl = document.getElementById('edit-menu-category');
        const editPriceEl = document.getElementById('edit-menu-price');
        const editDescEl = document.getElementById('edit-menu-description');
        const editReleaseDateEl = document.getElementById('edit-release-date');

        if (editIdEl) editIdEl.value = item.id;
        if (editNameEl) editNameEl.value = item.name;
        if (editCategoryEl) editCategoryEl.value = item.category;
        if (editPriceEl) editPriceEl.value = item.price;
        if (editDescEl) editDescEl.value = item.description;
        if (editReleaseDateEl) editReleaseDateEl.value = item.releaseDate;
        
        menuEditModal.show();
    }

    function exportToPDF() {
        if (currentlyDisplayedItems.length === 0) {
            alert('내보낼 데이터가 없습니다.');
            return;
        }
        
        const doc = new jsPDF();
        doc.text("메뉴 목록", 14, 16);

        const tableColumn = ["메뉴명", "카테고리", "가격", "상태"];
        const tableRows = [];

        currentlyDisplayedItems.forEach(item => {
            const itemData = [
                item.name,
                item.category,
                item.price.toLocaleString() + '원',
                item.status,
            ];
            tableRows.push(itemData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('menu_list.pdf');
    }

    function exportToExcel() {
        if (currentlyDisplayedItems.length === 0) {
            alert('내보낼 데이터가 없습니다.');
            return;
        }
        
        const worksheetData = currentlyDisplayedItems.map(item => ({
            '메뉴명': item.name,
            '카테고리': item.category,
            '가격': item.price,
            '상태': item.status,
            '출시예정일': item.releaseDate || '',
            '원가율': item.costRatio || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "메뉴 목록");

        worksheet['!cols'] = [
            { wch: 30 }, // 메뉴명
            { wch: 15 }, // 카테고리
            { wch: 15 }, // 가격
            { wch: 15 }, // 상태
            { wch: 15 }, // 출시예정일
            { wch: 15 }  // 원가율
        ];

        XLSX.writeFile(workbook, "menu_list.xlsx");
    }

    // 메뉴 수정 폼 제출 처리
    if (menuEditForm) {
        menuEditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 실제 환경에서는 서버로 AJAX 요청을 보내야 함
            // 여기서는 클라이언트 사이드에서만 업데이트
            const id = document.getElementById('edit-menu-id').value;
            const index = originalMenuData.findIndex(item => item.id == id);

            if (index > -1) {
                const nameEl = document.getElementById('edit-menu-name');
                const categoryEl = document.getElementById('edit-menu-category');
                const priceEl = document.getElementById('edit-menu-price');
                const descEl = document.getElementById('edit-menu-description');
                const releaseDateEl = document.getElementById('edit-release-date');

                if (nameEl) originalMenuData[index].name = nameEl.value;
                if (categoryEl) originalMenuData[index].category = categoryEl.value;
                if (priceEl) originalMenuData[index].price = parseInt(priceEl.value, 10) || 0;
                if (descEl) originalMenuData[index].description = descEl.value;
                if (releaseDateEl) originalMenuData[index].releaseDate = releaseDateEl.value;

                // TODO: 실제 환경에서는 서버로 데이터 전송
                console.log('메뉴 수정 데이터:', originalMenuData[index]);
            }

            menuEditModal.hide();
            applyFiltersAndSort();
        });
    }

    // 이벤트 리스너 등록
    if (searchInput) searchInput.addEventListener('input', applyFiltersAndSort);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFiltersAndSort);
    if (sortOptions) sortOptions.addEventListener('change', applyFiltersAndSort);
    if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportToPDF);
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportToExcel);

    // 상태 탭 이벤트 리스너
    statusTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            statusTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            applyFiltersAndSort();
        });
    });
    
    // 메뉴 그리드 클릭 이벤트 (이벤트 위임)
    if (menuGrid) {
        menuGrid.addEventListener('click', function(e) {
            const detailBtn = e.target.closest('.btn-detail');
            const editBtn = e.target.closest('.btn-edit');
            const cardImage = e.target.closest('.menu-card-image');

            if (detailBtn) {
                const menuId = detailBtn.dataset.id;
                showMenuDetails(menuId);
                return;
            }
            if (editBtn) {
                const menuId = editBtn.dataset.id;
                openEditModal(menuId);
                return;
            }
            if (cardImage) {
                const menuId = cardImage.dataset.id;
                showMenuDetails(menuId);
            }
        });
    }

    // 초기화 및 데이터 로드
    function initialize() {
        // JSP에서 렌더링된 데이터를 추출
        originalMenuData = extractMenuDataFromDOM();
        console.log('추출된 메뉴 데이터:', originalMenuData);
        
        // 초기 렌더링
        applyFiltersAndSort();
    }

    // 페이지 로드 완료 후 초기화
    initialize();
});