/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자           수정내용
 *  -----------   -------------    ---------------------------
 * 2025. 10. 13.     장어진            최초 생성
 * 2025. 10. 27.     수정됨            근무 상태 색상 및 캘린더 요일 추가
 *
 * </pre>
 */
const currentTime = document.getElementById('current-time');
const userId = document.getElementById('hiddenUserId');

const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const workingBtn = document.getElementById('working-btn');
const absenceBtn = document.getElementById('absence-btn');

const attendanceRecord = document.querySelector('#attendance-record tbody');
const currentWorkingStatus = document.getElementById('current-working-status')

const regularBar = document.getElementById('regularBar');
const overtimeBar = document.getElementById('overtimeBar');

const CalendarEl = document.getElementById('calendar');

const projectColors = [
	'#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#16a085', '#d35400'
];

document.addEventListener("DOMContentLoaded", async () => {
	setInterval(updateTime, 1000);
	updateTime();

	await initializeAttendanceSystem();
	await getWeekAttendance();
	await getMonthAttendance();
	await getVacationDays();

	//-------------------- Calendaer --------------------//
	const projectColorMap = new Map();
	const fetchEvents = async function(fetchInfo, successCallback, failureCallback) {
		try {
			// 두 API를 동시에 호출
			const [teamData, deptData] = await Promise.all([
				fetch(`/rest/fullcalendar-team/events`).then(handleResponse),
				fetch(`/rest/fullcalendar-dept`).then(handleResponse)
			]);

			// 두 데이터 병합
			const allData = [...teamData, ...deptData];

			// eventId 기준으로 중복 제거
			const uniqueEventsMap = new Map();
			allData.forEach(eventData => {
				if (!uniqueEventsMap.has(eventData.eventId)) {
					uniqueEventsMap.set(eventData.eventId, eventData);
				}
			});

			// 중복 제거된 데이터를 변환
			const allTransformedEvents = Array.from(uniqueEventsMap.values()).flatMap(eventData => {
				const eventType = eventData.eventType;
				let color = '#34495e';

				if (eventType === 'project') {
					const bizId = eventData.bizId;
					if (!projectColorMap.has(bizId)) {
						const colorIndex = projectColorMap.size % projectColors.length;
						projectColorMap.set(bizId, projectColors[colorIndex]);
					}
					color = projectColorMap.get(bizId);
				}
				else if (eventType === 'main_task') {
					const bizId = eventData.bizId;
					color = projectColorMap.get(bizId) || '#8599a6';
				}
				else if (eventType === 'department') color = '#3498db';
				else if (eventType === 'personal') color = '#2ecc71';
				else if (eventType === 'businesstrip') color = '#e74c3c';
				else if (eventType === 'vacation') color = '#f1c40f';

				const isAllDay = eventData.allday === 'Y';
				const parsedStart = parseDateAsKST(eventData.startDt);
				let parsedEnd = eventData.endDt ? parseDateAsKST(eventData.endDt) : null;

				if (isAllDay && parsedEnd) {
					let exclusiveEnd = new Date(parsedEnd);
					exclusiveEnd.setDate(exclusiveEnd.getDate() + 1);
					exclusiveEnd.setHours(0, 0, 0, 0);
					parsedEnd = exclusiveEnd;
				}

				let priority;
				switch (eventType) {
					case 'project': priority = 1; break;
					case 'main_task': priority = 2; break;
					case 'department': priority = 2; break;
					case 'businesstrip': priority = 3; break;
					case 'vacation': priority = 3; break;
					case 'personal': priority = 4; break;
					default: priority = 5;
				}

				// 프로젝트 타입: 시작/종료 마커 생성
				if (eventType === 'project' && parsedStart && parsedEnd) {
					const startEvent = {
						id: eventData.eventId + '_start',
						title: '시작 : ' + eventData.title,
						start: parsedStart,
						allDay: true,
						extendedProps: {
							type: eventType,
							description: eventData.description,
							userNm: eventData.userNm,
							originalData: eventData,
							priority: priority,
							isProjectMarker: true,
							projectId: eventData.bizId
						},
						borderColor: color,
						backgroundColor: color
					};

					const endEvent = {
						id: eventData.eventId + '_end',
						title: '종료 : ' + eventData.title,
						start: parsedEnd,
						allDay: true,
						extendedProps: {
							type: eventType,
							description: eventData.description,
							userNm: eventData.userNm,
							originalData: eventData,
							priority: priority,
							isProjectMarker: true,
							projectId: eventData.bizId
						},
						borderColor: color,
						backgroundColor: color
					};
					return [startEvent, endEvent];
				}

				// 다른 타입은 일반 이벤트로 반환
				return {
					id: eventData.eventId,
					title: eventData.title,
					start: parsedStart,
					end: parsedEnd,
					allDay: isAllDay,
					extendedProps: {
						type: eventType,
						description: eventData.description,
						userNm: eventData.userNm,
						originalData: eventData,
						priority: priority
					},
					borderColor: color,
					backgroundColor: color
				};
			});

			successCallback(allTransformedEvents);
		} catch (error) {
			handleError(error);
			if (failureCallback) failureCallback(error);
		}
	};

	const calendar = new FullCalendar.Calendar(CalendarEl, {
		locale: 'ko',
		initialView: 'listDay',
		headerToolbar: {
			left: '',
			center: 'title',
			right: ''
		},
		height: 350, // 높이 고정
		events: fetchEvents,
		noEventsContent: '오늘 일정이 없습니다.',
		eventContent: function(arg) {
			const event = arg.event;
			const title = `<div style="font-weight: bold; margin-top: 5px;">${event.title}</div>`;

			let timeHtml;
			if (event.allDay) {
				timeHtml = '<div>하루 종일</div>';
			} else {
				const startTime = event.start.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: false });
				const endTime = event.end ? event.end.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: false }) : '';

				if (endTime && startTime !== endTime) {
					timeHtml = `<div>${startTime} ~ ${endTime}</div>`;
				} else {
					timeHtml = `<div>${startTime}</div>`;
				}
			}

			const timeContainer = `<div style="font-size: 0.9em; color: #6c757d;">${timeHtml}</div>`;

			return { html: timeContainer + title };
		}
	});
	calendar.render();

	// 캘린더 렌더 후 제목에 요일 추가
	updateCalendarTitleWithDay();
});

