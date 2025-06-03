import { FastifyRequest, FastifyReply } from 'fastify'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import {
  CreateUserDto,
  SleepRecord,
  CreateSleepRecordDto,
  UpdateSleepRecordDto,
} from '../types'
import { SleepRecordService } from '../services/sleepRecordService'

type SleepRecordControllerDeps = {
  deepSleepService: SleepRecordService
}

export const createDeepSleepController = ({ deepSleepService }: SleepRecordControllerDeps) => {
  // 특정 사용자의 수면 기록 리스트 조회 (userId 기준)
  const getSleepRecordsByUserId = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const userId = parseInt(request.params.userId, 10)
      if (isNaN(userId)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 사용자 ID입니다.'))
      }
      const records = await deepSleepService.getSleepRecordsByUserId(userId)
      return reply.code(200).send(createSuccessResponse(records))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('수면 기록 조회에 실패했습니다.'))
    }
  }

  // 수면 기록 생성
  const createSleepRecord = async (
    request: FastifyRequest<{ Body: CreateSleepRecordDto }>,
    reply: FastifyReply
  ) => {
    try {
      const recordData = request.body
      const newRecord = await deepSleepService.createSleepRecord(recordData)
      return reply.code(201).send(createSuccessResponse(newRecord, '수면 기록이 추가되었습니다.'))
    } catch (error: any) {
      request.log.error(error)
      if (error.message && error.message.includes('기록이 존재')) {
        return reply.code(409).send(createErrorResponse(error.message))
      }
      return reply.code(500).send(createErrorResponse('수면 기록 추가에 실패했습니다.'))
    }
  }

  // 수면 기록 수정
  const updateSleepRecord = async (
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateSleepRecordDto }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)
      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 기록 ID입니다.'))
      }
      const record = await deepSleepService.getSleepRecordById(id)
      if (!record) {
        return reply.code(404).send(createErrorResponse('수면 기록을 찾을 수 없습니다.'))
      }
      // (옵션) 날짜 중복 검사 등 추가 가능
      const updated = await deepSleepService.updateSleepRecord(id, request.body)
      return reply.code(200).send(createSuccessResponse(updated, '수면 기록이 수정되었습니다.'))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('수면 기록 수정에 실패했습니다.'))
    }
  }

  // 수면 기록 삭제
  const deleteSleepRecord = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)
      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 기록 ID입니다.'))
      }
      const record = await deepSleepService.getSleepRecordById(id)
      if (!record) {
        return reply.code(404).send(createErrorResponse('수면 기록을 찾을 수 없습니다.'))
      }
      const deleted = await deepSleepService.deleteSleepRecord(id)
      if (!deleted) {
        return reply.code(500).send(createErrorResponse('수면 기록 삭제에 실패했습니다.'))
      }
      return reply.code(200).send(createSuccessResponse(null, '수면 기록이 삭제되었습니다.'))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('수면 기록 삭제에 실패했습니다.'))
    }
  }

  return {
    getSleepRecordsByUserId,
    createSleepRecord,
    updateSleepRecord,
    deleteSleepRecord,
  }
}

export type DeepSleepController = ReturnType<typeof createDeepSleepController>