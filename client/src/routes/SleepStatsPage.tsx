import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import { sleepStatsService, adviceService } from "../services/api";
import { DailySleepStat, WeekdayAvgSleepStat } from "../types/sleep_stats";
import { Line, Bar } from "react-chartjs-2";
import ReactMarkdown from "react-markdown";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title
);

const weekdayKorean = ["일", "월", "화", "수", "목", "금", "토"];

const SleepStatsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [dailyStats, setDailyStats] = useState<DailySleepStat[]>([]);
  const [weekdayStats, setWeekdayStats] = useState<WeekdayAvgSleepStat[]>([]);
  const [loading, setLoading] = useState(true);

  // AI 조언 관련 상태
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [errorAdvice, setErrorAdvice] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/nickname", { replace: true });
      return;
    }
    setLoading(true);
    Promise.all([
      sleepStatsService.getRecentStats(user.id),
      sleepStatsService.getWeekdayAvgStats(user.id)
    ]).then(([daily, weekday]) => {
      setDailyStats(daily);
      setWeekdayStats(weekday);
      setLoading(false);
    });
  }, [user, navigate]);

  // undefined 제거 함수
  function cleanAdvice(text: string | null): string {
    if (!text) return "";
    // 맨 마지막 줄에 undefined 있으면 제거
    return text.replace(/undefined\s*$/g, "").trim();
  }

  const handleGetAdvice = async () => {
    if (!user) return;
    setAdvice(null);
    setErrorAdvice(null);
    setLoadingAdvice(true);
    try {
      const text = await adviceService.getAdvice(user.id);
      setAdvice(cleanAdvice(text));
    } catch (e: any) {
      setErrorAdvice(e.message || "AI 조언 요청 실패");
    }
    setLoadingAdvice(false);
  };

  if (!user) return null;
  if (loading) return <div className="p-8 text-center">통계 불러오는 중...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8">수면 인사이트</h2>

      {/* AI 수면 조언 */}
      <section className="mb-8 flex flex-col items-center">
        <button
          className="bg-primary-500 text-white px-6 py-3 rounded shadow text-lg font-bold hover:bg-primary-600 transition disabled:opacity-50 mb-2"
          onClick={handleGetAdvice}
          disabled={loadingAdvice}
          style={{ minWidth: 200 }}
        >
          {loadingAdvice ? "분석 중..." : "AI 조언 받아보기"}
        </button>
        <div className="text-sm text-gray-500 mb-2">
          AI가 내 수면 패턴을 분석해서 맞춤형 조언을 제안해드립니다.
        </div>
        <div className="text-xs text-gray-400 mb-4">
          (조언 생성에 10~20초 정도 소요될 수 있습니다.)
        </div>
        {advice && (
          <div className="mt-6 p-5 bg-orange-50 border border-orange-200 rounded text-gray-800 w-full max-w-2xl whitespace-pre-line">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
        )}
        {errorAdvice && (
          <div className="mt-4 text-red-600">{errorAdvice}</div>
        )}
      </section>

      {/* 최근 30일 일별 수면시간 */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-2">최근 30일간 일별 수면시간</h3>
        <Line
          data={{
            labels: dailyStats.map(d => d.date),
            datasets: [
              {
                label: "수면시간(h)",
                data: dailyStats.map(d => d.sleepTime),
                fill: false,
                borderColor: "#fd7e14",
                tension: 0.3,
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              title: { display: false },
            },
            scales: {
              y: { beginAtZero: true, title: { display: true, text: "시간" } },
              x: { title: { display: true, text: "날짜" } }
            }
          }}
        />
      </section>

      {/* 요일별 평균 수면시간 */}
      <section>
        <h3 className="text-lg font-semibold mb-2">요일별 평균 수면시간</h3>
        <Bar
          data={{
            labels: weekdayStats.map(w => weekdayKorean[Number(w.weekday)]),
            datasets: [
              {
                label: "평균 수면시간(h)",
                data: weekdayStats.map(w => w.avgSleep),
                backgroundColor: "#fd7e14",
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: false }
            },
            scales: {
              y: { beginAtZero: true, title: { display: true, text: "시간" } },
              x: { title: { display: true, text: "요일" } }
            }
          }}
        />
      </section>
    </div>
  );
};

export default SleepStatsPage;