import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { mkdir } from 'fs/promises'
import { dirname } from 'path'
import env from '../config/env'
import { users } from './schema'

// 데이터베이스 디렉토리 생성 함수
async function ensureDatabaseDirectory() {
  const dir = dirname(env.DATABASE_URL)
  try {
    await mkdir(dir, { recursive: true })
  } catch (error) {
    // 디렉토리가 이미 존재하는 경우 무시
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error
    }
  }
}

// 초기 사용자 데이터
const initialUsers = [
  { nickname: '당근이' }
]

// 데이터베이스 마이그레이션 및 초기 데이터 삽입
async function runMigration() {
  try {
    // 데이터베이스 디렉토리 생성
    await ensureDatabaseDirectory()

    // 데이터베이스 연결
    const sqlite = new Database(env.DATABASE_URL)
    const db = drizzle(sqlite)

    // 스키마 생성
    console.log('데이터베이스 스키마 생성 중...')

    // users 테이블 생성
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT NOT NULL UNIQUE
      )
    `)

    // sleep_records 테이블 생성
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sleep_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        sleep_date TEXT NOT NULL,
        sleep_start TEXT NOT NULL,
        wake_time TEXT NOT NULL,
        sleep_time REAL NOT NULL,
        note TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT,
        UNIQUE(user_id, sleep_date),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `)

    // 초기 데이터 삽입
    console.log('초기 데이터 삽입 중...')

    // 기존 데이터 확인
    const existingUsers = db.select().from(users)

    if ((await existingUsers).length === 0) {
      for (const user of initialUsers) {
        await db.insert(users).values(user)
      }
      console.log(`${initialUsers.length}명의 유저가 추가되었습니다.`)
    } else {
      console.log('유저 데이터가 이미 존재합니다. 초기 데이터 삽입을 건너뜁니다.')
    }

    console.log('데이터베이스 마이그레이션이 완료되었습니다.')
  } catch (error) {
    console.error('데이터베이스 마이그레이션 중 오류가 발생했습니다:', error)
    process.exit(1)
  }
}

// 스크립트가 직접 실행된 경우에만 마이그레이션 실행
if (require.main === module) {
  runMigration()
}

export default runMigration
