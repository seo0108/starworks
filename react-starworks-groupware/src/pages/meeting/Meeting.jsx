import { useEffect, useState } from 'react';
import axiosInst from '../../api/apiClient';
import { showAlert, showToast } from '../../api/sweetAlert';
import MeetingCreateModal from './MeetingCreateModal';
import MeetingModifyModal from './MeetingModifyModal';
import "./Meeting.css";
function Meeting() {

     const now = new Date();
    // YYYY-MM-DD 형식으로 세팅
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    let resetOtherday = "";
    resetOtherday = tomorrow.toISOString().split('T')[0];

    const [meetingRoomList, setMeetingRoomList] = useState([]); // 회의실 목록
    const [meetingReservationList , setMeetingReservationList] = useState([]); // 회의실 예약 목록
    const [meetingOtherdayReservationList , setmeetingOtherdayReservationList] = useState([]); // 다른날 회의실 예약 목록
    const [meetingOtherday, setMeetingOtherDay] = useState(resetOtherday); // 선택한 다른날.. (기본값은 다음날)

    const [meetingRecurringBookingList, setMeetingRecurringBookingList] = useState([]); // 회의실 반복예약 신청 목록
    const [meetingRecurringBookingApprovalList, setMeetingRecurringBookingApprovalList] = useState([]); // 회의실 반복예약 신청 목록
    const [meetingRecurringBookingAllList, setMeetingRecurringBookingAllList] = useState([]);
    const [currentTime, setCurrentTime] = useState(""); // 현재 시각
    const [selectedRoom, setSeletedRoom] = useState([]); // 선택한 회의실 Id

    useEffect(() => {
        refresh();

        const date = new Date();
        setCurrentTime(date.getHours());
    }, []);

    useEffect(() => {
        getOtherdayMeetingReservationList(meetingOtherday);
    }, [meetingOtherday]);

    const refresh = () => {
        getMeetingRoomList();
        getTodayMeetingReservationList();
        getMeetingRecurringBookingList();
        getMeetingRecurringBookApprovalList();
        getMeetingRecurringBookingAllList();
        getOtherdayMeetingReservationList(meetingOtherday);
    }

    // 그냥 예약된거 취소
    const handleReservationCancel = (recurringId) => {

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

            axiosInst.delete(`/meeting/${recurringId}`)
            .then(({data}) => {
                if (data.success) {
                        refresh();
                        showToast("success", "취소 처리 되었습니다.");
                    } else {
                        if (data.message) {
                            showAlert("info", data.message);
                        } else {
                            showAlert("info", "취소 처리가 되지 않았습니다.");
                        }
                    }
                })
                . catch ((err) => {
                    showAlert("error", "취소 처리 중 오류가 발생했습니다.");
                    console.log(err.message);
                });
            }
        });   
    }

    // 반복예약된거 취소
    const handleCancelBtn = (recurringId) => {
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

                    axiosInst.delete(`/meeting-recurring-booking/${recurringId}`)
                    .then(({data}) => {
                        if(data.success) {
                            refresh();
                            showAlert("success", "취소 처리 되었습니다.");
                        } else{
                            if (data.message) {
                                showAlert("info", data.message);
                            } else {
                                showAlert("info", "취소 처리가 되지 않았습니다.");
                            }
                        }
                    })
                    .catch((err) => {
                        showAlert("error", "취소 처리 중 오류가 발생했습니다.");
                        console.log(err.message);
                    })
                }
            })
            .catch((err) => {
                showAlert("error", "취소 처리 중 오류가 발생했습니다.");
                console.log(err.message);
            });
        }

    // 반복예약 승인
    const handleApprovalBtn = async (recurringId) => {
        try {
            const resp = await axiosInst.post(`/meeting-recurring-booking/${recurringId}?type=approval`);
            const data = await resp.data;

            if(data.success) {
                refresh();
                showAlert("success", "승인 처리 되었습니다.");
            } else{
                if (data.message) {
                    showAlert("info", data.message);
                } else {
                    showAlert("info", "승인 처리가 되지 않았습니다.");
                }
            }
        } catch (err) {
            showAlert("error", "승인 처리 중 오류가 발생했습니다.");
            console.log(err.message);
        };
    }

    // 반복예약 반려
    const handleRejectBtn = async (recurringId) => {
        const { value: text } = await Swal.fire({
            input: "textarea",
            reverseButtons: true,
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "반려",
            title: "반려 사유 입력",
            cancelButtonText: "취소",
            inputPlaceholder: "ex) 다른 예약과 시간 중복",
            inputAttributes: {
                "aria-label": "Type your message here"
            },
            });
            if (text) {
                try {
                    const resp = await axiosInst.post(`/meeting-recurring-booking/${recurringId}?type=reject`, {"rejectReason" : text});
                    const data = await resp.data;

                    console.log(data);
                    if(data.success) {
                        refresh();
                        showAlert("success", "반려 처리 되었습니다.");
                    } else{
                        showAlert("info", "반려 처리가 되지 않았습니다.");
                    }
                } catch(err) {
                     showAlert("error", "반려 처리 중 오류가 발생했습니다.");
                }

            }
    }

    // 회의실 상태 변경
    const handleToggleRoomStatus = (room) => {
        if (room.useYn === 'Y') {
            Swal.fire({
                    title: "회의실을 비활성화하시겠습니까?",
                    text: `이 회의실(${room.roomName})을 잠시 이용할 수 없도록 변경합니다.`,
                    icon: "question",
                    reverseButtons: true,
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#6e7881",
                    confirmButtonText: "예",
                    cancelButtonText: "아니오"
                }).then((result) => {
                    if (result.isConfirmed) {
                        axiosInst.put('/meeting/room/open-close', {'roomId' : room.roomId, 'useYn' : 'N'})
                        .then(({data}) => {
                            if(data.success) {
                                getMeetingRoomList();
                            }
                        })
                    }
                });
            } else {
                axiosInst.put('/meeting/room/open-close', {'roomId' : room.roomId, 'useYn' : 'Y'})
                .then(({data}) => {
                    if(data.success) {
                        getMeetingRoomList();
                    }
                })
            }
    }

    // 회의실 리스트 얻어오기
    const getMeetingRoomList = () => {
        axiosInst.get("/meeting/room")
        .then(({data}) => {
            setMeetingRoomList(data);
        })
        .catch(err => {
            console.log(err);
            setMeetingRoomList([]);
        })
    }

    // 오늘의 회의실 예약 리스트 얻어오기
    const getTodayMeetingReservationList = () => {
        axiosInst.get(`/meeting/reservations?role=admin`)
        .then(({data}) => {
            setMeetingReservationList(data);
        })
        .catch(err => {
            console.log(err);
            setMeetingReservationList([]);
        })
    }

    // 다른날 회의실 예약 리스트 얻어오기
    const getOtherdayMeetingReservationList = (e) => {
        const now = new Date();

        let _meetingOtherDay = "";
        if (!e) {
            // YYYY-MM-DD 형식으로 세팅
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            setMeetingOtherDay(tomorrow.toISOString().split('T')[0]);
            _meetingOtherDay = tomorrow.toISOString().split('T')[0];
        } else {
            setMeetingOtherDay(e);
            _meetingOtherDay = e;
        }

        axiosInst.get(`/meeting/reservations?date=${_meetingOtherDay}&role=admin`)
        .then(({data}) => {
            setmeetingOtherdayReservationList(data);
        })
        .catch(err => {
            console.log(err);
            setmeetingOtherdayReservationList([]);
        })
    }

    // 회의실 반복예약 신청 리스트 얻어오기
    const getMeetingRecurringBookingList = () => {
        axiosInst.get("/meeting-recurring-booking?status=A302")
        .then(({data}) => {
            setMeetingRecurringBookingList(data);
            console.log("getMeetingRecurringBookingList", data)
        })
        .catch(err => {
            console.log(err);
            setMeetingRecurringBookingList([]);
        })
    }

    // 회의실 반복예약 진행중 리스트 얻어오기
    const getMeetingRecurringBookApprovalList = () => {
        axiosInst.get("/meeting-recurring-booking?status=progress")
        .then(({data}) => {
            setMeetingRecurringBookingApprovalList(data);
        })
        .catch(err => {
            console.log(err);
            setMeetingRecurringBookingApprovalList([]);
        })
    }

    // 모든 회의실 반복예약 내역 얻어오기
    const getMeetingRecurringBookingAllList = () => {
        axiosInst.get(`/meeting-recurring-booking`)
        .then(({data}) => setMeetingRecurringBookingAllList(data))
        .catch(err => {
            console.log(err);
            setMeetingRecurringBookingAllList([]);
        })
    }


  return (
    <>
     <div className='content-wrapper container'>
        <div className="page-heading">
            <h3>회의실 관리</h3>
            <p className="text-subtitle text-muted">회의실의 예약과 이용 현황을 관리합니다.</p>
        </div>
        <div className="page-content">
           <section className="section">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title float-start">회의실 전체 목록</h4>
                                    <button className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#createRoomModal">+  신규 회의실 등록</button>
                                </div>
                                <div className="card-body">
                                    <table className="table table-hover" id="roomTable">
                                        <thead style={{ borderTop: "2px solid #dee2e6" }}>
                                            <tr>
                                                <th style={{width: '9%'}}>ID</th>
                                                <th style={{width: '15%'}}>작업</th>
                                                <th className="text-center" style={{width: '15%'}}>회의실</th>
                                                <th className="text-center" style={{width: '30%'}}>위치</th>
                                                <th className="text-center">수용인원</th>
                                                <th className="text-center">상태</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                {meetingRoomList.map((room, i) => (
                                                    <tr key={i}>
                                                        <td>{room.rnum}</td>
                                                        <td>
                                                            <label className="form-check form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    checked={room.useYn === "Y"}
                                                                    onChange={() => handleToggleRoomStatus(room)}
                                                                />
                                                                {room.useYn === 'Y' ? <span className="badge bg-primary">활성</span> 
                                                                    : <span className="badge bg-secondary">비활성</span>}
                                                            </label>
                                                        </td>
                                                        <td className="text-center">{room.roomName}</td>
                                                        <td className="text-center">{room.location}</td>
                                                        <td className="text-center">{room.capacity}</td>
                                                        <td className="text-center">
                                                            <button 
                                                                className="btn btn-sm btn-outline-primary" 
                                                                data-bs-toggle="modal"
                                                                 data-bs-target="#modifyRoomModal"
                                                                 onClick={() => setSeletedRoom(room)}>
                                                                수정
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">반복 예약 승인 대기</h4>
                                </div>
                                <div className="card-body">
                                    <div className="alert alert-light-primary color-primary"><i className="bi bi-exclamation-circle"></i> 승인 버튼을 누르면 시스템이 중복 예약 여부를 확인한 후, 즉시 승인을 진행합니다.</div>
                                    <table className="table">
                                        <thead style={{ borderTop: "2px solid #dee2e6" }}>
                                            <tr>
                                                <th className="text-center">요청자</th>
                                                <th className="text-center">회의실</th>
                                                <th className="text-center">기간</th>
                                                <th className="text-center">반복 조건</th>
                                                <th className="text-center">요청일</th>
                                                <th className="text-center">관리</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { meetingRecurringBookingList && meetingRecurringBookingList.length > 0 ? (
                                                meetingRecurringBookingList.map((recurringBooking) => (
                                                    <tr>
                                                        <td className="text-center">{recurringBooking.userNm}({recurringBooking.userId})</td>
                                                        <td className="text-center">{recurringBooking.roomName}</td>
                                                        <td className="text-center">
                                                            <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>{recurringBooking.startDate}</span>
                                                            <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>-</span>
                                                            <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>{recurringBooking.endDate}</span>
                                                        </td>
                                                        {/* <td>매주 월 14:00-15:30</td> */}
                                                        <td className="text-center">
                                                            {recurringBooking.interval}{recurringBooking.frequency == 'day'? '일마다 ' : '주마다 '}
                                                            {recurringBooking.weekCheckList.map((weekCheck) => (
                                                                weekCheck == '1' ? '월 ' : 
                                                                weekCheck == '2' ? '화 ' :
                                                                weekCheck == '3' ? '수 ' : 
                                                                weekCheck == '4' ? '목 ' :
                                                                weekCheck == '5' ? '금 ' : '주말'
                                                            ))}
                                                            <br/>
                                                            {recurringBooking.startTime}시-{recurringBooking.endTime}시
                                                        </td>
                                                        <td className="text-center">{recurringBooking.crtDt}</td>
                                                        <td className="text-center">
                                                            <button className="btn btn-sm btn-success mb-1" onClick={() => handleApprovalBtn(recurringBooking.recurringId)}><i className="bi bi-check-lg"></i> 승인</button>
                                                            <br/>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleRejectBtn(recurringBooking.recurringId)}><i className="bi bi-x-lg"></i> 반려</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                             <tr className="text-center">
                                                <td colSpan={6} className="py-5 text-muted">현재 승인 대기 중인 반복 예약이 없습니다.</td>
                                             </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">반복 예약 진행 목록</h4>
                                </div>
                                <div className="card-body">
                                    <div className="alert alert-light-secondary color-secondary">
                                        <i className="bi bi-exclamation-triangle"></i> 취소 버튼을 누르면 오늘 이후의 반복 예약이 삭제됩니다.</div>
                                    <table className="table">
                                        <thead style={{ borderTop: "2px solid #dee2e6" }}>
                                            <tr>
                                                <th className="text-center">요청자</th>
                                                <th className="text-center">회의실</th>
                                                <th className="text-center">기간</th>
                                                <th className="text-center">반복 조건</th>
                                                <th className="text-center">요청일</th>
                                                <th className="text-center">관리</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { meetingRecurringBookingApprovalList && meetingRecurringBookingApprovalList.length > 0 ? (
                                                meetingRecurringBookingApprovalList.map((recurringBooking) => (
                                                <tr>
                                                    <td className="text-center">{recurringBooking.userNm}({recurringBooking.userId})</td>
                                                    <td className="text-center">{recurringBooking.roomName}</td>
                                                    <td className="text-center">
                                                        <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>{recurringBooking.startDate}</span>
                                                        <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>-</span>
                                                        <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>{recurringBooking.endDate}</span>
                                                    </td>
                                                    {/* <td>매주 월 14:00-15:30</td> */}
                                                    <td className="text-center">
                                                        {recurringBooking.interval}{recurringBooking.frequency == 'day'? '일마다 ' : '주마다 '}
                                                        {recurringBooking.weekCheckList.map((weekCheck) => (
                                                            weekCheck == '1' ? '월 ' : 
                                                            weekCheck == '2' ? '화 ' :
                                                            weekCheck == '3' ? '수 ' : 
                                                            weekCheck == '4' ? '목 ' :
                                                            weekCheck == '5' ? '금 ' : '주말'
                                                        ))}
                                                        <br/>
                                                        {recurringBooking.startTime}시-{recurringBooking.endTime}시
                                                    </td>
                                                    <td className="text-center">{recurringBooking.crtDt}</td>
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleCancelBtn(recurringBooking.recurringId)}><i className="bi bi-x-lg"></i> 취소</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colSpan={6} className="py-5 text-muted">현재 진행 중인 반복 예약이 없습니다.</td>
                                             </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title">반복 예약 신청 히스토리</h4>
                                </div>
                                <div className="card-body">
                                    <table className="table">
                                        <thead style={{ borderTop: "2px solid #dee2e6" }}>
                                            <tr>
                                                <th className="text-center">요청자</th>
                                                <th className="text-center">회의실</th>
                                                <th className="text-center">기간</th>
                                                <th className="text-center">반복 조건</th>
                                                <th className="text-center">요청일</th>
                                                <th className="text-center">상태</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { meetingRecurringBookingAllList && meetingRecurringBookingAllList.length > 0 ? (
                                                meetingRecurringBookingAllList.map((recurringBooking) => (
                                                    <tr>
                                                        <td className="text-center">{recurringBooking.userNm}({recurringBooking.userId})</td>
                                                        <td className="text-center">{recurringBooking.roomName}</td>
                                                        <td className="text-center">
                                                            <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>{recurringBooking.startDate}</span>
                                                            <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>-</span>
                                                            <span className="date-line" style={{display: "block",margin: 0,lineHeight: 1.2}}>{recurringBooking.endDate}</span>
                                                        </td>
                                                        {/* <td>매주 월 14:00-15:30</td> */}
                                                        <td className="text-center">
                                                            {recurringBooking.interval}{recurringBooking.frequency == 'day'? '일마다 ' : '주마다 '}
                                                            {recurringBooking.weekCheckList.map((weekCheck) => (
                                                                weekCheck == '1' ? '월 ' : 
                                                                weekCheck == '2' ? '화 ' :
                                                                weekCheck == '3' ? '수 ' : 
                                                                weekCheck == '4' ? '목 ' :
                                                                weekCheck == '5' ? '금 ' : '주말'
                                                            ))}
                                                            <br/>
                                                            {recurringBooking.startTime}시-{recurringBooking.endTime}시
                                                        </td>
                                                        <td className="text-center">{recurringBooking.crtDt}</td>
                                                        <td className="text-center">
                                                                {recurringBooking.status === 'A401' ? (
                                                                    <span className="badge bg-success">승인</span>) : 
                                                                 recurringBooking.status === 'A402' ? (
                                                                    <span className="badge bg-danger">반려</span>):
                                                                 recurringBooking.status === 'B305' ? (
                                                                    <span className="badge bg-danger">취소</span>) : ( <span className="badge bg-secondary">승인대기</span>)
                                                                 }
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                             <tr className="text-center">
                                                <td colSpan={6} className="py-5 text-muted">예약 내역이 없습니다.</td>
                                             </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        

                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title"><i className="bi bi-clock-fill"></i> 금일 예약 현황</h4>
                                </div>
                                <div className="card-body">
                                    <div className="list-group">
                                        {meetingReservationList && meetingReservationList.length > 0 ?  
                                            (meetingReservationList.map((reservation, i) => (
                                                <div className="list-group-item list-group-item" key={i}>
                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h5 className="mb-1">{String(reservation.startTime).padStart(2, '0')}:00 - {String(reservation.endTime).padStart(2, '0')}:00</h5>
                                                        <small>
                                                            {(reservation.startTime <= currentTime && currentTime < reservation.endTime) ? <span className="badge bg-primary">진행중</span> :
                                                                           (reservation.endTime <= currentTime) ? <span className="badge bg-danger">종료</span> 
                                                                           : <span className="badge bg-light-secondary">예정</span>}
                                                        </small>
                                                    </div>
                                                    <p className="mb-1">
                                                        <span className="text-bold">{reservation.roomName}</span> / {reservation.title}
                                                    </p>
                                                    <div className="d-flex align-items-center mt-2">
                                                        <div className="avatar avatar-sm border">
                                                            {reservation.filePath ? <img src={reservation.filePath} alt="Avatar" className="avatar-image" /> : 
                                                                                    <img src="/assets/static/images/faces/1.jpg" alt="Avatar" className="avatar-image" /> }
                                                            
                                                        </div>
                                                        <small className="ms-2">{reservation.userNm} {reservation.deptNm}</small>

                                                        <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => handleReservationCancel(reservation.reservationId)}>예약 취소</button>
                                                    </div>
                                                </div>
                                            )) 
                                        ) : (
                                            <div className="text-center text-muted py-3">
                                                금일 예약 내역이 없습니다.
                                            </div>
                                        )}
                                            
                                        
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-header pb-2">
                                    <h4 className="card-title"><i class="bi bi-calendar-event-fill"></i> 다른 날 예약 조회</h4>
                                </div>
                                <div className="card-body">
                                    <input className="form-control mb-2" type="date" value={meetingOtherday} onChange={(e) => setMeetingOtherDay(e.target.value)}/>
                                    <div className="list-group">
                                        {meetingOtherdayReservationList && meetingOtherdayReservationList.length > 0 ?  
                                            (meetingOtherdayReservationList.map((reservation, i) => (
                                                <div className="list-group-item list-group-item" key={i}>
                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h5 className="mb-1">{String(reservation.startTime).padStart(2, '0')}:00 - {String(reservation.endTime).padStart(2, '0')}:00</h5>
                                                    </div>
                                                    <p className="mb-1">
                                                        <span className="text-bold">{reservation.roomName}</span> / {reservation.title}
                                                    </p>
                                                    <div className="d-flex align-items-center mt-2">
                                                        <div className="avatar avatar-sm border">
                                                            {reservation.filePath ? <img src={reservation.filePath} alt="Avatar" className="avatar-image" /> : 
                                                                                    <img src="/assets/static/images/faces/1.jpg" alt="Avatar" className="avatar-image" /> }
                                                            
                                                        </div>
                                                        <small className="ms-2">{reservation.userNm} {reservation.deptNm}</small>

                                                        <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => handleReservationCancel(reservation.reservationId)}>예약 취소</button>
                                                    </div>
                                                </div>
                                            )) 
                                        ) : (
                                            <div className="text-center text-muted py-5">
                                                해당 날짜의 예약 내역이 없습니다.
                                            </div>
                                        )}
                                            
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        </div>
    </div>

    <MeetingCreateModal getMeetingRoomList={getMeetingRoomList} />
    <MeetingModifyModal getMeetingRoomList={getMeetingRoomList} getTodayMeetingReservationList={getTodayMeetingReservationList} selectedRoom={selectedRoom} />
    </>
  )
}

export default Meeting