/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 15.     	장어진            최초 생성
 *
 * </pre>
 */
const departAttendanceToday = document.querySelector('#depart-attendance-today tbody')
const lateAbsent = document.querySelector('#late-absent ol')

// 페이징 설정
const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let totalAttendanceData = [];

// 캘린더 페이징 변수
const EMPLOYEES_PER_PAGE = 10;
let currentEmployeePage = 1;
let allEmployeesList = [];

let currentCalendarYear = new Date().getFullYear();
let currentCalendarMonth = new Date().getMonth() + 1;

document.addEventListener("DOMContentLoaded", async () => {
	await initializeAttendanceSystem();
})

async function initializeAttendanceSystem() {
	try {
		await Promise.all([
			await getMonthListAttendance(),
			await getDepartAttendance(),
			await departAttendanceCalendar(),
			await weekdayWorkHoursChart(),
		]);

	} catch (error) {
		console.error(error)
	}
}

async function getMonthListAttendance() {
	const url = `/rest/attendance-stats/month-list`;
	const resp = await fetch(url, { method: 'GET' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const data = await resp.json();
	const umaDTOLAList = data.umaDTOLA;

	lateAbsent.innerHTML = '';

	for (let i = 0; i < Math.min(umaDTOLAList.length, 5); i++) {
		const umaDTOLA = umaDTOLAList[i];
		const li = document.createElement('li')
		li.innerHTML = `
				<span>${umaDTOLA.userNm} ${umaDTOLA.jbgdNm}</span>
				<span class="counts">
					 <span class="absent">${umaDTOLA.absentDays}회</span> / <span class="late"> ${umaDTOLA.lateCount}회</span>
				</span>`
		lateAbsent.appendChild(li);
	}
}

function getJbgdName(jbgdCd) {
	switch (jbgdCd) {
		case 'JBGD01':
			return '대표';
		case 'JBGD02':
			return '부장';
		case 'JBGD03':
			return '차장';
		case 'JBGD04':
			return '과장';
		case 'JBGD05':
			return '대리';
		case 'JBGD06':
			return '사원';
		default:
			return '';
	}
}

function formatTime(time) {
	const hours = time.split(":")[0]
	const minutes = time.split(":")[1]

	return `${hours}시 ${minutes}분`
}

function formatHoursMinutes(totalMinutes) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return `${hours}시간 ${minutes}분`;
}

async function departAttendanceCalendar() {
	const url = `/rest/attendance-stats/depart`;

	try {
		const response = await fetch(url);
		const apiData = await response.json();

		if (apiData.adsDTOStatsList && Array.isArray(apiData.adsDTOStatsList)) {
			drawHeatmap(apiData.adsDTOStatsList);
		} else {
			console.error('adsDTOStatsList가 없거나 배열이 아닙니다.');
			drawHeatmap([]);  // 빈 배열로도 그릴 수 있게
		}
	} catch (error) {
		console.error('데이터 로드 실패:', error);
		drawHeatmap([]);
	}

	// ========== 날짜 포맷 변환 (20251017 -> 2025-10-17) ==========
	function formatDate(dateStr) {
		if (!dateStr || dateStr.length !== 8) return null;
		return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
	}

	// ========== 상태 판단 함수 ==========
	function getAttendanceStatus(d, currentDate) {
		const formattedDate = d.formattedDate;

		const dayOfWeek = new Date(formattedDate).getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			return { type: 'single', status: '주말', color: '#E0E0E0' };
		}

		// 미래 날짜 체크
		const cellDate = new Date(formattedDate);
		cellDate.setHours(0, 0, 0, 0);

		if (cellDate > currentDate) {
			return { type: 'single', status: '미래', color: '#FFFFFF' };
		}

		// workBgngDt가 없으면 결근
		if (!d.workBgngDt || d.workBgngDt === null) {
			return { type: 'single', status: '결근', color: '#F44336' };
		}

		if (d.vactYn === 'Y') {
			return { type: 'single', status: '휴가', color: '#2196F3' };
		}

		if (d.bztrYn === 'Y') {
			return { type: 'single', status: '출장', color: '#9C27B0' };
		}

		if (d.lateYn === 'Y' && d.earlyYn === 'Y') {
			return {
				type: 'split',
				status1: '지각',
				color1: '#FFC107',
				status2: '조퇴',
				color2: '#FF9800'
			};
		}

		if (d.lateYn === 'Y') {
			return { type: 'single', status: '지각', color: '#FFC107' };
		}

		if (d.earlyYn === 'Y') {
			return { type: 'single', status: '조퇴', color: '#FF9800' };
		}

		return { type: 'single', status: '정상', color: '#4CAF50' };
	}

	// ========== 둥근 삼각형 path 생성 함수 ==========
	function createRoundedTrianglePath(x, y, width, height, radius, isUpperLeft) {
		const r = Math.min(radius, width * 0.2, height * 0.2);

		if (isUpperLeft) {
			return `
                M ${x + r} ${y}
                L ${x + width - r} ${y}
                Q ${x + width} ${y} ${x + width} ${y + r}
                L ${x + r} ${y + height - r}
                Q ${x} ${y + height} ${x} ${y + height - r}
                L ${x} ${y + r}
                Q ${x} ${y} ${x + r} ${y}
                Z
            `;
		} else {
			return `
                M ${x + width} ${y + r}
                L ${x + width} ${y + height - r}
                Q ${x + width} ${y + height} ${x + width - r} ${y + height}
                L ${x + r} ${y + height}
                Q ${x} ${y + height} ${x + r} ${y + height - r}
                L ${x + width - r} ${y + r}
                Q ${x + width} ${y} ${x + width} ${y + r}
                Z
            `;
		}
	}

	function formatLocalDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function drawHeatmap(rawData) {
		const year = currentCalendarYear;
		const month = currentCalendarMonth;

		// 현재 날짜 (시간 제거)
		const currentDate = new Date();
		currentDate.setHours(0, 0, 0, 0);

		// 해당 월의 모든 날짜 생성
		const startDate = new Date(year, month - 1, 1); // 월의 첫날
		const endDate = new Date(year, month, 0); // 월의 마지막날

		const allDates = [];
		let currentDateLoop = new Date(startDate);

		while (currentDateLoop <= endDate) {
			allDates.push(formatLocalDate(currentDateLoop));
			currentDateLoop.setDate(currentDateLoop.getDate() + 1);
		}

		// 전체 사원 목록 추출
		allEmployeesList = [];
		const employeeJbgdMap = new Map();

		if (rawData && rawData.length > 0) {
			allEmployeesList = Array.from(new Set(rawData.map(d => d.userNm))).filter(name => name);

			rawData.forEach(d => {
				if (d.userNm && d.jbgdCd && !employeeJbgdMap.has(d.userNm)) {
					employeeJbgdMap.set(d.userNm, d.jbgdCd);
				}
			});
		}

		if (allEmployeesList.length === 0) {
			console.warn('사원 데이터가 없습니다.');
			return;
		}

		// 현재 페이지의 사원만 필터링
		const startIndex = (currentEmployeePage - 1) * EMPLOYEES_PER_PAGE;
		const endIndex = Math.min(startIndex + EMPLOYEES_PER_PAGE, allEmployeesList.length);
		const currentPageEmployees = allEmployeesList.slice(startIndex, endIndex);

		// API 데이터를 Map으로 변환
		const apiDataMap = new Map();
		if (rawData && rawData.length > 0) {
			rawData.forEach(d => {
				const formattedDate = formatDate(d.workYmd);
				if (formattedDate) {
					const key = `${d.userNm}-${formattedDate}`;
					apiDataMap.set(key, d);
				}
			});
		}

		// 현재 페이지 사원들의 데이터만 생성
		const data = [];
		currentPageEmployees.forEach(employee => {
			allDates.forEach(date => {
				const key = `${employee}-${date}`;
				const existingData = apiDataMap.get(key);

				if (existingData) {
					data.push({
						...existingData,
						formattedDate: date
					});
				} else {
					data.push({
						workYmd: date.replace(/-/g, ''),
						userId: employee.replace(/\s/g, ''),
						userNm: employee,
						jbgdCd: employeeJbgdMap.get(employee),
						workBgngDt: null,
						workEndDt: null,
						lateYn: null,
						earlyYn: null,
						vactYn: null,
						bztrYn: null,
						formattedDate: date
					});
				}
			});
		});

		const container = document.querySelector("#depart-attendance-calendar");
		const containerWidth = container.clientWidth || 1200;  // 기본값

		// 설정 - 셀 크기 75% 축소
		const margin = { top: 67, right: 30, bottom: 0, left: 90 };
		const cellGapRatio = 0.05;

		const availableWidth = containerWidth - margin.left - margin.right;
		const totalGapWidth = availableWidth * cellGapRatio;
		const cellWidth = ((availableWidth - totalGapWidth) / allDates.length); // 70% 크기
		const cellGap = totalGapWidth / (allDates.length - 1);

		const cellSize = cellWidth;

		// 전체 너비 계산 (75% 크기 반영)
		const actualWidth = (allDates.length * cellSize) + ((allDates.length - 1) * cellGap);
		const width = actualWidth;
		const height = (currentPageEmployees.length * cellSize) + ((currentPageEmployees.length - 1) * cellGap);

		// SVG 생성
		d3.select("#depart-attendance-calendar").selectAll("*").remove();

		const svg = d3.select("#depart-attendance-calendar")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		function getXPosition(index) {
			return index * (cellSize + cellGap);
		}

		function getYPosition(index) {
			return index * (cellSize + cellGap);
		}

		const yAxisGroup = svg.append("g");

		currentPageEmployees.forEach((employee, index) => {
			const jbgdCd = employeeJbgdMap.get(employee);
			const jbgdName = getJbgdName(jbgdCd);
			const label = jbgdName ? `${jbgdName} ${employee}` : employee;

			yAxisGroup.append("text")
				.attr("x", -15)
				.attr("y", getYPosition(index) + cellSize / 2)
				.attr("text-anchor", "end")
				.attr("alignment-baseline", "middle")
				.style("font-size", "14px")
				.style("fill", "#333")
				.text(label);
		});

		// X축 (날짜)
		allDates.forEach((date, index) => {
			const day = new Date(date).getDate();
			const dayOfWeek = new Date(date).getDay();
			const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

			svg.append("text")
				.attr("x", getXPosition(index) + cellSize / 2)
				.attr("y", -10)
				.attr("text-anchor", "middle")
				.style("font-size", "14px")
				.style("fill", isWeekend ? "#999" : "#333")
				.text(day);
		});

		// 툴팁
		const tooltip = d3.select("body")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "10px")
			.style("pointer-events", "none")
			.style("z-index", "9999");

		const mouseover = function(event, d) {
			tooltip.style("opacity", 1);
		};

		const mousemove = function(event, d) {
			const statusInfo = getAttendanceStatus(d, currentDate);
			const displayDate = `${new Date(d.formattedDate).getMonth() + 1}/${new Date(d.formattedDate).getDate()}`;

			const jbgdName = getJbgdName(d.jbgdCd);
			const employeeInfo = jbgdName ? `${jbgdName} ${d.userNm}` : d.userNm;

			let statusText = statusInfo.type === 'split'
				? `${statusInfo.status1} / ${statusInfo.status2}`
				: statusInfo.status;

			tooltip
				.html(`<strong>날짜:</strong> ${displayDate}<br><strong>사원:</strong> ${employeeInfo}<br><strong>근태:</strong> ${statusText}`)
				.style("left", (event.pageX + 15) + "px")
				.style("top", (event.pageY - 15) + "px");
		};

		const mouseleave = function(event, d) {
			tooltip.style("opacity", 0);
		};

		// 셀 그리기
		const cells = svg.selectAll('.cell-group')
			.data(data, d => d.userNm + ':' + d.formattedDate)
			.join("g")
			.attr("class", "cell-group")
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave);

		cells.each(function(d) {
			const statusInfo = getAttendanceStatus(d, currentDate);
			const dateIndex = allDates.indexOf(d.formattedDate);
			const empIndex = currentPageEmployees.indexOf(d.userNm);

			const cellX = getXPosition(dateIndex);
			const cellY = getYPosition(empIndex);
			const cellWidth = cellSize;  // ⭐ 모든 셀 동일한 너비
			const cellHeight = cellSize;  // ⭐ 모든 셀 동일한 높이
			//			const cornerRadius = 3;
			const cornerRadius = Math.min(3, cellSize * 0.1);

			if (statusInfo.type === 'single') {
				d3.select(this)
					.append("rect")
					.attr("x", cellX)
					.attr("y", cellY)
					.attr("rx", cornerRadius)
					.attr("ry", cornerRadius)
					.attr("width", cellWidth)
					.attr("height", cellHeight)
					.style("fill", statusInfo.color)
					.style("stroke", "#ddd")
					.style("stroke-width", 0.2);
			} else {
				d3.select(this)
					.append("path")
					.attr("d", createRoundedTrianglePath(cellX, cellY, cellWidth, cellHeight, cornerRadius, true))
					.style("fill", statusInfo.color1)
					.style("stroke", "white")
					.style("stroke-width", 0.2);

				d3.select(this)
					.append("path")
					.attr("d", createRoundedTrianglePath(cellX, cellY, cellWidth, cellHeight, cornerRadius, false))
					.style("fill", statusInfo.color2)
					.style("stroke", "white")
					.style("stroke-width", 0.2);
			}
		});

		// ⭐ 제목과 이전/다음 버튼
		const titleGroup = svg.append("g");

		// 이전 월 버튼 - 미니멀
		const prevButton = titleGroup.append("g")
			.attr("transform", "translate(-85, -65)")
			.style("cursor", "pointer")
			.on("click", () => changeCalendarMonth(-1));

		prevButton.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 35)
			.attr("height", 35)
			.attr("rx", 8)
			.style("fill", "transparent")
			.style("stroke", "#e0e0e0")
			.style("stroke-width", "1.5px")

		prevButton.append("path")
			.attr("d", "M 12 17.5 L 21 10 L 21 25 Z")
			.style("fill", "#666");

		prevButton.on("mouseover", function() {
			d3.select(this).select("rect")
				.style("fill", "#f5f7fa")
				.style("stroke", "#435ebe");
			d3.select(this).select("path")
				.style("fill", "#435ebe");
		})
			.on("mouseout", function() {
				d3.select(this).select("rect")
					.style("fill", "transparent")
					.style("stroke", "#e0e0e0");
				d3.select(this).select("path")
					.style("fill", "#666");
			});

		// 제목 (이전 버튼 바로 옆)
		const mainTitle = titleGroup.append("text")
			.attr("x", -40)
			.attr("y", -40)
			.attr("text-anchor", "left")
			.style("font-size", "20px")
			.style("font-weight", "bold")
			.style("fill", "#333")
			.text(`${year}년 ${month}월 부서 근태 현황 캘린더`);

		// ⭐ 제목의 실제 너비 측정
		const titleBBox = mainTitle.node().getBBox();
		const titleWidth = titleBBox.width;

		// 다음 월 버튼 - 미니멀
		const nextButton = titleGroup.append("g")
			.attr("transform", `translate(${-30 + titleWidth}, -65)`)
			.style("cursor", "pointer")
			.on("click", () => changeCalendarMonth(1));

		nextButton.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 35)
			.attr("height", 35)
			.attr("rx", 8)
			.style("fill", "transparent")
			.style("stroke", "#e0e0e0")
			.style("stroke-width", "1.5px");

		nextButton.append("path")
			.attr("d", "M 23 17.5 L 14 10 L 14 25 Z")
			.style("fill", "#666");

		nextButton.on("mouseover", function() {
			d3.select(this).select("rect")
				.style("fill", "#f5f7fa")
				.style("stroke", "#435ebe");
			d3.select(this).select("path")
				.style("fill", "#435ebe");
		})
			.on("mouseout", function() {
				d3.select(this).select("rect")
					.style("fill", "transparent")
					.style("stroke", "#e0e0e0");
				d3.select(this).select("path")
					.style("fill", "#666");
			});

		// 범례 (부제목 옆에 동적 배치)
		const legend = svg.append("g")
			.attr("transform", `translate(420, -57)`);

		const legendData = getLegendDataForHeatmap();

		legendData.forEach((item, index) => {
			const xOffset = index * 60;

			legend.append("rect")
				.attr("x", xOffset)
				.attr("y", 0)
				.attr("width", 12)
				.attr("height", 12)
				.attr("rx", 2)
				.attr("fill", item.color);

			legend.append("text")
				.attr("x", xOffset + 16)
				.attr("y", 11)
				.style("font-size", "16px")
				.style("fill", "#666")
				.text(item.status);
		});

		renderCalendarPagination(allEmployeesList.length);
	}
}

