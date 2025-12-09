<!-- 
 * == 개정이력(Modification Information) ==
 *   
 *   수정일      			수정자           수정내용
 *  ============   	============== =======================
 *  2025. 10. 25.     	임가영            최초 생성
 *
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>    
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form" %>    
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring" %>    
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="security" %>    


<div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-modal="true" role="dialog" padding-right: 19px;">
	<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
		<div class="modal-content">
			<div class="modal-header bg-danger">
				<h5 class="modal-title text-white" id="deleteConfirmModalLabel">
					<i class="bi bi-exclamation-triangle-fill me-2"></i> 삭제 확인
				</h5>
			</div>

			<div class="modal-body">
				<p>정말 삭제하시겠습니까?</p>
				<p class="text-danger small">삭제된 데이터는 휴지통에서 복원할 수 있습니다.</p>
<!-- 				<input type="hidden" id="menuIdToDelete" value=""> -->
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
				<button type="button" class="btn btn-danger" id="confirmDeleteBtn">
					<i class="bi bi-trash-fill"></i> 삭제
				</button>
			</div>
		</div>
	</div>
</div>