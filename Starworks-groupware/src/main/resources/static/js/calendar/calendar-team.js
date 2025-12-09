/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      수정자           수정내용
 *  -----------   -------------    ---------------------------
 * 2025. 9. 30.     장어진            최초 생성
 * 2025. 10. 27.    장어진            리팩토링
 * </pre>
 */

// ============================================
// 1. 설정 및 상수
// ============================================
const CONFIG = {
	eventTypes: {
		'personal': {
			label: '개인일정',
			color: '#2ecc71',
			priority: 4,
			editable: true
		},
		'project': {
			label: '프로젝트',
			color: null, // 동적으로 할당
			priority: 1,
			editable: false
		},
		'main_task': {
			label: '주요업무',
			color: null, // 프로젝트 색상 상속
			priority: 2,
			editable: false
		},
		'vacation': {
			label: '휴가',
			color: '#f1c40f',
			priority: 3,
			editable: false
		},
		'businesstrip': {
			label: '출장',
			color: '#e74c3c',
			priority: 3,
			editable: false
		}
	},
	projectColors: [
		'#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#16a085', '#d35400'
	],
	api: {
		endpoints: {
			user: '/rest/calendar-user',
			events: '/rest/fullcalendar-team/events',
			projects: '/rest/fullcalendar-team/project-list'
		}
	},
	calendar: {
		height: 700,
		dayMaxEvents: 3,
		locale: 'ko',
		clickDelay: 250
	},
	messages: {
		addSuccess: '일정이 성공적으로 저장되었습니다.',
		updateSuccess: '일정이 성공적으로 수정되었습니다.',
		deleteSuccess: '일정이 성공적으로 삭제되었습니다.',
		deleteConfirm: '정말 일정을 삭제하시겠습니까?',
		approvalOnly: '개인 일정을 제외한 일정들은 결재 시스템을 통해서만 추가/수정 및 삭제할 수 있습니다.',
		requiredFields: '일정 제목과 시작일은 필수입니다.',
		personalOnly: '개인 일정만 날짜를 변경할 수 있습니다.',
		noEvents: '선택된 날짜에 일정이 없습니다.'
	}
};

// ============================================
// 2. DOM 요소 관리
// ============================================
class DOMElements {
	constructor() {
		this.initializeElements();
	}

	initializeElements() {
		// 이벤트 추가 모달 요소
		this.addModal = {
			form: document.getElementById('eventForm'),
			label: document.getElementById('eventModalLabel'),
			title: document.getElementById('eventTitle'),
			type: document.getElementById('eventType'),
			start: document.getElementById('eventStart'),
			end: document.getElementById('eventEnd'),
			allDayCheck: document.getElementById('allDayCheck'),
			description: document.getElementById('eventDescription')
		};

		// 이벤트 상세/수정 모달 요소
		this.detailModal = {
			label: document.getElementById('eventDetailModalLabel'),
			title: document.getElementById('detailTitle'),
			userNm: document.getElementById('detailUserNm'),
			type: document.getElementById('detailType'),
			start: document.getElementById('detailStart'),
			end: document.getElementById('detailEnd'),
			description: document.getElementById('detailDescription')
		};

		// 수정 폼 요소
		this.editForm = {
			id: document.getElementById("editEventId"),
			title: document.getElementById("editEventTitle"),
			type: document.getElementById("editEventType"),
			start: document.getElementById("editEventStart"),
			end: document.getElementById("editEventEnd"),
			allDayCheck: document.getElementById("editAllDayCheck"),
			description: document.getElementById("editEventDescription")
		};

		// 뷰 및 푸터 요소
		this.views = {
			detailView: document.getElementById("eventDetailView"),
			editView: document.getElementById("eventEditView"),
			detailFooter: document.getElementById("detailFooter"),
			editFooter: document.getElementById("editFooter")
		};

		// 버튼 요소
		this.buttons = {
			add: document.getElementById('addEvent'),
			edit: document.getElementById('editEvent'),
			delete: document.getElementById('deleteEvent'),
			openEdit: document.getElementById("openEditModal"),
			cancelEdit: document.getElementById("cancelEdit")
		};

		// hidden 값
		this.hidden = {
			userId: document.getElementById('hiddenUserId')
		};

		// 캘린더 요소
		this.calendar = {
			main: document.getElementById('calendar'),
			list: document.getElementById('list-calendar')
		};

		// 필터 컨테이너
		this.filter = {
			container: document.getElementById('filter-container'),
			projectContainer: document.getElementById('project-filter-container')
		};
	}

