/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일            수정자     수정내용
 *  -----------     ---------   ---------------------------
 *  2025. 9. 30.     홍현택       최초 생성
 *  2025. 10.10.	 홍현택		페이징, 검색 추가
 * </pre>
 */

document.addEventListener('DOMContentLoaded', function () {


  // ===== 페이지 본문: 서버사이드 렌더링에 맞춘 최소 스크립트 =====
  const tableBody = document.querySelector('#approval-table tbody');

  // 행 클릭 시 상세로 이동
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const row = e.target.closest('tr[data-href]');
      if (row) location.href = row.dataset.href;
    });
  }
});

// 검색 폼
const searchUI = document.querySelector("#searchUI");

// 페이지네이션 링크 클릭 처리
function searchForm(page) {
  if(searchUI) {
    searchUI.page.value = page;
    searchUI.submit();
  }
}