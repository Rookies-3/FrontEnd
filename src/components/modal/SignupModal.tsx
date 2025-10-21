import React, { useState } from 'react';

interface SignupModalProps {
  onClose: () => void;
  onSignup: (username: string, name: string, nickname: string, phone: string, password: string, email: string) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(username, name, nickname, email, phone, password);
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
          회원가입
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
            className="w-full px-3 py-2 rounded-md border border-github-border bg-github-dark text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
          />
        <label className="block text-sm text-github-text-secondary mb-1">
            이름
        </label>
        <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-github-border bg-github-dark text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
          />

        <label className="block text-sm text-github-text-secondary mb-1">
            닉네임
        </label>
        <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-github-border bg-github-dark text-github-text focus:outline-none focus:ring-2 focus:ring-github-accent"
          />

          <label className="block text-sm text-github-text-secondary mb-1">
            이메일
          </label>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md bg-github-dark border border-github-border focus:outline-none focus:border-github-accent"
          />

          <label className="block text-sm text-github-text-secondary mb-1">
            핸드폰
          </label>
          <input
            type="phone"
            placeholder="핸드폰번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 rounded-md bg-github-dark border border-github-border focus:outline-none focus:border-github-accent"
          />

          <label className="block text-sm text-github-text-secondary mb-1">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-github-dark border border-github-border focus:outline-none focus:border-github-accent"
          />
        </div>



        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 py-2 rounded-md bg-github-accent hover:bg-github-accent/80 text-white font-semibold transition"
          >
            회원가입
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-md bg-github-dark border border-github-border text-github-text hover:bg-github-dark/80 transition"
          >
            닫기
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default SignupModal;