// 캘린더 제목에 요일 추가 함수
function updateCalendarTitleWithDay() {
	const titleElement = document.querySelector('#calendar .fc-toolbar-title');
	if (titleElement) {
		const currentDate = new Date();
		const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
		const dayOfWeek = days[currentDate.getDay()];

		// 기존 텍스트가 이미 요일을 포함하고 있지 않으면 추가
		if (!titleElement.textContent.includes('요일')) {
			titleElement.textContent = titleElement.textContent + ` (${dayOfWeek})`;
		}
	}
}

// 근무 상태 업데이트 함수 (색상 클래스 적용)
function updateWorkingStatus(statusText, statusClass) {
	currentWorkingStatus.innerHTML = statusText;
	currentWorkingStatus.className = ''; // 기존 클래스 제거
	if (statusClass) {
		currentWorkingStatus.classList.add(statusClass);
	}
}

startBtn.addEventListener("click", async () => {
	try {
		await createTAA();
		await Promise.all([
			readTAAList(),
			readLatestWS()
		]);
		updateButtonState('working');
	} catch (error) {
		showAlert('error', '출근 처리 중 오류가 발생했습니다.' + error);
	}
})

endBtn.addEventListener("click", async () => {
	try {
		await modifyTAA();
		await Promise.all([
			readTAAList(),
			readLatestWS()
		]);

		// 퇴근 후에도 당일이면 퇴근 버튼 유지
		updateButtonState('end-only');
		updateWorkingStatus('퇴근 완료', 'status-absent');

		showAlert('success', '퇴근 시간이 기록되었습니다. 당일 중 다시 수정 가능합니다.');
	} catch (error) {
		showAlert('error', '퇴근 처리 중 오류가 발생했습니다.' + error);
	}
})

workingBtn.addEventListener("click", async () => {
	try {
		await changeToWorking();
		await readLatestWS();
		updateButtonState('working');
	} catch (error) {
		showAlert('error', '복귀 처리 중 오류가 발생했습니다.' + error);
	}
})

absenceBtn.addEventListener("click", async () => {
	try {
		await changeToAbsence();
		await readLatestWS();
		updateButtonState('absence');
	} catch (error) {
		showAlert('error', '자리비움 처리 중 오류가 발생했습니다.' + error);
	}
})

async function initializeAttendanceSystem() {
	try {
		await Promise.all([
			readTAAList(),
			readLatestWS()
		]);

		await updateButtonStateFromServer();
	} catch (error) {
		updateButtonState('initial');
	}
}

