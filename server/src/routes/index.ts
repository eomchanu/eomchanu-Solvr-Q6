import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createUserRoutes } from './userRoutes'
import { createSleepRecordRoutes } from './sleepRecordRoutes'

// 모든 라우트 등록
export const createRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  fastify.register(createSleepRecordRoutes(context), { prefix: '/api/records' })
  fastify.register(createUserRoutes(context), { prefix: '/api/users' })
}
