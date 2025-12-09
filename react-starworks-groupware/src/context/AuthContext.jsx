
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInst from '../api/apiClient'; // API 호출을 위한 axios 인스턴스
import axios from 'axios';

// AuthContext 생성. 앱 전역에서 사용될 인증 관련 상태와 함수를 담는 공간입니다.
const AuthContext = createContext(null);

// AuthProvider 컴포넌트: AuthContext.Provider를 통해 하위 컴포넌트들에게 인증 상태와 함수들을 제공합니다.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 로그인한 사용자 정보를 저장하는 상태
    const [loading, setLoading] = useState(true); // 사용자 정보 로딩 상태

    // 컴포넌트가 처음 마운트될 때 실행되어, 현재 로그인된 사용자 정보를 가져옵니다.
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // 백엔드의 /comm-user/me 엔드포인트를 호출하여 현재 세션의 사용자 정보를 요청합니다.
                const response = await axiosInst.get('/comm-user/me');
                setUser(response.data); // 성공 시, 응답으로 받은 사용자 정보를 user 상태에 저장합니다.

                // console.log("사용자 정보",response.data); // (가영 추가)
            } catch (error) {
                console.log("Not logged in"); // API 호출 실패 시 (보통 401 Unauthorized), 로그인하지 않은 상태로 간주합니다.
                setUser(null);
            }
            setLoading(false); // 사용자 정보 확인이 끝나면 로딩 상태를 false로 변경합니다.
        };

        fetchUser();
    }, []);

    // login 함수: 외부(예: 로그인 페이지)에서 호출하여 user 상태를 업데이트합니다.
    const login = (userData) => {
        setUser(userData);
    };

    // logout 함수: user 상태를 null로 만들어 로그아웃 상태로 변경하고 로그인 페이지로 리다이렉트합니다.
    const logout = async () => { // 비동기 함수로 변경
        try {
            // 백엔드 로그아웃 API 호출 (baseURL 우회)
            await axios.get('http://localhost/common/auth/revoke',{headers:{Accept: "application/json"}, withCredentials: true });
            console.log("로그아웃 성공: 서버 세션이 만료되었습니다."); // 로그아웃 성공 메시지
        } catch (error) {
            console.error("로그아웃 실패:", error); // 로그아웃 실패 시 에러 로깅
            // 쿠키에서 액세스 토큰 삭제, 쿠키의 만료 날짜를 머나먼 과거로 설정
        } finally {
            setUser(null); // 사용자 상태를 null로 설정하여 클라이언트 측에서도 로그아웃 처리
            window.location.href = '/reactlogin'; // 로그아웃 후 React 로그인 페이지로 전체 페이지 리다이렉트
        }
    };

    // Context를 통해 하위 컴포넌트에 제공될 값들
    const value = {
        user, // 현재 사용자 정보
        login, // 로그인 함수
        logout, // 로그아웃 함수
        isAuthenticated: !!user, // 사용자가 있으면 true, 없으면 false (로그인 여부)
                isAdmin: user?.authorities?.some(auth => 
                    (typeof auth === 'string' && auth === 'ROLE_ADMIN') || (auth && auth.authority === 'ROLE_ADMIN')
                ),
                loading    };

    return (
        <AuthContext.Provider value={value}>
            {/* 로딩이 끝난 후에만 하위 컴포넌트들을 렌더링합니다. */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// useAuth 커스텀 훅: 다른 컴포넌트에서 쉽게 AuthContext의 값들을 사용할 수 있게 합니다.
export const useAuth = () => {
    return useContext(AuthContext);
};
