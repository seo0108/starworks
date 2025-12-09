import axios from "axios";
import React, { useEffect, useState } from "react";
import axiosInst from "../../api/apiClient";
import { showToast } from "../../api/sweetAlert";

function MeetingModifyModal({ getMeetingRoomList, getTodayMeetingReservationList, selectedRoom }) {

    const [modifyMeetingRoom, setModifyMeetingRoom] = useState({"roomName" : selectedRoom.roomName, "location" : selectedRoom.location, "capacity" : selectedRoom.capacity})

    useEffect(() => {
        if(selectedRoom) {
            setModifyMeetingRoom(selectedRoom);
        }
    }, [selectedRoom]) // selectedRoomId 가 바뀔때마다 modifyMeetingRoom 값 변경 (원본 데이터와 따로 관리)

  // 수정 폼 제출 핸들러
  const modfiyFormHandler = async (e) => {
    e.preventDefault();
    
    const resp = await axiosInst.put("/meeting/room", modifyMeetingRoom)
    const data = await resp.data;

    if (data.success) {
        showToast("success", "수정되었습니다.");

        // 회의실 목록 갱신
        if(getMeetingRoomList) getMeetingRoomList();

        // 모달 닫기
        const modalEl = document.getElementById("modifyRoomModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();
        e.target.reset();
    } else {
        if(data.message != null) {
            showToast("info", data.meesage);
        } else {
            showToast("error", "등록에 실패하였습니다.");
        }
    }
}

    // 회의실 삭제 핸들러
    const roomDelBtnHandler = () => {
        console.log(modifyMeetingRoom.roomId)
        Swal.fire({
            title: "회의실을 삭제하시겠습니까?",
            text: `이 회의실(${modifyMeetingRoom.roomName})을 삭제하면 복구할 수 없습니다. 일시적으로 사용을 중단하려면 비활성화 기능을 이용해주세요.`,
            icon: "warning",
            reverseButtons: true,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6e7881",
            confirmButtonText: "삭제하기",
            cancelButtonText: "아니오"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInst.put('/meeting/room/open-close', 
                    {
                        'roomId' : modifyMeetingRoom.roomId, 
                        'useYn' : 'N', 'delYn' : 'Y'
                    })
                    .then (({data}) => {
                        if(data.success) {
                            showToast("trash", "삭제되었습니다.");

                            if(getMeetingRoomList) getMeetingRoomList();
                            if(getTodayMeetingReservationList) getTodayMeetingReservationList();
                            
                            // 모달 닫기
                            const modalEl = document.getElementById("modifyRoomModal");
                            const modalInstance = bootstrap.Modal.getInstance(modalEl);
                            modalInstance.hide();
                        }
                    });
        
            }
        });

        
    }

  return (
    <div
      className="modal fade text-left"
      id="modifyRoomModal"
      tabIndex="-1"
      aria-labelledby="myModalLabel1"
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="myModalLabel1">
              회의실 정보 수정
            </h5>
          </div>
          <form id="createMeetingRoomForm" onSubmit={modfiyFormHandler}>
            <div className="modal-body">
              <div className="col-md-12 mb-3">
                <label htmlFor="formName" className="form-label">
                  🔑 회의실 이름
                </label>
                <input
                  className="form-control"
                  id="formName"
                  placeholder="ex) 제 1회의실"
                  type="text"
                  name="roomName"
                  value={modifyMeetingRoom.roomName || ""}
                  onChange={(e) =>
                    setModifyMeetingRoom({
                      ...modifyMeetingRoom,
                      roomName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="row mb-12 mb-3">
                <div className="col-md-7">
                  <label htmlFor="formName" className="form-label">
                    회의실 위치
                  </label>
                  <input
                    className="form-control"
                    id="formName"
                    placeholder="ex) 스타웍스 4층"
                    type="text"
                    name="location"
                    value={modifyMeetingRoom.location || ""}
                    onChange={(e) =>
                      setModifyMeetingRoom({
                        ...modifyMeetingRoom,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-5">
                  <label htmlFor="formName" className="form-label">
                    수용인원
                  </label>
                  <input
                    className="form-control"
                    id="formName"
                    placeholder="10"
                    type="number"
                    min={0}
                    max={999}
                    name="capacity"
                    value={modifyMeetingRoom.capacity || ""}
                    onChange={(e) =>
                      setModifyMeetingRoom({
                        ...modifyMeetingRoom,
                        capacity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn icon icon-left btn-danger me-auto" onClick={roomDelBtnHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-circle">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        회의실 삭제
                </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                <i className="bx bx-x d-block d-sm-none"></i>
                <span className="d-none d-sm-block">닫기</span>
              </button>
              <button type="submit" className="btn btn-primary ms-1">
                <i className="bx bx-check d-block d-sm-none"></i>
                <span className="d-none d-sm-block">저장</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MeetingModifyModal;
