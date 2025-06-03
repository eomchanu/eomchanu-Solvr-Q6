import { FastifyRequest, FastifyReply } from 'fastify'
import { createSuccessResponse, createErrorResponse } from '../utils/response'
import { NewUser } from '../types'
import { UserService } from '../services/userService'

type UserControllerDeps = {
  userService: UserService
}

export const createUserController = ({ userService }: UserControllerDeps) => {
  // 전체 사용자 조회
  const getAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await userService.getAllUsers()
      return reply.code(200).send(createSuccessResponse(users))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 목록을 불러오는데 실패했습니다.'))
    }
  }

  // id로 단일 조회
  const getUserById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)
      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 사용자 ID입니다.'))
      }
      const user = await userService.getUserById(id)
      if (!user) {
        return reply.code(404).send(createErrorResponse('사용자를 찾을 수 없습니다.'))
      }
      return reply.code(200).send(createSuccessResponse(user))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 정보를 불러오는데 실패했습니다.'))
    }
  }

  // 닉네임으로 단일 조회 (선택, 필요 시 사용)
  const getUserByNickname = async (
    request: FastifyRequest<{ Params: { nickname: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { nickname } = request.params
      if (!nickname) {
        return reply.code(400).send(createErrorResponse('닉네임을 입력해주세요.'))
      }
      const user = await userService.getUserByNickname(nickname)
      if (!user) {
        return reply.code(404).send(createErrorResponse('사용자를 찾을 수 없습니다.'))
      }
      return reply.code(200).send(createSuccessResponse(user))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 정보를 불러오는데 실패했습니다.'))
    }
  }

  // 사용자 등록
  const createUser = async (
    request: FastifyRequest<{ Body: NewUser }>,
    reply: FastifyReply
  ) => {
    try {
      const userData = request.body
      const newUser = await userService.createUser(userData)
      return reply.code(201).send(createSuccessResponse(newUser, '사용자가 성공적으로 생성되었습니다.'))
    } catch (error: any) {
      request.log.error(error)
      if (error?.message?.includes('닉네임')) {
        return reply.code(409).send(createErrorResponse('이미 사용 중인 닉네임입니다.'))
      }
      return reply.code(500).send(createErrorResponse('사용자 생성에 실패했습니다.'))
    }
  }

  // 사용자 삭제
  const deleteUser = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const id = parseInt(request.params.id, 10)
      if (isNaN(id)) {
        return reply.code(400).send(createErrorResponse('유효하지 않은 사용자 ID입니다.'))
      }
      const deleted = await userService.deleteUser(id)
      if (!deleted) {
        return reply.code(404).send(createErrorResponse('사용자를 찾을 수 없습니다.'))
      }
      return reply.code(200).send(createSuccessResponse(null, '사용자가 성공적으로 삭제되었습니다.'))
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send(createErrorResponse('사용자 삭제에 실패했습니다.'))
    }
  }

  return {
    getAllUsers,
    getUserById,
    getUserByNickname,
    createUser,
    deleteUser,
  }
}

export type UserController = ReturnType<typeof createUserController>