async function updateButtonStateFromServer() {
	try {
		const todayAttendance = await readTAAone();

		// 오늘 출퇴근 기록이 없으면 출근 버튼 표시
		if (!todayAttendance) {
			updateButtonState('initial');
			updateWorkingStatus('', '');
			return;
		}

		const url = `/rest/comm-user/work-status/${userId.value}`;
		const resp = await fetch(url, { method: 'GET' });

		const data = await resp.json();
		const workStatus = data.workStts?.workSttsCd;

		if (workStatus === 'C104') {
			updateButtonState('no-button');
			updateWorkingStatus('출장중', 'status-business-trip');
			return;
		} else if (workStatus === 'C105') {
			updateButtonState('no-button');
			updateWorkingStatus('휴가중', 'status-vacation');
			return;
		}

		// 퇴근 시간이 없으면 (아직 퇴근 안함) -> 근무 상태 확인
		if (todayAttendance.workEndDt === null) {
			if (!resp.ok) {
				throw new Error(`HTTP error! status: ${resp.status}`);
			}

			if (workStatus === 'C102') {
				updateButtonState('absence');
				updateWorkingStatus('자리비움', 'status-away');
			} else if (workStatus === 'C101') {
				updateButtonState('working');
				updateWorkingStatus('근무중', 'status-working');
			} else if (workStatus === 'C103') {
				updateButtonState('initial');
				updateWorkingStatus('부재중', 'status-absent');
			}
		} else {
			// 퇴근 시간이 있는 경우 -> 당일이면 퇴근 버튼 유지 (수정 가능)
			const now = new Date();
			const workDate = new Date(todayAttendance.workBgngDt.split('T')[0]);

			// 오늘 날짜와 출근 날짜 비교
			if (now.toDateString() === workDate.toDateString()) {
				// 당일이면 퇴근 버튼 계속 표시 (자리비움/복귀 버튼은 숨김)
				updateButtonState('end-only');
				updateWorkingStatus('퇴근 완료', 'status-absent');
			} else {
				// 다른 날이면 출근 버튼 표시
				updateButtonState('initial');
				updateWorkingStatus('', '');
			}
		}
	} catch (error) {
		updateButtonState('initial');
	}
}

function updateButtonState(state) {
	const buttonGrid = document.querySelector('.button-grid');

	startBtn.style.display = 'none';
	endBtn.style.display = 'none';
	workingBtn.style.display = 'none';
	absenceBtn.style.display = 'none';

	switch (state) {
		case 'initial':
			startBtn.style.display = 'inline-block';
			buttonGrid.classList.add('single-button');
			break;

		case 'working':
			endBtn.style.display = 'inline-block';
			absenceBtn.style.display = 'inline-block';
			buttonGrid.classList.remove('single-button');
			break;

		case 'absence':
			endBtn.style.display = 'inline-block';
			workingBtn.style.display = 'inline-block';
			buttonGrid.classList.remove('single-button');
			break;

		case 'end-only':
			endBtn.style.display = 'inline-block';
			buttonGrid.classList.add('single-button');
			break;

		case 'no-button':
			// 모든 버튼 숨김 (출장/휴가 시)
			buttonGrid.classList.add('single-button');
			break;
	}
}

