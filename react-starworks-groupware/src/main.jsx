import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider로 App 컴포넌트를 감싸서, 애플리케이션 전역에서 로그인 상태 및 사용자 정보에 접근할 수 있도록 합니다. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
