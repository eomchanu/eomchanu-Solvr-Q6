import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createUserRoutes } from './userRoutes'
import { createSleepRecordRoutes } from './sleepRecordRoutes'
import { createSleepStatsRoutes } from './sleepStatsRoute'
import { createAdviceRoutes } from './adviceRoutes'

// 모든 라우트 등록
export const createRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  fastify.register(createSleepRecordRoutes(context), { prefix: '/api/records' })
  fastify.register(createUserRoutes(context), { prefix: '/api/users' })
  fastify.register(createSleepStatsRoutes(context), { prefix: '/api/sleep-stats' })
  fastify.register(createAdviceRoutes(context), { prefix: '/api/advice' })
}
