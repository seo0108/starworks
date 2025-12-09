import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

// 로그인 페이지 컴포넌트
const LoginPage = () => {
  // 사용자 이름과 비밀번호 상태 관리
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // AuthContext에서 로그인 함수 가져오기
  const { login } = useAuth();
  // 페이지 이동을 위한 navigate 훅 사용
  const navigate = useNavigate();

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    try {
      // 백엔드 로그인 API 호출
      const response = await axios.post(
        "http://localhost/common/auth",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true, // 인증 정보를 함께 전송
        }
      );
      login(response.data); // 로그인 성공 시 AuthContext의 login 함수 호출하여 사용자 정보 업데이트
      navigate("/"); // 로그인 성공 후 메인 페이지로 이동
    } catch (error) {
      console.error("로그인 실패:", error); // 로그인 실패 시 에러 콘솔 출력
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."); // 사용자에게 알림
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h4 className="login-title">관리자 로그인</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">아이디:</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">비밀번호:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>
        <div className="login-footer">
          ⓒ 2025 Starworks. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
