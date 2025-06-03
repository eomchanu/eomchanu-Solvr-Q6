import { FastifyRequest, FastifyReply } from 'fastify';
import { SleepStatsService } from '../services/sleepStatsService';

type SleepStatsControllerDeps = { sleepStatsService: SleepStatsService };

export const createSleepStatsController = ({ sleepStatsService }: SleepStatsControllerDeps) => {
  // 최근 30일 일별 수면시간
  const recentStats = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    const userId = Number(request.params.userId);
    if (isNaN(userId)) return reply.code(400).send({ success: false, error: "잘못된 사용자" });
    const data = await sleepStatsService.getRecentSleepStats(userId);
    return reply.send({ success: true, data });
  };

  // 요일별 평균 수면시간
  const weekdayAvg = async (
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) => {
    const userId = Number(request.params.userId);
    if (isNaN(userId)) return reply.code(400).send({ success: false, error: "잘못된 사용자" });
    const data = await sleepStatsService.getWeekdayAvgSleepStats(userId);
    return reply.send({ success: true, data });
  };

  return { recentStats, weekdayAvg };
};