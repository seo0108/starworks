import React from 'react';
import { Link } from 'react-router-dom';
import "./Unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="unauth-wrapper">
      <div className="unauth-card shadow-lg p-5 rounded-4 text-center">
        <div className="unauth-icon mb-3">
          <i className="bi bi-shield-lock-fill"></i>
        </div>
        <h2 className="fw-bold mb-3">접근이 제한되었습니다</h2>
        <p className="text-muted mb-4">
          이 페이지는 관리자 전용입니다.<br />
          일반 사용자 계정으로는 접근할 수 없습니다.
        </p>
          
          <a href="http://localhost/"
            className="btn btn-primary mt-3"
            onClick={(e) => {
                e.preventDefault();
                window.location.href = "http://localhost/";
            }}
            > <i className="bi bi-house-door me-2"></i>사용자 페이지로 돌아가기</a>
      </div>
    </div>
  );
};

export default Unauthorized;
