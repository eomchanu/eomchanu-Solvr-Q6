import { User, NewUser, SleepRecord, NewSleepRecord } from '../db/schema'

// 사용자 관련 타입
export { User, NewUser, SleepRecord, NewSleepRecord }

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
  totalPages: number
}

// 사용자 생성 DTO
export interface CreateUserDto {
  nickname: string
}

// 수면 기록 생성 DTO
export interface CreateSleepRecordDto {
  userId: number
  sleepDate: string      // YYYY-MM-DD
  sleepStart: string     // YYYY-MM-DD HH:mm
  wakeTime: string       // YYYY-MM-DD HH:mm
  note?: string
}

// 수면 기록 수정 DTO
export interface UpdateSleepRecordDto {
  sleepStart?: string
  wakeTime?: string
  note?: string
}