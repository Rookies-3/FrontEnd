import React, { useState, useEffect } from 'react';

interface HeaderProps {
    activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
    const [isScrolled, setIsScrolled] = useState(false);

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

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled ? 'bg-github-dark/95 backdrop-blur-md border-b border-github-border' : 'bg-transparent'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-github-accent">우리는1팀이다</h1>
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
                </div>
            </div>
        </header>
    );
};

export default Header;