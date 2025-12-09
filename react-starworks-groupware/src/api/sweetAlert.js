
// 토스트 팝업
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

// Alert 창 함수
/* export const showAlert = function(icon, alertMessage) {
  return Swal.fire({
    title: alertMessage,
    icon: icon,
    draggable: true
  });
}; */
export const showAlert = function(icon, alertMessage, isConfirm = false) {
  if (isConfirm) {
    //확인/취소 버튼 있는 경고창 
    return Swal.fire({
      title: alertMessage,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "rgba(235, 89, 89, 1)",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      draggable: true
    });
  } else {
    // 일반 알림창
    return Swal.fire({
      title: alertMessage,
      icon: icon,
      draggable: true
    });
  }
};

// 함수를 전역으로 등록
export const showToast = function(icon, toastMessage) {
  // 기본 지원 아이콘일 때
  if (['success', 'error', 'warning', 'info', 'question'].includes(icon)) {
    Toast.fire({
      icon: icon,
      title: toastMessage
    })
  } 
  // 커스텀 아이콘일 때 (예: 휴지통)
  else if (icon === 'trash') {
    Toast.fire({
      iconHtml: '<i class="fa-solid fa-trash"></i>',
      title: toastMessage,
      customClass: {
        icon: 'no-border'
      }
    })
  }
}

// CSS (아이콘 테두리 제거 및 크기 조정)
const style = document.createElement('style');
style.innerHTML = `
  .swal2-icon.no-border {
    border: none !important;
  }
`;
document.head.appendChild(style);