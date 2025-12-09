/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 13.     	윤서현            최초 생성
 *
 * </pre>
 */

// SweetAlert2 확인창 함수
async function showConfirm(message) {
  return Swal.fire({
    title: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "추가하기",
    cancelButtonText: "취소",
    reverseButtons: true,
    focusCancel: true,
    confirmButtonColor: "#c2b6a2",
    cancelButtonColor: "#aaa"
  }).then(result => result.isConfirmed);
}

let currentSelectedData = null;
let uploadedFileId = null;

document.addEventListener("DOMContentLoaded", function() {

  var items = document.querySelectorAll(".list-group-item");

  if (items.length === 0) {
    console.warn(" .list-group-item 요소가 없습니다.");
  }

  items.forEach(function(item) {
    item.addEventListener("click", function(e) {
      e.preventDefault();

      items.forEach(function(i) { i.classList.remove("active"); });
      this.classList.add("active");

      var dataId = this.getAttribute("data-id");
      var nwmnSqn = dataId ? dataId.trim() : "";
      console.log("nwmnSqn:", nwmnSqn);

      if (!nwmnSqn) {
        //console.warn("data-id가 비어 있음");
        return;
      }

      var url = "/rest/product-newmenu/" + encodeURIComponent(nwmnSqn);
      console.log("요청 URL:", url);

      fetch(url)
        .then(function(res) {
          if (!res.ok) throw new Error(res.status);
          return res.json();
        })
        .then(function(data) {
          console.log("상세 데이터:", data);

          document.querySelector(".card-body h5").textContent =
            "[" + data.categoryNm + "] " + data.menuNm;

          var rows = document.querySelectorAll(".card-body .row.mb-3 .col-sm-9");
          rows[0].textContent = data.atrzDocId;
          rows[1].textContent = data.userNm;
          rows[2].textContent = data.releaseYmd;
          rows[3].textContent = data.categoryNm;
          rows[4].textContent = new Intl.NumberFormat().format(data.priceAmt) + "원";

          const marketingEl = document.getElementById("marketingContent");
          const ingredientEl = document.getElementById("ingredientContent");

          if (marketingEl) marketingEl.textContent = data.marketingContent || '';
          if (ingredientEl) ingredientEl.textContent = data.ingredientContent || '';

          //선택된 기안서 정보 저장
          currentSelectedData = data;
        })
        .catch(function(err) {
          console.error("상세조회 실패:", err);
        });
    });
  });
});


//메뉴추가 버튼 클릭시 이벤트
  const addBtn = document.querySelector("#menuModal .btn.btn-primary");
  addBtn.addEventListener("click", async function () {
    if (!currentSelectedData) {
      //alert("먼저 목록에서 기안서를 선택하세요.");
      showAlert("error", "먼저 목록에서 기안서를 선택하세요.");
      return;
    }

	//확인창 추가
	const confirmed  = await showConfirm("판매중인 상품에 추가하시겠습니까?");
	if(!confirmed) return;

    // form 가져오기
    const form = document.getElementById("menuForm");
    const formData = new FormData(form);

    formData.append("costRatioAmt", currentSelectedData.costRatioAmt);
    formData.append("releaseYmd", currentSelectedData.releaseYmd);
    formData.append("standardCd", currentSelectedData.standardCd);
    formData.append("ingredientContent", currentSelectedData.ingredientContent);

    // JSON 데이터도 함께 append (기안서 정보)
    /* formData.append("menuNm", currentSelectedData.menuNm);
    formData.append("categoryNm", currentSelectedData.categoryNm);
    formData.append("priceAmt", currentSelectedData.priceAmt);
    formData.append("marketingContent", currentSelectedData.marketingContent);
    formData.append("ingredientContent", currentSelectedData.ingredientContent);
    formData.append("releaseYmd", currentSelectedData.releaseYmd); */

    try {
      const res = await fetch("/rest/product-newmenu/add", {
        method: "POST",
        body: formData // multipart/form-data 자동 처리됨
      });

      const result = await res.text();
      if (result === "success") {
        //alert("메뉴 등록이 완료되었습니다!");
        showAlert("success", "메뉴 등록이 완료되었습니다!")

        bootstrap.Modal.getInstance(document.getElementById("menuModal")).hide();
      } else {
        alert("등록 실패: " + result);
      }
    } catch (err) {
      console.error("등록 요청 오류:", err);
      alert("서버 통신 중 오류가 발생했습니다.");
    }
  });





//모달에 데이터 채워넣기
const menuModal = document.getElementById("menuModal");
menuModal.addEventListener("show.bs.modal", function() {
  if (!currentSelectedData) {
    //alert("먼저 목록에서 기안서를 선택하세요.");
    showAlert("error", "먼저 목록에서 기안서를 선택하세요.")
    event.preventDefault();
    return;
  }

  //console.log("모달에 채울 데이터:", currentSelectedData);

  // 모달 input/textarea 찾기
  const inputs = menuModal.querySelectorAll("input.form-control");
  const textarea = menuModal.querySelector("textarea.form-control");

  // 순서: [0] 메뉴명, [1] 카테고리, [2] 가격
  if (inputs.length >= 3) {
    inputs[0].value = currentSelectedData.menuNm || '';
    inputs[1].value = currentSelectedData.categoryNm || '';
    inputs[2].value = currentSelectedData.priceAmt || '';
  }

  if (textarea) {
    textarea.value = currentSelectedData.marketingContent || '';
  }
});

//모달 닫힐 때 모든 입력 초기화
menuModal.addEventListener("hidden.bs.modal", function () {
  const inputs = menuModal.querySelectorAll("input.form-control");
  const textarea = menuModal.querySelector("textarea.form-control");
  const selects = menuModal.querySelectorAll("select.form-select");

  // 모든 input 비우기
  inputs.forEach(input => input.value = "");

  // textarea 비우기
  if (textarea) textarea.value = "";

  // select 초기화 (첫 번째 옵션으로)
  selects.forEach(select => select.selectedIndex = 0);

  // 선택된 이미지나 파일도 리셋하고 싶다면 (FilePond 사용 시)
  if (window.pond) {
    pond.removeFiles();
  }

  console.log("모달 입력값이 초기화되었습니다.");
});