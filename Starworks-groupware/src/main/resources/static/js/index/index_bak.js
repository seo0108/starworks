/**
 * <pre>
 * << 개정이력(Modification Information) >>
 *
 *   수정일      			수정자           수정내용
 *  -----------   	-------------    ---------------------------
 * 2025. 10. 23.     	윤서현            최초 생성
 *
 * </pre>
 */

const workStartBtn = document.getElementById("clock-in-btn");
const workEndBtn = document.getElementById("clock-out-btn");

const currentTimeDiv = document.getElementById("current-time");

const workTimerDiv = document.getElementById("work-timer");

//날씨 설정
document.addEventListener("DOMContentLoaded", async () => {
  const weatherDiv = document.getElementById("weather-info");
  if (!weatherDiv) return;

  const apiKey = "a70fa70c8d3284d63b510ec9aade4cd7"; // 발급받은 키
  const city = "Daejeon,KR";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=kr`;

  weatherDiv.textContent = "날씨 정보를 불러오는 중...";

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      console.error("API 오류:", data.message);
      weatherDiv.textContent = "날씨 정보를 불러올 수 없습니다.";
      return;
    }

    const temp = data.main.temp.toFixed(1);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    weatherDiv.innerHTML = `
      <span style="display:flex;align-items:center;gap:8px;">
        <img src="https://openweathermap.org/img/wn/${icon}.png"
             alt="${desc}" style="width:30px;height:30px;">
        <span>현재 대전은 <strong>${desc}</strong>,
        온도는 <strong>${temp}°C</strong> 입니다.</span>
      </span>
    `;
  } catch (err) {
    console.error("API 요청 실패:", err);
    weatherDiv.textContent = "날씨 정보를 불러오는 데 실패했습니다.";
  }
});





// 근무시간 시계 동작
document.addEventListener("DOMContentLoaded", async () => {
	reset();
});

let timerId = null;
const reset = async () => {
	if(timerId) clearInterval(timerId); // 기존 interval 제거
	let workStatus = await getWorkStatus();
	timerId = setInterval(() => updateTime(workStatus), 1000);
	updateTime(workStatus);
}


// 대시보드 출근 버튼 클릭
workStartBtn.addEventListener("click", async () => {

	try {
		const url = `/rest/attendance`;
		const resp = await fetch(url, { method: 'POST' });

		if (!resp.ok) {
			throw new Error(`HTTP error! status: ${resp.status}`);
		}

		const data = await resp.json();

		if (data.success) {

			// 출근에 성공하면 Toastify로 실시간 표시
			Toastify({
				text: "출근 완료! 좋은 하루 되세요 ☀️",
				duration: 4000,
				close: true,
				offset: {
					y: '3.7rem'
				},
			}).showToast();

			workStartBtn.setAttribute("disabled", "disabled");
			workEndBtn.removeAttribute("disabled");

			let workStartTime = await getWorkStatus();
			workStartTime = workStartTime.workBgngDt
			currentTimeDiv.innerHTML = workStartTime.substring(workStartTime.indexOf('T') + 1);

			reset();


		} else {
			console.log("실패")
		}

	} catch (error) {
		showToast('error', '출근 처리 중 오류가 발생했습니다.');
	}
})

// 대시보드 퇴근 버튼 클릭
workEndBtn.addEventListener("click", async () => {
	try {
		const now = new Date();

		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const day = now.getDate().toString().padStart(2, '0');

		const yyyymmdd = `${year}${month}${day}`;

		const url = `/rest/attendance`;
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
		if (!resp.ok) {
			throw new Error(`HTTP error! status: ${resp.status}`);
		}

		const data = await resp.json();
		if (data.success) {

			// 퇴근에 성공하면 Toastify로 실시간 표시
			Toastify({
				text: "퇴근 완료! 오늘도 수고하셨습니다 🌙",
				duration: 4000,
				close: true,
				offset: {
					y: '3.7rem'
				},
			}).showToast();

			workEndBtn.setAttribute("disabled", "disabled");

			reset();

		} else {
			console.log("실패")
		}

	} catch (error) {
		showToast('error', '퇴근 처리 중 오류가 발생했습니다.');
	}
})

// 오늘 출근 기록 가져오기
const getWorkStatus = async () => {
	const resp = await fetch(`/rest/attendance/${window.username}/today`)
	const data = await resp.json();

	if (data != null) {
		return data.taaVO;
	}

	return null;
}

// 실시간 시계
const updateTime = (workStatus) => {
	const now = new Date();
	const timeString = now.toLocaleTimeString('ko-KR');

//	let workStatus = await getWorkStatus();

	if (workStatus.workBgngDt) {
		if(workStatus.workEndDt == null) {
			const start = new Date(workStatus.workBgngDt);
			const diffMin = now - start; // 밀리초 차이

			// 시, 분, 초 계산
			const hours = Math.floor(diffMin / (1000 * 60 * 60));
			const minutes = Math.floor((diffMin % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diffMin % (1000 * 60)) / 1000);

			// 두 자리 수 포맷 (예: 01, 09, 12)
			const pad = (num) => String(num).padStart(2, '0');

			workTimerDiv.innerHTML = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
		} else {
			// 출근/퇴근 모두 찍혔으면 오늘 근무시간 종료
			let workHr = workStatus.workHr;

			// 시, 분, 초 계산
			const hours = Math.floor(workHr / 60);
			const minutes = workHr % 60;
			const seconds = 0; // 분 단위라면 초는 0으로 설정

			// 두 자리수 포맷 함수
			const pad = (num) => String(num).padStart(2, '0');

			// HH:MM:SS 형식으로 변환
			const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

			workTimerDiv.innerHTML = formattedTime;
		}
	}
}

// 날짜 및 시간 실시간 업데이트
document.addEventListener("DOMContentLoaded", () => {
  const timeIcon = document.getElementById("time-icon");
  const timeText = document.getElementById("time-text");
  const dateDisplay = document.getElementById("date-display");

  if (!timeIcon || !timeText || !dateDisplay) return;

  function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();

    // 아이콘 설정
    if (hours >= 5 && hours < 12) {
        timeIcon.textContent = '🌄'; // 아침
    } else if (hours >= 12 && hours < 18) {
        timeIcon.textContent = '☀️'; // 낮
    } else {
        timeIcon.textContent = '🌙'; // 저녁/밤
    }

    // 시간 포맷팅 (HH:mm:ss)
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeText.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;

    // 날짜 포맷팅 (YYYY년 MM월 DD일 요일)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const day = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
    dateDisplay.textContent = `${year}년 ${month}월 ${date}일 ${day}요일`;
  }

  updateDateTime(); // 초기 로딩 시 즉시 실행
  setInterval(updateDateTime, 1000); // 1초마다 업데이트
});