let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		departAttendanceCalendar();
	}, 300);
});

async function weekdayWorkHoursChart() {
	const url = `/rest/attendance-stats/depart`;

	try {
		const response = await fetch(url);
		const apiData = await response.json();

		if (apiData.adsDTOStatsList && Array.isArray(apiData.adsDTOStatsList)) {
			drawWorkHoursChart(apiData.adsDTOStatsList);
		} else {
			console.error('adsDTOStatsList가 없거나 배열이 아닙니다.');
		}
	} catch (error) {
		console.error('데이터 로드 실패:', error);
	}

	// ========== 날짜 포맷 변환 ==========
	function formatDate(dateStr) {
		if (!dateStr || dateStr.length !== 8) return null;
		return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
	}

	// ========== 요일 한글 변환 ==========
	function getDayOfWeekKorean(dayNum) {
		const days = ['일', '월', '화', '수', '목', '금', '토'];
		return days[dayNum];
	}

	// ========== 차트 그리기 ==========
	function drawWorkHoursChart(rawData) {

		// 출근한 사람만 필터링 (workBgngDt가 있는 경우)
		const attendedData = rawData.filter(d =>
			d.workBgngDt &&
			d.workYmd &&
			formatDate(d.workYmd)
		);

		// 요일별 데이터 집계
		const dayStats = {
			1: { day: '월', totalRegular: 0, totalOvertime: 0, count: 0 },
			2: { day: '화', totalRegular: 0, totalOvertime: 0, count: 0 },
			3: { day: '수', totalRegular: 0, totalOvertime: 0, count: 0 },
			4: { day: '목', totalRegular: 0, totalOvertime: 0, count: 0 },
			5: { day: '금', totalRegular: 0, totalOvertime: 0, count: 0 }
		};

		attendedData.forEach(d => {
			const formattedDate = formatDate(d.workYmd);
			if (!formattedDate) return;

			const dayOfWeek = new Date(formattedDate).getDay();

			// 평일만 집계 (월~금)
			if (dayOfWeek >= 1 && dayOfWeek <= 5) {
				const workHr = parseFloat(d.workHr) || 0;  // 총 근로시간 (분)
				const overtimeHr = parseFloat(d.overtimeHr) || 0;  // 연장근무시간 (분)
				const regularHr = Math.max(0, workHr - overtimeHr);  // 기본 근로시간 (분)

				dayStats[dayOfWeek].totalRegular += regularHr;
				dayStats[dayOfWeek].totalOvertime += overtimeHr;
				dayStats[dayOfWeek].count += 1;
			}
		});

		// 평균 계산 및 시간 단위 변환 (분 → 시간)
		const chartData = Object.values(dayStats).map(stat => {
			const avgRegular = stat.count > 0 ? stat.totalRegular / stat.count / 60 : 0;
			const avgOvertime = stat.count > 0 ? stat.totalOvertime / stat.count / 60 : 0;

			return {
				day: stat.day,
				regularHours: avgRegular,
				overtimeHours: avgOvertime,
				totalHours: avgRegular + avgOvertime,
				count: stat.count
			};
		});

		// ========== 차트 설정 ==========
		const container = document.querySelector("#weekday-workhours");
		const containerWidth = container.clientWidth || 600;

		const margin = { top: 60, right: 40, bottom: 50, left: 60 };
		const width = containerWidth - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		// SVG 생성
		d3.select("#weekday-workhours").selectAll("*").remove();

		const svg = d3.select("#weekday-workhours")
			.append("svg")
			.attr("width", containerWidth)
			.attr("height", 400)
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// X축 스케일
		const x = d3.scaleBand()
			.domain(chartData.map(d => d.day))
			.range([0, width])
			.padding(0.3);

		// ⭐ Y축 스케일 (0~14시간 고정)
		const y = d3.scaleLinear()
			.domain([0, 14])
			.range([height, 0]);

		// 색상
		const colorRegular = '#435ebe';
		const colorOvertime = '#dc3545';

		// X축 그리기
		svg.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(d3.axisBottom(x))
			.style("font-size", "14px")
			.style("font-weight", "500")
			.select(".domain")
			.remove();

		// Y축 그리기
		svg.append("g")
			.call(d3.axisLeft(y).ticks(10))
			.style("font-size", "12px")
			.select(".domain")
			.remove();

		// Y축 라벨
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -50)
			.attr("x", -height / 2)
			.attr("text-anchor", "middle")
			.style("font-size", "13px")
			.style("fill", "#666")
			.text("평균 근로시간 (시간)");

		// 2. 8시간 기준선만 표시
		svg.append("line")
			.attr("x1", 0)
			.attr("x2", width)
			.attr("y1", y(8))
			.attr("y2", y(8))
			.style("stroke", "#FF5252")
			.style("stroke-width", "1px")
			.style("stroke-dasharray", "5,5");

		svg.append("line")
			.attr("x1", width)
			.attr("x2", width)
			.attr("y1", y(8))
			.attr("y2", 50)
			.style("stroke", "#FF5252")
			.style("stroke-width", "1px")
			.style("stroke-dasharray", "5,5");

		// 8시간 기준선 라벨
		svg.append("text")
			.attr("x", width + 20)
			.attr("y", y(8) - 80)
			.attr("text-anchor", "end")
			.style("font-size", "11px")
			.style("fill", "#FF5252")
			.style("font-weight", "bold")
			.text("기본 근로시간 (8시간)");

		// 툴팁
		const tooltip = d3.select("body")
			.append("div")
			.style("opacity", 0)
			.attr("class", "chart-tooltip")
			.style("position", "absolute")
			.style("background-color", "rgba(0, 0, 0, 0.8)")
			.style("color", "white")
			.style("border-radius", "5px")
			.style("padding", "10px")
			.style("pointer-events", "none")
			.style("font-size", "12px")
			.style("z-index", "9999");

		svg.selectAll(".bar-regular")
			.data(chartData)
			.enter()
			.append("rect")
			.attr("class", "bar-regular")
			.attr("x", d => x(d.day))
			.attr("y", d => y(d.regularHours))
			.attr("width", x.bandwidth())
			.attr("height", d => Math.max(0, height - y(d.regularHours)))
			.attr("fill", colorRegular)
			.attr("rx", 0)
			.on("mouseover", function(event, d) {
				tooltip.style("opacity", 1);
				d3.select(this).style("opacity", 0.8);
			})
			.on("mousemove", function(event, d) {
				tooltip
					.html(`
                        <strong>${d.day}요일</strong><br>
                        기본 근로: ${d.regularHours.toFixed(1)}시간<br>
                        연장 근무: ${d.overtimeHours.toFixed(1)}시간<br>
                        <strong>총: ${d.totalHours.toFixed(1)}시간</strong><br>
                        <span style="color: #ccc; font-size: 11px;">(${d.count}건 평균)</span>
                    `)
					.style("left", (event.pageX + 15) + "px")
					.style("top", (event.pageY - 15) + "px");
			})
			.on("mouseout", function() {
				tooltip.style("opacity", 0);
				d3.select(this).style("opacity", 1);
			});

		svg.selectAll(".bar-overtime")
			.data(chartData)
			.enter()
			.append("rect")
			.attr("class", "bar-overtime")
			.attr("x", d => x(d.day))
			.attr("y", d => y(d.totalHours))
			.attr("width", x.bandwidth())
			.attr("height", d => y(d.regularHours) - y(d.totalHours))
			.attr("fill", colorOvertime)
			.attr("rx", 0)
			.on("mouseover", function(event, d) {
				tooltip.style("opacity", 1);
				d3.select(this).style("opacity", 0.8);
			})
			.on("mousemove", function(event, d) {
				tooltip
					.html(`
                        <strong>${d.day}요일</strong><br>
                        기본 근로: ${d.regularHours.toFixed(1)}시간<br>
                        연장 근무: ${d.overtimeHours.toFixed(1)}시간<br>
                        <strong>총: ${d.totalHours.toFixed(1)}시간</strong><br>
                        <span style="color: #ccc; font-size: 11px;">(${d.count}건 평균)</span>
                    `)
					.style("left", (event.pageX + 15) + "px")
					.style("top", (event.pageY - 15) + "px");
			})
			.on("mouseout", function() {
				tooltip.style("opacity", 0);
				d3.select(this).style("opacity", 1);
			});

		// 수치 라벨 (막대 위)
		svg.selectAll(".label")
			.data(chartData)
			.enter()
			.append("text")
			.attr("class", "label")
			.attr("x", d => x(d.day) + x.bandwidth() / 2)
			.attr("y", d => y(d.totalHours) - 5)
			.attr("text-anchor", "middle")
			.style("font-size", "12px")
			.style("font-weight", "bold")
			.style("fill", "#333")
			.text(d => d.totalHours.toFixed(1) + 'h');

		// 제목
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", -30)
			.attr("text-anchor", "middle")
			.style("font-size", "18px")
			.style("font-weight", "bold")
			.style("fill", "#333")
			.text("요일별 평균 근로시간");

		// 범례
		const legend = svg.append("g")
			.attr("transform", `translate(${width - 150}, -10)`);

		legend.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", colorRegular)
			.attr("rx", 2);

		legend.append("text")
			.attr("x", 20)
			.attr("y", 12)
			.style("font-size", "12px")
			.text("기본 근로");

		legend.append("rect")
			.attr("x", 80)
			.attr("y", 0)
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", colorOvertime)
			.attr("rx", 2);

		legend.append("text")
			.attr("x", 100)
			.attr("y", 12)
			.style("font-size", "12px")
			.text("연장 근무");
	}
}

