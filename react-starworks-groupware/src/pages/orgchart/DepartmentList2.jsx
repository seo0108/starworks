import React, { useEffect, useState } from 'react'

/* 부서 관리 + 부서 추가 모달 */
function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  //신규 부서 등록시 입력값을 담는 상태
  const [newDept, setNewDept] = useState({deptId: "", deptNm:"", upDeptId:""});
  const [users, setUsers] = useState({});

  //부서목록
  const loadDepartments = ()=>{
    fetch("http://localhost/rest/comm-depart")
      .then((res)=>res.json()) //json으로 변환
      .then(setDepartments) //state에 저장
      .catch(err=>console.error("부서 조회 실패", err));
  };

  //사용자 목록
  const loadUsers = () =>{
    fetch("http://localhost/rest/comm-user")
      .then((res)=>res.json())
      .then(setUsers)
      .catch(err=>console.error("사용자 조회 실패", err));
  }

  useEffect(()=>{
    loadDepartments(); // 페이지 처음 들어올 때 자동으로 부서 목록 불러오기
    loadUsers();
  }, []);

  const handleChange = (e) =>{
    const { name, value} = e.target; // name, value 구조분해
    setNewDept((prev)=>({
      ...prev,     // 기존값 유지
      [name]:value // 변경된 필드만 덮어쓰기
    })); 
  }

  //부서 등록
  const handleAddDept = ()=>{
    fetch("http://localhost/rest/comm-depart", {
      method : "POST",
      headers: {"Content-Type":"application/json"},
      body : JSON.stringify(newDept),
    })
      .then((res)=>{
        if(!res.ok) throw new Error("등록실패");
        alert("부서가 등록되었습니다");

        // 모달창 닫기
        const modalEl = document.getElementById("addDeptModal");
        let modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (!modalInstance) {
          modalInstance = new bootstrap.Modal(modalEl);
        }
        modalInstance.hide();

         // 입력 초기화
        setNewDept({
          deptId: "",
          deptNm: "",
          upDeptId: "",
        });

        loadDepartments(); //등록 후 목록 다시 불러오기
      })
      .catch((err)=>console.error("등록 실패", err));
  }

  //부서 삭제
  const handleDeleteDept = (deptId) =>{
    if(!window.confirm("부서를 삭제하시겠습니까?")) return;

    fetch(`http://localhost/rest/comm-depart/${deptId}`, {
      method: "DELETE",
    })
      .then((res)=>res.json())
      .then((data)=>{
        alert(data.message);

        if (data.success) loadDepartments(); 
        
      })
      .catch((err)=>console.error("삭제 실패", err));
  }

  //부서별 인원수 계산
  const getEmpCount = (deptId) =>{
    return Array.isArray(users) ? users.filter(u => u.deptId === deptId).length : 0;
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title">부서 목록</h4>
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addDeptModal"
        >
          <i className="bi bi-plus-lg"></i> 부서 추가
        </button>
      </div>

      <div className="card-body">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>부서ID</th>
              <th>부서명</th>
              <th>인원수</th>
              <th>사용여부</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr key={dept.deptId}>
                <td>{dept.deptId}</td>
                <td>{dept.deptNm}</td>
                <td>{getEmpCount(dept.deptId)} 명</td>
                <td>{dept.useYn}</td>
                <td>
                  {/* 삭제 버튼 */}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteDept(dept.deptId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*부서 추가 모달 */}
      <div
        className="modal fade"
        id="addDeptModal"
        tabIndex="-1"
        aria-labelledby="addDeptModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">부서 추가</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <label>부서ID</label>
              <input
                name="deptId"
                value={newDept.deptId}
                onChange={handleChange}
                className="form-control mb-2"
              />

              <label>부서명</label>
              <input
                name="deptNm"
                value={newDept.deptNm}
                onChange={handleChange}
                className="form-control mb-2"
              />

              <label>상위부서</label>
              <select
                name="upDeptId"
                value={newDept.upDeptId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">(없음)</option>
                {/* 현재 존재하는 부서들 중에서 선택 */}
                {departments.map((d) => (
                  <option key={d.deptId} value={d.deptId}>
                    {d.deptNm}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddDept}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentList