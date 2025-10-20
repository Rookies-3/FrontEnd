import React, { useState } from 'react';

interface SignupModalProps {
  onClose: () => void;
  onSignup: (username: string, password: string, email: string) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(username, password, email);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-github-surface p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-bold text-github-text mb-4">회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-github-border bg-github-dark text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-github-border bg-github-dark text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-github-border bg-github-dark text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
          />
          <div className="flex justify-end space-x-2">
            <button type="submit" className="btn-primary">
              회원가입
            </button>            
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