// 기존 getDepartAttendance 함수 수정
async function getDepartAttendance() {
	const url = `/rest/attendance-stats/depart`;
	const resp = await fetch(url, { method: 'GET' });

	if (!resp.ok) {
		throw new Error(`HTTP error! status: ${resp.status}`);
	}

	const data = await resp.json();
	const adsDTOList = data.adsDTOList

	if (adsDTOList && adsDTOList.length > 0) {
		// 통계 업데이트
		const adsDTOCnt = adsDTOList.length;
		document.getElementById('allNum').innerHTML = adsDTOCnt

		const c101Cnt = adsDTOList.filter(adsDTO => adsDTO.workSttsCd === "C101").length;
		const c102Cnt = adsDTOList.filter(adsDTO => adsDTO.workSttsCd === "C102").length;
		document.getElementById('workingNum').innerHTML = c101Cnt + c102Cnt;

		const c104Cnt = adsDTOList.filter(adsDTO => adsDTO.workSttsCd === "C104").length;
		document.getElementById('businessTripNum').innerHTML = c104Cnt;

		const c105Cnt = adsDTOList.filter(adsDTO => adsDTO.workSttsCd === "C105").length;
		document.getElementById('vacationNum').innerHTML = c105Cnt;

		// 전체 데이터 저장
		totalAttendanceData = adsDTOList;

		// 페이징 표시
		displayAttendanceData(1);
	}
}

