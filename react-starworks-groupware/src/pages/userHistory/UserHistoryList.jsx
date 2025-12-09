import { useEffect, useMemo, useState } from "react";
import axiosInst from "../../api/apiClient"; // Import axiosInst
import { showAlert } from "../../api/sweetAlert";
import "./UserHistoryList.css";

function UserHistoryList() {
  const [histories, setHistories] = useState([]);

  const [filteredHistories, setFilteredHistories] = useState([]); //필터링 된 데이터
  const [selectedType, setSelectedType] = useState("all"); //선택된 변동유형

  const defaultProfile = "/assets/compiled/jpg/b.jpg";

  //상세정보 + 인사이력
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserHistories, setSelectedHistories] = useState([]);

  //페이징처리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 표시 개수

  useEffect(() => {
    axiosInst
      .get("/comm-user-history")
      .then((res) => {
        if (res.status !== 200) throw new Error("서버 오류 발생");
        setHistories(res.data);
      })
      .catch((err) => console.error("인사이력 조회 실패", err));
  }, []);

  useEffect(() => {
    if (selectedType === "all") {
      setFilteredHistories(histories);
    } else {
      const filtered = histories.filter(
        (h) => getChangeTypeLabel(h.changeType) === selectedType
      );
      setFilteredHistories(filtered);
      setCurrentPage(1);
    }
  }, [selectedType, histories]);

  const handleUserClick = (userId) => {
  const userHistories = histories.filter(h => h.userId === userId);
  if (userHistories.length === 0) {
    showAlert("info", "해당 직원의 인사이력 데이터가 없습니다.");
    return;
  }

  axiosInst.get(`/comm-user/${userId}`)
    .then((userRes) => {
      setSelectedUser(userRes.data);
      setSelectedHistories(userHistories);
    })
    .catch(() => showAlert("error", "직원 정보 조회 실패"));
};



  //--페이징처리--
  //계산을 반복하지 않게 해주는 성능 최적화 훅(useMemo)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredHistories.length / itemsPerPage)),
    [filteredHistories]
  );

  const currentHistories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredHistories.slice(start, end);
  }, [filteredHistories, currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //console.log("전체 histories:", histories.length);
  //console.log("필터링된 filteredHistories:", filteredHistories.length);
  //console.log("현재 페이지:", currentPage);

  return (
    <div className="content-wrapper container userhistory-container">
      <style>{`
  /* ===== UserHistory 전용 모달 ===== */
  .userhistory-container .modal-content {
    border-radius: 12px;
    border: none;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .userhistory-container .modal-header {
    background: #f8f9fc;
    border-bottom: 1px solid #e0e3e7;
  }

  .userhistory-container .modal-title {
    font-weight: 600;
    color: #333;
  }

  .userhistory-container .modal-footer {
    background: #f8f9fc;
    border-top: 1px solid #e0e3e7;
  }

  /* ===== 버튼 ===== */
  .userhistory-container .btn-primary {
    background: #4e73df;
    border: none;
  }

  .userhistory-container .btn-primary:hover {
    background: #2e59d9;
  }

  /* ===== 테이블 ===== */
  .userhistory-container table {
    border-color: #ddd;
    border-top: none !important;
  }

  .userhistory-container table th {
    background-color: rgba(226, 236, 253, 1);
    color: #555;
    font-weight: 600;
    text-align: center;
  }

  .userhistory-container table td {
    text-align: center;
    vertical-align: middle;
  }

  .userhistory-container .table-hover tbody tr:hover {
    background-color: #f9fbff;
  }

  /* ===== 상세 모달 내부 테이블 ===== */
  .userhistory-container .modal-body table {
    border: 1px solid #ccc; /* 선 명도 강화 */
  }

  .userhistory-container .modal-body table th {
    background-color: #f8f9fc;
    font-weight: 600;
    color: #333;
    border: 1px solid #ccc; /* 명확한 구분선 */
  }

  .userhistory-container .modal-body table td {
    vertical-align: middle;
    border: 1px solid #ddd; /* 셀 경계선 가시성 강화 */
  }

  /* ===== 변경 구간 표시 ===== */
  .userhistory-container .change-box {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .userhistory-container .arrow {
    color: #333; /* 기본 글자색 (검정) */
    font-weight: 600;
  }

  /* ===== 페이징 ===== */
  .userhistory-container .pagination .page-item.active .page-link {
    background-color: #4e73df;
    border-color: #3d6af0ff;
    color: #dfebf3ff;
  }

  .userhistory-container .pagination .page-link {
    color: #4e73df;
    border: none;
  }

  .userhistory-container .pagination .page-link:hover {
    background: #edf2ff;
  }
`}</style>


      <div className="card" style={{ "minHeight": "600px" }}>
        <div className="card-header">
          <h4 className="card-title">인사이력 조회</h4>
        </div>

      <div className="card-body">
        <div className="d-flex align-items-center">
          <label className="me-2 fw-bold">변동유형:</label>
          <select
            className="form-select"
            style={{ width: "180px" }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">전체보기</option>
            <option value="부서이동">부서이동</option>
            <option value="승진">승진</option>
            <option value="부서+직급 변경">부서+직급 변경</option>
          </select>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>사번</th>
                <th>직원명</th>
                <th>변동유형</th>
                <th className="text-center">부서 변경</th>
                <th className="text-center">직급 변경</th>
                {/* <th>사유</th> */}
                <th>변경일</th>
              </tr>
            </thead>
            <tbody>
              {currentHistories.length > 0 ? (
                currentHistories.map((h) => {
                  const hasDeptChange =
                    h.beforeDeptNm &&
                    h.afterDeptNm &&
                    h.beforeDeptNm !== h.afterDeptNm;
                  const hasJbgdChange =
                    h.beforeJbgdNm &&
                    h.afterJbgdNm &&
                    h.beforeJbgdNm !== h.afterJbgdNm;

                  return (
                    <tr key={h.historyId}>
                      <td>{h.userId}</td>
                      {/* <td>{h.userNm}</td> */}
                      <td>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#userHistoryModal"
                          onClick={() => handleUserClick(h.userId)}
                        >
                          {h.userNm}
                        </button>
                      </td>
                      <td>{getChangeTypeLabel(h.changeType)}</td>

                      {/* 부서 변경 칸 */}
                      <td className="text-center">
                        {hasDeptChange ? (
                          <div className="change-box">
                            <span>{h.beforeDeptNm}</span>
                            <span className="arrow">➜</span>
                            <span>{h.afterDeptNm}</span>
                          </div>
                        ) : (
                          <span>{h.beforeDeptNm || h.afterDeptNm || "-"}</span>
                        )}
                      </td>

                      {/* 직급 변경 칸 */}
                      <td className="text-center">
                        {hasJbgdChange ? (
                          <div className="change-box">
                            <span>{h.beforeJbgdNm}</span>
                            <span className="arrow">➜</span>
                            <span>{h.afterJbgdNm}</span>
                          </div>
                        ) : (
                          <span>{h.beforeJbgdNm || h.afterJbgdNm || "-"}</span>
                        )}
                      </td>

                      <td>{formatDate(h.crtDt)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    인사이력 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
         {/* 상세정보 + 인사이력 모달창 */}
        <div
          className="modal fade"
          id="userHistoryModal"
          tabIndex="-1"
          aria-labelledby="userHistoryModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header ">
                <h5 className="modal-title" id="userHistoryModalLabel">
                  직원 상세정보 및 인사이력
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                ></button>
              </div>

              <div className="modal-body">
                {selectedUser ? (
                  <>
                    {/* 기본정보 */}
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={
                          selectedUser.filePath || defaultProfile
                        }
                        alt="프로필"
                        className="rounded-circle me-3"
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          border: "1px solid #ccc",
                        }}
                      />
                      <div>
                        <h5 className="mb-0">
                          {selectedUser.userNm}{" "}
                          <small className="text-muted">
                            {selectedUser.jbgdNm}
                          </small>
                        </h5>
                        <div>{selectedUser.deptNm}</div>
                        <small className="text-secondary">
                          사번 {selectedUser.userId}
                        </small>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p>
                          <strong>이메일:</strong>{" "}
                          {selectedUser.userEmail || "-"}
                        </p>
                        <p>
                          <strong>연락처:</strong>{" "}
                          {selectedUser.userTelno || "-"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>입사일:</strong>{" "}
                          {formatDate(selectedUser.hireYmd)}
                        </p>
                        <p>
                          <strong>상태:</strong>{" "}
                          <span
                            className={`badge ${
                              selectedUser.rsgntnYn === "N"
                                ? "bg-success"
                                : "bg-secondary"
                            }`}
                          >
                            {selectedUser.rsgntnYn === "N" ? "재직" : "퇴사"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <hr />

                    {/* 개인 인사이력 */}
                    <h6 className="fw-bold mb-2">인사이력</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>변동유형</th>
                            <th>변경 전 부서</th>
                            <th>변경 후 부서</th>
                            <th>변경 전 직급</th>
                            <th>변경 후 직급</th>
                            <th>변경일</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUserHistories.length > 0 ? (
                            selectedUserHistories.map((h) => (
                              <tr key={h.historyId}>
                                <td>{getChangeTypeLabel(h.changeType)}</td>
                                <td>{h.beforeDeptNm || "-"}</td>
                                <td>{h.afterDeptNm || "-"}</td>
                                <td>{h.beforeJbgdNm || "-"}</td>
                                <td>{h.afterJbgdNm || "-"}</td>
                                <td>{formatDate(h.crtDt)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                인사이력 없음
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted">직원 정보를 불러오는 중...</p>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>


        {/*페이지네이션 */}
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-center text-muted small mt-2">
          Showing{" "}
          {filteredHistories.length === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredHistories.length)} of{" "}
          {filteredHistories.length} entries
        </div>
      </div>
    </div>
    </div>
  );
}

// 변동유형 코드
function getChangeTypeLabel(code) {
  const strCode = String(code).trim().padStart(2, "0");
  switch (strCode) {
    case "01":
      return "부서이동";
    case "02":
      return "승진";
    case "03":
      return "부서+직급 변경";
    default:
      return "-";
  }
}

// 날짜 포맷 변환
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}

export default UserHistoryList;