async function createTAA() {
	const url = `/rest/attendance`;
	const resp = await fetch(url, { method: 'POST' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const data = await resp.json();
	return data;
}

async function modifyTAA() {
	const now = new Date();

	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');

	const yyyymmdd = `${year}${month}${day}`;

	let url = `/rest/attendance`;
	const resp = await fetch(url
		, {
			method: 'PUT'
			, headers: {
				'Content-Type': 'application/json'
			}
			, body: JSON.stringify({
				workYmd: yyyymmdd
			})
		})
	if (resp.ok) {
		return null;
	}
}

async function readTAAList() {
	const url = `/rest/attendance/${userId.value}`;
	const resp = await fetch(url, { method: 'GET' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const data = await resp.json();
	const listTAA = data.listTAA;

	attendanceRecord.innerHTML = '';

	if (listTAA && listTAA.length > 0) {
		listTAA.forEach(taa => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
                <td>${taa.workBgngDt.split('T')[0]}</td>
                <td>${taa.workBgngDt.split('T')[1]}</td>
                <td>${taa.workEndDt != null ? taa.workEndDt.split('T')[1] : '-'}</td>
                <td>${taa.lateYn === 'Y' ? '지각' : taa.earlyYn === 'Y' ? '조퇴' : '정상'}</td>
            `;
			attendanceRecord.appendChild(tr);
		});
	}
}

async function readTAAone() {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	const yyyymmdd = `${year}${month}${day}`;

	const url = `/rest/attendance/${userId.value}/${yyyymmdd}`;

	try {
		const resp = await fetch(url, { method: 'GET' });
		const data = await resp.json();
		return data.taaVO || data;
	} catch (error) {
		return null;
	}
}

async function readLatestWS() {
	const url = `/rest/comm-user/work-status/${userId.value}`;
	const resp = await fetch(url, { method: 'GET' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const data = await resp.json();
	const workStatus = data.workStts?.workSttsCd;

	// 상태 코드를 한글로 변환하고 색상 클래스 적용
	if (workStatus === 'C101') {
		updateWorkingStatus('근무중', 'status-working');
	} else if (workStatus === 'C102') {
		updateWorkingStatus('자리비움', 'status-away');
	} else if (workStatus === 'C103') {
		updateWorkingStatus('부재중', 'status-absent');
	} else if (workStatus === 'C104') {
		updateWorkingStatus('출장중', 'status-business-trip');
	} else if (workStatus === 'C105') {
		updateWorkingStatus('휴가중', 'status-vacation');
	}

	return data;
}

async function changeToWorking() {
	const url = `/rest/comm-user/work-status`;
	const resp = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			workSttsCd: "C101"
		})
	});
	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}
	return await resp.json();
}

async function changeToAbsence() {
	const url = `/rest/comm-user/work-status`;
	const resp = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			workSttsCd: "C102"
		})
	});
	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}
	return await resp.json();
}

async function changeToLeave() {
	const url = `/rest/comm-user/work-status`;
	const resp = await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			workSttsCd: "C103"
		})
	});
	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}
	return await resp.json();
}

function updateTime() {
	const now = new Date();
	const timeString = now.toLocaleTimeString('ko-KR');
	currentTime.textContent = timeString;
}

function getFirstDayOfWeek(date) {
	const d = new Date(date);
	const day = d.getDay(); // 0(일요일) ~ 6(토요일)
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);
	return new Date(d.setDate(diff));
}

async function getWeekAttendance() {
	const url = `/rest/attendance-stats/week`;
	const resp = await fetch(url, { method: 'GET' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const data = await resp.json();
	const uwaDTO = data.uwaDTO ?? {};

	console.log(uwaDTO)

	const workWeekStartDate = uwaDTO.workWeekStartDate ?? getFirstDayOfWeek(new Date());
	const userNm = uwaDTO.userNm ?? '-';
	const deptNm = uwaDTO.deptNm ?? '-';
	const jbgdNm = uwaDTO.jbgdNm ?? '-';

	const totalWorkHr = uwaDTO.totalWorkHr ?? 0;
	let overtimeHr = uwaDTO.totalOvertimeHr ?? 0;
	if (overtimeHr > 720) overtimeHr = 720;
	let regularHr = totalWorkHr - overtimeHr;
	if (regularHr > 2400) regularHr = 2400;

	const regularPcnt = (regularHr / 3120) * 100
	const overtimePcnt = (overtimeHr / 3120) * 100

	regularBar.style.width = regularPcnt + '%'
	regularBar.setAttribute('aria-valuenow', regularHr / 60)

	overtimeBar.style.width = overtimePcnt + '%'
	overtimeBar.setAttribute('aria-valuenow', overtimeBar / 60)
	overtimeBar.setAttribute('aria-valuemin', regularBar / 60)

	document.getElementById('leftWorkHr').innerText = `남은 근무시간 : ${formatHoursMinutes(totalWorkHr > 2400 ? 2400 : 2400 - totalWorkHr)}`
	document.getElementById('leftoverWorkHr').innerText = `남은 연장 근무시간 : ${formatHoursMinutes(totalWorkHr > 2400 ? 3120 - totalWorkHr : 720)}`

	document.getElementById('nameSpace').innerHTML = `${deptNm} ${userNm} ${jbgdNm}`
	document.getElementById('week').innerText = `${formatWeekLabel(workWeekStartDate)} (주 52시간 기준 주간 근무실적)`
	document.getElementById('totalWorkHr').innerText = formatHoursMinutes(totalWorkHr)

	return data;
}

async function getMonthAttendance() {
	const url = `/rest/attendance-stats/month`;
	const resp = await fetch(url, { method: 'GET' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const data = await resp.json();
	const umaDTO = data.umaDTO;

	const workMonth = umaDTO.workMonth;
	const workCnt = umaDTO.workDays;
	const earlyCnt = umaDTO.earlyCount;
	const lateCnt = umaDTO.lateCount;

	document.getElementById('yearMonth1').innerText = formatYearMonth(workMonth)
	document.getElementById('yearMonth2').innerText = formatYearMonth(workMonth)
	document.getElementById('lateCnt').innerText = `${lateCnt}회`
	document.getElementById('earlyCnt').innerText = `${earlyCnt}회`
	document.getElementById('lateCntSub').innerText = `출근 ${workCnt}회 중 ${lateCnt}회`
	document.getElementById('earlyCntSub').innerText = `출근 ${workCnt}회 중 ${earlyCnt}회`
}

async function getVacationDays() {
	const url = `/rest/approval-vacation/E101`
	const resp = await fetch(url, { method: 'GET' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const now = new Date();
	const year = now.getFullYear();
	const hireYmd = document.getElementById('hiddenHireYmd').value;
	const hireYear = hireYmd.split('-')[0]
	const hireMonth = hireYmd.split('-')[1]

	let fullVacationDays = 0;

	if (year.toString() == hireYear) {
		fullVacationDays = now.getMonth() + 1 - hireMonth
	} else {
		fullVacationDays = 12
	}

	const data = await resp.json();
	document.getElementById('vacationCnt').innerText = `${fullVacationDays - data}회`
	document.getElementById('vacationCntSub').innerText = `연차 ${fullVacationDays}회 중 ${fullVacationDays - data}회 남음`
}

function formatHoursMinutes(totalMinutes) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${hours}h ${minutes}m`;
}

function formatYearMonth(yearMonth) {
	const year = yearMonth.split('-')[0]
	const month = yearMonth.split('-')[1]
	return `${year}년 ${month}월`
}

function formatWeekLabel(dateStr) {
	const date = new Date(dateStr);
	if (isNaN(date)) return "";

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const firstDay = new Date(year, month - 1, 1);
	const weekNumber = Math.floor((day + firstDay.getDay() - 1) / 7) + 1;

	return `${month.toString().padStart(2, '0')}월 ${weekNumber}주째`;
}

//-------------------- Calendar --------------------//
function handleResponse(response) {
	if (!response.ok) throw new Error(`API 호출 실패: ${response.statusText}`);
	return response.text().then((text) => (text ? JSON.parse(text) : {}));
}

function handleError(error) {
	console.error("API Error:", error);
	showAlert('error', `오류가 발생했습니다: ${error.message}`);
}

function parseDateAsKST(dateString) {
	if (!dateString) return null;
	// "YYYY-MM-DD HH:mm:ss" 형식의 문자열을 파싱
	const parts = dateString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
	if (!parts) {
		// 정규식이 실패할 경우, ISO 8601 또는 다른 형식을 시도 (대체 작동)
		return new Date(dateString);
	}
	// new Date(year, monthIndex, day, hours, minutes, seconds)
	// 이 생성자는 브라우저의 로컬 시간대를 기준으로 Date 객체를 생성합니다.
	return new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
}

// 페이징 설정
const ITEMS_PER_PAGE = 5; // 페이지당 표시할 항목 수
let currentPage = 1;
let totalAttendanceData = []; // 전체 근태 데이터 저장

// 페이지네이션 정보 계산 함수
function calculatePaginationInfo(totalItems, currentPage, itemsPerPage = ITEMS_PER_PAGE, pageBlockSize = 10) {
	const totalPage = Math.max(1, Math.ceil(totalItems / itemsPerPage));
	const validCurrentPage = Math.max(1, Math.min(currentPage, totalPage));

	const currentBlock = Math.ceil(validCurrentPage / pageBlockSize);
	const startPage = (currentBlock - 1) * pageBlockSize + 1;
	const endPage = Math.min(startPage + pageBlockSize - 1, totalPage);

	return {
		totalPage,
		currentPage: validCurrentPage,
		startPage,
		endPage,
		totalItems,
		itemsPerPage
	};
}

// 페이지네이션 HTML 렌더링 함수 (Java 코드와 동일한 로직)
function renderPagination(paging, fnName = 'goToPage') {
	const totalPage = Math.max(1, paging.totalPage);
	const startPage = Math.max(1, paging.startPage);
	const endPage = Math.min(paging.endPage, totalPage);
	let currentPage = paging.currentPage;

	if (currentPage < 1) currentPage = 1;
	if (currentPage > totalPage) currentPage = totalPage;

	let html = '<nav aria-label="페이지">\n';
	html += '<ul class="pagination pagination-primary justify-content-center">\n';

	// 이전 버튼
	if (startPage > 1 && currentPage > 1) {
		html += '<li class="page-item">';
		html += `<a class="page-link" href="javascript:void(0);" onclick="${fnName}(${startPage - 1}); return false;">이전</a>`;
		html += '</li>\n';
	} else {
		html += '<li class="page-item disabled">';
		html += '<span class="page-link">이전</span>';
		html += '</li>\n';
	}

	// 페이지 숫자 버튼
	for (let p = startPage; p <= endPage; p++) {
		if (p === currentPage) {
			html += '<li class="page-item active">';
			html += `<span class="page-link" aria-current="page">${p}</span>`;
			html += '</li>\n';
		} else {
			html += '<li class="page-item">';
			html += `<a class="page-link" href="javascript:void(0);" onclick="${fnName}(${p}); return false;">${p}</a>`;
			html += '</li>\n';
		}
	}

	// 다음 버튼
	if (endPage < totalPage && currentPage < totalPage) {
		html += '<li class="page-item">';
		html += `<a class="page-link" href="javascript:void(0);" onclick="${fnName}(${endPage + 1}); return false;">다음</a>`;
		html += '</li>\n';
	} else {
		html += '<li class="page-item disabled">';
		html += '<span class="page-link">다음</span>';
		html += '</li>\n';
	}

	html += '</ul>\n';
	html += '</nav>\n';

	return html;
}

// 페이지 이동 함수
function goToPage(pageNum) {
	currentPage = pageNum;
	displayAttendanceData(currentPage);
}

function displayAttendanceData(page = 1) {
	const paging = calculatePaginationInfo(totalAttendanceData.length, page);
	currentPage = paging.currentPage;

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalAttendanceData.length);
	const pageData = totalAttendanceData.slice(startIndex, endIndex);

	attendanceRecord.innerHTML = '';

	if (pageData.length > 0) {
		pageData.forEach(taa => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
                <td>${taa.workBgngDt.split('T')[0]}</td>
                <td>${taa.workBgngDt.split('T')[1]}</td>
                <td>${taa.workEndDt != null ? taa.workEndDt.split('T')[1] : '-'}</td>
                <td>${taa.lateYn === 'Y' ? (taa.earlyYn === 'Y' ? '지각/조퇴' : '지각') : taa.earlyYn === 'Y' ? '조퇴' : '-'}</td>
            `;
			attendanceRecord.appendChild(tr);
		});

		const emptyRowsCount = ITEMS_PER_PAGE - pageData.length;
		for (let i = 0; i < emptyRowsCount; i++) {
			const tr = document.createElement('tr');
			tr.className = 'empty-row';
			tr.innerHTML = `
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            `;
			attendanceRecord.appendChild(tr);
		}
	} else {
		const tr = document.createElement('tr');
		tr.innerHTML = '<td colspan="4" class="text-center">근태 기록이 없습니다.</td>';
		attendanceRecord.appendChild(tr);

		for (let i = 0; i < ITEMS_PER_PAGE - 1; i++) {
			const tr = document.createElement('tr');
			tr.className = 'empty-row';
			tr.innerHTML = `
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            `;
			attendanceRecord.appendChild(tr);
		}
	}

	// 페이지네이션을 card-footer로 추가
	const paginationHtml = renderPagination(paging, 'goToPage');

	let paginationContainer = document.getElementById('attendance-pagination');
	if (!paginationContainer) {
		paginationContainer = document.createElement('div');
		paginationContainer.id = 'attendance-pagination';
		paginationContainer.className = 'card-footer';

		// card-body의 부모 card를 찾아서 추가
		const card = document.querySelector('#attendance-record').closest('.card');
		card.appendChild(paginationContainer);
	}

	paginationContainer.innerHTML = paginationHtml;
}

// readTAAList 함수 수정 (기존 함수 대체)
async function readTAAList() {
	const url = `/rest/attendance/${userId.value}`;
	const resp = await fetch(url, { method: 'GET' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const data = await resp.json();
	const listTAA = data.listTAA;

	// 전체 데이터 저장
	totalAttendanceData = listTAA || [];

	// 첫 페이지 표시
	displayAttendanceData(1);
}

