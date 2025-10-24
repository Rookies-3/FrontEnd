import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/user/userStore';
import LoginModal from '../components/modal/LoginModal';
import SignupModal from './modal/SignupModal';
import axios from "axios";
interface HeaderProps {
    activeSection: string;
}

function decodeJwt(token : string) {
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

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const { isLoggedIn, user, login, logout } = useUserStore();

    // 스크롤 이벤트 처리
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 섹션 스크롤 smooth하게 이동 함수
    const scrollToSection = (sectionId:String) => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({
            behavior:'smooth'
        });
    }

    // 네비게이션 목록 정의
    const navigation = [
        { name: '홈', id: 'home'},
        { name: 'AI 서비스', id: 'AIService' },
    ];

    const handleLogin = async (username: string, password: string) => {
        console.log("로그인 시도", username, password);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, 
                {
                    username,
                    password
                })

                console.log("로그인 성공");

                login({
                    username: response.data.username,
                    email: response.data.email,
                    password: response.data.password,
                    accessToken: response.data.accessToken
                });
        } catch(error) {
            console.error("로그인 실패:", error);
            alert("로그인에 실패했습니다.");              
        }
    }

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

                // login({
                //     email: response.data.email,
                //     password: response.data.password,
                // });
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입에 실패했습니다.");                  
        }
    }
   

    return (
        <>
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-github-dark/95 backdrop-blur-md border-b border-github-border' : 'bg-transparent'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-github-accent">면접을 Job아!</h1>
                    </div>
                <nav className="hidden md:block">
                    <ul className="flex space-x-8">
                        {/* 네비게이션 가로 정렬 */}
                        {
                            navigation.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => scrollToSection(item.id)}
                                        className={`text-sm font-medium transition-colors duration-200 hover:text-github-accent ${
                                            activeSection === item.id ? 'text-github-accent' : 'text-github-text-secondary'
                                        }`}                                        
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </nav>

                {/* 로그인 & 회원가입 버튼 */}
                <div className="ml-6 flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <>
                            <button className="btn-primary" onClick={() => setIsLoginOpen(true)}>
                            로그인
                            </button>
       
                            <button
                                className="btn-secondary" onClick={() => setIsSignupOpen(true)}>
                                회원가입
                            </button>                  
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-github-text-secondary">
                            {user?.username || user?.email} 님
                            </span>                           
                            <button onClick={logout} className="btn-secondary">
                            로그아웃
                            </button>
                        </div>                                 
                    )}


                </div>
                </div>
            </div>
        </header>

        {/* 모달 조건부 렌더링 */}
        {isLoginOpen && (
            <LoginModal onClose={() => setIsLoginOpen(false)} onLogin={handleLogin}/>
        )}

        {isSignupOpen && (
            <SignupModal onClose={() => setIsSignupOpen(false)} onSignup={handleSignup}/>
        )}
        </>
    );
};

export default Header;