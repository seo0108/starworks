<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>회의실 예약</title>
</head>

<body>
<div class="page-wrapper-centered mt-4">
  <div class="page-heading">

    <h3 class="mb-3 fw-bold">회의실 예약</h3>
    <p class="text-muted">나의 회의 보기</p>

	<!-- 타임라인 캘린더 -->
	<div class="card">
	    <div class="card-header">
	        <h4 class="card-title">회의실 예약 현황</h4>
	        <div class="d-flex justify-content-between align-items-center mt-3">
	            <div class="form-check form-switch">
	                <input class="form-check-input" type="checkbox" id="filter-my-meetings">
	                <label class="form-check-label" for="filter-my-meetings">내 예약만 보기</label>
	            </div>
	            <h5 class="mb-0">2025-10-17</h5>
	            <button class="btn btn-primary" id="new-reservation-btn">+ 새 예약</button>
	        </div>
	    </div>

		    <div class="card-body">
		        <div id="timeline-container" class="timeline-container table-responsive">
		        <div class="timeline-grid">
		        	<div>
		        	</div>
		        	<div class="timeline-header">09:00</div>
		        	<div class="timeline-header">10:00</div>
		        	<div class="timeline-header">11:00</div>
		        	<div class="timeline-header">12:00</div>
		        	<div class="timeline-header">13:00</div>
		        	<div class="timeline-header">14:00</div>
		        	<div class="timeline-header">15:00</div>
		        	<div class="timeline-header">16:00</div>
		        	<div class="timeline-header">17:00</div>
		        	<div class="timeline-header">18:00</div>
		        	<div class="room-label">412호</div>
		        	<div class="time-slot" data-room="412호" data-hour="9"></div>
		        	<div class="time-slot" data-room="412호" data-hour="10"></div>
		        	<div class="time-slot" data-room="412호" data-hour="11"></div>
		        	<div class="time-slot" data-room="412호" data-hour="12"></div>
		        	<div class="time-slot" data-room="412호" data-hour="13"></div>
		        	<div class="time-slot" data-room="412호" data-hour="14"></div>
		        	<div class="time-slot" data-room="412호" data-hour="15"></div>
		        	<div class="time-slot" data-room="412호" data-hour="16"></div>
		        	<div class="time-slot" data-room="412호" data-hour="17"></div>
		        	<div class="time-slot" data-room="412호" data-hour="18"></div>
		        	<div class="room-label">413호</div>
		        	<div class="time-slot" data-room="413호" data-hour="9"></div>
		        	<div class="time-slot" data-room="413호" data-hour="10"></div>
		        	<div class="time-slot" data-room="413호" data-hour="11"></div>
		        	<div class="time-slot" data-room="413호" data-hour="12"></div>
		        	<div class="time-slot" data-room="413호" data-hour="13"></div>
		        	<div class="time-slot" data-room="413호" data-hour="14"></div>
		        	<div class="time-slot" data-room="413호" data-hour="15"></div>
		        	<div class="time-slot" data-room="413호" data-hour="16"></div>
		        	<div class="time-slot" data-room="413호" data-hour="17"></div>
		        	<div class="time-slot" data-room="413호" data-hour="18"></div>
		        	<div class="room-label">414호</div>
		        	<div class="time-slot" data-room="414호" data-hour="9"></div>
		        	<div class="time-slot" data-room="414호" data-hour="10"></div>
		        	<div class="time-slot" data-room="414호" data-hour="11"></div>
		        	<div class="time-slot" data-room="414호" data-hour="12"></div>
		        	<div class="time-slot" data-room="414호" data-hour="13"></div>
		        	<div class="time-slot" data-room="414호" data-hour="14"></div>
		        	<div class="time-slot" data-room="414호" data-hour="15"></div>
		        	<div class="time-slot" data-room="414호" data-hour="16"></div>
		        	<div class="time-slot" data-room="414호" data-hour="17"></div>
		        	<div class="time-slot" data-room="414호" data-hour="18"></div>
		        </div>
		        <div class="reservation-bar is-mine" data-id="1" style="top: 42px; left: calc(10% + 72px); width: calc(30% - 26px);">주간 업무 회의 (10:00~13:00)</div>
		        <div class="reservation-bar bg-light" data-id="2" style="top: 103px; left: calc(10% + 72px); width: calc(20% - 18px);">긴급 수정사항 (10:00~12:00)</div>
		        <div class="reservation-bar bg-light" data-id="3" style="top: 42px; left: calc(50% + 40px); width: calc(20% - 18px);">인사팀 면접 (14:00~16:00)</div>
		        <div class="reservation-bar is-mine" data-id="4" style="top: 164px; left: calc(70% + 24px); width: calc(20% - 18px);">고객사 미팅 (16:00~18:00)</div>
		    	</div> <!-- timeline-container 끝 -->
			</div> <!-- card-body 끝 -->
		</div> <!-- card 끝 -->

    <!-- 🔹 회의실 예약 현황 -->
