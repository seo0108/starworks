<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 9. 26.     	김주민            최초 생성
 *  2025. 9. 27.        김주민         커스텀 삭제 확인 모달 추가
 *	2025. 9. 30.		임가영		 img 태그 src 경로 수정
 *	2025. 10. 28.		김주민		 상품관리 UI 전면 수정
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상품 관리 - 그룹웨어</title>

    <link rel="stylesheet" href="/css/products.css">

    <!-- jsPDF and SheetJS libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.autotable.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

</head>

<body>
<div id="main-content">
    <div class="page-heading">
        <!-- 헤더 영역 -->
        <div class="page-title-section">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="page-title-text mb-2">상품 관리</h2>
                    <p class="page-subtitle-text text-muted">판매 중인 상품을 조회하고 관리할 수 있습니다.</p>
                </div>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                        <li class="breadcrumb-item active">상품 관리</li>
                    </ol>
                </nav>
            </div>
        </div>

        <!-- 메인 컨텐츠 레이아웃 -->
        <div class="premium-layout">
            <!-- 테이블 섹션 -->
            <div class="table-section" id="tableSection">
                <div class="premium-card">
                    <!-- 툴바 -->
                    <div class="toolbar">
                        <div class="toolbar-left">
                            <!-- 검색 -->
                            <div class="search-box" id="searchUI">
                                <select class="search-select" name="searchType">
                                    <option value="">전체</option>
                                    <option value="menuNm">상품명</option>
                                    <option value="categoryNm">카테고리</option>
                                </select>
                                <div class="search-input-wrapper">
                                    <i class="bi bi-search search-icon"></i>
                                    <input type="text"
                                           class="search-input"
                                           name="searchWord"
                                           placeholder="검색어를 입력하세요"
                                           onkeypress="handleSearchEnter(event)">
                                </div>
                                <button class="btn-search" type="button" id="searchBtn">
                                    검색
                                </button>
                            </div>
                        </div>

                        <div class="toolbar-right">
                            <button class="btn-icon" id="reset-filters" title="초기화">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
