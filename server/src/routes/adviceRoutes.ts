import { FastifyInstance } from "fastify";
import { AppContext } from "../types/context";
import { createAdviceController } from "../controllers/adviceController";

export function createAdviceRoutes(context: AppContext) {
  const controller = createAdviceController({ adviceService: context.adviceService });

  return async (fastify: FastifyInstance) => {
    fastify.post("/", controller.getAdvice);
  };
}