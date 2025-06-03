import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { Database } from "../types/database";
import { User, NewUser } from '../types'

type UserServiceDeps = { db: Database };

export const createUserService = ({ db }: UserServiceDeps) => {
  // 전체 사용자 조회
  const getAllUsers = async (): Promise<User[]> => {
    return db.select().from(users);
  };

  // 사용자 ID로 조회
  const getUserById = async (id: number): Promise<User | undefined> => {
    const res = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return res[0];
  };

  // 닉네임으로 조회 (닉네임 중복 체크용)
  const getUserByNickname = async (nickname: string): Promise<User | undefined> => {
    const res = await db.select().from(users).where(eq(users.nickname, nickname)).limit(1);
    return res[0];
  };

  // 사용자 생성 (닉네임 중복 불가)
  const createUser = async (dto: NewUser): Promise<User> => {
    // 닉네임 중복 확인
    const exists = await getUserByNickname(dto.nickname);
    if (exists) {
      throw new Error("이미 사용 중인 닉네임입니다.");
    }
    const result = await db.insert(users).values(dto).returning();
    return result[0];
  };

  // 사용자 삭제
  const deleteUser = async (id: number): Promise<boolean> => {
    const result = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return result.length > 0;
  };

  return {
    getAllUsers,
    getUserById,
    getUserByNickname,
    createUser,
    deleteUser,
  };
};

export type UserService = ReturnType<typeof createUserService>;