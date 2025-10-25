import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user/userStore';
import LoginModal from '../components/modal/LoginModal';
import SignupModal from './modal/SignupModal';
import MyPage from './MyPage'; // ✅ 같은 폴더 안
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  activeSection: string;
}

function decodeJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  element?.scrollIntoView({ behavior: 'smooth' });
};

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false); // ✅ 오버레이 상태
  const [slideIn, setSlideIn] = useState(false); // ✅ 애니메이션 상태
  const { isLoggedIn, user, login, logout } = useUserStore();
  const navigate = useNavigate();

  // 스크롤 상태 관리
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 마이페이지 슬라이드 애니메이션
  useEffect(() => {
    if (showMyPage) {
      setTimeout(() => setSlideIn(true), 10);
    } else {
      setSlideIn(false);
    }
  }, [showMyPage]);

  // 로그인 요청
  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { username, password }
      );
      login({
        username: response.data.username,
        email: response.data.email,
        password: response.data.password,
        accessToken: response.data.accessToken,
      });
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다.");
    }
  };

    const handleSignup = async (username: string, name: string, nickname: string, email: string, phone: string, password: string) => {
        console.log('회원가입 시도:', nickname, name, email, phone, password);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/signup`,
                {
                    username,
                    name,
                    nickname,
                    phone,
                    password,
                    email,
                });

                console.log("회원가입 성공");

                login({
                    email: response.data.email,
                    password: response.data.password,
                });
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입에 실패했습니다.");                  
        }
    }
   

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-github-dark/95 backdrop-blur-md border-b border-github-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* 좌측 로고 */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <h1 className="text-xl font-bold text-github-accent">
                면접을 Job아!
              </h1>
            </div>

            {/* 중앙 네비게이션 */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {[
                  { name: '홈', id: 'home' },
                  { name: 'AI와 대화하기', id: 'AIService' },
                  { name: '실전연습', id: 'AIService2'}
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`text-sm font-medium transition-colors duration-200 hover:text-github-accent ${
                        activeSection === item.id
                          ? 'text-github-accent'
                          : 'text-github-text-secondary'
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 우측 로그인/마이페이지 */}
            <div className="ml-6 flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <button className="btn-primary" onClick={() => setIsLoginOpen(true)}>
                    로그인
                  </button>
                  <button className="btn-secondary" onClick={() => setIsSignupOpen(true)}>
                    회원가입
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-github-text-secondary">
                    {user?.username || user?.email} 님
                  </span>
                  <button
                    onClick={() => setShowMyPage(true)}
                    className="btn-secondary"
                  >
                    마이페이지
                  </button>
                  <button onClick={logout} className="btn-secondary">
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 로그인 모달 */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
        />
      )}

      {/* 회원가입 모달 */}
      {isSignupOpen && (
        <SignupModal
          onClose={() => setIsSignupOpen(false)}
          onSignup={handleSignup}
        />
      )}

      {/* ✅ 오른쪽 슬라이드 마이페이지 */}
      {showMyPage && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] flex justify-end transition-opacity duration-300"
          onClick={() => setShowMyPage(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative h-full w-[420px] bg-github-dark border-l border-gray-700 shadow-2xl transform transition-transform duration-500 ease-in-out ${
              slideIn ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowMyPage(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            {/* 마이페이지 내용 */}
            <div className="p-8 overflow-y-auto h-full">
              <MyPage />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
