import { FastifyRequest, FastifyReply } from "fastify";
import { AdviceService } from "../services/adviceService";

type AdviceControllerDeps = { adviceService: AdviceService };

export function createAdviceController({ adviceService }: AdviceControllerDeps) {
  // POST /api/advice { userId }
  const getAdvice = async (
    req: FastifyRequest<{ Body: { userId: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { userId } = req.body;
      const advice = await adviceService.getAdvice(userId);
      reply.code(200).send({ success: true, data: { advice } });
    } catch (error) {
      reply.code(500).send({ success: false, error: "AI 조언 생성 실패" });
    }
  };
  return { getAdvice };
}