import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import { sleepStatsService } from "../services/api";
import { DailySleepStat, WeekdayAvgSleepStat } from "../types/sleep_stats";
import { Line, Bar } from "react-chartjs-2";
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

  if (!user) return null;
  if (loading) return <div className="p-8 text-center">통계 불러오는 중...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8">수면 인사이트</h2>

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