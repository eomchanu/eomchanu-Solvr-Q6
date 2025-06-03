import { SleepRecordService } from '../services/sleepRecordService'
import { UserService } from '../services/userService'
import { SleepStatsService } from '../services/sleepStatsService'
import { AdviceService } from '../services/adviceService'

export type AppContext = {
  sleepRecordService: SleepRecordService
  userService: UserService
  sleepStatsService: SleepStatsService
  adviceService: AdviceService
}
