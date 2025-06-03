import { FastifyInstance } from 'fastify'
import { AppContext } from '../types/context'
import { createUserController } from '../controllers/userController'

// 사용자 관련 라우트 등록
export const createUserRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  const userController = createUserController({ userService: context.userService })
    // 전체 사용자 조회
    fastify.get('/', userController.getAllUsers)
    // id로 단일 조회
    fastify.get('/:id', userController.getUserById)
    // 닉네임으로 단일 조회
    fastify.get('/by-nickname/:nickname', userController.getUserByNickname)
    // 사용자 등록
    fastify.post('/', userController.createUser)
    // 사용자 삭제
    fastify.delete('/:id', userController.deleteUser)
}
