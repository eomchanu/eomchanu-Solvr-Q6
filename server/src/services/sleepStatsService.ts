import { sql, eq } from "drizzle-orm";
import { sleepRecords } from "../db/schema";
import { Database } from "../types/database";

type SleepStatsServiceDeps = { db: Database };

export const createSleepStatsService = ({ db }: SleepStatsServiceDeps) => {
  // 최근 30일간 일별 수면시간
  const getRecentSleepStats = async (userId: number) => {
    const results = await db.select({
      date: sleepRecords.sleepDate,
      sleepTime: sleepRecords.sleepTime,
    })
    .from(sleepRecords)
    .where(sql`${sleepRecords.userId} = ${userId} AND ${sleepRecords.sleepDate} >= date('now', '-29 days')`)
    .orderBy(sql`${sleepRecords.sleepDate} ASC`);

    // [{ date: '2024-06-01', sleepTime: 7.5 }, ...]
    return results;
  };

  // 요일별 평균 수면시간
const getWeekdayAvgSleepStats = async (userId: number) => {
  const results = await db.select({
    weekday: sql`strftime('%w', ${sleepRecords.sleepDate})`.as("weekday"),
    avgSleep: sql`avg(${sleepRecords.sleepTime})`.as("avgSleep"),
  })
    .from(sleepRecords)
    .where(eq(sleepRecords.userId, userId))
    .groupBy(sql`weekday`)
    .orderBy(sql`weekday`);
  return results;
};

  return { getRecentSleepStats, getWeekdayAvgSleepStats };
};

export type SleepStatsService = ReturnType<typeof createSleepStatsService>