	getAddModalElements() {
		return this.addModal;
	}

	getDetailModalElements() {
		return this.detailModal;
	}

	getEditFormElements() {
		return this.editForm;
	}

	getViewElements() {
		return this.views;
	}

	getButtonElements() {
		return this.buttons;
	}

	getHiddenValues() {
		return this.hidden;
	}

	getCalendarElements() {
		return this.calendar;
	}

	getFilterElements() {
		return this.filter;
	}
}

// ============================================
// 3. 유틸리티 클래스들
// ============================================

// 날짜 유틸리티
class DateUtils {
	/**
	 * 서버에서 받은 날짜 문자열을 KST 시간대의 Date 객체로 파싱
	 */
	static parseDateAsKST(dateString) {
		if (!dateString) return null;
		const parts = dateString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
		if (!parts) return new Date(dateString);
		return new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
	}

	/**
	 * Date 객체를 'YYYY-MM-DDTHH:mm' 형식으로 변환
	 */
	static toDatetimeLocalString(date) {
		if (!date) return '';
		const d = new Date(date);

		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		const hours = String(d.getHours()).padStart(2, '0');
		const minutes = String(d.getMinutes()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	/**
	 * 상세보기를 위한 날짜 포맷팅
	 */
	static formatEventDate(date, isAllDay, isEnd = false, startDate = null) {
		if (!date) return null;
		let d = new Date(date);

		if (isAllDay && isEnd) {
			d.setDate(d.getDate() - 1);
			if (new Date(startDate).toDateString() === d.toDateString()) {
				return null;
			}
		}

		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		if (!isAllDay) {
			options.hour = '2-digit';
			options.minute = '2-digit';
			options.hour12 = false;
		}
		return d.toLocaleString('ko-KR', options);
	}

	/**
	 * 하루 종일 이벤트의 종료일을 exclusive end로 변환
	 */
	static convertToExclusiveEnd(endDate) {
		let exclusiveEnd = new Date(endDate);
		exclusiveEnd.setDate(exclusiveEnd.getDate() + 1);
		exclusiveEnd.setHours(0, 0, 0, 0);
		return exclusiveEnd;
	}
}

// API 유틸리티
class ApiUtils {
	/**
	 * API 응답 처리
	 */
	static async handleResponse(response) {
		if (!response.ok) {
			throw new Error(`API 호출 실패: ${response.statusText}`);
		}
		const text = await response.text();
		return text ? JSON.parse(text) : {};
	}

	/**
	 * 에러 처리
	 */
	static handleError(error) {
		console.error("API Error:", error);
		showAlert('error', `오류가 발생했습니다: ${error.message}`);
	}

	/**
	 * API 요청 실행
	 */
	static async request(endpoint, method, data = null) {
		const options = {
			method: method,
			headers: { 'Content-Type': 'application/json' }
		};

		if (data && (method === 'POST' || method === 'PUT')) {
			options.body = JSON.stringify(data);
		}

		try {
			const response = await fetch(endpoint, options);
			return await this.handleResponse(response);
		} catch (error) {
			this.handleError(error);
			throw error;
		}
	}
}

// 검증 유틸리티
class ValidationUtils {
	/**
	 * 필수 필드 검증
	 */
	static validateRequiredFields(title, start) {
		if (!title || !start) {
			showToast('warning', CONFIG.messages.requiredFields);
			return false;
		}
		return true;
	}

	/**
	 * 수정 가능 여부 검증 (팀 캘린더는 개인일정만 수정 가능)
	 */
	static validateEditable(eventType) {
		if (eventType !== 'personal') {
			showAlert('error', CONFIG.messages.approvalOnly);
			return false;
		}
		return true;
	}
}

// ============================================
// 4. 프로젝트 서비스 클래스 (팀 캘린더 고유)
// ============================================
class ProjectService {
	constructor() {
		this.projectColorMap = new Map();
	}

	/**
	 * 프로젝트 색상 가져오기
	 */
	getProjectColor(bizId) {
		if (!this.projectColorMap.has(bizId)) {
			const colorIndex = this.projectColorMap.size % CONFIG.projectColors.length;
			this.projectColorMap.set(bizId, CONFIG.projectColors[colorIndex]);
		}
		return this.projectColorMap.get(bizId);
	}

	/**
	 * 프로젝트 목록 가져오기 및 필터 생성
	 */
	async fetchAndRenderProjects(filterContainer) {
		try {
			const projects = await ApiUtils.request(CONFIG.api.endpoints.projects, 'GET');

			if (!projects || projects.length === 0) {
				return [];
			}

			projects.forEach((project, index) => {
				const color = this.getProjectColor(project.bizId);
				this.renderProjectFilter(filterContainer, project, color);
			});

			return projects;
		} catch (error) {
			ApiUtils.handleError(error);
			return [];
		}
	}

	/**
	 * 프로젝트 필터 렌더링
	 */
	renderProjectFilter(container, project, color) {
		const filterDiv = document.createElement('div');
		filterDiv.className = 'filter-item project-filter-item';  // 변경
		filterDiv.innerHTML = `
	        <input type="checkbox"
	               class="project-filter"
	               value="${project.bizId}"
	               id="project_${project.bizId}"
	               checked>
	        <label class="filter-label"
	               for="project_${project.bizId}"
	               style="background-color: ${color};">
	            <span class="filter-label-text">${project.bizNm}</span>
	        </label>
	    `;
		container.appendChild(filterDiv);
	}


	/**
	 * 프로젝트 이벤트를 시작/종료 마커로 분리
	 */
	createProjectMarkers(eventData, color, priority) {
		const parsedStart = DateUtils.parseDateAsKST(eventData.startDt);
		const parsedEnd = eventData.endDt ? DateUtils.parseDateAsKST(eventData.endDt) : null;

		if (!parsedStart || !parsedEnd) {
			return [];
		}

		const baseProps = {
			type: eventData.eventType,
			description: eventData.description,
			userNm: eventData.userNm,
			originalData: eventData,
			priority: priority,
			isProjectMarker: true,
			projectId: eventData.bizId
		};

		// 시작일 이벤트
		const startEvent = {
			id: eventData.eventId + '_start',
			title: '시작 : ' + eventData.title,
			start: parsedStart,
			allDay: true,
			extendedProps: baseProps,
			borderColor: color,
			backgroundColor: color
		};

		// 종료일 이벤트
		const endEvent = {
			id: eventData.eventId + '_end',
			title: '종료 : ' + eventData.title,
			start: parsedEnd,
			allDay: true,
			extendedProps: baseProps,
			borderColor: color,
			backgroundColor: color
		};

		return [startEvent, endEvent];
	}

	/**
	 * 이벤트 색상 결정
	 */
	getEventColor(eventType, bizId) {
		const config = CONFIG.eventTypes[eventType];

		if (eventType === 'project' || eventType === 'main_task') {
			return this.getProjectColor(bizId);
		}

		return config?.color || '#34495e';
	}

	getColorMap() {
		return this.projectColorMap;
	}
}

// ============================================
// 5. 이벤트 서비스 클래스
// ============================================
class EventService {
	constructor(domElements, projectService) {
		this.dom = domElements;
		this.projectService = projectService;
		this.calendar = null;
		this.listCalendar = null;
	}

	setCalendars(calendar, listCalendar) {
		this.calendar = calendar;
		this.listCalendar = listCalendar;
	}

	/**
	 * 이벤트 목록 가져오기
	 */
	async fetchEvents(fetchInfo, successCallback, failureCallback) {
		try {
			const data = await ApiUtils.request(CONFIG.api.endpoints.events, 'GET');
			const allTransformedEvents = data.flatMap(eventData =>
				this.transformEvent(eventData)
			);
			const filteredEvents = this.filterEvents(allTransformedEvents);
			successCallback(filteredEvents);
		} catch (error) {
			if (failureCallback) failureCallback(error);
		}
	}

	/**
	 * 이벤트 데이터 변환
	 */
	transformEvent(eventData) {
		const eventType = eventData.eventType;
		const config = CONFIG.eventTypes[eventType] || {
			color: '#34495e',
			priority: 5
		};

		const color = this.projectService.getEventColor(eventType, eventData.bizId);
		const priority = config.priority;

		// 프로젝트 이벤트는 시작/종료 마커로 분리
		if (eventType === 'project') {
			return this.projectService.createProjectMarkers(eventData, color, priority);
		}

		// 다른 타입은 일반 이벤트로 처리
		const isAllDay = eventData.allday === 'Y';
		const parsedStart = DateUtils.parseDateAsKST(eventData.startDt);
		let parsedEnd = eventData.endDt ? DateUtils.parseDateAsKST(eventData.endDt) : null;

		if (isAllDay && parsedEnd) {
			parsedEnd = DateUtils.convertToExclusiveEnd(parsedEnd);
		}

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
	}

	/**
	 * 타입 및 프로젝트별 필터링
	 */
	filterEvents(events) {
		// 선택된 이벤트 타입 (개인일정, 휴가, 출장만)
		const selectedTypes = Array.from(
			document.querySelectorAll('#filter-container input[type="checkbox"]:not(.project-filter):checked')
		).map(checkbox => checkbox.value);

		// 선택된 프로젝트 ID
		const selectedProjects = Array.from(
			document.querySelectorAll('#filter-container .project-filter:checked')
		).map(checkbox => checkbox.value);

		return events.filter(event => {
			const eventType = event.extendedProps.type;
			const projectId = event.extendedProps.projectId || event.extendedProps.originalData?.bizId;

			// 프로젝트 또는 주요업무: 해당 프로젝트가 선택되어 있어야 함
			if (eventType === 'project' || eventType === 'main_task') {
				return selectedProjects.includes(projectId);
			}

			// 다른 타입: 타입 필터 확인
			return selectedTypes.includes(eventType);
		});
	}

	/**
	 * 이벤트 추가
	 */
	async addEvent(formData) {
		if (!ValidationUtils.validateRequiredFields(formData.title, formData.start)) {
			return false;
		}

		if (!ValidationUtils.validateEditable(formData.type)) {
			return false;
		}

		// 하루 종일 이벤트이고 종료일이 없으면 시작일과 동일하게 설정
		if (formData.allDay && !formData.end) {
			formData.end = formData.start;
		}

		const apiData = this.prepareApiData(formData, 'add');

		try {
			await ApiUtils.request(CONFIG.api.endpoints.user, 'POST', apiData);
			this.refreshCalendars();
			showToast("success", CONFIG.messages.addSuccess);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * 이벤트 수정
	 */
	async updateEvent(formData) {
		if (!ValidationUtils.validateRequiredFields(formData.title, formData.start)) {
			return false;
		}

		if (!ValidationUtils.validateEditable(formData.type)) {
			return false;
		}

		// 하루 종일 이벤트이고 종료일이 없으면 시작일과 동일하게 설정
		if (formData.allDay && !formData.end) {
			formData.end = formData.start;
		}

		const apiData = this.prepareApiData(formData, 'edit');

		try {
			await ApiUtils.request(CONFIG.api.endpoints.user, 'PUT', apiData);
			this.refreshCalendars();
			showToast('success', CONFIG.messages.updateSuccess);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * 이벤트 삭제
	 */
	async deleteEvent(event) {
		const eventType = event.extendedProps.type;

		if (!ValidationUtils.validateEditable(eventType)) {
			return false;
		}

		const result = await Swal.fire({
			title: CONFIG.messages.deleteConfirm,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "삭제",
			cancelButtonText: "취소"
		});

		if (!result.isConfirmed) return false;

		const apiData = this.prepareDeleteData(event);

		try {
			await ApiUtils.request(CONFIG.api.endpoints.user, 'PUT', apiData);
			this.refreshCalendars();

			await Swal.fire({
				title: "일정이 삭제되었습니다.",
				icon: "success"
			});

			showToast('trash', CONFIG.messages.deleteSuccess);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * 드래그앤드롭으로 이벤트 날짜 수정
	 */
	async updateEventOnDrop(info) {
		const event = info.event;
		const type = event.extendedProps.type;

		if (type !== 'personal') {
			info.revert();
			showAlert('error', CONFIG.messages.personalOnly);
			return false;
		}

		const originalData = event.extendedProps.originalData;
		const isAllDay = originalData.allday === 'Y';

		const newStart = new Date(event.start);
		let newEnd;

		if (event.end) {
			newEnd = new Date(event.end);
			if (isAllDay) {
				newEnd.setDate(newEnd.getDate() - 1);
			}
		} else {
			newEnd = new Date(newStart);
		}

		const formData = {
			id: event.id,
			title: event.title,
			type: type,
			start: DateUtils.toDatetimeLocalString(newStart),
			end: DateUtils.toDatetimeLocalString(newEnd),
			allDay: isAllDay,
			description: event.extendedProps.description
		};

		try {
			const apiData = this.prepareApiData(formData, 'edit');
			await ApiUtils.request(CONFIG.api.endpoints.user, 'PUT', apiData);
			showToast('success', CONFIG.messages.updateSuccess);
			this.refreshCalendars();
			return true;
		} catch (error) {
			info.revert();
			return false;
		}
	}

	/**
	 * API 데이터 준비 (추가/수정)
	 */
	prepareApiData(formData, mode) {
		const hidden = this.dom.getHiddenValues();

		const apiData = {
			userId: hidden.userId.value,
			schdTtl: formData.title,
			schdStrtDt: formData.start,
			schdEndDt: formData.end,
			allday: formData.allDay ? 'Y' : 'N',
			userSchdExpln: formData.description || '',
			delYn: 'N'
		};

		if (mode === 'edit') {
			apiData.userSchdId = formData.id;
		}

		return apiData;
	}

	/**
	 * 삭제를 위한 API 데이터 준비
	 */
	prepareDeleteData(event) {
		const hidden = this.dom.getHiddenValues();
		const originalData = event.extendedProps.originalData;

		return {
			userSchdId: event.id,
			userId: hidden.userId.value,
			schdTtl: event.title,
			schdStrtDt: DateUtils.toDatetimeLocalString(DateUtils.parseDateAsKST(originalData.startDt)),
			schdEndDt: DateUtils.toDatetimeLocalString(DateUtils.parseDateAsKST(originalData.endDt)),
			allday: originalData.allday,
			userSchdExpln: event.extendedProps.description,
			delYn: 'Y'
		};
	}

	/**
	 * 캘린더 새로고침
	 */
	refreshCalendars() {
		if (this.calendar) this.calendar.refetchEvents();
		if (this.listCalendar) this.listCalendar.refetchEvents();
	}
}

// ============================================
// 6. 모달 관리자 클래스
// ============================================
class ModalManager {
	constructor(domElements) {
		this.dom = domElements;
		this.eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
		this.eventDetailModal = new bootstrap.Modal(document.getElementById('eventDetailModal'));
		this.clickedEventInfo = null;
	}

	/**
	 * 새 일정 추가 모달 열기
	 */
	openAddModal(info = null) {
		const addModal = this.dom.getAddModalElements();

		addModal.form.reset();
		addModal.label.innerText = '새 일정 추가';

		const now = new Date();
		if (info && info.dateStr) {
			const clickedDate = new Date(info.dateStr);
			now.setFullYear(
				clickedDate.getFullYear(),
				clickedDate.getMonth(),
				clickedDate.getDate()
			);
		}

		this.toggleAllDay(false, addModal.start, addModal.end);
		addModal.start.value = DateUtils.toDatetimeLocalString(now);
		now.setHours(now.getHours() + 1);
		addModal.end.value = DateUtils.toDatetimeLocalString(now);

		this.eventModal.show();
	}

	/**
	 * 다중 날짜 선택을 위한 모달 열기
	 */
	openAddModalForMultiSelect(info) {
		const addModal = this.dom.getAddModalElements();

		addModal.form.reset();
		addModal.label.innerText = '새 일정 추가';

		addModal.allDayCheck.checked = true;
		this.toggleAllDay(true, addModal.start, addModal.end);

		const startDate = new Date(info.start);
		startDate.setHours(0, 0, 0, 0);
		addModal.start.value = DateUtils.toDatetimeLocalString(startDate);

		const endDate = new Date(info.end);
		endDate.setDate(endDate.getDate() - 1);
		endDate.setHours(23, 59, 0, 0);
		addModal.end.value = DateUtils.toDatetimeLocalString(endDate);

		this.eventModal.show();
	}

	/**
	 * 이벤트 상세 정보 표시
	 */
	showEventDetails(info) {
		this.clickedEventInfo = info;
		const event = info.event;
		const eventType = event.extendedProps.type;
		const detailModal = this.dom.getDetailModalElements();
		const buttons = this.dom.getButtonElements();

		// 상세 정보 채우기
		detailModal.title.textContent = event.title;
		detailModal.type.textContent = CONFIG.eventTypes[eventType]?.label || eventType;
		detailModal.userNm.textContent = event.extendedProps.userNm || '-';

		const startStr = DateUtils.formatEventDate(event.start, event.allDay);
		const endStr = DateUtils.formatEventDate(event.end, event.allDay, true, event.start);
		detailModal.start.textContent = startStr;
		detailModal.end.textContent = (endStr && endStr !== startStr) ? endStr : '미지정';
		detailModal.description.textContent = event.extendedProps.description || '';

		// 개인일정이 아닌 경우 수정, 삭제 버튼 숨기기
		if (eventType !== 'personal') {
			buttons.openEdit.style.display = "none";
			buttons.delete.style.display = "none";
		} else {
			buttons.openEdit.style.display = "inline-block";
			buttons.delete.style.display = "inline-block";
		}

		this.showDetailView();
		this.eventDetailModal.show();
	}

	/**
	 * 상세 뷰를 수정 뷰로 전환
	 */
	showEditView() {
		const event = this.clickedEventInfo.event;
		const originalData = event.extendedProps.originalData;
		const editForm = this.dom.getEditFormElements();
		const detailModal = this.dom.getDetailModalElements();
		const views = this.dom.getViewElements();

		// 폼에 데이터 채우기
		editForm.id.value = event.id;
		editForm.title.value = event.title;
		editForm.type.value = event.extendedProps.type;
		editForm.description.value = event.extendedProps.description || "";
		editForm.allDayCheck.checked = event.allDay;

		// 날짜 필드 채우기
		if (event.allDay) {
			const startDate = DateUtils.parseDateAsKST(originalData.startDt);
			const endDate = originalData.endDt ? DateUtils.parseDateAsKST(originalData.endDt) : new Date(startDate);

			startDate.setHours(0, 0, 0, 0);
			editForm.start.value = DateUtils.toDatetimeLocalString(startDate);

			endDate.setHours(23, 59, 0, 0);
			editForm.end.value = DateUtils.toDatetimeLocalString(endDate);
		} else {
			editForm.start.value = DateUtils.toDatetimeLocalString(event.start);
			editForm.end.value = event.end ? DateUtils.toDatetimeLocalString(event.end) : "";
		}

		editForm.start.dataset.savedTime = editForm.start.value;
		editForm.end.dataset.savedTime = editForm.end.value;

		// 뷰 전환
		detailModal.label.innerText = "일정 수정";
		views.detailView.style.display = "none";
		views.detailFooter.style.display = "none";
		views.editView.style.display = "block";
		views.editFooter.style.display = "block";
	}

	/**
	 * 수정 뷰를 상세 뷰로 전환
	 */
	showDetailView() {
		const detailModal = this.dom.getDetailModalElements();
		const views = this.dom.getViewElements();

		detailModal.label.innerText = "상세 정보";
		views.detailView.style.display = "block";
		views.detailFooter.style.display = "block";
		views.editView.style.display = "none";
		views.editFooter.style.display = "none";
	}

	/**
	 * 하루 종일 UI 토글
	 */
	toggleAllDay(isAllDay, startInput, endInput) {
		if (isAllDay) {
			// 현재 값을 저장
			if (startInput.value) {
				startInput.dataset.savedTime = startInput.value;
			}
			if (endInput.value) {
				endInput.dataset.savedTime = endInput.value;
			}

			// 시작 시간을 00:00으로 설정
			let startDate = startInput.value ? new Date(startInput.value) : new Date();
			startDate.setHours(0, 0, 0, 0);
			startInput.value = DateUtils.toDatetimeLocalString(startDate);

			// 종료 시간을 23:59로 설정
			let endDate = endInput.value ? new Date(endInput.value) : new Date(startDate);
			endDate.setHours(23, 59, 0, 0);
			endInput.value = DateUtils.toDatetimeLocalString(endDate);

		} else {
			// 저장된 시간이 있으면 복원
			if (startInput.dataset.savedTime) {
				startInput.value = startInput.dataset.savedTime;
			}
			if (endInput.dataset.savedTime) {
				endInput.value = endInput.dataset.savedTime;
			}
		}
	}

	/**
	 * 추가 모달에서 폼 데이터 가져오기
	 */
	getAddFormData() {
		const addModal = this.dom.getAddModalElements();

		return {
			title: addModal.title.value,
			type: addModal.type.value,
			start: addModal.start.value,
			end: addModal.end.value,
			allDay: addModal.allDayCheck.checked,
			description: addModal.description.value
		};
	}

	/**
	 * 수정 모달에서 폼 데이터 가져오기
	 */
	getEditFormData() {
		const editForm = this.dom.getEditFormElements();

		return {
			id: editForm.id.value,
			title: editForm.title.value,
			type: editForm.type.value,
			start: editForm.start.value,
			end: editForm.end.value,
			allDay: editForm.allDayCheck.checked,
			description: editForm.description.value
		};
	}

	/**
	 * 모달 닫기
	 */
	closeAddModal() {
		this.eventModal.hide();
	}

	closeDetailModal() {
		this.eventDetailModal.hide();
	}

	/**
	 * 현재 선택된 이벤트 정보 가져오기
	 */
	getClickedEvent() {
		return this.clickedEventInfo?.event;
	}
}

// ============================================
// 7. 캘린더 관리자 클래스
// ============================================
class CalendarManager {
	constructor(domElements, modalManager, eventService) {
		this.dom = domElements;
		this.modalManager = modalManager;
		this.eventService = eventService;
		this.calendar = null;
		this.listCalendar = null;
		this.clickTimer = null;
	}

	/**
	 * 캘린더 초기화
	 */
	initialize() {
		const calendarElements = this.dom.getCalendarElements();

		// List Calendar 초기화
		this.listCalendar = this.createListCalendar(calendarElements.list);

		// Main Calendar 초기화
		this.calendar = this.createMainCalendar(calendarElements.main);

		// EventService에 캘린더 설정
		this.eventService.setCalendars(this.calendar, this.listCalendar);

		return { calendar: this.calendar, listCalendar: this.listCalendar };
	}

	/**
	 * List Calendar 생성
	 */
	createListCalendar(element) {
		return new FullCalendar.Calendar(element, {
			locale: CONFIG.calendar.locale,
			initialView: 'listDay',
			headerToolbar: {
				left: '',
				center: 'title',
				right: ''
			},
			height: CONFIG.calendar.height,
			events: (fetchInfo, successCallback, failureCallback) => {
				this.eventService.fetchEvents(fetchInfo, successCallback, failureCallback);
			},
			eventClick: (info) => {
				this.modalManager.showEventDetails(info);
			},
			noEventsContent: CONFIG.messages.noEvents,
			eventContent: function(arg) {
				const event = arg.event;
				const title = `<div style="font-weight: bold; margin-top: 5px;">${event.title}</div>`;

				let timeHtml;
				if (event.allDay) {
					timeHtml = '<div>하루 종일</div>';
				} else {
					const startTime = event.start.toLocaleTimeString('ko-KR', {
						hour: 'numeric',
						minute: '2-digit',
						hour12: false
					});
					const endTime = event.end ? event.end.toLocaleTimeString('ko-KR', {
						hour: 'numeric',
						minute: '2-digit',
						hour12: false
					}) : '';

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
	}

	/**
	 * Main Calendar 생성
	 */
	createMainCalendar(element) {
		const self = this;

		return new FullCalendar.Calendar(element, {
			locale: CONFIG.calendar.locale,
			dayCellContent: function(arg) {
				return arg.date.getDate();
			},
			eventOrder: '-duration,priority,start',  // depart와 동일하게
			initialView: 'dayGridMonth',
			headerToolbar: {
				left: 'prev,next today',
				center: 'title',
				right: 'addEventButton'
			},
			customButtons: {
				addEventButton: {
					text: '새 일정 추가',
					click: () => this.modalManager.openAddModal()
				}
			},
			height: 'auto',  // depart와 동일하게

			fixedMirrorParent: document.body,
			dragRevertDuration: 0,

			displayEventTime: false,
			displayEventEnd: false,

			events: (fetchInfo, successCallback, failureCallback) => {
				this.eventService.fetchEvents(fetchInfo, successCallback, failureCallback);
			},

			selectable: true,
			selectMirror: true,
			select: (info) => {
				const startDate = new Date(info.start);
				const endDate = new Date(info.end);
				const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
				if (dayDiff > 1) {
					this.modalManager.openAddModalForMultiSelect(info);
					this.calendar.unselect();
				}
			},

			editable: true,
			eventStartEditable: true,
			eventDurationEditable: false,
			eventResizableFromStart: false,

			eventDrop: (info) => {
				this.eventService.updateEventOnDrop(info);
			},

			eventAllow: function(dropInfo, draggedEvent) {
				return draggedEvent.extendedProps.type === 'personal';
			},

			droppable: true,

			dayMaxEvents: 3,

			eventClassNames: function(arg) {
				return ['unified-event', 'event-type-' + arg.event.extendedProps.type];
			},

			eventContent: function(arg) {
				return {
					html: arg.event.title
				};
			},

			moreLinkClick: (info) => {
				self.listCalendar.gotoDate(info.date);
				return false;
			},

			moreLinkText: function(num) {  // 추가
				return '+' + num;
			},

			dateClick: (info) => {
				this.handleDateClick(info);
			},

			eventClick: (info) => {
				const clickedDate = info.event.start;
				self.listCalendar.gotoDate(clickedDate);
			}
		});
	}

	/**
	 * 날짜 클릭 핸들러 (더블클릭 감지)
	 */
	handleDateClick(info) {
		if (this.clickTimer === null) {
			this.clickTimer = setTimeout(() => {
				this.clickTimer = null;
				// Single-click: Update list view
				this.listCalendar.gotoDate(info.date);
			}, CONFIG.calendar.clickDelay);
		} else {
			clearTimeout(this.clickTimer);
			this.clickTimer = null;
			// Double-click: Open add event modal
			this.modalManager.openAddModal(info);
		}
	}

	/**
	 * 캘린더 렌더링
	 */
	render() {
		this.listCalendar.render();
		this.calendar.render();
	}
}

// ============================================
// 8. 메인 초기화 및 이벤트 리스너 설정
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
	// 인스턴스 생성
	const domElements = new DOMElements();
	const projectService = new ProjectService();
	const modalManager = new ModalManager(domElements);
	const eventService = new EventService(domElements, projectService);
	const calendarManager = new CalendarManager(domElements, modalManager, eventService);

	// 캘린더 초기화
	calendarManager.initialize();

	// 프로젝트 목록 가져오기 및 필터 생성
	const filterElements = domElements.getFilterElements();
	await projectService.fetchAndRenderProjects(filterElements.projectContainer);

	// 캘린더 렌더링
	calendarManager.render();

	// 이벤트 리스너 바인딩
	setupEventListeners(domElements, modalManager, eventService);

	// 필터 체크박스 이벤트 리스너
	setupFilterListeners(eventService, filterElements);
});

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners(domElements, modalManager, eventService) {
	const buttons = domElements.getButtonElements();
	const addModal = domElements.getAddModalElements();
	const editForm = domElements.getEditFormElements();

	// 일정 추가 버튼
	buttons.add.addEventListener('click', async () => {
		const formData = modalManager.getAddFormData();
		const success = await eventService.addEvent(formData);
		if (success) {
			modalManager.closeAddModal();
		}
	});

	// 일정 수정 버튼
	buttons.edit.addEventListener('click', async () => {
		const formData = modalManager.getEditFormData();
		const success = await eventService.updateEvent(formData);
		if (success) {
			modalManager.closeDetailModal();
		}
	});

	// 일정 삭제 버튼
	buttons.delete.addEventListener('click', async () => {
		const event = modalManager.getClickedEvent();
		const success = await eventService.deleteEvent(event);
		if (success) {
			modalManager.closeDetailModal();
		}
	});

	// 수정 뷰 열기 버튼
	buttons.openEdit.addEventListener('click', () => {
		modalManager.showEditView();
	});

	// 수정 취소 버튼
	buttons.cancelEdit.addEventListener('click', () => {
		modalManager.showDetailView();
	});

	// 하루 종일 체크박스 (추가 모달)
	addModal.allDayCheck.addEventListener('change', (e) => {
		modalManager.toggleAllDay(e.target.checked, addModal.start, addModal.end);
	});

	// 하루 종일 체크박스 (수정 모달)
	editForm.allDayCheck.addEventListener('change', (e) => {
		modalManager.toggleAllDay(e.target.checked, editForm.start, editForm.end);
	});
}

/**
 * 필터 체크박스 리스너 설정
 */
function setupFilterListeners(eventService) {
	// 모든 필터를 #filter-container에서 통합 관리
	const filterContainer = document.getElementById('filter-container');

	filterContainer.addEventListener('change', (e) => {
		if (e.target.type === 'checkbox') {
			eventService.refreshCalendars();
		}
	});
}