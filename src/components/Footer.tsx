import React from 'react';
import { Clipboard, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-github-surface border-t border-github-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-1 text-github-text-secondary mb-4 md:mb-0">
            <span>Made with</span>
            <Clipboard className="w-4 h-4 text-red-500 animate-pulse" />
            <span>by</span>
            <span className="text-github-accent font-medium">팀명</span>
          </div>

          <div className="flex items-center space-x-6">
            <p className="text-sm text-github-text-secondary">
              © SK쉴더스 루키즈 4기 1팀 팀명
            </p>
            
            <button
              onClick={scrollToTop}
              className="p-2 bg-github-accent/10 hover:bg-github-accent/20 text-github-accent rounded-lg transition-all duration-200 hover:scale-110"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;