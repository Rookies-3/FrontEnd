import { Eye, EyeOff } from "lucide-react"; 
import React, { useState } from 'react';
interface LoginModalProps {
    onClose: () => void;
    onLogin: (username: string, password: string) => void;
  }
  
  const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!username.trim()) {
        alert("아이디를 입력해주세요.");
        return;
      }
      if (username.length < 3) {
        alert("아이디는 최소 3자 이상이어야 합니다.");
        return;
      }
      if (!password.trim()) {
        alert("비밀번호를 입력해주세요.");
        return;
      }
      if (password.length < 6) {
        alert("비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }

      onLogin(username, password);
      onClose();
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-github-surface p-6 rounded-lg shadow-lg w-full max-w-sm">
          <form
        onSubmit={handleSubmit}
        className="bg-github-surface p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-github-accent mb-6 text-center">
          로그인
        </h1>

        <div className="mb-4">
          <label className="block text-sm text-github-text-secondary mb-1">
            아이디
          </label>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded-md bg-github-dark border border-github-border focus:outline-none focus:border-github-accent"
            />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-github-text-secondary mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-github-dark border border-github-border focus:outline-none focus:border-github-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-github-text-secondary hover:text-github-text transition"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
            </button>
        </div>

        {/* 일반 로그인 */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 py-2 rounded-md bg-github-accent hover:bg-github-accent/80 text-white font-semibold transition"
          >
            로그인
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-primary"
          >
            닫기
          </button>
        </div>


      </form>

          
        </div>
      </div>
    );
  };
  
  export default LoginModal;
  