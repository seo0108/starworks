/** 
 * <pre>
 * << 개정이력(Modification Information) >>
 *   
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 9. 28.     	임가영            최초 생성
 *
 * </pre>
 */

// search 버튼 클릭
searchBtn.addEventListener("click", function() {	
	let queryString = window.location.search + "";
	
	if (queryString.indexOf('F10') > -1) {
		// 만약 category queryString 이 있으면
		category = queryString.substr(queryString.indexOf("category") + 9, 4);
	} else {
		// category queryStirng 이 없으면
		category = "";
	}
	
	searchUI.category.value = category;
	searchUI.requestSubmit();
})


// 페이지 버튼 클릭
function fnPaging(page) {
	let queryString = window.location.search + "";

	if (queryString.indexOf('F10') > -1) {
		// 만약 category queryString 이 있으면
		category = queryString.substr(queryString.indexOf("category") + 9, 4);
	} else {
		// category queryStirng 이 없으면
		category = "";
	}
	
	searchForm.category.value = category;
	searchForm.page.value = page;
	searchForm.requestSubmit();
}

// 조회수 증가
document.addEventListener("DOMContentLoaded", function() {
	const boardTitle = document.querySelectorAll(".boardTitle");
	boardTitle.forEach(title => {
		title.addEventListener("click", (e) => {
			let url = `/rest/board-vct/${e.target.dataset.title}`;
			fetch(url, {
				method: "put"
			}) // fetch 끝
		}) // click 이벤트 끝
	}) // forEach 끝

	const searchBtn = document.querySelector("#searchBtn");
}) // DOMContentLoaded 끝

