

/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자            수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 9. 30.     	임가영            최초 생성
 * 2025. 10. 8.			임가영			헤더 알림 영역에 알림 꽂아 넣는 로직 추가
 * 2025. 10. 13.		임가영			각 페이지 진입 시 권한 확인하는 로직 추가
 * </pre>
 */

// 권한 비교
document.addEventListener("DOMContentLoaded", () => {
	const username = window.username;
	if (username == null) return;
	if (policiesList == null) return;

	document.querySelectorAll("[data-feature-Id]").forEach(el => {
		const featureId = el.dataset.featureId;

		// featureId 가 나의 권한 목록에 속해있는지 확인
		if (featureId in policiesList) {
			//			el.style.display = '';
			// 만약 속해 있다면, boolean 값 꺼내보기
			if (!policiesList[featureId]) {
				el.setAttribute("data-bs-toggle", "tooltip");
				el.setAttribute("title", "접근 불가능한 기능");
				// 기존 브라우저 툴팁이 아니라 Bootstrap 스타일로 강제 초기화
				new bootstrap.Tooltip(el);

				// 만약 true 라면 권한 있음, false 면 권한 없음
				el.addEventListener("click", async (e) => {
					e.preventDefault();
					e.stopImmediatePropagation();

					const resp = await fetch(`/rest/comm-policies/${featureId}`);
					const data = await resp.json();

					const policiesDetailList = data.policiesDetailList;

					let code = "";
					code += policiesDetailList.map(policy => (
						policy.deptNm
					)).join(", ");
					code += " " + data.policiesDetailList[0].jbgdNm + " 이상만";
					code += " 접근 가능한 기능입니다";

					Swal.fire({
						icon: "info",
						title: "접근 권한이 없습니다",
						text: code,
					});
				})
			}
		}
	})
})

// 알림 읽음 여부 업데이트
const notificationButton = document.querySelector("#notificationIcon");
if (notificationButton != null) {
	notificationButton.addEventListener("click", async function() {
		const url = `/rest/alarm-log-list`;
		const resp = await fetch(url, { method: 'put' })
		const data = await resp.json();
		if (data.success) {
			console.log("알림 읽음 여부 업데이트 성공");
			// 로컬 스토리지 읽음 여부 전부 Y 로 변경
			let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
			notifications.forEach(n => n.readYn = 'Y');
			localStorage.setItem("notifications", JSON.stringify(notifications));

			const badge = document.getElementById('notificationBadge');
			if (badge) badge.remove();
		} else {
			console.log("알림 읽음 여부 업데이트 실패");
		}
	});

	// 알림 드롭다운 목록 가져오기
	notificationDropDown();
}


async function notificationDropDown() {
	const url = "/rest/alarm-log-top10";
	const resp = await fetch(url);
	const serverData = await resp.json();

	// 로컬 스토리지에 serverData 복제
	localStorage.setItem("notifications", JSON.stringify(serverData));

	// 알림 목록을 넣을 공간
	const notificationDiv = document.querySelector("#notification-div");

	let code = "";
	let badgeCount = 0;

	if (serverData.length == 0) {
		code = `<div class="notification-text ms-4">
					<p class="notification-subtitle font-thin text-sm">새로운 알림이 없습니다.</p>
				 </div>`;
	}

	serverData.forEach(alarm => {
		let alarmMessage = alarm.alarmMessage; // 알림 메시지
		let readYn = alarm.readYn; // 읽음 여부
		let createdDt = alarm.createdDt; // 알림 생성 날짜
		let alarmCategory = alarm.alarmCategory; // 알림 카테고리
		let relatedUrl = alarm.relatedUrl; // 바로가기 Url

		// 상대 시간 계산
		const timeAgo = getTimeAgo(createdDt);

		// 읽지 않은 알림 개수 카운트
		if (readYn == 'N') {
			badgeCount++;
		}

		// 읽지 않은 알림이면 배경색 클래스 추가
		const unreadClass = readYn === 'N' ? 'bg-unread' : '';

		let alarmColor;
		let alarmIcon;
		if (alarmCategory == "전자메일") {
			alarmColor = "var(--danger-color)";
			alarmIcon = "bi-envelope-arrow-down";
		} else if (alarmCategory == "전자결재") {
			alarmColor = "var(--primary-color)";
			alarmIcon = "bi-file-earmark-check";
		} else if (alarmCategory == "프로젝트 관리") {
			alarmColor = "var(--success-color)";
			alarmIcon = "bi-easel2";
		} else if (alarmCategory == "자유게시판") {
			alarmColor = "var(--warning-color)";
			alarmIcon = "bi-people-fill";
		} else {
			alarmColor = "var(--danger-color)";
			alarmIcon = "bi-at";
		}

		code += `<li class="dropdown-item notification-item ${unreadClass}">
					 <a class="d-flex align-items-center" href="${relatedUrl}">
						 <div class="notification-icon" style="background-color: ${alarmColor}">
			                <i class="bi ${alarmIcon}"></i>
			             </div>
						 <div class="notification-text ms-4">
						 	<p class="notification-title font-bold">${alarmMessage}</p>
						 	<p class="notification-subtitle font-thin text-sm">${timeAgo}</p>
						 </div>
					 </a>
				 </li>
				 `;
	})

	if (badgeCount != 0) {
		// 알림 뱃지 추가
		const notificationIcon = document.getElementById('notificationIcon');
		notificationIcon.insertAdjacentHTML(
			"beforeend",
			`<span class="badge badge-notification" style="background-color:var(--danger-color)" id="notificationBadge">${badgeCount}</span>`
		);
	}

	notificationDiv.innerHTML = code;
}

// 상대 시간 계산 함수
function getTimeAgo(dateString) {
	const now = new Date();
	const created = new Date(dateString);
	const diffMs = now - created;

	const diffMinutes = Math.floor(diffMs / 1000 / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMinutes < 1) return "방금 전";
	if (diffMinutes < 60) return `${diffMinutes}분 전`;
	if (diffHours < 24) return `${diffHours}시간 전`;
	if (diffDays === 1) return "어제";
	if (diffDays < 7) return `${diffDays}일 전`;

	// 7일 이상이면 날짜로 표시
	return created.toLocaleDateString("ko-KR", {
		month: "short",
		day: "numeric"
	});
}



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
window.showAlert = function(icon, alertMessage) {
	return Swal.fire({
		title: alertMessage,
		icon: icon,
		draggable: true
	});
};

// 함수를 전역으로 등록
window.showToast = function(icon, toastMessage) {
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