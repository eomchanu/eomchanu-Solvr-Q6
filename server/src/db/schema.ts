import { sqliteTable, integer, text, real, unique, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nickname: text("nickname").notNull().unique(),
});

export const sleepRecords = sqliteTable("sleep_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  sleepDate: text("sleep_date").notNull(),          // YYYY-MM-DD
  sleepStart: text("sleep_start").notNull(),        // YYYY-MM-DD HH:mm
  wakeTime: text("wake_time").notNull(),            // YYYY-MM-DD HH:mm
  sleepTime: real("sleep_time").notNull(),          // 시간(실수)
  note: text("note"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at"),
}, (table) => ({
  uniqueSleepDatePerUser: unique().on(table.userId, table.sleepDate),
}));

// 타입 자동 추론
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type SleepRecord = typeof sleepRecords.$inferSelect;
export type NewSleepRecord = typeof sleepRecords.$inferInsert;
export type UpdateSleepRecord = Partial<Omit<NewSleepRecord, 'id' | 'createdAt'>>;

// // 사용자 테이블 스키마
// export const users = sqliteTable('users', {
//   id: integer('id').primaryKey({ autoIncrement: true }),
//   name: text('name').notNull(),
//   email: text('email').notNull().unique(),
//   role: text('role', { enum: ['ADMIN', 'USER', 'GUEST'] })
//     .notNull()
//     .default('USER'),
//   createdAt: text('created_at')
//     .notNull()
//     .$defaultFn(() => new Date().toISOString()),
//   updatedAt: text('updated_at')
//     .notNull()
//     .$defaultFn(() => new Date().toISOString())
// })

// // 사용자 타입 정의
// export type User = typeof users.$inferSelect
// export type NewUser = typeof users.$inferInsert
// export type UpdateUser = Partial<Omit<NewUser, 'id' | 'createdAt'>>
