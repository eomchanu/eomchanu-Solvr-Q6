import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";
import { useUser } from "../UserContext";

const NicknamePage = () => {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useUser();

  // 이미 등록된 유저라면 홈으로 리다이렉트
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!nickname.trim()) {
      setError("닉네임을 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      let userObj;
      try {
        userObj = await userService.getByNickname(nickname);
      } catch {
        userObj = await userService.create({ nickname });
      }
      login({ id: userObj.id, nickname: userObj.nickname });
      navigate("/", { replace: true });
    } catch (err: any) {
      setError("사용자 등록 실패: " + (err.message || "알 수 없는 오류"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 flex flex-col gap-4 w-full max-w-xs"
      >
        <h2 className="text-xl font-bold text-center mb-2">닉네임을 입력하세요</h2>
        <input
          className="p-2 border rounded text-center"
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={20}
          autoFocus
          autoComplete="off"
          disabled={loading}
        />
        <button
          className="bg-primary-500 text-white font-semibold rounded py-2 hover:bg-primary-600 mt-4 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "확인 중..." : "시작하기"}
        </button>
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default NicknamePage;