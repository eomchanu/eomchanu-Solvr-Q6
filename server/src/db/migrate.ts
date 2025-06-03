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
  { nickname: '당근이' },      // id: 1
  { nickname: '당근2' },      // id: 2
  { nickname: '당근e' },    // id: 3
]

// 랜덤 혹은 패턴을 준 수면 기록 생성 (최근 30일, id 1~3번)
function makeInitialSleepRecords() {
  const records: any[] = []
  const today = new Date()
  for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)
    const dateStr = date.toISOString().slice(0, 10)

    // 7~8.5시간 랜덤
    const sleepStart1 = `${dateStr}T23:30`
    const wakeTime1 = `${dateStr}T07:30`
    const sleepTime1 = 7 + Math.random() * 1.5
    records.push({
      user_id: 1,
      sleep_date: dateStr,
      sleep_start: sleepStart1,
      wake_time: wakeTime1,
      sleep_time: parseFloat(sleepTime1.toFixed(2)),
      note: daysAgo % 5 === 0 ? "야근" : "",
      created_at: dateStr + "T08:00",
    })

    // 8~9.5시간
    const sleepStart2 = `${dateStr}T22:30`
    const wakeTime2 = `${dateStr}T07:30`
    const sleepTime2 = 8 + Math.random() * 1.5
    records.push({
      user_id: 2,
      sleep_date: dateStr,
      sleep_start: sleepStart2,
      wake_time: wakeTime2,
      sleep_time: parseFloat(sleepTime2.toFixed(2)),
      note: daysAgo % 7 === 0 ? "운동 후 숙면" : "",
      created_at: dateStr + "T08:00",
    })

    // 5~7시간, 불규칙
    const sleepStart3 = `${dateStr}T00:30`
    const wakeTime3 = `${dateStr}T06:30`
    const sleepTime3 = 5 + Math.random() * 2
    records.push({
      user_id: 3,
      sleep_date: dateStr,
      sleep_start: sleepStart3,
      wake_time: wakeTime3,
      sleep_time: parseFloat(sleepTime3.toFixed(2)),
      note: daysAgo % 6 === 0 ? "불면증" : "",
      created_at: dateStr + "T08:00",
    })
  }
  return records
}

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
    const existingUsers = await db.select().from(users)
    if (existingUsers.length === 0) {
      // 유저 삽입
      for (const user of initialUsers) {
        await db.insert(users).values(user)
      }
      console.log(`${initialUsers.length}명의 유저가 추가되었습니다.`)

      // sleep_records 데이터 삽입
      const sleepRecords = makeInitialSleepRecords()
      for (const rec of sleepRecords) {
        sqlite.prepare(
          `INSERT INTO sleep_records
            (user_id, sleep_date, sleep_start, wake_time, sleep_time, note, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(
          rec.user_id,
          rec.sleep_date,
          rec.sleep_start,
          rec.wake_time,
          rec.sleep_time,
          rec.note,
          rec.created_at,
        )
      }
      console.log(`${sleepRecords.length}건의 수면 기록이 추가되었습니다.`)
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