<!--     <div class="card mb-4"> -->
<!--       <div class="card-header fw-bold">회의실 예약 현황</div> -->
<!--       <div class="card-body"> -->
<%--         <c:forEach var="room" items="${roomList}"> --%>
<!--           <div class="card mb-3"> -->
<%--             <div class="card-header bg-light fw-bold">${room.roomName}</div> --%>
<!--             <div class="card-body p-0"> -->
<!--               <table class="table table-bordered mb-0 align-middle"> -->
<!--                 <thead class="table-light"> -->
<!--                   <tr> -->
<!--                     <th>회의일</th><th>시작</th><th>종료</th><th>제목</th><th>예약자</th> -->
<!--                   </tr> -->
<!--                 </thead> -->
<!--                 <tbody> -->
<%--                   <c:forEach var="r" items="${reservationList}"> --%>
<%--                     <c:if test="${r.roomId == room.roomId}"> --%>
<!--                       <tr> -->
<%--                         <td>${r.meetingDate}</td> --%>
<%--                         <td>${r.startTime}:00</td> --%>
<%--                         <td>${r.endTime}:00</td> --%>
<%--                         <td>${r.title}</td> --%>
<%--                         <td>${r.userId}</td> --%>
<!--                       </tr> -->
<%--                     </c:if> --%>
<%--                   </c:forEach> --%>
<!--                 </tbody> -->
<!--               </table> -->
<!--             </div> -->
<!--           </div> -->
<%--         </c:forEach> --%>
<!--       </div> -->
<!--     </div> -->

    <!-- 🔹 나의 회의 -->
    <div class="card">
      <div class="card-header fw-bold">나의 회의</div>
      <div class="card-body">
        <div class="row">
          <c:forEach var="memo" items="${memoList}">
            <div class="col-lg-3 col-md-6 mb-4">
              <div class="meeting-note-card category-work">
                <div class="d-flex justify-content-between">
                  <h6 class="fw-bold mb-1">
                    <i class="bi bi-chat-dots me-1"></i>${memo.title}
                  </h6>
                  <div class="dropdown">
                    <a href="#" data-bs-toggle="dropdown" class="btn btn-sm btn-light icon rounded-pill">
                      <i class="bi bi-three-dots-vertical"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                      <a class="dropdown-item" href="#"><i class="bi bi-pencil-fill me-2"></i>수정</a>
                      <a class="dropdown-item text-danger" href="#"><i class="bi bi-trash-fill me-2"></i>삭제</a>
                    </div>
                  </div>
                </div>
                <div class="meeting-memo small mt-2 text-secondary">${memo.contents}</div>
                <div class="small text-muted mt-2">작성자: ${memo.userId}</div>
              </div>
            </div>
          </c:forEach>
        </div>
      </div>
    </div>
  </div>
</div>
  <!-- JS -->
  <script>
  document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("timeline-container");
    const dateDisplay = document.getElementById("selectedDate");
    //현재 날짜
    let currentDate = new Date();

    //현재 날짜를 화면에 표시하는 함수호출
    updateDateLabel();
    //서버에서 회의실 예약 데이터 가져오는 함수
    fetchMeetings();

    //날짜를 YYYY-MM-DD 형식으로 표시하는 함수
    function updateDateLabel() {
      const y = currentDate.getFullYear(); //년
      const m = String(currentDate.getMonth() + 1).padStart(2, '0'); //월
      const d = String(currentDate.getDate()).padStart(2, '0'); //일
      dateDisplay.textContent = `${y}-${m}-${d}`;
    }

    function fetchMeetings() {
      const formatted = dateDisplay.textContent;
      Promise.all([
        fetch("/rest/meeting/room"), // 회의실 목록 요청
        fetch(`/rest/meeting/reservations?date=${formatted}`) // 해당 날짜의 예약 정보 요청
      ])
      .then(async ([roomsRes, reservationsRes]) => {
    	// 두 응답을 JSON으로 파싱
    	const rooms = await roomsRes.json();
        const reservations = await reservationsRes.json();
        console.log("회의실 목록:", rooms);
        console.log("예약 목록:", reservations);
        //타임라인 렌더링 함수 호출
        renderTimeline(rooms, reservations);
      });
    }

    //타임라인을 화면에 그리는 함수
    function renderTimeline(roomList, reservationList) {
      // 기존 내용 초기화 후 새 grid 생성
      const grid = document.createElement("div");
      grid.className = "timeline-grid";
      container.innerHTML = "";
      container.appendChild(grid);

   	  // 표시할 시간대: 9시부터 18시까지 (10칸)
      const hours = Array.from({ length: 10 }, (_, i) => i + 9);
      // 왼쪽 상단 빈 칸 (라벨 자리)
      grid.appendChild(document.createElement("div"));
   	  // 상단 헤더(시간) 셀 생성
      hours.forEach(h => {
        const div = document.createElement("div");
        div.className = "timeline-header";
        div.textContent = `${h}:00`;
        grid.appendChild(div);
      });

   	  // 각 회의실 행에 대해 반복
      roomList.forEach((room, idx) => {
        const label = document.createElement("div");
        label.className = "room-label";
        label.textContent = room.roomName;
        grid.appendChild(label);
     	// 9~18시 칸 생성 (각 칸은 예약 가능 시간 단위)
        hours.forEach(hour => {
          const slot = document.createElement("div");
          slot.className = "time-slot";
          slot.dataset.room = room.roomId; // 어떤 회의실인지 저장
          slot.dataset.hour = hour; // 몇 시인지 저장
          grid.appendChild(slot);
        });

     	// 이 회의실의 예약 데이터만 필터링
        const roomReservations = reservationList.filter(r => r.roomId === room.roomId);
        //예약데이터마다 막대 생성
     	roomReservations.forEach(r => {
          const duration = r.endTime - r.startTime;
          const left = (r.startTime - 9) / 10 * 100;
          const width = duration / 10 * 100;
          const bar = document.createElement("div");
          bar.className = "reservation-bar";
          bar.textContent = r.title;
          bar.title = `${r.title} (${r.startTime}:00~${r.endTime}:00)`;
          bar.style.left = `calc(80px + (${left}%))`;
          bar.style.width = `calc(${width}% - 5px)`;
          bar.style.top = `${60 + idx * 55}px`;
          container.appendChild(bar);
        });
      });
    }
  });
  </script>
</body>
</html>
