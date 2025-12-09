import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";
function Header() {

  const { user, isAuthenticated, logout } = useAuth(); // useAuth 훅 사용
  const [realUser, setRealUser] = useState([]);

 
  useEffect(() => {
    if(user){
      // console.log("헤더에서 꺼낸", user.principal.realUser, isAuthenticated);
      setRealUser(user.principal.realUser);
    }
  })

  const handleLogout = (e) => { e.preventDefault()
    logout(); // 로그아웃 함수 호출
  };

  return (
    <header className="mb-5">
      <div className="header-top">
        <div className="container">
          <div className="logo">
            {/* <Link to="/admin">
              <h5 style={{ marginBottom: "0" }}>StarWorks 관리자 페이지</h5>
            </Link> */}
            <Link
              to="/admin"
              className="d-flex align-items-center text-decoration-none"
              style={{ gap: "10px" }}
            >
              
              <img
                src="/assets/static/Starworks_logo_6.png"
                alt="StarWorks 관리자 페이지 로고"
                style={{
                  height: "40px", /* Adjust height as needed */
                  width: "auto",
                  marginBottom: 0,
                }}
              />
            </Link>

          </div>

          <div className="header-top-right">

  {isAuthenticated && ( // 로그인 상태일 때만 드롭다운 표시
            <div className="dropdown">
              <a
                href="#"
                id="topbarUserDropdown"
                className="user-dropdown d-flex align-items-center dropend dropdown-toggle "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                
                <div className="avatar avatar-md2 border">
                  <img src={realUser.filePath ?? '../assets/compiled/jpg/1.jpg'} alt="Avatar" />
                </div>
                <div className="text">
                  <h6 className="user-dropdown-name"> <span style={{ fontWeight: 'bold', color: '#2483e9ff' }}>관리자</span> {realUser?.userNm}</h6>
                  <p className="user-dropdown-status text-sm text-muted">{realUser.deptNm} {realUser.jbgdNm}</p>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="topbarUserDropdown">
                {/* <li>
                  <a className="dropdown-item" href="#">
                    My Account
                  </a>
                </li> */}
                <li>
                  <a className="dropdown-item" href="http://localhost">
                    <span>
                      <i className="bi bi-briefcase-fill"></i>  사용자 페이지로 돌아가기
                    </span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}> {/* 로그아웃 함수 호출 */}
                    <i className="bi bi-power"></i> 로그아웃
                  </a>
                </li>
              </ul>
            </div>
)}

            {/* Burger button responsive */}
            <a href="#" className="burger-btn d-block d-xl-none">
              <i className="bi bi-justify fs-3"></i>
            </a>
          </div>
        </div>
      </div>

      <nav className="main-navbar active">
        <div className="container">
          <ul>
            <li className="menu-item">
              <NavLink to="/admin" end className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}>
                <span>
                  <i className="bi-grid-fill"></i> 대시보드
                </span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink to="/admin/orgchart" className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}>
                <span>
                  <i className="bi-person-fill-gear"></i> 조직 관리
                </span>
              </NavLink>
            </li>

            {/* 페이징 화면(인사 관리) 메뉴 추가 */}
            <li className="menu-item">
              <NavLink to="/admin/userHistory" className="menu-link">
                <span>
                  <i className="bi-people-fill"></i> 인사 관리
                </span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink to="/admin/project" className="menu-link">
                <span>
                  <i className="bi-clipboard-data-fill"></i> 프로젝트 관리
                </span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink to="/admin/approval" className="menu-link">
                <span>
                  <i className="bi-file-earmark-medical-fill"></i> 결재품의서 관리
                </span>
              </NavLink>
            </li>

            <li className="menu-item">
              <NavLink to="/admin/meeting" className="menu-link">
                <span>
                  <i className="bi bi-door-open-fill"></i> 회의실 관리
                </span>
              </NavLink>
            </li>

            <li className="menu-item me-2">
              <NavLink to="/admin/auth" className="menu-link">
                <span>
                  <i className="bi bi-building-fill-lock"></i> 권한 관리
                </span>
              </NavLink>
            </li>

          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
