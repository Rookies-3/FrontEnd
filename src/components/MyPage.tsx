import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "../store/user/userStore";
import { Save, Eye, EyeOff } from "lucide-react"; 

const Mypage: React.FC = () => {
  const { user } = useUserStore(); 
  const [nickname, setNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  //백엔드에서 내 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`, // JWT 토큰 전송
            },
          }
        );
        setNickname(res.data.nickname); 
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
      }
    };

    if (user?.accessToken) {
      fetchUserInfo();
    }
  }, [user]);

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/me`,
        {
          nickname,
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      alert("프로필이 저장되었습니다 ✅");
    } catch (err) {
      console.error("프로필 저장 실패:", err);
      alert("프로필 저장 중 오류가 발생했습니다 ❌");
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">프로필 수정</h2>

      <div className="space-y-6 max-w-md">
        {/* 닉네임 */}
        <div>
          <label className="block text-sm mb-2 text-github-text-secondary">
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-2 bg-github-surface border border-github-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* 현재 비밀번호 */}
        <div>
          <label className="block text-sm mb-2 text-github-text-secondary">현재 비밀번호</label>
          <div className="relative"> 
            <input
              type={showCurrentPassword ? "text" : "password"} 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-github-surface border border-github-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((v) => !v)} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-github-text-secondary hover:text-github-text transition"
              aria-label={showCurrentPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
            </button>
          </div>
        </div>

        {/* 새 비밀번호 */}
        <div>
          <label className="block text-sm mb-2 text-github-text-secondary">새 비밀번호</label>
          <div className="relative"> 
            <input
              type={showPassword ? "text" : "password"} 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-github-surface border border-github-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm mb-2 text-github-text-secondary">비밀번호 확인</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-github-surface border border-github-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-github-text-secondary hover:text-github-text transition"
              aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />} 
            </button>
          </div>
        </div>


        {/* 저장 버튼 */}
        <button
          onClick={handleSave}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save size={18} /> 저장하기
        </button>
      </div>
    </div>
  );
};

export default Mypage;
