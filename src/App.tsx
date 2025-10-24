import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // ✅ 추가
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import AIService from './components/AIService';
import Footer from './components/Footer';
import Mypage from './components/MyPage'; // ✅ 마이페이지 추가 (경로는 네 폴더 구조에 맞게 수정)

/*
 TODO: 푸터 추가하기
*/
function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'AIService'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <Router>
      <div className="bg-github-dark text-github-text font-inter min-h-screen">
        {/* ✅ Header는 반드시 Router 내부에 위치해야 함 */}
        <Header activeSection={activeSection} />

        <main>
          <Routes>
            {/* ✅ 홈 화면 (Hero + AIService 포함) */}
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <AIService />
                </>
              }
            />

            {/* ✅ 마이페이지 라우트 */}
            <Route path="/mypage" element={<Mypage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
