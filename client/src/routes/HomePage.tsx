import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sleepRecordService } from "../services/api";
import { useUser } from "../UserContext";

function toFullDateTime(date: string, time: string) {
  return `${date}T${time}`;
}

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // 오늘 날짜 (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

  // form state
  const [sleepDate, setSleepDate] = useState(today);
  const [sleepStart, setSleepStart] = useState(""); // HH:mm
  const [wakeTime, setWakeTime] = useState("");     // HH:mm
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // 로그인 안 됐으면 닉네임 입력 화면으로
  useEffect(() => {
    if (!user) {
      navigate("/nickname", { replace: true });
    }
  }, [user, navigate]);

  // user가 없으면 렌더 X (잠깐 빈 화면)
  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!sleepStart || !wakeTime) {
      setMessage("수면 시작/기상 시간을 모두 입력하세요.");
      return;
    }

    const sleepStartFull = toFullDateTime(sleepDate, sleepStart);
    const wakeTimeFull = toFullDateTime(sleepDate, wakeTime);

    try {
      await sleepRecordService.create({
        userId: user.id,
        sleepDate, // YYYY-MM-DD
        sleepStart: sleepStartFull, // YYYY-MM-DDTHH:mm
        wakeTime: wakeTimeFull,     // YYYY-MM-DDTHH:mm
        note,
      });
      setMessage("수면 기록이 등록되었습니다.");
      setNote("");
      // setSleepStart(""); setWakeTime(""); 등 필요 시 추가
    } catch (err: any) {
      setMessage(err.message || "기록 등록 실패");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-primary-500">당근 딥슬립</h1>
        <div className="mb-4 text-gray-500">{user.nickname}님, 오늘의 수면을 기록하세요.</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="date"
            className="border p-2 rounded"
            value={sleepDate}
            onChange={e => setSleepDate(e.target.value)}
            max={today}
            required
          />
          <div className="flex gap-2">
            <input
              type="time"
              className="border p-2 rounded w-1/2"
              value={sleepStart}
              onChange={e => setSleepStart(e.target.value)}
              required
            />
            <input
              type="time"
              className="border p-2 rounded w-1/2"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
              required
            />
          </div>
          <textarea
            className="border p-2 rounded"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="특이사항 (선택)"
            rows={2}
          />
          <button
            type="submit"
            className="bg-primary-500 text-white font-bold py-2 rounded hover:bg-primary-600"
          >
            기록 저장
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-primary-700">{message}</div>
        )}
        <button
          className="mt-8 text-primary-500 underline"
          onClick={() => navigate("/records")}
        >
          내 기록 보기
        </button>
      </div>
    </div>
  );
};

export default HomePage;