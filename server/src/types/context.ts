import { SleepRecordService } from '../services/sleepRecordService'
import { UserService } from '../services/userService'

export type AppContext = {
  sleepRecordService: SleepRecordService
  userService: UserService
}
