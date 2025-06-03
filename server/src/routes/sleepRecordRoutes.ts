import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createSleepRecordController } from '../controllers/sleepRecordController'

export function createSleepRecordRoutes(context: AppContext) {
  const controller = createSleepRecordController({
    sleepRecordService: context.sleepRecordService,
  })

  return async (fastify: FastifyInstance) => {
    fastify.get('/list/:userId', controller.getSleepRecordList)
    fastify.get('/:userId/:sleepDate', controller.getSleepRecord)
    fastify.post('/', controller.createSleepRecord)
    fastify.put('/:userId/:sleepDate', controller.updateSleepRecord)
    fastify.delete('/:userId/:sleepDate', controller.deleteSleepRecord)
  }
}