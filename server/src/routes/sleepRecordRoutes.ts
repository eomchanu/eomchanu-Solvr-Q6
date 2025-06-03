import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createSleepRecordController } from '../controllers/sleepRecordController'

export const sleepRecordRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  const controller = createSleepRecordController({ sleepRecordService: context.sleepRecordService })
  fastify.get('/list/:userId', controller.getSleepRecordList)
  fastify.get('/:userId/:sleepDate', controller.getSleepRecord)
  fastify.post('/', controller.createSleepRecord)
  fastify.put('/:userId/:sleepDate', controller.updateSleepRecord)
  fastify.delete('/:userId/:sleepDate', controller.deleteSleepRecord)
}
