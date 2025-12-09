import React, { useEffect, useState } from "react";

function UserDetailModal({ user }) {
  if (!user) return null;

   const [viewUser, setViewUser] = useState(user || {});

  // 기본 프로필 이미지 경로
  const defaultProfile = "/assets/compiled/jpg/b.jpg";

  useEffect(() => {
    if(user) {
      setViewUser(user);
    }
  }, [user])

  return (
    <div
      className="modal fade"
      id="userDetailModal"
      tabIndex="-1"
      aria-labelledby="userDetailModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="userDetailModalLabel">
              사용자 상세 정보
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="row">
              {/* 왼쪽: 프로필 */}
              <div className="col-md-4 text-center border-end">
                <img
                  src={user.filePath || defaultProfile}
                  alt="프로필"
                  className="rounded-circle mb-3"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <h5>{user.userNm}</h5>
                <p className="text-muted">
                  {user.jbgdNm} · {user.deptNm}
                </p>
              </div>

              {/* 오른쪽: 상세정보 */}
              <div className="col-md-8">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>사번</th>
                      <td>{user.userId}</td>
                    </tr>
                    <tr>
                      <th>이메일</th>
                      <td>{user.userEmail}</td>
                    </tr>
                    <tr>
                      <th>연락처</th>
                      <td>{user.userTelno}</td>
                    </tr>
                    <tr>
                      <th>내선번호</th>
                      <td>{user.extTel || "-"}</td>
                    </tr>
                    <tr>
                      <th>입사일</th>
                      <td>{user.hireYmd || "-"}</td>
                    </tr>
                    <tr>
                      <th>상태</th>
                      <td>
                        <span
                          className={`badge ${
                            user.rsgntnYn === "N"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {user.rsgntnYn === "N" ? "재직" : "퇴사"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
