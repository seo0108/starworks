import React, { useEffect, useState } from 'react'
import axiosInst from '../../api/apiClient'; // Import axiosInst
import { showAlert, showToast } from '../../api/sweetAlert';

/* 구성원 수정 모달 */
function UserEditModal({ user, departments = [] }) {
  const [editUser, setEditUser] = useState(user || {});

  useEffect(() => {
    console.log("모달user 데이터" , user);
    if (user) {
      setEditUser({
        ...user,
        jbgdCd:
          user.jbgdCd ||
          (user.jbgdNm === "대표"
            ? "JBGD01"
            : user.jbgdNm === "부장"
            ? "JBGD02"
            : user.jbgdNm === "차장"
            ? "JBGD03"
            : user.jbgdNm === "과장"
            ? "JBGD04"
            : user.jbgdNm === "대리"
            ? "JBGD05"
            : user.jbgdNm === "사원"
            ? "JBGD06"
            : ""),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  // async로 수정
  const handleUpdateUser = async () => {
    if (!editUser.userId) {
      //alert("수정할 구성원 정보가 없습니다.");
      await showToast("warning","수정할 구성원 정보가 없습니다.");
      return;
    }

    try {
      // axiosInst로 PUT 요청
      const response = await axiosInst.put(`/comm-user/${editUser.userId}`, editUser);

      if (response.status === 200) {
        //alert("구성원의 정보가 수정되었습니다.");
        await showAlert("success", "구성원의 정보가 수정되었습니다.");
        //모달 닫기
        const modalEl = document.getElementById("userEditModal");
        const modalInstance = window.bootstrap?.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        // 페이지 새로고침
        window.location.reload();
      } else {
        //alert("수정 실패: 서버 응답이 올바르지 않습니다.");
        showAlert("error","수정 실패: 서버 응답이 올바르지 않습니다." );
      }
    } catch (err) {
      console.error("수정 실패:", err);
      //alert("구성원 수정 중 오류가 발생했습니다.");
      showAlert("error","비밀번호를 입력해주세요" );
    }
  };
  return (
    <div
      className="modal fade"
      id="userEditModal"
      tabIndex="-1"
      aria-labelledby="userEditModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              구성원 정보 수정
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form className="form form-vertical">
              <div className="form-body">
                <div className="row">
                  {/* 이름 */}
                  <div className="col-6 mb-3">
                    <label>이름</label>
                    <input
                      type="text"
                      name="userNm"
                      value={editUser.userNm || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="이름"
                    />
                  </div>


                  {/* 비밀번호 */}
                  <div className="col-6 mb-3">
                    <label>비밀번호</label>
                    <input
                      type="password"
                      name="userPswd"
                      value={editUser.userPswd || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="비밀번호"
                    />
                  </div>

                  {/* 부서 */}
                  <div className="col-6 mb-3">
                    <label>부서</label>
                    <select
                      name="deptId"
                      value={editUser.deptId || ""}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">부서 선택</option>
                      {departments.map((dept) => (
                        <option key={dept.deptId} value={dept.deptId}>
                          {dept.deptNm}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 직급 */}
                  <div className="col-6 mb-3">
                    <label>직급</label>
                    <select
                      name="jbgdCd"
                      value={editUser.jbgdCd || ""}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">직급 선택</option>
                      <option value="JBGD01">대표</option>
                      <option value="JBGD02">부장</option>
                      <option value="JBGD03">차장</option>
                      <option value="JBGD04">과장</option>
                      <option value="JBGD05">대리</option>
                      <option value="JBGD06">사원</option>
                    </select>
                  </div>

                  {/* 이메일 */}
                  <div className="col-6 mb-3">
                    <label>이메일</label>
                    <input
                      type="email"
                      name="userEmail"
                      value={editUser.userEmail || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="이메일"
                    />
                  </div>

                  {/* 연락처 */}
                  <div className="col-6 mb-3">
                    <label>연락처</label>
                    <input
                      type="text"
                      name="userTelno"
                      value={editUser.userTelno || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="연락처"
                    />
                  </div>

                  {/* 내선번호 */}
                  <div className="col-6 mb-3">
                    <label>내선번호</label>
                    <input
                      type="text"
                      name="extTel"
                      value={editUser.extTel || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="내선번호"
                    />
                  </div>

                  
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light-secondary"
              data-bs-dismiss="modal"
            >
              취소
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateUser}
            >
              저장
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}


export default UserEditModal