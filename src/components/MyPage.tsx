import React, { useEffect, useState } from "react";
import axios from "axios";
import { Save } from "lucide-react";
import { useUserStore } from "../store/user/userStore";

const Mypage: React.FC = () => {
  const { user } = useUserStore(); // ✅ 로그인한 유저 정보 (accessToken 포함)
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ 백엔드에서 내 정보 불러오기
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
        setNickname(res.data.nickname); // ✅ 서버에서 받은 닉네임 반영
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
      }
    };

    if (user?.accessToken) {
      fetchUserInfo();
    }
  }, [user]);

  const handleSave = async () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/update`,
        {
          nickname,
          password,
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

        {/* 새 비밀번호 */}
        <div>
          <label className="block text-sm mb-2 text-github-text-secondary">
            새 비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-github-surface border border-github-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-sm mb-2 text-github-text-secondary">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-github-surface border border-github-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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