// 페이징 처리 함수
function displayAttendanceData(page = 1) {
	const paging = calculatePaginationInfo(totalAttendanceData.length, page);
	currentPage = paging.currentPage;

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalAttendanceData.length);
	const pageData = totalAttendanceData.slice(startIndex, endIndex);

	departAttendanceToday.innerHTML = '';

	if (pageData.length > 0) {
		pageData.forEach(adsDTO => {
			const workSttsCd = adsDTO.workSttsCd
			const jbgdCd = adsDTO.jbgdCd
			let workStts = null;

			switch (workSttsCd) {
				case 'C101': workStts = '근무 중'; break;
				case 'C102': workStts = '자리 비움'; break;
				case 'C103': workStts = '미출근'; break;
				case 'C104': workStts = '출장'; break;
				case 'C105': workStts = '휴가'; break;
				case null: workStts = '미출근'; break;
			}

			const tr = document.createElement('tr');
			tr.innerHTML = `
                <td>${getJbgdName(jbgdCd)}</td>
                <td>${adsDTO.userNm}</td>
                <td>${workStts}</td>
                <td>${adsDTO.workBgngDt != null ? formatTime(adsDTO.workBgngDt.split('T')[1]) : "-"}</td>
                <td>${adsDTO.workEndDt != null ? formatTime(adsDTO.workEndDt.split('T')[1]) : "-"}</td>
                <td>${adsDTO.workHr != null ? adsDTO.workHr != '0' ? formatHoursMinutes(adsDTO.workHr) : "-" : "-"}</td>
            `;
			departAttendanceToday.appendChild(tr);
		});

		// 10개 미만일 경우 빈 행 추가
		const emptyRowsCount = ITEMS_PER_PAGE - pageData.length;
		for (let i = 0; i < emptyRowsCount; i++) {
			const tr = document.createElement('tr');
			tr.className = 'empty-row';
			tr.innerHTML = `
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            `;
			departAttendanceToday.appendChild(tr);
		}
	}

	// 페이지네이션 렌더링
	const paginationHtml = renderPagination(paging, 'goToPage');

	let paginationContainer = document.getElementById('attendance-pagination');
	if (!paginationContainer) {
		paginationContainer = document.createElement('div');
		paginationContainer.id = 'attendance-pagination';
		paginationContainer.className = 'card-footer';

		const card = document.querySelector('#depart-attendance-today').closest('.card');
		card.appendChild(paginationContainer);
	}

	paginationContainer.innerHTML = paginationHtml;
}

