import { useEffect, useState } from 'react';
import axiosInst from '../../api/apiClient'; // Import axiosInst

/* 퇴사자 관리 */
function ResignedUserList({ onCountChange }) {
    const [resignedUsers, setResignedUsers] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    //퇴사자 목록가져오기
    useEffect(() => {
    axiosInst.get("/comm-user/resigned")
      .then((res) => {
         const data = res.data;
         console.log("퇴사자 목록 조회 성공:", data); 
         setResignedUsers(data);
          if (onCountChange) onCountChange(data.length); // 부모에게 개수 전달
    })
    .catch((err) => console.error("퇴사자 목록 조회 실패:", err));
}, [onCountChange]);

// 현재 페이지의 데이터 계산
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = resignedUsers.slice(indexOfFirst, indexOfLast);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(resignedUsers.length / itemsPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="content-wrapper container resigned-container">
      <style>{`
  .resigned-container .modal-content {
    border-radius: 12px;
    border: none;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .resigned-container .modal-header {
    background: #f8f9fc;
    border-bottom: 1px solid #e0e3e7;
  }

  .resigned-container .modal-title {
    font-weight: 600;
    color: #333;
  }

  .resigned-container .modal-footer {
    background: #f8f9fc;
    border-top: 1px solid #e0e3e7;
  }

  .resigned-container .btn-primary {
    background: #4e73df;
    border: none;
  }

  .resigned-container .btn-primary:hover {
    background: #2e59d9;
  }

  .resigned-container table {
    border-color: #eee;
    border-top: none !important; /* 구성원관리와 통일: 상단줄 제거 */
  }

  .resigned-container table th {
    background-color: rgba(226, 236, 253, 1);
    color: #555;
    font-weight: 600;
    text-align: center;
  }

  .resigned-container table td {
    text-align: center;
    vertical-align: middle;
  }

  .resigned-container .table-hover tbody tr:hover {
    background-color: #f9fbff;
  }

  .resigned-container .pagination .page-item.active .page-link {
    background-color: #4e73df;
    border-color: #4e73df;
    color: #fff;
  }

  .resigned-container .pagination .page-link {
    color: #4e73df;
    border: none;
  }

  .resigned-container .pagination .page-link:hover {
    background: #edf2ff;
  }
`}</style>

      <div className="page-content">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">퇴사자 목록</h4>
          </div>
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>사번</th>
                  <th>이름</th>
                  <th>부서</th>
                  <th>직급</th>
                  <th>이메일</th>
                  <th>연락처</th>
                  <th>퇴사일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.userNm}</td>
                      <td>{user.deptNm}</td>
                      <td>{user.jbgdNm}</td>
                      <td>{user.userEmail}</td>
                      <td>{user.userTelno}</td>
                      <td>{user.rsgntnYmd || "-"}</td>
                      <td>
                        <span className="badge bg-secondary">
                        {user.workSttsNm || "퇴사"}
                        </span>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      퇴사자가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 영역 */}
          <nav>
            <ul className="pagination justify-content-center mt-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    onClick={() => paginate(i + 1)}
                    className="page-link"
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

        </div>
      </div>
    </div>
  );
}

export default ResignedUserList