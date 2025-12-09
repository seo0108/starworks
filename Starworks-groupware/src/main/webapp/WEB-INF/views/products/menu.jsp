<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c"%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>메뉴 조회 - 그룹웨어</title>

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="mazer-1.0.0/dist/assets/css/bootstrap.css">
    <link rel="stylesheet" href="mazer-1.0.0/dist/assets/vendors/bootstrap-icons/bootstrap-icons.css">
    <link rel="stylesheet" href="mazer-1.0.0/dist/assets/css/app.css">

    <!-- 상품관리 css -->
    <link rel="stylesheet" href="/css/products.css">

    <!-- jsPDF and SheetJS libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.autotable.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

</head>

<body>
<div id="main-content">
            <div class="page-heading">
                <div class="page-title">
                    <div class="row">
                        <div class="col-12 col-md-6 order-md-1 order-last">
                            <h3>메뉴 조회</h3>
                            <p class="text-subtitle text-muted">다양한 메뉴를 확인하고 검색할 수 있습니다.</p>
                        </div>
                        <div class="col-12 col-md-6 order-md-2 order-first">
                            <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">메뉴 조회</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

                <section class="section">
                    <div class="card">
                        <div class="card-body">
                            <ul class="nav nav-tabs" id="statusTab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" data-status-filter="all" type="button" role="tab">전체</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" data-status-filter="판매중" type="button" role="tab">판매중</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" data-status-filter="시즌 한정" type="button" role="tab">시즌 한정</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" data-status-filter="단종" type="button" role="tab">단종</button>
                                </li>
                            </ul>
                            <div class="filter-bar pt-3">
                                <div class="row g-3 align-items-center">

                                    <div class="col-lg-3">
                                        <div class="input-group">
                                            <span class="input-group-text" id="search-addon"><i class="bi bi-search"></i></span>
                                            <input type="text" class="form-control" placeholder="메뉴명 검색..." id="search-input">
                                        </div>
                                    </div>

                                    <div class="col-lg-2">
                                        <select class="form-select" id="category-filter">
                                            <option value="all">카테고리 전체</option>
                                            <option value="커피">커피</option>
                                            <option value="음료">음료</option>
                                            <option value="티">티</option>
                                            <option value="디저트">디저트</option>
                                        </select>
                                    </div>
                                    <div class="col-lg-2">
                                        <select class="form-select" id="sort-options">
                                            <option value="latest">최신 등록순</option>
                                            <option value="price-asc">가격 낮은순</option>
                                            <option value="price-desc">가격 높은순</option>
                                            <option value="popular">인기순</option>
                                        </select>
                                    </div>
                                    <div class="col-lg-5 d-flex justify-content-end">
                                        <button class="btn btn-light-secondary me-2" id="reset-filters">초기화</button>
                                        <div class="btn-group" role="group">
                                            <button class="btn btn-outline-primary" id="export-pdf"><i class="bi bi-file-earmark-pdf-fill"></i> PDF</button>
                                            <button class="btn btn-outline-success" id="export-excel"><i class="bi bi-file-earmark-excel-fill"></i> Excel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row match-height" id="menu-grid">
                        <!-- JavaScript에서 동적으로 생성됩니다 -->
                    </div>
                    <div id="no-results" class="text-center p-5" style="display: none;">
                        <p class="text-muted fs-4">검색 결과가 없습니다.</p>
                    </div>

                    <div id="pagination-container" class="d-flex justify-content-center mt-4">
                        <!-- Pagination links will be injected here -->
                    </div>
                </section>
            </div>
        </div>


    <!-- Menu Detail Modal -->
    <div class="modal fade" id="menu-detail-modal" tabindex="-1" aria-labelledby="menuDetailModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="menu-detail-title"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <img id="menu-detail-image" src="" class="img-fluid rounded w-100" alt="Menu Image">
                        </div>
                        <div class="col-md-6">
                            <p id="menu-detail-description" class="mb-3"></p>
                            <h4><strong id="menu-detail-price"></strong></h4>
                            <div id="menu-detail-period" class="mt-3" style="display: none;">
                                <strong>출시예정일:</strong> <span id="menu-detail-release-date"></span>
                            </div>
                            <hr>
                            <strong>카테고리</strong>
                            <p id="menu-detail-category" class="text-muted"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success"><i class="bi bi-file-earmark-pdf"></i> PDF 매뉴얼</button>
                    <button type="button" class="btn btn-info"><i class="bi bi-cloud-download"></i> 교육자료 다운로드</button>
                    <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">닫기</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Menu Edit Modal -->
    <div class="modal fade" id="menu-edit-modal" tabindex="-1" aria-labelledby="menuEditModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <form id="menu-edit-form">
                    <div class="modal-header">
                        <h5 class="modal-title" id="menuEditModalLabel">메뉴 수정</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="edit-menu-id">
                        <div class="mb-3">
                            <label for="edit-menu-name" class="form-label">메뉴명</label>
                            <input type="text" class="form-control" id="edit-menu-name" required>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="edit-menu-category" class="form-label">카테고리</label>
                                <select class="form-select" id="edit-menu-category" required>
                                    <option value="커피">커피</option>
                                    <option value="음료">음료</option>
                                    <option value="티">티</option>
                                    <option value="디저트">디저트</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="edit-menu-price" class="form-label">가격</label>
                                <input type="number" class="form-control" id="edit-menu-price" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="edit-menu-description" class="form-label">메뉴 설명</label>
                            <textarea class="form-control" id="edit-menu-description" rows="3" required></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="edit-menu-image" class="form-label">이미지 업로드</label>
                            <input class="form-control" type="file" id="edit-menu-image">
                        </div>
                        <div class="mb-3">
                            <label for="edit-menu-status" class="form-label">상태</label>
                            <select class="form-select" id="edit-menu-status" required>
                                <option value="판매중">판매중</option>
                                <option value="시즌 한정">시즌 한정</option>
                                <option value="단종">단종</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
                        <button type="submit" class="btn btn-primary">저장</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


    <script src="mazer-1.0.0/dist/assets/js/bootstrap.bundle.min.js"></script>
    <script src="mazer-1.0.0/dist/assets/js/app.js"></script>
	<script src="/js/products/menu.js"></script>

</body>

</html>