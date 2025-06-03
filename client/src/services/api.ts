import axios from 'axios'
import { User, NewUserDto } from '../types/user'
import { SleepRecord, NewSleepRecordDto, UpdateSleepRecordDto  } from '../types/sleep_record'

// 공통 API 응답 타입
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 환경변수 또는 기본값
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ----------- 사용자(User) 서비스 -----------
export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users')
    return response.data.data || []
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`)
    if (!response.data.data) throw new Error('사용자를 찾을 수 없습니다.')
    return response.data.data
  },

  getByNickname: async (nickname: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/by-nickname/${nickname}`)
    if (!response.data.data) throw new Error('사용자를 찾을 수 없습니다.')
    return response.data.data
  },

  create: async (userData: NewUserDto): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', userData)
    if (!response.data.data) throw new Error('사용자 생성에 실패했습니다.')
    return response.data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`)
  }
}

// ----------- 수면 기록(SleepRecord) 서비스 -----------
export const sleepRecordService = {
  // 유저별 기록 전체 리스트
  getListByUserId: async (userId: number): Promise<SleepRecord[]> => {
    const res = await api.get<ApiResponse<SleepRecord[]>>(`/records/list/${userId}`)
    return res.data.data || []
  },

  // 특정 날짜 단일 기록 조회
  getRecord: async (userId: number, sleepDate: string): Promise<SleepRecord> => {
    const res = await api.get<ApiResponse<SleepRecord>>(`/records/${userId}/${sleepDate}`)
    if (!res.data.data) throw new Error('기록을 찾을 수 없습니다.')
    return res.data.data
  },

  // 기록 생성
  create: async (recordData: NewSleepRecordDto): Promise<SleepRecord> => {
    const res = await api.post<ApiResponse<SleepRecord>>('/records', recordData)
    if (!res.data.data) throw new Error('기록 생성에 실패했습니다.')
    return res.data.data
  },

  // 기록 수정
  update: async (recordId: number, updateData: UpdateSleepRecordDto): Promise<SleepRecord> => {
    const res = await api.put<ApiResponse<SleepRecord>>(`/records/${recordId}`, updateData)
    if (!res.data.data) throw new Error('기록 수정에 실패했습니다.')
    return res.data.data
  },

  // 기록 삭제
  delete: async (recordId: number): Promise<void> => {
    await api.delete(`/records/${recordId}`)
  }
}

export default api