import { FastifyInstance } from "fastify";
import { AppContext } from "../types/context";
import { createSleepStatsController } from "../controllers/sleepStatsController";

export const createSleepStatsRoutes = (context: AppContext) => async (fastify: FastifyInstance) => {
  const ctrl = createSleepStatsController({
    sleepStatsService: context.sleepStatsService
  });
  fastify.get('/recent/:userId', ctrl.recentStats);
  fastify.get('/weekday-avg/:userId', ctrl.weekdayAvg);
};