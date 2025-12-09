import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * 보호된 라우트를 위한 컴포넌트.
 * 이 컴포넌트로 감싸진 자식 라우트들은 아래의 권한 검사를 통과해야만 렌더링됩니다.
 */
const ProtectedRoute = () => {
    // AuthContext로부터 현재 로그인 상태와 관리자 여부를 가져옵니다.
    const { isAuthenticated, isAdmin } = useAuth();

    // 1. 인증되지 않은 사용자(로그인하지 않은 사용자)인 경우
    if (!isAuthenticated) {
        // React 앱의 로그인 페이지로 리디렉션합니다.
        return <Navigate to="/reactlogin" replace />; // React Router를 사용하여 /reactlogin 경로로 이동
    }

    // 2. 인증은 되었지만 ADMIN이 아닌 경우
    if (!isAdmin) {
        // 인증은 되었지만 ADMIN이 아닌 경우, /unauthorized 페이지로 리디렉션합니다.
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. 인증되었고 ADMIN인 경우
    // 자식 라우트들을 렌더링합니다. (예: <Route path='/admin' ... />)
    return <Outlet />;
};

export default ProtectedRoute;
