import dotenvSafe from 'dotenv-safe'
import path from 'path'

// .env 파일 로드 (dotenv-safe 사용)
dotenvSafe.config({
  path: path.resolve(process.cwd(), '.env'),
  example: path.resolve(process.cwd(), '.env.example'),
  allowEmptyValues: true
})

// 환경 변수 타입 정의
interface Env {
  PORT: number
  HOST: string
  NODE_ENV: 'development' | 'production' | 'test'
  DATABASE_URL: string
  CORS_ORIGIN: string
  GEMINI_API_KEY: string
  LOG_LEVEL: string
}

// 환경 변수 기본값 설정
const env: Env = {
  PORT: parseInt(process.env.PORT || '8000', 10),
  HOST: process.env.HOST || 'localhost',
  NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'development',
  DATABASE_URL: process.env.DATABASE_URL || './data/database.sqlite',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyAWIhu-6QZ0sJ9osjabZbZHo0t5y6pK5Zs",
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
}

export default env