// 페이지 이동 함수
function goToPage(page) {
	displayAttendanceData(page);
}

// 페이지 계산 함수
function calculatePaginationInfo(totalRecords, currentPage) {
	const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
	const screenSize = 5;
	const blockSize = 5;

	return {
		totalRecords: totalRecords,
		screenSize: screenSize,
		blockSize: blockSize,
		currentPage: currentPage,
		totalPages: totalPages,
		startPage: Math.floor((currentPage - 1) / blockSize) * blockSize + 1,
		endPage: Math.min(Math.floor((currentPage - 1) / blockSize) * blockSize + blockSize, totalPages),
		startRow: (currentPage - 1) * ITEMS_PER_PAGE + 1,
		endRow: Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)
	};
}

// 페이지네이션 HTML 렌더링
function renderPagination(paginationInfo, funcName) {
	const { currentPage, totalPages, startPage, endPage } = paginationInfo;

	let html = '<nav><ul class="pagination justify-content-center">';

	// 이전 블록
	if (startPage > 1) {
		html += `<li class="page-item"><a class="page-link" href="javascript:${funcName}(${startPage - 1})">‹</a></li>`;
	} else {
		html += `<li class="page-item disabled"><span class="page-link">‹</span></li>`;
	}

	// 페이지 번호
	for (let i = startPage; i <= endPage; i++) {
		if (i === currentPage) {
			html += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
		} else {
			html += `<li class="page-item"><a class="page-link" href="javascript:${funcName}(${i})">${i}</a></li>`;
		}
	}

	// 다음 블록
	if (endPage < totalPages) {
		html += `<li class="page-item"><a class="page-link" href="javascript:${funcName}(${endPage + 1})">›</a></li>`;
	} else {
		html += `<li class="page-item disabled"><span class="page-link">›</span></li>`;
	}

	html += '</ul></nav>';
	return html;
}

