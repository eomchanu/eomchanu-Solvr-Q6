export interface SleepRecord {
  id: number
  userId: number
  sleepDate: string       // YYYY-MM-DD
  sleepStart: string      // YYYY-MM-DD HH:mm
  wakeTime: string        // YYYY-MM-DD HH:mm
  sleepTime: number       // 총 수면 시간 (float, 단위: 시간)
  note?: string
  createdAt: string
  updatedAt: string
}

export interface NewSleepRecordDto {
  userId: number
  sleepDate: string
  sleepStart: string
  wakeTime: string
  note?: string
}

export interface UpdateSleepRecordDto {
  sleepStart?: string
  wakeTime?: string
  note?: string
}