<!--                             <button class="btn-icon" id="export-pdf" title="PDF 내보내기"> -->
<!--                                 <i class="bi bi-file-earmark-pdf"></i> -->
<!--                             </button> -->
<!--                             <button class="btn-icon" id="export-excel" title="Excel 내보내기"> -->
<!--                                 <i class="bi bi-file-earmark-excel"></i> -->
<!--                             </button> -->
                        </div>
                    </div>

                    <!-- 상태 탭 -->
                    <%-- <div class="status-tabs">
                        <button class="status-tab active" data-status="all">
                            전체
                            <span class="tab-count">${paging.totalRecord}</span>
                        </button>
                        <button class="status-tab" data-status="N">
                            판매중
                            <span class="tab-count tab-count-success">0</span>
                        </button>
                        <button class="status-tab" data-status="Y">
                            단종
                            <span class="tab-count tab-count-danger">0</span>
                        </button>
                    </div> --%>

                    <!-- 테이블 -->
                    <div class="premium-table-wrapper">
                        <table class="premium-table" id="menuTable">
                            <thead>
                                <tr>
                                    <th style="width: 40px;">
                                        <input type="checkbox" class="table-checkbox" id="selectAll">
                                    </th>
                                    <th style="width: 80px;">이미지</th>
                                    <th style="width: 80px;">코드</th>
                                    <th style="width: 190px;">상품명</th>
                                    <th style="width: 100px;">카테고리</th>
                                    <th style="width: 90px;">판매가</th>
                                    <th style="width: 80px;">원가율</th>
                                    <th style="width: 80px;">상태</th>
                                    <th style="width: 100px;">출시일</th>
                                </tr>
                            </thead>
                            <tbody id="menu-tbody">
                                <c:forEach var="menu" items="${menuList}">
                                    <tr class="table-row"
                                        data-menu-id="${menu.menuId}"
                                        onclick="showMenuDetail('${menu.menuId}')">
                                        <td onclick="event.stopPropagation()">
                                            <input type="checkbox" class="table-checkbox row-checkbox">
                                        </td>
                                        <td>
                                            <div class="table-thumbnail">
											    <c:choose>
											        <c:when test="${not empty menu.fileList[0].filePath}">
											            <img src="${menu.fileList[0].filePath}"
											                 alt="${menu.menuNm}"
											                 loading="lazy"
											                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\'thumbnail-placeholder\'><i class=\'bi bi-image\'></i></div>'">
											        </c:when>
											        <c:otherwise>
											            <div class="thumbnail-placeholder">
											                <i class="bi bi-image"></i>
											            </div>
											        </c:otherwise>
											    </c:choose>
											</div>
                                        </td>
                                        <td class="text-muted">${menu.menuId}</td>
                                        <td>
                                            <span class="product-name">${menu.menuNm}</span>
                                        </td>
                                        <td>
                                            <span class="category-badge">${menu.categoryNm}</span>
                                        </td>
                                        <td class="font-semibold price-cell">${menu.priceAmt}원</td>
                                        <td class="text-muted">${menu.costRatioAmt}%</td>
                                        <td>
                                            <c:choose>
                                                <c:when test="${menu.delYn == 'N'}">
                                                    <span class="status-badge status-active">판매중</span>
                                                </c:when>
                                                <c:otherwise>
                                                    <span class="status-badge status-inactive">단종</span>
                                                </c:otherwise>
                                            </c:choose>
                                        </td>
                                        <td class="text-muted">${menu.releaseYmd}</td>
                                    </tr>
                                </c:forEach>
                            </tbody>
                        </table>

                        <!-- 빈 상태 -->
                        <div id="emptyState" class="empty-state" style="display: none;">
                            <i class="bi bi-inbox"></i>
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    </div>

                    <!-- 푸터 (페이징) -->
                    <div class="table-footer">
                        <div class="footer-info">
                            전체 <strong id="totalCount">${paging.totalRecord}</strong>건
                        </div>
                        <nav class="pagination-wrapper d-flex justify-content-center">
                            <ul class="pagination" id="pagination-container">
                                <c:out value="${pagingHTML}" escapeXml="false" />
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            <!-- 사이드바 디테일 -->
            <div class="sidebar-detail" id="sidebarDetail">
                <div class="sidebar-header">
                    <h5 class="sidebar-title">상품 상세</h5>
                    <button class="btn-close-sidebar" onclick="closeSidebar()">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>

                <div class="sidebar-content">
                    <!-- 이미지 -->
                    <div class="detail-image-wrapper" id="sidebarImageWrapper">
                        <img id="sidebarImage" src="" alt="상품 이미지" class="detail-image" style="display: none;">
                        <div id="sidebarImagePlaceholder" class="detail-image-placeholder">
                            <i class="bi bi-image"></i>
                        </div>
                    </div>

                    <!-- 상품명 -->
                    <h3 class="detail-product-name" id="sidebarMenuNm"></h3>

                    <!-- 정보 그리드 -->
                    <div class="detail-info-grid">
                        <div class="info-item">
                            <div class="info-label">
                                <i class="bi bi-upc-scan"></i>
                                상품코드
                            </div>
                            <div class="info-value" id="sidebarMenuId"></div>
                        </div>

                        <div class="info-item">
                            <div class="info-label">
                                <i class="bi bi-tag"></i>
                                카테고리
                            </div>
                            <div class="info-value">
                                <span class="category-badge" id="sidebarCategoryNm"></span>
                            </div>
                        </div>

                        <div class="info-item">
                            <div class="info-label">
                                <i class="bi bi-currency-dollar"></i>
                                판매가
                            </div>
                            <div class="info-value info-value-price" id="sidebarPriceAmt"></div>
                        </div>

                        <div class="info-item">
                            <div class="info-label">
                                <i class="bi bi-graph-up"></i>
                                원가율
                            </div>
                            <div class="info-value" id="sidebarCostRatioAmt"></div>
                        </div>

                        <div class="info-item">
                            <div class="info-label">
                                <i class="bi bi-calendar-check"></i>
                                출시일
                            </div>
                            <div class="info-value" id="sidebarReleaseYmd"></div>
                        </div>

                        <div class="info-item">
                            <div class="info-label">
                                <i class="bi bi-circle-fill"></i>
                                상태
                            </div>
                            <div class="info-value" id="sidebarDelYn"></div>
                        </div>
                    </div>

                    <!-- 상세 설명 -->
                    <div class="detail-section">
                        <h6 class="section-title">
                            <i class="bi bi-list-ul"></i>
                            원재료 정보
                        </h6>
                        <p class="section-content" id="sidebarIngredientContent"></p>
                    </div>

                    <div class="detail-section">
                        <h6 class="section-title">
                            <i class="bi bi-chat-left-text"></i>
                            마케팅 설명
                        </h6>
                        <p class="section-content" id="sidebarMarketingContent"></p>
                    </div>

                    <!-- 액션 버튼 -->
                    <div class="sidebar-actions">
                        <button id="menu-edit-btn" class="btn-action btn-action-primary"
                        	data-bs-toggle="modal" data-bs-target="#menuEditModal" data-feature-id="M009-01-01">
                            <i class="bi bi-pencil"></i>
                            수정
                        </button>
                        <button id="menu-remove-btn" class="btn-action btn-action-danger"
                        	data-bs-toggle="modal" data-bs-target="#deleteConfirmModal" data-feature-id="M009-01-02">
                            <i class="bi bi-trash"></i>
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 수정 모달 -->
<div class="modal fade" id="menuEditModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">상품 수정</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="menuEditForm">
                    <input type="hidden" id="menuId">
                    <input type="hidden" id="menuFileId">

                    <div class="mb-3">
                        <label for="menuNm" class="form-label">상품명 <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="menuNm" required>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="categoryNm" class="form-label">카테고리 <span class="text-danger">*</span></label>
                            <select class="form-select" id="categoryNm" required>
                                <option value="">선택</option>
                                <option value="커피">커피</option>
                                <option value="음료">음료</option>
                                <option value="티">티</option>
                                <option value="디저트">디저트</option>
                                <option value="푸드">푸드</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="priceAmt" class="form-label">판매가 <span class="text-danger">*</span></label>
                            <input type="number" class="form-control" id="priceAmt" required>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="costRatioAmt" class="form-label">원가율(%)</label>
                            <input type="number" class="form-control" id="costRatioAmt" step="0.1">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="releaseYmd" class="form-label">출시일</label>
                            <input type="date" class="form-control" id="releaseYmd">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="ingredientContent" class="form-label">원재료 정보</label>
                        <textarea class="form-control" id="ingredientContent" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="marketingContent" class="form-label">마케팅 설명</label>
                        <textarea class="form-control" id="marketingContent" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="delYn" class="form-label">상태</label>
                        <select class="form-select" id="delYn">
                            <option value="N">판매중</option>
                            <option value="Y">단종</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
                <button type="button" class="btn btn-primary" id="saveMenuBtn">저장</button>
            </div>
        </div>
    </div>
