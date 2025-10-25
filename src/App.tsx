import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import AIService from './components/AIService';
import AIService2 from './components/AIService2';
import Footer from './components/Footer';
import Mypage from './components/MyPage'; 

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'AIService', 'AIService2'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const middle = window.innerHeight / 2;
          return rect.top <= middle && rect.bottom >= middle;
        }
        return false;
      });
      
      // const currentSection = sections.find(section => {
      //   const element = document.getElementById(section);
      //   if (element) {
      //     const rect = element.getBoundingClientRect();
      //     return rect.top <= 100 && rect.bottom >= 100;
      //   }
      //   return false;
      // });

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

  useEffect(() => {
    console.log("현재 activeSection:", activeSection);
  }, [activeSection]);
  
  return (
    <Router>
      <div className="bg-github-dark text-github-text font-inter min-h-screen">
        <Header activeSection={activeSection} setActiveSection={setActiveSection}/>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <AIService />
                  <AIService2 />
                </>
              }
            />

            <Route path="/mypage" element={<Mypage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
