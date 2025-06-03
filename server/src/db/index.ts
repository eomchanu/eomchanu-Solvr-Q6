import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import env from '../config/env'
import * as schema from './schema'
import { Database as DrizzleDatabase } from '../types/database'

// 싱글톤 인스턴스
let db: DrizzleDatabase | null = null

// DB 인스턴스 생성
export async function getDb(): Promise<DrizzleDatabase> {
  if (!db) {
    const sqlite = new Database(env.DATABASE_URL)
    db = drizzle(sqlite, { schema }) as DrizzleDatabase
  }
  return db
}

// 초기화 함수 (forward compatibility용, 내부적으로 getDb만 호출)
export async function initializeDatabase(): Promise<DrizzleDatabase> {
  return getDb()
}

export default { initializeDatabase, getDb }
