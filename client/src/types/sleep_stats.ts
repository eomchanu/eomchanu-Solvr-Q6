// 최근 30일 일별 수면시간
export interface DailySleepStat {
  date: string;      // YYYY-MM-DD
  sleepTime: number;      // (단위: 시간, 소수점)
}

// 요일별 평균 수면시간
export interface WeekdayAvgSleepStat {
  weekday: string;        // "0"~"6" (0: 일요일)
  avgSleep: number;       // 평균 수면시간 (시간)
}