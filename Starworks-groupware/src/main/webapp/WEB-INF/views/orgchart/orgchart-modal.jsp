<!--
 * == 개정이력(Modification Information) ==
 *
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 9. 30.     			김주민            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<style>
.org-tree input[type="checkbox"] {
    cursor: pointer;
}
.org-tree label {
    cursor: pointer;
}
.selected-user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 5px;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
}
</style>

</head>
<body>

<!-- Organization Chart Modal -->
<div class="modal fade" id="org-chart-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">조직도 - 사용자 선택</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="input-group mb-3">
                    <input type="text" id="modal-orgSearchInput" class="form-control"
                           placeholder="부서명 또는 사원명 검색">
                    <button class="btn btn-primary" type="button" id="modal-orgSearchButton">검색</button>
                </div>

                <div class="row">
                    <!-- 조직 구조 -->
                    <div class="col-md-7">
                        <h6>조직 구조</h6>
                        <div id="modal-orgTreeContainer" class="org-tree border p-3 rounded bg-white"
                             style="max-height: 400px; overflow-y: auto;">
                            <!-- 조직도 트리가 여기에 렌더링됨 -->
                        </div>
                    </div>

                    <!-- 선택된 사용자 -->
                    <div class="col-md-5">
                        <h6>선택된 사용자 <span id="selected-count" class="badge bg-primary">0</span></h6>
                        <div id="modal-selectedUsers" class="border p-3 rounded bg-light"
                             style="max-height: 400px; overflow-y: auto;">
                            <p class="text-muted">사용자를 체크박스로 선택하세요</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light-secondary" data-bs-dismiss="modal">취소</button>
                <button type="button" class="btn btn-primary" id="confirm-selection-btn">선택 완료</button>
            </div>
        </div>
    </div>
</div>

</body>
</html>