import React, { useEffect, useState } from "react";
import UserEditModal from "./UserEditModal";
import axiosInst from '../../api/apiClient'; // Import axiosInst
import './UserList.css'
import { showAlert } from "../../api/sweetAlert";
import UserDetailModal from "./UserDetailModal";

/* 구성원 관리 + 구성원 추가 모달 + 퇴사처리 */
function UserList({ onResignedUpdate, onUserCountUpdate }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  //pdf 변환
  const [purpose, setPurpose] = useState("");

  // 부서 목록 저장
  const [departments, setDepartments] = useState([]);

  //페이징처리
  const [currentPage, setCurrentPage] = useState(1); //현재 페이지
  const itemsPerPage = 10; //페이지당 갯수

  // 신규 구성원 입력값
  const [newUser, setNewUser] = useState({
    userNm: "",
    userId: "",
    userPswd: "",
    userEmail: "",
    userTelno: "",
    extTel: "",
    deptId: "",
    jbgdNm: "",
    hireYmd: "",
  });

  const handleAuto = ()=>{
    setNewUser({
      userNm: "김도완",
      userId: "20261524",
      userPswd: "java",
      userEmail: "sd@starwork.com",
      userTelno: "010-8542-7448",
      extTel: "154",
      deptId: "DP003000",
      jbgdCd: "JBGD05",
      hireYmd: "2025-10-20",
    })
  }



  const [searchWord, setSearchWord] = useState("");

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 구성원 목록 조회 (함수화)
  const loadUsers = () => {
    axiosInst.get("/comm-user")
      .then((res) => {
        const data = res.data;
        /* setUsers(data) */
        //console.log("서버에서 받은 조직도형 데이터:", data);

        // userId가 존재하는 행만 필터링
        const allUsers = data.filter((item) => !!item.userId);
        //console.log("필터링된 직원 목록:", allUsers);
        
        //부모한테 전달(전체 구성원수)
        if (onUserCountUpdate) {
          onUserCountUpdate(allUsers.length);
        }
        
        setUsers(allUsers);
        
        
      })
      .catch((err) => console.error("구성원 목록 조회 실패:", err));
  };

  // 신규 구성원 등록
  const handleAddUser = () => {
    if (!newUser.userNm || !newUser.userId || !newUser.userPswd) {
      //alert("이름, 아이디, 비밀번호는 필수 입력 항목입니다.");
      showAlert("error", "이름, 아이디, 비밀번호는 필수 입력 항목입니다.");
      return;
    }

    axiosInst.post("/comm-user", newUser)
      .then((res) => {
        if (res.status !== 200) throw new Error("등록 실패");
        //return res.json(); // axios는 응답 데이터를 자동으로 JSON으로 파싱합니다.
      })
      .then(() => {
        //alert("신규 구성원이 등록되었습니다.");
        showAlert("success", "신규 구성원이 등록되었습니다.");

        // 모달 닫기
        const modalEl = document.getElementById("addUserModal");
        const modalInstance = window.bootstrap?.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();

        // 입력 초기화
        setNewUser({
          userNm: "",
          userId: "",
          userPswd: "",
          userEmail: "",
          userTelno: "",
          extTel: "",
          deptId: "",
          jbgdNm: "",
          hireYmd: "",
        });

        // 목록 갱신
        loadUsers();
      })
      .catch((err) => console.error("등록 실패:", err));
  };

  // 초기 데이터 로드
  useEffect(() => {
    loadUsers();
    setSelectedUser({
          userNm: "",
          userId: "",
          userPswd: "",
          userEmail: "",
          userTelno: "",
          extTel: "",
          deptId: "",
          jbgdNm: "",
          hireYmd: "",
        })

    // 부서 목록 가져오기
    axiosInst.get("/comm-depart") 
      .then((res) => {
        const data = res.data;
        const activeDepts = data.filter(dept => dept.useYn === 'Y'); //사용하는 부서만 가져오도록 필터링
        setDepartments(activeDepts);
      })
      .catch((err) => console.error("부서 목록 조회 실패:", err));
  }, []);


  const handleRetireUser = (userId) => {
  showAlert("warning", "정말 퇴사 처리하시겠습니까?", true).then((result) => {
    if (!result.isConfirmed) return;

    axiosInst.patch("/comm-user/" + userId + "/retire")
      .then((res) => {
        if (res.status !== 200) throw new Error("퇴사 처리 실패");

        showAlert("success", "퇴사처리가 완료되었습니다.");
        loadUsers(); // 구성원 목록 갱신

        axiosInst.get("/comm-user/resigned")
          .then((res2) => {
            if (onResignedUpdate) {
              onResignedUpdate(res2.data.length);
            }
          })
          .catch((err) => console.error("퇴사자 수 갱신 실패:", err));
      })
      .catch((err) => {
        console.error("퇴사처리 오류", err);
        showAlert("error", "퇴사 처리 중 오류가 발생했습니다.");
      });
  });
};



  //엑셀로 등록
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    //요청보내기
    axiosInst.post("/comm-user/uploadExcel", formData,{
      headers : {"Content-Type" : "multipart/form-data"},
    })
    .then((res)=>{
      showAlert("success",res.data).then(()=>{
      loadUsers(); //업로드 후 구성원 목록 새로고침
      });
    })
    .catch((err) => {
      console.error("엑셀 업로드 실패", err);
      //alert("엑셀 업로드중 오류가 발생했숨돠,,,");
      showAlert("error", "엑셀 업로드중 오류가 발생했습니다");
    })

  }

  const handleSearch = () => {
    if (!searchWord) {
      loadUsers(); // 검색어 없으면 전체 조회
      setCurrentPage(1); //검색어 없어도 페이지 초기화
      return;
    }

    axiosInst.get(`/comm-user/search?term=${searchWord}`)
      .then((res) => {
        setUsers(res.data);
        setCurrentPage(1);
      })
      .catch((err) => console.error("검색 실패:", err));
  };
  
  //페이징 처리 관련 계산
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  //페이징 이동함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 재직증명서 PDF 다운로드
  const handleCertificateDownload = (userId) => {
    if (!userId) {
      showAlert("error", "대상 사용자를 선택해주세요.");
      return;
    }

    axiosInst({
      url: `/certificate/${userId}`,
      method: "GET",
      responseType: "blob", // PDF는 바이너리로 받음
      params: { purpose },  // 모달에서 입력한 용도를 @RequestParam으로 전달
    })
      .then((res) => {
        // PDF Blob 객체를 브라우저에서 다운로드
        const file = new Blob([res.data], { type: "application/pdf" });

        // blob 객체를 임시 URL로
        const fileURL = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", `${userId}_재직증명서.pdf`);
        
        // 클릭으로 자동 다운로드 트리거
        document.body.appendChild(link);
        link.click();
        link.remove();
        setPurpose("");
        showAlert("success", "재직증명서가 발급되었습니다.");
      })
      .catch((err) => {
        console.error("PDF 발급 오류:", err);
        showAlert("error", "재직증명서 발급 중 오류가 발생했습니다.");
      });
};

  return (
    <div className="content-wrapper container userlist-container">
      <style>{`
        .userlist-container .modal-content {
          border-radius: 12px;
          border: none;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .userlist-container .modal-header {
          background: #f8f9fc;
          border-bottom: 1px solid #e0e3e7;
        }

        .userlist-container .modal-title {
          font-weight: 600;
          color: #333;
        }

        .userlist-container .modal-footer {
          background: #f8f9fc;
          border-top: 1px solid #e0e3e7;
        }

        .userlist-container .btn-primary {
          background: #4e73df;
          border: none;
        }

        .userlist-container .btn-primary:hover {
          background: #2e59d9;
        }

        .userlist-container table {
          border-color: #eee;
        }

        .userlist-container table th {
          background-color: rgba(226, 236, 253, 1);
          color: #333;
          font-weight: 600;
          text-align: center;
        }

        .userlist-container table td {
          text-align: center;
          vertical-align: middle;
        }

        .userlist-container .table-hover tbody tr:hover {
          background-color: #f9fbff;
        }

        .userlist-container .pagination .page-item.active .page-link {
          background-color: #4e73df;
          border-color: #4e73df;
          color: #fff;
        }

        .userlist-container .pagination .page-link {
          color: #4e73df;
          border: none;
        }

        .userlist-container .pagination .page-link:hover {
          background: #edf2ff;
        }
      `}</style>
      <div className="page-content">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">구성원 목록</h4>
            <div className="d-flex gap-2">
              {/* 엑셀 업로드 버튼 */}
              <label htmlFor="excelUpload" className="btn btn-success">
                <i className="bi bi-file-earmark-excel"></i> 엑셀로 추가
              </label>
              <input id="excelUpload" type="file" accept=".xlsx" onChange={handleExcelUpload} style={{display:"none"}} />
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#addUserModal"
            >
              <i className="bi bi-plus-lg"></i> 신규 구성원 추가
            </button>
          </div>
        </div>
          <div className="card-body">
            {/* 검색 영역 */}
            <div className="col-md-5 col-sm-6 mb-3">
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  name="searchWord"
                  placeholder="사번, 이름, 부서, 이메일, 연락처로 검색하세요"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  onKeyDown={(e)=>{
                    if(e.key === "Enter"){
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                <button className="btn btn-primary" type="button" onClick={handleSearch}>
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            {/* 구성원 목록 테이블 */}
            <div className="dataTable-container">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>사번</th>
                    <th>이름</th>
                    <th>부서</th>
                    <th>직급</th>
                    <th>이메일</th>
                    <th>연락처</th>
                    <th>상태</th>
                    <th className="text-center">관리
                      <small className="text-muted">(수정 / 퇴사 / 증명서)</small>
                    </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-link p-0 text-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#userDetailModal"
                            onClick={()=> {
                              //console.log("111",user);
                              // console.log("===========================");
                              // console.log(user);
                              // console.log("===========================");
                              //let obj = document.getElementById("userDetailModal");
                              setSelectedUser(user)


                            }}>
                          {user.userNm}
                          </button></td>
                        <td>{user.deptNm}</td>
                        <td>{user.jbgdNm}</td>
                        <td>{user.userEmail}</td>
                        <td>{user.userTelno}</td>
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
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-light"
                            data-bs-toggle="modal"
                            data-bs-target="#userEditModal"
                            title="수정"
                            onClick={() => setSelectedUser(user)}
                          >
                            <i className="bi bi-pencil-fill"></i>
                            {/* <span className="text-primary small">수정</span> */}
                          </button>
                          <button
                            className="btn btn-sm btn-light text-danger"
                            onClick={() =>handleRetireUser(user.userId)}
                            title="퇴사처리"
                          >
                            <i className="bi bi-person-x-fill"></i>
                            {/* <span className="text-danger small">퇴사</span> */}
                          </button>
                          <button
                          className="btn btn-sm btn-light"
                          data-bs-toggle="modal"
                          data-bs-target="#certificateModal"
                          onClick={() => setSelectedUser(user)}
                          title = "재직증명서"
                        >
                          <i className="bi bi-file-earmark-text"></i>
                          {/* <span className="text-success small">증명서</span> */}
                        </button>
                        </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        구성원 정보가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* 페이지네이션 */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
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

            <div className="dataTable-bottom text-center text-muted small">
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, users.length)} of {users.length} entries
            </div>
          </div>
        </div>
      </div>
            {/* <div className="dataTable-bottom">
              <div className="dataTable-info">
                Showing {users.length} entries
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* 신규 구성원 추가 모달 */}
      <div
        className="modal fade"
        id="addUserModal"
        tabIndex="-1"
        aria-labelledby="addUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addUserModalLabel">
                신규 구성원 추가
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
                    <div className="col-12">
                      <div className="form-group">
                        <label>이름 <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          name="userNm"
                          value={newUser.userNm}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="이름"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>사번(아이디) <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          name="userId"
                          value={newUser.userId}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="사번"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>비밀번호 <span className="text-danger">*</span></label>
                        <input
                          type="password"
                          name="userPswd"
                          value={newUser.userPswd}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="비밀번호"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>부서 <span className="text-danger">*</span></label>
                        <select
                          name="deptId"
                          value={newUser.deptId}
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
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>직급 <span className="text-danger">*</span></label>
                        <select
                          name="jbgdCd"
                          value={newUser.jbgdCd}
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
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>이메일 <span className="text-danger">*</span></label>
                        <input
                          type="email"
                          name="userEmail"
                          value={newUser.userEmail}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="이메일"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>연락처</label>
                        <input
                          type="text"
                          name="userTelno"
                          value={newUser.userTelno}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="연락처"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>내선번호</label>
                        <input
                          type="text"
                          name="extTel"
                          value={newUser.extTel}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="내선번호"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>입사일</label>
                        <input
                          type="date"
                          name="hireYmd"
                          value={newUser.hireYmd}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={handleAuto}>+</button>
              <button
                type="button"
                className="btn btn-light-secondary"
                data-bs-dismiss="modal"
                onClick={() => {
                  setNewUser({
                    userNm: "",
                    userId: "",
                    userPswd: "",
                    userEmail: "",
                    userTelno: "",
                    extTel: "",
                    deptId: "",
                    jbgdCd: "",
                    hireYmd: "",
                  });
                }}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-primary ml-1"
               // data-bs-dismiss="modal"
                onClick={handleAddUser}
              >
                추가
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 재직증명서 발급 모달 */}
      <div
        className="modal fade"
        id="certificateModal"
        tabIndex="-1"
        aria-labelledby="certificateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="certificateModalLabel">
                재직증명서 발급
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedUser ? (
                <>
                  <p><strong>대상자:</strong> {selectedUser.userNm} ({selectedUser.deptNm} {selectedUser.jbgdNm})</p>
                  <div className="mb-3">
                    <label className="form-label">용도</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="재직증명서 용도를 입력하세요"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    ></textarea>
                  </div>
                </>
              ) : (
                <p className="text-muted">대상을 선택하세요.</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={()=>setPurpose("")}
              >
                닫기
              </button>
              <button
                type="button"
                className="btn btn-primary"
                //data-bs-dismiss="modal"
                onClick={() => {
                  if(!purpose){
                    showAlert("error", "재직증명서 용도를 입력해주세요.");
                    return;
                  }
                  handleCertificateDownload(selectedUser.userId);
                  
                  //발급 성공시 모달창 닫기
                  const modalEl = document.getElementById("certificateModal");
                  const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
                  if(modalInstance) modalInstance.hide();

                  setPurpose("");
                
                }}
              >
                PDF 발급
              </button>
            </div>
          </div>
        </div>
      </div>


      <UserDetailModal user={selectedUser} />
      <UserEditModal user={selectedUser} departments={departments}/>
    </div>
  );
}

export default UserList;
