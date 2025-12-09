import React, { useEffect, useState } from "react";
import './Dashboard.css';
import ApprovalChart from './ApprovalChart';
import DepartmentUserChart from './DepartmentUserChart';
import axiosInst from '../../api/apiClient'; // Import axiosInst


function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [projectList, setProjectList] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [newHires, setNewHires] = useState([]);
  const [resignations, setResignations] = useState([]);
  const [approvalCount, setApprovalCount] = useState(0);
  const [approvalChartData, setApprovalChartData] = useState([]); // 결재 양식별 통계 데이터
  const [departmentUserChartData, setDepartmentUserChartData] = useState([]); // 부서별 사용자 수 데이터
  const [emailCount, setEmailCount] = useState(0);
  const [promotionCount, setPromotionCount] = useState(0);
  const [deptMoveCount, setDeptMoveCount] = useState(0);

  useEffect(() => {
    // 전체 사용자 수
    axiosInst.get("/comm-user")
      .then((res) => {
        const data = res.data;
        //console.log("전체 사용자 데이터:", data);
        const validUsers = data.filter((item) => !!item.userId);
        setTotalUsers(validUsers.length);

      //최근 입사자
      const hires = validUsers
        .filter(u=>u.hireYmd)
        .sort((a, b)=> new Date(b.hireYmd) - new Date(a.hireYmd))
        .slice(0, 3);
      setNewHires(hires);

      })
      .catch((err) => console.error("조회 실패", err));

    // 퇴사자 목록 
    axiosInst.get("/comm-user/resigned")
      .then((res) => {
        const data = res.data;
        const latestResigned = Array.isArray(data) ? data
          .sort((a, b) => new Date(b.rsgntnYmd || 0) - new Date(a.rsgntnYmd || 0))
          .slice(0, 3) : [];
        setResignations(latestResigned);
      })
      .catch((err) => console.error("퇴사자 목록 조회 실패:", err));

    // 진행중인 프로젝트 수 + 목록
    axiosInst.get("/project")
      .then((res) => {
        const data = res.data;
        setProjectCount(data.length);
        setProjectList(data.slice(0,7));
      })
      .catch((err) => console.error("프로젝트 조회 실패:", err));

      //오늘 결재 수
      axiosInst.get("/approval/approvalCount")
        .then((res)=>{
          const data = res.data;
          setApprovalCount(data.approvalCount || 0);
        })
        .catch((err)=>console.error("결재수 조회 실패", err));

      // 결재 양식별 통계 데이터 (월간)
      axiosInst.get("/approval-chart-data/monthly-usage")
        .then((res) => {
          const data = res.data;
          setApprovalChartData(data); // Data is already in the desired format from the new backend
        })
        .catch((err) => console.error("결재 양식별 통계 데이터 조회 실패", err));

      // 부서별 사용자 수 데이터
      axiosInst.get("/department-chart-data/user-counts")
        .then((res) => {
          const data = res.data;
          setDepartmentUserChartData(data);
        })
        .catch((err) => console.error("부서별 사용자 수 데이터 조회 실패", err));
   
      //공지사항 목록
      axiosInst.get("/board-notice/dashBoard")
        .then((res)=> {
          const data = res.data;
          console.log("공지사항 data", data);
          setRecentNotices(Array.isArray(data) ? data : []);
        })
        .catch((err)=>console.error("공지사항 조회 실패", err));

      //메일 건수
      axiosInst.get("/EmailCount")
        .then((res)=> setEmailCount(res.data.count || 0))
        .catch((err)=> console.error("메일건수 조회 실패", err));


      //올해 진급자, 부서이동 수
      const fetchHrHistory = async () => {
      try {
        const res = await axiosInst.get("/comm-user-history");
        if (res.status !== 200) throw new Error("서버 오류 발생");

        const data = res.data || [];

        // 올해
        const currentYear = new Date().getFullYear();

        // 올해 진급/부서이동 필터링
        const thisYearHistories = data.filter((h) => {
          const year = new Date(h.crtDt).getFullYear();
          return year === currentYear;
        });

        // 진급: changeType === '02'
        const promotions = thisYearHistories.filter(
          (h) => String(h.changeType).trim().padStart(2, "0") === "02"
        ).length;

        // 부서이동: changeType === '01'
        const deptMoves = thisYearHistories.filter(
          (h) => String(h.changeType).trim().padStart(2, "0") === "01"
        ).length;

        setPromotionCount(promotions);
        setDeptMoveCount(deptMoves);
      } catch (err) {
        console.error("인사이력 조회 실패", err);
      }
    };
    fetchHrHistory();

  }, []);

  return (
    <div className="content-wrapper container">
      <div className="page-heading">
        <h3>관리자 대시보드</h3>
      </div>

      <div className="page-content">
        <section className="row">
          {/* 왼쪽 메인 컬럼 */}
          <div className="col-12 col-lg-8">
            {/* 카드 3개 */}
            <div className="row mt-0">
              {/* 전체 사용자 */}
              <div className="col-6 col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body px-3 py-4-5">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="stats-icon purple">
                          <i className="bi bi-person fs-4"></i>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <h6 className="text-muted font-semibold">전체 사용자</h6>
                        <h6 className="font-extrabold mb-0">{totalUsers} 명</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오늘의 결재 */}
              <div className="col-6 col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body px-3 py-4-5">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="stats-icon blue">
                          <i className="bi bi-file-text fs-4"></i>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <h6 className="text-muted font-semibold">금일 결재 요청</h6>
                        <h6 className="font-extrabold mb-0">{approvalCount} 건</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 진행중 프로젝트 수 */}
              <div className="col-6 col-lg-4 col-md-6">
                <div className="card">
                  <div className="card-body px-3 py-4-5">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="stats-icon green">
                          <i class="bi bi-envelope-arrow-up  fs-4"></i>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h6 className="text-muted font-semibold">금일 발송 메일</h6>
                      <h6 className="font-extrabold mb-0">{emailCount} 건</h6>
                          
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className="row mt-0">

            {/* 예시 카드 2 */}
            <div className="col-6 col-lg-4 col-md-6">
              <div className="card">
                <div className="card-body px-3 py-4-5">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="stats-icon teal">
                        <i className="bi bi-bar-chart-line fs-4"></i>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h6 className="text-muted font-semibold">
                          진행중인 프로젝트
                      </h6>
                      <h6 className="font-extrabold mb-0">{projectCount} 건</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 예시 카드 3 */}
            <div className="col-6 col-lg-4 col-md-6">
              <div className="card">
                <div className="card-body px-3 py-4-5">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="stats-icon orange">
                        <i class="bi bi-person-up  fs-4"></i>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <h6 className="text-muted font-semibold">진급자 수</h6>
                      <h6 className="font-extrabold mb-0">{promotionCount} 명</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 예시 카드 1 */}
            <div className="col-6 col-lg-4 col-md-6">
              <div className="card">
                <div className="card-body px-3 py-4-5">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="stats-icon red">
                       <i class="bi bi-building-gear fs-4"></i>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h6 className="text-muted font-semibold">부서이동 수</h6>
                      <h6 className="font-extrabold mb-0">{deptMoveCount} 명</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* 부서별 사용자 수 */}
            <div className="card mt-4">
              <div className="card-header">
                <h4 className="card-title">부서별 사용자 수</h4>
              </div>
              <div className="card-body d-flex justify-content-center">
                <DepartmentUserChart data={departmentUserChartData} width={780} height={480} />
              </div>
            </div>

            {/* 결재양식별 통계 */}
            <div className="card mt-4">
              <div className="card-header">
                <h4 className="card-title">결재 품의서별 사용량 (월간)</h4>
              </div>
              <div className="card-body d-flex justify-content-center">
                <ApprovalChart data={approvalChartData} />
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드 컬럼 */}
          <div className="col-12 col-lg-4">
            {/* 사내 전체 공지*/}
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">사내 전체 공지</h4>
                <div>
                  <button className="btn btn-primary btn-sm mr-1" onClick={() => (window.location.href = "http://localhost/board/notice/create")}>
                    <i className="bi bi-plus-lg"></i> 새 공지 작성
                  </button>
                  <button className="btn btn-light btn-sm" onClick={() => (window.location.href = "http://localhost/board/notice")}>
                    <i class="bi bi-list"></i>
                  </button>
                </div>
              </div>
              <div className="card-body">
              <ul className="list-group list-group-flush">
                {recentNotices.length > 0 ? (
                  recentNotices.map((notice) => (
                    <li key={notice.pstId} className="list-group-item">
                      {/* 제목 */}
                      <div className="fw-bold mb-1">{notice.pstTtl}</div>

                      {/* 작성자 + 부서 + 일자 */}
                      <small className="text-muted">
                        {notice.userNm}
                        {notice.jbgdNm}
                        {`(${notice.deptNm})`} |{" "}
                        {notice.frstCrtDt?.substring(0, 10)}
                      </small>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted text-center">
                    공지사항이 없습니다。
                  </li>
                )}
              </ul>
            </div>
          </div>


            {/* 진행중인 프로젝트 */}
            <div className="card mt-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">진행중인 프로젝트</h4>
                <button className="btn btn-primary btn-sm" onClick={() => (window.location.href = "http://localhost:5173/admin/project")}>
                  <i className="bi bi-plus-lg"></i> 프로젝트 관리
                </button>
              </div>
              <div className="card-body">
                {projectList.length > 0 ? (
                  <table className="table table-hover align-middle project-table">
                    <thead>
                      <tr>
                        <th>프로젝트명</th>
                        <th>담당자</th>
                        <th>진행률</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectList.map((p) => (
                        <tr key={p.bizId}>
                          <td className="fw-bold">{p.bizNm}</td>
                          <td>{p.bizPicId || "-"}</td>
                          <td style={{ width: "40%" }}>
                            <div className="progress" style={{ height: "10px" }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${p.bizPrgrs || 0}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                ) : (
                  <p className="text-center text-muted mb-0">
                    진행중인 프로젝트가 없습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 인사 현황 */}
            <div className="card mt-4">
              <div className="card-header">
                <h4 className="card-title">인사 현황</h4>
              </div>
              <div className="card-body">
                <ul className="nav nav-tabs" id="hr-tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active"
                      id="new-hires-tab"
                      data-bs-toggle="tab"
                      href="#new-hires"
                      role="tab"
                    >
                      최근 입사자
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="resignations-tab"
                      data-bs-toggle="tab"
                      href="#resignations"
                      role="tab"
                    >
                      최근 퇴사자
                    </a>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  {/* 최근 입사자 */}
                  <div
                    className="tab-pane fade show active"
                    id="new-hires"
                    role="tabpanel"
                  >
                    <ul className="list-group list-group-flush">
                      {newHires.length > 0 ? (
                        newHires.map((u) => (
                          <li
                            key={u.userId}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <h6 className="mb-0">{u.userNm}</h6>
                              <small className="text-muted">
                                {u.deptNm} / {u.hireYmd?.substring(0, 10)}
                              </small>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-center text-muted">
                          최근 입사자가 없습니다.
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* 최근 퇴사자 */}
                  <div
                    className="tab-pane fade"
                    id="resignations"
                    role="tabpanel"
                  >
                    <ul className="list-group list-group-flush">
                      {resignations.length > 0 ? (
                        resignations.map((u) => (
                          <li
                            key={u.userId}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <h6 className="mb-0">{u.userNm}</h6>
                              <small className="text-muted">
                                {u.deptNm} / {u.rsgntnYmd?.substring(0, 10)}
                              </small>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-center text-muted">
                          최근 퇴사자가 없습니다。
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </section>
      </div>
    </div>
  );

}

export default Dashboard;
