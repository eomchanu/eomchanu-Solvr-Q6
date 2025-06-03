import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sleepRecordService } from "../services/api";
import { SleepRecord } from "../types/sleep_record";
import { useUser } from "../UserContext";

const getTimeString = (datetime: string) => {
  // "2025-06-03T23:11" → "23:11"
  return datetime.split("T")[1]?.slice(0, 5) || "";
};

const SleepRecordListPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<SleepRecord>>({});

  useEffect(() => {
    if (!user) {
      navigate("/nickname", { replace: true });
    }
  }, [user, navigate]);

  const fetchRecords = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const list = await sleepRecordService.getListByUserId(user.id);
      list.sort((a, b) => b.sleepDate.localeCompare(a.sleepDate));
      setRecords(list);
    } catch (err: any) {
      setError(err.message || "기록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRecords();
  }, [user?.id]);

  const handleDelete = async (record: SleepRecord) => {
    if (!user) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(record.id);
    try {
      await sleepRecordService.delete(record.id);
      await fetchRecords();
    } catch (err: any) {
      setError(err.message || "삭제 실패");
    } finally {
      setDeleting(null);
    }
  };

  const handleEditSave = async (record: SleepRecord) => {
    try {
      // 시간만 입력받았을 때 기존 날짜와 합쳐서 보냄
      const getFullDatetime = (_date: string, time: string) =>
        `${record.sleepDate}T${time}`;

      await sleepRecordService.update(record.id, {
        sleepStart: editData.sleepStart?.includes("T")
          ? editData.sleepStart
          : getFullDatetime(record.sleepDate, editData.sleepStart ?? getTimeString(record.sleepStart)),
        wakeTime: editData.wakeTime?.includes("T")
          ? editData.wakeTime
          : getFullDatetime(record.sleepDate, editData.wakeTime ?? getTimeString(record.wakeTime)),
        note: editData.note ?? record.note ?? "",
      });
      setEditingId(null);
      setEditData({});
      await fetchRecords();
    } catch (err: any) {
      setError(err.message || "수정 실패");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-6">내 수면 기록</h2>
        <button
          className="mb-4 px-4 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
          onClick={() => navigate("/")}
        >
          ← 홈으로
        </button>
        {loading ? (
          <div className="text-center text-gray-500">불러오는 중...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : records.length === 0 ? (
          <div className="text-center text-gray-400">기록이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full mt-2 text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">날짜</th>
                  <th className="text-left p-2">수면 시작</th>
                  <th className="text-left p-2">기상</th>
                  <th className="text-left p-2">수면시간(h)</th>
                  <th className="text-left p-2">특이사항</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {records.map(record =>
                  editingId === record.id ? (
                    <tr key={record.id} className="bg-yellow-50">
                      {/* 날짜 (수정 불가) */}
                      <td className="border-t p-2">{record.sleepDate}</td>
                      {/* 수면 시작 */}
                      <td className="border-t p-2">
                        <input
                          type="time"
                          className="border p-1 rounded w-full"
                          value={editData.sleepStart ?? getTimeString(record.sleepStart)}
                          onChange={e => setEditData(d => ({ ...d, sleepStart: e.target.value }))}
                        />
                      </td>
                      {/* 기상 */}
                      <td className="border-t p-2">
                        <input
                          type="time"
                          className="border p-1 rounded w-full"
                          value={editData.wakeTime ?? getTimeString(record.wakeTime)}
                          onChange={e => setEditData(d => ({ ...d, wakeTime: e.target.value }))}
                        />
                      </td>
                      {/* 수면시간(h) */}
                      <td className="border-t p-2">{record.sleepTime.toFixed(2)}</td>
                      {/* 특이사항 */}
                      <td className="border-t p-2">
                        <input
                          type="text"
                          className="border p-1 rounded w-full"
                          value={editData.note ?? record.note ?? ""}
                          onChange={e => setEditData(d => ({ ...d, note: e.target.value }))}
                        />
                      </td>
                      {/* 액션 */}
                      <td className="border-t p-2">
                        <button
                          className="text-green-600 font-bold mr-2"
                          onClick={() => handleEditSave(record)}
                        >
                          저장
                        </button>
                        <button
                          className="text-gray-500"
                          onClick={() => {
                            setEditingId(null);
                            setEditData({});
                          }}
                        >
                          취소
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={record.id}>
                      <td className="border-t p-2">{record.sleepDate}</td>
                      <td className="border-t p-2">{getTimeString(record.sleepStart)}</td>
                      <td className="border-t p-2">{getTimeString(record.wakeTime)}</td>
                      <td className="border-t p-2">{record.sleepTime.toFixed(2)}</td>
                      <td className="border-t p-2">{record.note || "-"}</td>
                      <td className="border-t p-2">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => {
                            setEditingId(record.id);
                            setEditData({
                              sleepStart: getTimeString(record.sleepStart),
                              wakeTime: getTimeString(record.wakeTime),
                              note: record.note ?? "",
                            });
                          }}
                          disabled={!!deleting}
                        >
                          수정
                        </button>
                        <button
                          className="text-red-500 hover:underline disabled:text-gray-300"
                          onClick={() => handleDelete(record)}
                          disabled={!!deleting}
                        >
                          {deleting === record.id ? "삭제 중..." : "삭제"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SleepRecordListPage;