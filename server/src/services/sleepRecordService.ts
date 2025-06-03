import { and, eq } from "drizzle-orm";
import { sleepRecords } from "../db/schema";
import { Database } from "../types/database";
import {
  SleepRecord,
  NewSleepRecord,
  CreateSleepRecordDto,
  UpdateSleepRecordDto
} from '../types'

type DeepSleepServiceDeps = { db: Database };

export const createDeepSleepService = ({ db }: DeepSleepServiceDeps) => {
  // 유저별 전체 기록 조회
  const getSleepRecordsByUserId = async (userId: number): Promise<SleepRecord[]> => {
    return db.select().from(sleepRecords).where(eq(sleepRecords.userId, userId));
  };

  // 단일 기록 조회 (userId + sleepDate)
  const getSleepRecord = async (
    userId: number,
    sleepDate: string
  ): Promise<SleepRecord | undefined> => {
    const result = await db
      .select()
      .from(sleepRecords)
      .where(and(eq(sleepRecords.userId, userId), eq(sleepRecords.sleepDate, sleepDate)))
      .limit(1)
    return result[0]
  }

  // 기록 생성 (동일 날짜 중복 불가)
  const createSleepRecord = async (
    dto: CreateSleepRecordDto
  ): Promise<SleepRecord> => {
    // 중복 체크 (userId+date)
    const exists = await getSleepRecord(dto.userId, dto.sleepDate)
    if (exists) {
      throw new Error('이미 해당 날짜에 기록이 존재합니다.')
    }

    // 수면 시간 계산 (분 단위 → 시간 단위 float)
    const sleepStart = new Date(dto.sleepStart)
    const wakeTime = new Date(dto.wakeTime)
    let diffMs = wakeTime.getTime() - sleepStart.getTime()
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000 // 자정 넘김 보정
    const sleepTime = diffMs / (1000 * 60 * 60)

    const newRecord: NewSleepRecord = {
      ...dto,
      sleepTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const result = await db.insert(sleepRecords).values(newRecord).returning()
    return result[0]
  }

  // 기록 수정
  const updateSleepRecord = async (
    userId: number,
    sleepDate: string,
    dto: UpdateSleepRecordDto
  ): Promise<SleepRecord | undefined> => {
    // sleepTime 재계산 필요시
    let sleepTime: number | undefined = undefined
    if (dto.sleepStart && dto.wakeTime) {
      const start = new Date(dto.sleepStart)
      const end = new Date(dto.wakeTime)
      let diffMs = end.getTime() - start.getTime()
      if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000
      sleepTime = diffMs / (1000 * 60 * 60)
    }

    const updateFields: Partial<NewSleepRecord> = {
      ...dto,
      updatedAt: new Date().toISOString(),
      ...(sleepTime !== undefined ? { sleepTime } : {})
    }

    const result = await db
      .update(sleepRecords)
      .set(updateFields)
      .where(and(eq(sleepRecords.userId, userId), eq(sleepRecords.sleepDate, sleepDate)))
      .returning()
    return result[0]
  }

  // 삭제
  const deleteSleepRecord = async (
    userId: number,
    sleepDate: string
  ): Promise<boolean> => {
    const result = await db
      .delete(sleepRecords)
      .where(and(eq(sleepRecords.userId, userId), eq(sleepRecords.sleepDate, sleepDate)))
      .returning({ id: sleepRecords.id })
    return result.length > 0
  }

  return {
    getSleepRecordsByUserId,
    getSleepRecord,
    createSleepRecord,
    updateSleepRecord,
    deleteSleepRecord,
  };
};

export type DeepSleepService = ReturnType<typeof createDeepSleepService>