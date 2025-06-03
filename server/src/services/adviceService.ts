import { GoogleGenAI } from '@google/genai';
import type { SleepStatsService } from './sleepStatsService';

type AdviceServiceDeps = {
  apiKey: string,
  sleepStatsService: SleepStatsService
};

export function createAdviceService({ apiKey, sleepStatsService }: AdviceServiceDeps) {
  const ai = new GoogleGenAI({ apiKey });

  async function getAdvice(userId: number) {
    // 통계, 최근 기록 등 수집
    const recentStats = await sleepStatsService.getRecentSleepStats(userId);
    const weekdayStats = await sleepStatsService.getWeekdayAvgSleepStats(userId);

    // 프롬프트 조립
    const prompt = `
      [최근 30일 수면기록]
      ${JSON.stringify(recentStats)}
      [요일별 평균 수면시간]
      ${JSON.stringify(weekdayStats)}
      위 기록을 분석해서 이 사용자의 수면습관 개선 포인트와 구체적 조언을 알려줘.
    `;

    // Gemini API 호출
    const config = { responseMimeType: 'text/plain' };
    const model = 'gemma-3n-e4b-it';

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ]
    });

    let advice = '';
    for await (const chunk of response) {
      advice += chunk.text;
    }
    return advice.trim();
  }

  return { getAdvice };
}

export type AdviceService = ReturnType<typeof createAdviceService>;