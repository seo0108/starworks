<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 17.     	김주민            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- 파일 탭 Start -->
<div class="tab-pane fade" id="files-pane" role="tabpanel" aria-labelledby="files-tab">
    <div class="card mt-3">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
                프로젝트 파일 모아보기
                <span class="badge bg-light-secondary ms-2" id="total-files-count">0</span>
            </h5>
            <div class="d-flex gap-2">
                <!-- 필터 드롭다운 -->
                <select class="form-select form-select-sm" id="file-source-filter" style="width: auto;">
                    <option value="">전체</option>
                    <option value="프로젝트">프로젝트 첨부</option>
                    <option value="업무">업무 첨부</option>
                    <option value="게시글">게시글 첨부</option>
                </select>

                <!-- 검색 -->
                <div class="input-group input-group-sm" style="width: 250px;">
                    <input type="text" class="form-control" id="file-search-input"
                           placeholder="파일명 검색...">
                    <button class="btn btn-outline-secondary" type="button" id="file-search-btn">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="card-body">
            <!-- 파일 목록 테이블 -->
            <div class="table-responsive">
                <table class="table table-hover" style="table-layout: fixed; width: 100%;">
                    <thead>
                        <tr>
		                    <th style="width: 5%;" class="text-center"><i class="bi bi-file-earmark"></i></th>
		                    <th style="width: 25%;">파일명</th>
		                    <th style="width: 10%;" class="text-end pe-5">크기</th>
		                    <th style="width: 25%;" class="ps-5">출처명</th>
		                    <th style="width: 10%;" class="text-center">업로드 날짜</th>
		                    <th style="width: 10%;" class="text-center">업로더</th>
		                    <th style="width: 10%;" class="text-center">다운로드</th>
		                </tr>
                    </thead>
                    <tbody id="files-list-tbody">
                        <!-- JS가 채움 -->
                        <tr>
                            <td colspan="7" class="text-center text-muted py-5">
					            <i class="bi bi-folder2-open" style="font-size: 3rem;"></i>
					            <p class="mt-3 mb-0">파일을 불러오는 중...</p>
					        </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 페이징 영역 -->
		    <div id="files-pagination-container" class="mt-3">
		        <!-- 페이징 HTML 여기에 렌더링 -->
		    </div>

        </div>
    </div>
</div>
<!--  파일 탭 END -->