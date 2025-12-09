import { useState } from 'react'

// 컴포넌트 임포트
import Header from './fragments/Header'
import Approval from './pages/approval/Approval'
import Auth from './pages/auth/Auth'
import Dashboard from './pages/dashboard/Dashboard'
import Orgchart from './pages/orgchart/Orgchart'
import Project from './pages/project/Project'
import Meeting from './pages/meeting/Meeting'
import UserHistory from './pages/userHistory/UserHistory' // 페이징 화면

// React Router 관련 임포트
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import './App.css'

import AuthCreate from './pages/auth/AuthCreate'
import ProtectedRoute from './routes/ProtectedRoute'
import Unauthorized from './pages/unauthorized/Unauthorized'
import LoginPage from './pages/auth/LoginPage' // LoginPage 임포트

// AppContent 컴포넌트: 라우팅 및 조건부 헤더 렌더링을 처리합니다.
function AppContent() {
  const location = useLocation();
  // 특정 경로에서는 헤더를 숨깁니다. (예: /unauthorized, /reactlogin)
  const showHeader = location.pathname !== '/unauthorized' && location.pathname !== '/reactlogin';

  return (
    <div id="app">
      <div id="main" className="layout-horizontal">
        {/* showHeader 값에 따라 헤더를 조건부로 렌더링합니다. */}
        {showHeader && <Header />}
        <div className="layout-wrapper">
          <div className="main-content">
            <Routes>
              {/* 로그인 페이지 라우트 */}
              <Route path="/reactlogin" element={<LoginPage />} />
              {/* 권한 불필요 페이지 라우트 */}
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* ProtectedRoute로 감싸진 라우트들은 인증 및 권한 검사를 거칩니다. */}
              <Route element={<ProtectedRoute />}>
                {/* 기본 진입 경로를 /admin으로 리다이렉트합니다. */}
                <Route path="/" element={<Navigate to="/admin" replace />} />

                {/* 관리자 전용 페이지 라우트들 */}
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/orgchart" element={<Orgchart />} />
                <Route path="/admin/project" element={<Project />} />
                <Route path="/admin/meeting" element={<Meeting />} />
                <Route path="/admin/approval" element={<Approval />} />
                <Route path="/admin/auth" element={<Auth />} />
                <Route path="/admin/auth/create" element={<AuthCreate />} />
                <Route path="/admin/userHistory" element={<UserHistory />} /> {/* 페이징 적용 화면 */}
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

// App 컴포넌트: BrowserRouter로 전체 애플리케이션을 감싸 라우팅을 활성화합니다.
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
