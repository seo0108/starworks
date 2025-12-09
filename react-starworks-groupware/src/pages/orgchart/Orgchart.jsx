import { useEffect, useState } from "react";
import DepartmentList from "./DepartmentList";
import ResignedUserList from "./ResignedUserList";
import UserList from "./UserList";
import UserHistoryList from "../userHistory/UserHistoryList";
import axiosInst from '../../api/apiClient'; // Import axiosInst


/* 전체 페이지(구성원 관리 / 부서 관리 / 퇴사자 관리)  */
function Orgchart() {
  const [activeTab, setActiveTab] = useState("users");
  const [resignedCount, setResignedCount] = useState(0);
  const [resignedUsers, setResignedUsers] = useState([]);
  //전체 구성원수
  const [userCount, setUserCount] = useState(0);

   useEffect(() => {
      axiosInst.get("/comm-user")
        .then((res)=>{
          const data = res.data;
          const activeUsers = data.filter(user => user.rsgntnYn === "N"); //재직자만
          setUserCount(activeUsers.length);
        })
          .catch((err) => console.error("사용자 목록 조회 실패:", err));

      axiosInst.get("/comm-user/resigned")
        .then((res) => {
           const data = res.data;
           setResignedUsers(data);
           setResignedCount(data.length);
      })
        .catch((err) => console.error("퇴사자 목록 조회 실패:", err));
       }, []);

    


  return (
    <div className="content-wrapper container">
      <div className="page-heading">
        <h3>조직 관리</h3>
        <p className="text-muted">구성원, 부서, 퇴사자 정보를 통합적으로 관리합니다.</p>
      </div>

      <div className="page-content">
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              구성원 관리{" "}
              <span className="badge bg-secondary ms-1"   style={{
                  background: "linear-gradient(90deg, #4e73df, #6ea8fe)",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  padding: "0.35rem 0.7rem",
                  borderRadius: "50rem",
                  boxShadow: "0 2px 6px rgba(78,115,223,0.3)",
                }}>{userCount}명</span>
            </button>
          </li>
          
          <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "resigned" ? "active" : ""}`}
            onClick={() => setActiveTab("resigned")}
          >
            퇴사자 관리{" "}
            <span className="badge bg-secondary ms-1" style={{
                  background: "linear-gradient(90deg, #adb5bd, #ced4da)",
                  color: "#212529",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  padding: "0.35rem 0.7rem",
                  borderRadius: "50rem",
                  boxShadow: "0 2px 6px rgba(173,181,189,0.3)",
                }} >{resignedCount}명</span>
          </button>
        </li>
        <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "departments" ? "active" : ""}`}
              onClick={() => setActiveTab("departments")}
            >
              부서 관리
            </button>
          </li>
          {/* <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              인사이력 관리
            </button>
          </li> */}
        </ul>

        {activeTab === "users" && <UserList onResignedUpdate={setResignedCount} 
                                            onUserCountUpdate={setUserCount}/>}
        {activeTab === "departments" && <DepartmentList />}
        {activeTab === "resigned" && <ResignedUserList onCountChange={setResignedCount}/>}
       {/*  {activeTab === "history" && <UserHistoryList />} */}
      </div>
    </div>
  );
}

export default Orgchart;