</div>

<!-- 삭제 확인 모달 -->
<div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">삭제 확인</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p>정말로 이 상품을 삭제하시겠습니까?</p>
                <input type="hidden" id="menuIdToDelete">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">삭제</button>
            </div>
        </div>
    </div>
</div>

<!-- 숨김 폼 -->
<form id="searchForm" method="get" action="/products" style="display: none;">
    <input type="hidden" name="page" value="${pageInfo.currentPage}">
    <input type="hidden" name="searchType" value="${searchData.searchType}">
    <input type="hidden" name="searchWord" value="${searchData.searchWord}">
</form>

<script>
window.searchData = {
    searchType: "${searchData.searchType}",
    searchWord: "${searchData.searchWord}"
};


// 사이드바 열기/닫기 함수
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

// const menuEditBtn = document.querySelector("#menu-edit-btn");
// menuEditBtn.addEventListener("click", () => {
// 	editMenuFromSidebar();
// });

// 사이드바에서 수정 버튼 클릭
// function editMenuFromSidebar() {
//     if (currentSidebarMenuId) {
//         loadMenuData(currentSidebarMenuId);
//     }
// }

// const menuRemoveBtn = document.querySelector("#menu-remove-btn");
// menuRemoveBtn.addEventListener("click", () => {
//     const menuIdInput = document.getElementById("menuIdToDeleteInput");
//     if (menuIdInput && currentSidebarMenuId) {
//         menuIdInput.value = currentSidebarMenuId;
//     }
// });

// 사이드바에서 삭제 버튼 클릭
// function deleteMenuFromSidebar() {
//     if (currentSidebarMenuId) {
//         showDeleteConfirmModal(currentSidebarMenuId);
//     }
// }

// ESC 키로 사이드바 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSidebar();
    }
});
</script>

<script src="/js/products/menu-list.js"></script>

</body>
</html>
