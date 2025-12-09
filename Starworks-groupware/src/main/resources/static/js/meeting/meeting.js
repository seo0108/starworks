/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 22.     	임가영            최초 생성
 *
 * </pre>
 */
document.addEventListener("DOMContentLoaded", () => {
	const username = window.username;

	const recurringBookingModalEl = document.getElementById("recurring-booking-modal"); // 반복예약신청 모달
	const reservationModalEl = document.getElementById("reservation-modal"); // 일반 회의실예약 모달
	const reservationForm = document.getElementById("reservation-form");

	// 모달 인스턴스 가져오기 (Bootstrap 5 모달을 JS로 닫으려면 모달 인스턴스를 가져와야함)
	const reservationModal = bootstrap.Modal.getOrCreateInstance(reservationModalEl);

	// 모달 버튼 관련
	const cancelBtn = document.getElementById("cancel-btn"); // 예약 취소 버튼
	const modifyBtn = document.getElementById("modify-btn"); // 수정 버튼
	const submitBtn = document.getElementById("save-btn"); // 저장 버튼
	const myMeetingBtn = document.getElementById("my-meeting-btn"); // 나의 회의 추가 버튼

	reservationModalEl.addEventListener('show.bs.modal', async (e) => {
		// 모달 헤더 및 텍스트
		const modalHeader = document.querySelector(".modal-header");
		const modalHeaderTxt = document.querySelector(".modal-title");

		// 모달을 열은 버튼
		const reservationBtn = e.relatedTarget;
		const reservationId = reservationBtn.dataset.id;
		const reservationRoomId = reservationBtn.dataset.room; // 한 칸 눌렀을 때 roomId
		const reservationHour = reservationBtn.dataset.hour; // 한 칸 눌렀을 때 hour

		// hidden 값에 예약Id와 예약날짜 세팅
		const modalReservationId = document.getElementById("meeting-id");
		modalReservationId.value = (reservationId != null && reservationId !== 'undifined') ? reservationId : null;

		const modalTitle = document.getElementById("modal-title"); // 모달 제목
		const reservationTitle = document.getElementById("modal-meeting-title"); // 회의 제목
		const reservationUser = document.getElementById("modal-meeting-user") // 예약자명

		const reservationStart = document.getElementById("modal-start-time"); // 시작 시간
		const reservationEnd = document.getElementById("modal-end-time"); // 끝나는 시간

		const reservationMeetingDate = document.getElementById("meeting-date"); // 예약일

		// 모달 열고 라벨 변경을 위한 셀렉터
		const reservationUserLabel = reservationUser.previousElementSibling; // 예약자(사번입력) => 예약자로 라벨 변경

		// 예약된 회의를 눌렀다면
		if (reservationId != null && reservationId !== 'undefined') {
			// 예약 데이터 가져오기
			const resp = await fetch(`/rest/meeting/reservations/${reservationId}`);
			const data = await resp.json();

			// 예약 버튼 숨김
			submitBtn.hidden = true;
			// 나의 회의 추가 버튼 보임
			myMeetingBtn.hidden = false;
			// * 표시 숨김
			const dangerMark = reservationForm.querySelectorAll("span.text-danger");
			dangerMark.forEach(item => item.hidden = true);
			// 모달 헤더 색깔 바꿈
			modalHeader.classList.add("bg-custom", "white");
			modalHeaderTxt.classList.add("text-white");

			// 만약 내가 예약한 회의라면
			if (data.userId === `${username}`) {
				reservationUser.classList.add("readonly");

				if (selectedDay == today || selectedDay == null || selectedDay === '') {
					// 오늘 날짜에 예약된 회의가 맞는데
					// 예약한 시각보다 지나있다면
					if (`${currentHour}` > data.startTime) {
						console.log("📝 [회의실 예약 로그] : 내가 예약한 회의, 오늘 날짜에 예약된 회의, 예약한 시각 지남")

						console.log(infoMsg)
						infoMsg.innerHTML = '<i class="bi-info-circle"></i> 시작 시각이 지난 회의는 취소가 불가능합니다';
						// 회의실 못 바꾸게
						const radioBtns = reservationForm.querySelectorAll('input[type="radio"]');
						radioBtns.forEach(btn => {
							btn.classList.add('readonly'); // 시각적으로 비활성화 느낌;
						});
						// 시작시간 못 바꾸게
						reservationStart.readOnly = true;
						reservationStart.classList.add("readonly");
						modifyBtn.hidden = false;
					} else {
						// 예약 취소 및 수정 버튼 보임
						console.log("📝 [회의실 예약 로그] : 내가 예약한 회의, 오늘 날짜에 예약된 회의, 예약한 시각보다 전임")
						cancelBtn.hidden = false;
						modifyBtn.hidden = false;
					}

				} else {
					// 오늘 날짜에 예약된 회의가 아니라면
					console.log("📝 [회의실 예약 로그] : 내가 예약한 회의, 다른 날짜 예약")

					infoMsg.innerHTML = '<i class="bi-info-circle"></i> 시작 시각이 지난 회의는 취소가 불가능합니다';
					// 회의실 못 바꾸게
					const radioBtns = reservationForm.querySelectorAll('input[type="radio"]');
					radioBtns.forEach(btn => {
						btn.classList.add('readonly'); // 시각적으로 비활성화 느낌;
					});
					// 시작시간 못 바꾸게
					reservationStart.readOnly = true;
					reservationStart.classList.add("readonly");
					reservationEnd.readOnly = true;
					reservationEnd.classList.add("readonly");
					modifyBtn.hidden = false;
				}


			} else {
				// 내가 예약한 회의 아니라면 readonly-input 클래스 추가
				console.log("📝 [회의실 예약 로그] : 내가 예약하지 않은 회의")

				const inputTags = reservationForm.querySelectorAll('input:not([type="radio"])');
				inputTags.forEach(item => {
					item.readOnly = true
					item.classList.add("readonly-input");
				});
				const radioBtns = reservationForm.querySelectorAll('input[type="radio"]');
				radioBtns.forEach(btn => btn.disabled = true);
			}

			// 라벨명 변경
			modalTitle.textContent = "예약 상세조회";
			reservationUserLabel.textContent = "예약자";

			// 회의실 라디오 버튼 선택
			const reservationRoom = document.getElementById(`modal-room-${data.roomId}`);

			// 예약 데이터로 모달 세팅
			reservationRoom.checked = true;
			reservationTitle.value = data.title;
			reservationUser.value = data.userId;
			reservationStart.value = data.startTime;
			reservationEnd.value = data.endTime;
			reservationMeetingDate.value = data.meetingDate;

			reservationCancle(cancelBtn, reservationId);
		} else {
			// 새 예약 버튼을 눌렀다면

			// 한 칸 눌렀다면
			if (reservationRoomId != null && reservationRoomId !== 'undefined') {
				reservationStart.value = parseInt(reservationHour);
				reservationEnd.value = parseInt(reservationHour) + 1;

				const reservationRoom = document.getElementById(`modal-room-${reservationRoomId}`);
				reservationRoom.checked = true;
			}

			// 라벨명 변경
			modalTitle.textContent = "새 예약";
			reservationUserLabel.innerHTML = "예약자 (사번 입력) <span class='text-danger'>*</span>";

			submitBtn.hidden = false;
		}
	}); // 모달이 열릴 때 끝

	// 모달이 닫힐 때..
	reservationModalEl.addEventListener('hidden.bs.modal', async () => {
		const modalHeader = document.querySelector(".modal-header");
		const modalHeaderTxt = document.querySelector(".modal-title");

		const cancelBtn = document.getElementById("cancel-btn"); // 예약 취소 버튼
		const modifyBtn = document.getElementById("modify-btn"); // 수정 버튼
		const myMeetingBtn = document.getElementById("my-meeting-btn"); // 나의 회의 추가 버튼

		reservationForm.reset(); // 폼 리셋
		cancelBtn.hidden = true; // 취소버튼 숨기기
		modifyBtn.hidden = true; // 수정버튼 숨기기
		myMeetingBtn.hidden = true; // 내회의추가버튼 숨기기

		// readOnly 속성 지우기
		const inputTags = reservationForm.querySelectorAll("input:not(#modal-meeting-user)");
		inputTags.forEach(item => {
			item.readOnly = false
			item.classList.remove("readonly");
			item.classList.remove("readonly-input");
		});
		const radioBtns = reservationForm.querySelectorAll('input[type="radio"]');
		radioBtns.forEach(btn => {
			btn.disabled = false;
			btn.classList.remove("readonly");
		});
		const dangerMark = reservationForm.querySelectorAll("span.text-danger"); // * 표시
		dangerMark.forEach(item => item.hidden = false);
		const reservationUser = document.getElementById("modal-meeting-user") // 예약자명
		reservationUser.classList.remove("readonly");
		// 시간 지나면 취소 불가능하다는 텍스트 삭제
		infoMsg.innerHTML = "";
		// 모달 헤더 색깔 바꿈
		modalHeader.classList.remove("bg-custom", "white");
		modalHeaderTxt.classList.remove("text-white");
	}); // 모달이 닫힐 때 끝

	// 회의실 예약 폼을 제출할 때
	reservationForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const newReservation = Object.fromEntries(formData.entries());

		try {
			const resp = await fetch("/rest/meeting", {
				method: 'post',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newReservation)
			});
			const data = await resp.json();

			if (data.success) {
				// 모달 닫기
				appendReservationToList(data.reservation);
				if (reservationModal) reservationModal.hide();
				showToast("success", "회의실이 예약되었습니다.");

			} else {
				// 실패했을경우..
				let message = "";
				// Object.values() 를 사용하면 객체의 value만 배열로 변환가능
				(data.errors != null) ? message = Object.values(data.errors)[0] : message = data.message;
				showToast("info", message);
			}
		} catch (err) {
			showToast("error", "회의실 예약 중 오류가 발생했습니다.");
		}
	}); // 회의 예약 폼 제출 이벤트 끝

	// 회의실 예약 폼을 제출할 때 사용
	const timelineDiv = document.querySelector(".timeline-wrapper");
	const appendReservationToList = (newReservation) => {
		//<!-- 회의 시작 시각에 따라 reservation-bar 시작 지점 구하기 -->
		const leftStartTime = (newReservation.startTime % 9) * 10.1;
		//<!-- 회의 시간에 따라 reservation-bar 너비 구하기 -->
		const widthHour = (newReservation.endTime - newReservation.startTime) * 10;
		const topPx = 22 + newReservation.rnum * 67;

		const div = document.createElement("div");
		div.className = `reservation-bar ${newReservation.userId == username ? "is-mine" : "bg-light"}`;
		div.dataset.id = newReservation.reservationId;

		// Bootstrap 모달 트리거 속성 (data- 속성 직접 설정)
		div.setAttribute("data-bs-toggle", "modal");
		div.setAttribute("data-bs-target", "#reservation-modal");

		// 스타일 적용
		div.style.top = `${topPx}px`;
		div.style.left = `calc(9%  + ${leftStartTime}%)`;
		div.style.width = `calc(${widthHour}%)`;

		div.textContent = `${newReservation.title} (${newReservation.startTime}:00-${newReservation.endTime}:00)`;

		timelineDiv.appendChild(div);
	}

	// 회의실 예약 정보를 수정할 때
	modifyBtn.addEventListener("click", async () => {
		const formData = new FormData(reservationForm);
		const modifyReservation = Object.fromEntries(formData.entries());

		try {
			const resp = await fetch("/rest/meeting", {
				method: "put",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(modifyReservation)
			});

			const data = await resp.json();

			if (data.success) {
				// 모달 닫기
				modifyReservationToList(data.reservation);
				if (reservationModal) reservationModal.hide();
				showToast("success", "예약 정보가 수정되었습니다.");
			} else {
				showToast("info", data.message);
			}
		} catch (err) {
			showToast("error", "잘못된 값을 입력하였습니다.");
		}

	}); // 회의실 예약 정보 수정 끝

	// 회의실 예약 정보 수정할 때 사용
	const modifyReservationToList = (modifyReservation) => {
		const bar = document.querySelector(`.reservation-bar[data-id="${modifyReservation.reservationId}"]`);
		if (bar) bar.remove();

		//<!-- 회의 시작 시각에 따라 reservation-bar 시작 지점 구하기 -->
		const leftStartTime = (modifyReservation.startTime % 9) * 10.1;
		//<!-- 회의 시간에 따라 reservation-bar 너비 구하기 -->
		const widthHour = (modifyReservation.endTime - modifyReservation.startTime) * 10;
		const topPx = 22 + modifyReservation.rnum * 67;

		const div = document.createElement("div");
		div.className = `reservation-bar ${modifyReservation.userId == username ? "is-mine" : "bg-light"}`;
		div.dataset.id = modifyReservation.reservationId;

		// Bootstrap 모달 트리거 속성 (data- 속성 직접 설정)
		div.setAttribute("data-bs-toggle", "modal");
		div.setAttribute("data-bs-target", "#reservation-modal");

		// 스타일 적용
		div.style.top = `${topPx}px`;
		div.style.left = `calc(9% + ${leftStartTime}%)`;
		div.style.width = `calc(${widthHour}%)`;

		div.textContent = `${modifyReservation.title} (${modifyReservation.startTime}:00-${modifyReservation.endTime}:00)`;

		timelineDiv.appendChild(div);
	}

	// 나의 회의에 추가를 눌렀을 때
	myMeetingBtn.addEventListener("click", async () => {
		const reservationTitle = document.getElementById("modal-meeting-title"); // 회의 제목
		const reservationMeetingDate = document.getElementById("meeting-date"); // 예약일

		try {
			const resp = await fetch("/rest/meeting-memo", {
				method: "post",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ "title": reservationTitle.value, "crtDt": reservationMeetingDate.value })
			});

			const data = await resp.json();

			if (data.success) {
				// 모달 닫기
				appendMemoToList(data.memo); // 새 메모를 메모리스트에 추가하는 함수
				if (reservationModal) reservationModal.hide();
				showToast("success", "나의 회의에 추가되었습니다.");
			} else {
				showToast("error", "회의 추가에 실패했습니다.");
			}
		} catch (err) {
			showToast("error", "추가 도중 에러가 발생했습니다.");
		}
	}); // 나의 회의에 추가를 눌렀을 때 끝

	// 회의실 예약 취소 함수 (모달에서 한 번 더 호출)
	const reservationCancle = (cancelBtn, reservationId) => {
		cancelBtn.addEventListener("click", () => {
			Swal.fire({
				title: "회의실 예약을 취소하시겠습니까?",
				icon: "warning",
				reverseButtons: true,
				showCancelButton: true,
				confirmButtonColor: "#d33",
				cancelButtonColor: "#6e7881",
				confirmButtonText: "취소하기",
				cancelButtonText: "아니오"
			}).then((result) => {
				if (result.isConfirmed) {
					fetch(`/rest/meeting/${reservationId}`, {
						method: "delete",
						headers: {
							"Content-Type": "application/json"
						}
					})
						.then(resp => resp.json())
						.then(data => {
							if (data.success) {
								reservationModal.hide();
								showToast("info", "회의실 예약이 취소되었습니다.");
								const bar = document.querySelector(`.reservation-bar[data-id="${reservationId}"]`);
								if (bar) bar.remove();
							} else {
								showToast("error", "회의실 예약 취소에 실패했습니다");
							}
						});
				} // sweetAlert 확인 버튼 누른 후 로직 끝
			})
		});
	} // 회의실 예약 취소 함수 끝

	//////////////////////////////////// 메모 관련 ////////////////////////////////////
	const memoContainer = document.getElementById("memo-container");
	// 이벤트 위임
	memoContainer.addEventListener("click", (e) => {
		// 선택한 메모 카드 가져옴
		const memoCard = e.target.closest('.memo-card');

		if (e.target.closest('#new-memo-btn')) {
			handleNewMemo();
			return;
		}

		if (e.target.closest('.delete-note') && memoCard) {
			const memoId = memoCard.dataset.memoid;
			handleDelMemo(memoCard, memoId);
		}
	}); // 클릭 이벤트 위임 끝

	memoContainer.addEventListener("dblclick", (e) => {
		// 선택한 메모 카드 가져옴
		const memoCard = e.target.closest('.memo-card');

		if (e.target.closest('.editable') && memoCard) {
			const memoId = memoCard.dataset.memoid;
			handleEditMemo(e.target.closest('.editable'), memoId);
		}
	}); // 더블 이벤트 위임 끝

	// 메모 삭제
	const handleDelMemo = (memoCard, memoId) => {
		Swal.fire({
			title: "메모를 삭제하시겠습니까?",
			icon: "info",
			reverseButtons: true,
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#6e7881",
			confirmButtonText: "삭제하기",
			cancelButtonText: "아니오"
		}).then((result) => {
			if (result.isConfirmed) {
				fetch(`/rest/meeting-memo/${memoId}`, { method: "delete" })
					.then(resp => resp.json())
					.then(data => {
						if (data.success) {
							memoCard.style.transition = 'all 0.3s ease';
							memoCard.style.opacity = '0';
							memoCard.style.transform = 'scale(0.95)';
							setTimeout(() => memoCard.remove(), 300);

							showToast("trash", "메모가 삭제되었습니다.");
						} else {
							showToast("error", "메모 삭제에 실패했습니다.");
						}
					});
			};
		}) // sweetAlert 확인 버튼 누른 후 로직 끝
	}

	// 메모 등록
	const handleNewMemo = async () => {
		try {
			const resp = await fetch('/rest/meeting-memo', {
				method: 'POST'
			});

			if (!resp.ok) {
				showToast("error", "메모 생성에 실패했습니다.");
				return;
			}

			const data = await resp.json();

			if (data.success) {
				appendMemoToList(data.memo); // 새 메모를 메모리스트에 추가하는 함수
			} else {
				showToast('error', '메모 생성 중 오류가 발생했습니다.');
				return;
			}

		} catch (err) {
			showToast("error", "메모 생성 중 오류가 발생했습니다.")
		}
	}

	// 메모 리스트에 메모 추가하는 함수 (메모 등록 handleNewMemo 에서 사용)
	const appendMemoToList = (newMemo) => {
		const memolistRow = document.getElementById("memolist-row");

		// 새 메모를 메모리스트에 추가하는 함수
		const code = `<div class="col-lg-3 col-md-6 mb-4 memo-card" data-memoid="${newMemo.memoId}">
					<div class="card meeting-note-card h-100 category-work">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="editable title">${newMemo.title}</h5>
									<p class="card-subtitle mb-2">
										<span class="editable date">${newMemo.crtDt}</span>
									</p>
								</div>
								<div class="dropdown">
									<a href="#" data-bs-toggle="dropdown" aria-expanded="false"
										class="btn btn-sm btn-light-secondary icon rounded-pill">
										<i class="bi bi-three-dots-vertical"></i>
									</a>
									<div class="dropdown-menu dropdown-menu border">
										 <button class="dropdown-item text-danger delete-note">
										 	<i class="bi bi-trash-fill me-2"></i>삭제
										 </button>
									</div>
								</div>
							</div>
							<p class="card-text memo-snippet editable contents ${newMemo.contents ? '' : 'fs-6 text-muted'}">${newMemo.contents ?? "본문을 더블클릭하여 내용을 입력하세요."}</p>
						</div>
					</div>
				</div>`;

		memolistRow.insertAdjacentHTML("afterbegin", code);
	}

	// 메모 수정
	const handleEditMemo = (el, memoId) => {
		// 이미 input, textarea 라면 중복 방지
		if (el.querySelector('input, textarea')) return;

		// 현재 텍스트를 가져온다
		const currentText = el.innerText.trim();
		let input;

		if (el.classList.contains("contents")) {
			// 메모 내용 칸이면 textarea 태그 생성
			input = document.createElement('textarea');
			input.rows = 5; // 높이? 설정? 너비??
		} else if (el.classList.contains("title")) {
			// 제목 칸이면 input type=text 태그 생성
			input = document.createElement('input');
			input.type = 'text';
		} else {
			// 날짜 칸이면 input type=date 태그 생성
			input = document.createElement('input');
			input.type = 'date';
		}

		// 새로 만든 태그에 현재 내용 삽입 -> 새로 만든 태그 div 안에 추가
		input.value = currentText;
		input.className = 'form-control';
		el.innerHTML = ''; // 기존 텍스트는 제거
		el.appendChild(input); // 원래 div 에 input 태그 추가
		input.focus();

		const type = el.classList.contains("contents") ? "contents" :
			el.classList.contains("title") ? "title" : "crtDt"; //** 이거 그대로 body 의 key 에 [type]으로 못 씀

		// 메모 수정 함수
		const saveChange = async () => {
			// 새로 입력한 텍스트 가져오기
			const newValue = input.value.trim() || '(내용 없음)';
			el.innerHTML = newValue;

			// memoId 가져오기
			// 수정할 body 생성
			const bodyData = {
				"memoId": `${memoId}`,
				[type]: newValue
			}

			// 서버에 수정 내용 저장
			const resp = await fetch(`/rest/meeting-memo/${memoId}`, {
				method: "put",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(bodyData)
			});
			const data = await resp.json();

		};

		// input 태그에 blur 라는 이벤트리스너를 준다..? (blur -> 포커스아웃 이벤트)
		input.addEventListener('blur', saveChange);
		// input 태그에 키보드 이벤트리스너 추가. 만약 Enter 입력 시, 그리고 class 에 contents 가 없으면..? <- (줄바꿈할 때 엔터 칠 수 있어서)
		input.addEventListener('keypress', e => {
			if (e.key === 'Enter' && !el.classList.contains('contents')) {
				e.preventDefault();
				saveChange();
			}
		})
	}

	//////////////////////////////////// 날짜 선택 관련 ////////////////////////////////////
	const dateBtn = document.getElementById("date-picker-btn");
	const dateInput = document.getElementById("date-picker");

	// 달력 버튼 클릭 시
	dateBtn.addEventListener("click", () => {
		dateInput.showPicker(); // Chrome, Edge, Safari 등 지원
	});

	// 날짜 선택 완료 시
	dateInput.addEventListener("change", (e) => {
		const selectedDate = dateInput.value;

		window.location = `/meeting/main?day=${selectedDate}`
	});

	//////////////////////////////////// 메모 검색 관련 ////////////////////////////////////
	let debounceTimer;
	memoSearchInput.addEventListener("keyup", (e) => { // 키보드에서 손 뗄 때 이벤트를 준다!!
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout( async() => {	// 0.5 초마다 이벤트.. setTimeout( () => {실행할 내용}, 반복할 초)
			// DB에서 정보 요청
			let searchWord = e.target.value.trim();
			const resp = await fetch(`/rest/meeting-memo?searchWord=${searchWord}`);
			const data = await resp.json();

			console.log("검색: ", data);
			const memolistRow = document.getElementById("memolist-row");

			memolistRow.innerHTML = "";
			const memoList = data.memoList;

			let code = "";
			memoList.forEach((memo) => {
				code += `<div class="col-lg-3 col-md-6 mb-4 memo-card" data-memoid="${memo.memoId}">
						<div class="card meeting-note-card h-100 category-work">
							<div class="card-body">
								<div class="d-flex justify-content-between align-items-start">
									<div>
										<h5 class="editable title">${memo.title}</h5>
										<p class="card-subtitle mb-2">
											<span class="editable date">${memo.crtDt}</span>
										</p>
									</div>
									<div class="dropdown">
										<a href="#" data-bs-toggle="dropdown" aria-expanded="false"
											class="btn btn-sm btn-light-secondary icon rounded-pill">
											<i class="bi bi-three-dots-vertical"></i>
										</a>
										<div class="dropdown-menu dropdown-menu border">
											 <button class="dropdown-item text-danger delete-note">
											 	<i class="bi bi-trash-fill me-2"></i>삭제
											 </button>
										</div>
									</div>
								</div>
								<p class="card-text memo-snippet editable contents ${memo.contents ? '' : 'fs-6 text-muted'}">${memo.contents ?? "본문을 더블클릭하여 내용을 입력하세요."}</p>
							</div>
						</div>
					</div>`;
			});
			if (code === '') {
				code = `<div class="col-lg col-md mb-5 mt-5"
							style="width: 100%; text-align: center; min-height:100px">
							<span> 검색 결과가 없습니다.
							</span>
						</div>`
			}
			memolistRow.insertAdjacentHTML("afterbegin", code);
		}, 500);

		// debounce 기법을 활용한 검색 (Debounce : 짧은 시간 안에 연속해서 발생하는 이벤트를 마지막 한 번만 실행되도록 지연시키는 기법)
	});
	//////////////////////////////////// 메모 검색 관련 끝 ////////////////////////////////////

	//////////////////////////////////// 날짜 선택 제어 시작 ////////////////////////////////////
	// 모달이 닫힐 때 폼 초기화
	recurringBookingModalEl.addEventListener("hidden.bs.modal", () => {
		const infoAlert = document.getElementById("modal-info"); // 'n 일/주/달 마다 반복' 한다는 ui 창
		infoAlert.innerHTML = `<i class="bi bi-star"></i> 빈도와 주기를 입력하면 반복 예약 안내가 나타납니다.`;

		const recurringBookingForm = document.getElementById("recurring-booking-form"); // 반복예약 신청 폼
		recurringBookingForm.reset();
	});


	recurringBookingModalEl.addEventListener("show.bs.modal", () => {
		// 달력에 이전 날짜 선택할 수 없도록..
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const minDate = tomorrow.toISOString().split('T')[0];
		const startInput = document.getElementById('modal-start-date');
		const endInput = document.getElementById('modal-end-date');

		// info 내용 변경하기 위해..
		const frequencySelect = document.getElementById("modal-frequency"); // 반복빈도 선택창
		const intervalInput = document.getElementById("modal-interval"); // 반복주기 입력창
		const infoAlert = document.getElementById("modal-info"); // 'n 일/주/달 마다 반복' 한다는 ui 창

		const weekCheckDiv = document.getElementById("modal-week-check"); // 요일 선택 칸

		const weekChecks = document.querySelectorAll("[name='weekCheck']");

		startInput.min = minDate;
		endInput.min = minDate;

		startInput.addEventListener('change', () => {
			endInput.min = startInput.value;
		});

		// 반복주기 입력창에 값이 들어갈 때마다
		intervalInput.addEventListener("keyup", () => {
			let interval = intervalInput.value;
			let frequency = frequencySelect.value;
			frequency = frequency == 'day' ? '일' : '주';

			if (frequencySelect.value == 'day') {
				infoAlert.innerHTML = `<i class="bi bi-star"></i> ${interval}${frequency}마다 회의실을 예약합니다.`;
			} else {
				const weekCheckeds = document.querySelectorAll("[name='weekCheck']:checked");
				let code = "";
				weekCheckeds.forEach((checked) => {
					code += "[" + checked.nextElementSibling.textContent + "]";
				});

				if (code != null && code !== "" ) {
					infoAlert.innerHTML = `<i class="bi bi-star"></i> ${interval}${frequency}마다 ${code}요일에 회의실을 예약합니다.`;
				}
			}

			if(intervalInput.value == null || intervalInput.value === "") {
				infoAlert.innerHTML = `<i class="bi bi-star"></i> 빈도와 주기를 선택하면 반복 예약 안내가 나타납니다.`;
			}

		});

		// 요일check 가 변경될 때마다
		weekChecks.forEach((checkbox) => {
			checkbox.addEventListener("change", (e) => {
				let interval = intervalInput.value;
				let frequency = frequencySelect.value;
				frequency = frequency == 'day' ? '일' : '주';

				const weekCheckeds = document.querySelectorAll("[name='weekCheck']:checked");
				let code = "";
				weekCheckeds.forEach((checked) => {
					code += "[" + checked.nextElementSibling.textContent + "]";
				});

				if (interval != null && interval !== "" ) {
					infoAlert.innerHTML = `<i class="bi bi-star"></i> ${interval}${frequency}마다 ${code}요일에 회의실을 예약합니다.`;
				}

				if(code == null || code === '') {
					infoAlert.innerHTML = `<i class="bi bi-star"></i> 빈도와 주기를 입력하면 반복 예약 안내가 나타납니다.`;
				}

			});
		});

		// 반복빈도가 변경될때마다
		frequencySelect.addEventListener("change", () => {
			let interval = intervalInput.value;
			let frequency = frequencySelect.value;
			frequency = frequency == 'day' ? '일' : '주';

			infoAlert.innerHTML = `<i class="bi bi-star"></i> 빈도와 주기를 입력하면 반복 예약 안내가 나타납니다.`;
			const weekCheckeds = document.querySelectorAll("[name='weekCheck']:checked");
			let code = "";
			weekCheckeds.forEach((checked) => {
				checked.checked = false;
			});


			if (frequencySelect.value == 'day') {
				infoAlert.innerHTML = `<i class="bi bi-star"></i> ${interval}${frequency}마다 회의실을 예약합니다.`;
			} else {
				const weekCheckeds = document.querySelectorAll("[name='weekCheck']:checked");
				let code = "";
				weekCheckeds.forEach((checked) => {
					code += "[" + checked.nextElementSibling.textContent + "]";
				});

				if (code != null && code !== "" && interval != null && interval !== "") {
					infoAlert.innerHTML = `<i class="bi bi-star"></i> ${interval}${frequency}마다 ${code}요일에 회의실을 예약합니다.`;
				}
			}

			if(intervalInput.value == null || intervalInput.value === "") infoAlert.innerHTML = `<i class="bi bi-star"></i> 빈도와 주기를 입력하면 반복 예약 안내가 나타납니다.`;

			if(frequencySelect.value == "week") {
				weekCheckDiv.hidden = false;
			} else {
				weekCheckDiv.hidden = true;
			}
		});
	});

	const recurringBookingForm = document.getElementById("recurring-booking-form"); // 반복예약 신청 폼

	// 반복 예약 신청 폼 제출
	recurringBookingForm.addEventListener("submit", async(e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const newRecurringBooking = Object.fromEntries(formData.entries());

		const weekCheckeds = document.querySelectorAll("[name='weekCheck']:checked");
		const weekCheckList = [];
		weekCheckeds.forEach((checked) => {
			weekCheckList.push(checked.value);
		});

		// 만들어진 newRecurringBooking 객체에 weekCheckList 요소 추가
		newRecurringBooking.weekCheckList = weekCheckList;

		const resp =  await fetch("/rest/meeting-recurring-booking", {
						method : "post",
						headers : {
							"Content-Type" : "application/json"
						},
						body : JSON.stringify(newRecurringBooking)
					});
		const data = await resp.json();

		try {
			if(data.success) {
				// 모달 인스턴스 가져오기 (Bootstrap 5 모달을 JS로 닫으려면 모달 인스턴스를 가져와야함)
				const recurringBookingModal = bootstrap.Modal.getOrCreateInstance(recurringBookingModalEl);
				// 모달 닫기
				if (recurringBookingModal) recurringBookingModal.hide();
				showToast("success", "반복 예약이 신청되었습니다.");
			} else {
				showToast("info", "반복 예약에 실패했습니다.");
			}
		} catch (err) {
			showToast("error", "반복 예약 신청 중 오류가 발생했습니다.");
		};

	});

}); // DOMContentLoaded 끝




//////////////// 버튼 누르면 자동 값 입력 ///////////////////////
document.getElementById("recurring-booking-modal-title").addEventListener("click", function () {

    // 회의실 선택 (예: 첫 번째 회의실)
    const firstRoom = document.querySelector("#recurring-booking-modal-room-ROOM01");
    if (firstRoom) firstRoom.checked = true;

    // 날짜 (오늘~7일 후)
// 내일부터 한 달 뒤
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1); // 내일

const oneMonthLater = new Date(tomorrow);
oneMonthLater.setMonth(tomorrow.getMonth() + 1); // 내일 기준 한 달 뒤

// YYYY-MM-DD 형식으로 변환
const formatDate = (date) => date.toISOString().split("T")[0];

document.getElementById("modal-start-date").value = formatDate(tomorrow);
document.getElementById("modal-end-date").value = formatDate(oneMonthLater);

    // 시간
    document.getElementById("recurring-booking-modal-start-time").value = 9;
    document.getElementById("recurring-booking-modal-end-time").value = 11;

    // 회의명 자동 세팅
    document.getElementById("recurring-booking-modal-meeting-title").value = "제품개발팀 아침회의";
});
