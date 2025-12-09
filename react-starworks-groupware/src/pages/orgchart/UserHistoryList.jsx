import { useEffect, useState } from "react";
import axiosInst from "../../api/apiClient"; // Import axiosInst

function UserHistoryList() {
  const [histories, setHistories] = useState([]);

  // 데이터 불러오기
  useEffect(() => {
    axiosInst
      .get("/comm-user-history")
      .then((res) => {
        if (res.status !== 200) throw new Error("서버 오류 발생");
        const data = res.data;
        setHistories(data);
      })
      .catch((err) => console.error("인사이력 조회 실패", err));
  }, []);

  return (
    <div className="card p-3">
      <h5>인사이력 관리</h5>
      <p className="text-muted">
        부서 이동, 승진, 직급변경 등 인사기록을 확인할 수 있습니다.
      </p>

      <div className="table-responsive mt-3">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>사번</th>
              <th>직원명</th>
              <th>변동유형</th>
              <th>변경 전 부서</th>
              <th>변경 후 부서</th>
              <th>변경 전 직급</th>
              <th>변경 후 직급</th>
              {/* <th>사유</th> */}
              <th>변경일</th>
            </tr>
          </thead>
          <tbody>
            {histories.length > 0 ? (
              histories.map((h) => (
                <tr key={h.historyId}>
                  <td>{h.userId}</td>
                  <td>{h.userNm}</td>
                  <td>{getChangeTypeLabel(h.changeType)}</td>
                  <td>{h.beforeDeptNm || "-"}</td>
                  <td>{h.afterDeptNm || "-"}</td>
                  <td>{h.beforeJbgdNm || "-"}</td>
                  <td>{h.afterJbgdNm || "-"}</td>
                  {/* <td>{h.reason || "-"}</td> */}
                  <td>{formatDate(h.crtDt)}</td>
                </tr>
              ))
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
    </div>
  );
}

// 변동유형 코드 변환
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
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export default UserHistoryList;