// 사원 페이지 변경 함수
function changeEmployeePage(page) {
	currentEmployeePage = page;
	departAttendanceCalendar();
}

// 캘린더 페이지네이션 렌더링 (근태 리스트 스타일과 동일하게)
function renderCalendarPagination(totalEmployees) {
	const pagination = document.getElementById('calendar-pagination');
	if (!pagination) return;

	const totalPages = Math.ceil(totalEmployees / EMPLOYEES_PER_PAGE);

	if (totalPages <= 1) {
		pagination.innerHTML = '';
		return;
	}

	const blockSize = 5;
	const startPage = Math.floor((currentEmployeePage - 1) / blockSize) * blockSize + 1;
	const endPage = Math.min(startPage + blockSize - 1, totalPages);

	let html = '<nav><ul class="pagination justify-content-center">';

	// 이전 블록
	if (startPage > 1) {
		html += `<li class="page-item"><a class="page-link" href="javascript:changeEmployeePage(${startPage - 1})">‹</a></li>`;
	} else {
		html += `<li class="page-item disabled"><span class="page-link">‹</span></li>`;
	}

	// 페이지 번호
	for (let i = startPage; i <= endPage; i++) {
		if (i === currentEmployeePage) {
			html += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
		} else {
			html += `<li class="page-item"><a class="page-link" href="javascript:changeEmployeePage(${i})">${i}</a></li>`;
		}
	}

	// 다음 블록
	if (endPage < totalPages) {
		html += `<li class="page-item"><a class="page-link" href="javascript:changeEmployeePage(${endPage + 1})">›</a></li>`;
	} else {
		html += `<li class="page-item disabled"><span class="page-link">›</span></li>`;
	}

	html += '</ul></nav>';
	pagination.innerHTML = html;
}

