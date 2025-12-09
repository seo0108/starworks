import React, { useEffect, useState } from "react";
import axiosInst from "../../api/apiClient";
import { showToast } from "../../api/sweetAlert";

// 회의실 등록, 수정 모달
function MeetingModal({ getMeetingRoomList }) {
  const [newMeetingRoom, setNewMeetingRoom] = useState({
    roomName: "",
    location: "",
    capacity: "",
  });

  const fillMeetingRoomForm = () => {
  const preset = {
    roomName: "라운지룸",
    location: "1층 카페 공간",
    capacity: 15,
  };

  setNewMeetingRoom(preset);
};

  // 회의실 등록 폼 제출 핸들러
  const createFormHandler = async (e) => {
    e.preventDefault();

    const resp = await axiosInst.post("/meeting/room", newMeetingRoom);
    const data = await resp.data;

    if (data.success) {
      showToast("success", "새로운 회의실이 등록되었습니다.");

      // 회의실 목록 갱신
      if (getMeetingRoomList) getMeetingRoomList();

      // 모달 닫기
      const modalEl = document.getElementById("createRoomModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();
      e.target.reset();
    } else {
      if (data.message != null) {
        showToast("info", data.message);
      } else {
        showToast("error", "등록에 실패하였습니다.");
      }
    }
  };

  return (
    <div
      className="modal fade text-left"
      id="createRoomModal"
      tabIndex="-1"
      aria-labelledby="myModalLabel1"
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="myModalLabel1" style={{ cursor: "default" }} onClick={fillMeetingRoomForm}>
              신규 회의실 등록
            </h5>
          </div>
          <form id="createMeetingRoomForm" onSubmit={createFormHandler}>
            <div className="modal-body">
              <div className="col-md-12 mb-3">
                <label htmlFor="formName" className="form-label">
                  🔑 회의실 이름 <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  id="formName"
                  placeholder="ex) 제 1회의실"
                  type="text"
                  name="roomName"
                   value={newMeetingRoom.roomName}
                  onChange={(e) =>
                    setNewMeetingRoom({
                      ...newMeetingRoom,
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
                    value={newMeetingRoom.location}
                    onChange={(e) =>
                      setNewMeetingRoom({
                        ...newMeetingRoom,
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
                    name="capacity"
                    min={0}
                    max={999}
                    value={newMeetingRoom.capacity}
                    onChange={(e) =>
                      setNewMeetingRoom({
                        ...newMeetingRoom,
                        capacity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
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
                <span className="d-none d-sm-block">등록</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MeetingModal;