// 월 변경 함수
function changeCalendarMonth(direction) {
	currentCalendarMonth += direction;

	// 월이 12를 넘으면 다음 해로
	if (currentCalendarMonth > 12) {
		currentCalendarMonth = 1;
		currentCalendarYear++;
	}
	// 월이 1보다 작으면 이전 해로
	else if (currentCalendarMonth < 1) {
		currentCalendarMonth = 12;
		currentCalendarYear--;
	}

	// 사원 페이지는 1페이지로 초기화
	currentEmployeePage = 1;

	// 캘린더 다시 그리기
	departAttendanceCalendar();
}

// 현재 월로 돌아가는 함수 (선택사항)
function goToCurrentMonth() {
	const today = new Date();
	currentCalendarYear = today.getFullYear();
	currentCalendarMonth = today.getMonth() + 1;
	currentEmployeePage = 1;
	departAttendanceCalendar();
}

function getLegendDataForHeatmap() {
	return [
		{ status: '정상', color: '#4CAF50' },
		{ status: '지각', color: '#FFC107' },
		{ status: '조퇴', color: '#FF9800' },
		{ status: '결근', color: '#F44336' },
		{ status: '휴가', color: '#2196F3' },
		{ status: '출장', color: '#9C27B0' },
		{ status: '주말', color: '#E0E0E0' }
	];
}
