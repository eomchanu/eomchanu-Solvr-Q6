import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './routes/HomePage'
import SleepRecordListPage from './routes/SleepRecordListPage'
import NotFoundPage from './routes/NotFoundPage'
import NicknamePage from './routes/NicknamePage'
import NicknameGate from './components/NicknameGate'

function App() {
  return (
    <Routes>
      {/* 닉네임 입력은 게이트 바깥에 둔다 */}
      <Route path="/nickname" element={<NicknamePage />} />
      {/* 나머지 전체를 NicknameGate로 감싼다 */}
      <Route
        path="/*"
        element={
          <NicknameGate>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="records" element={<SleepRecordListPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </NicknameGate>
        }
      />
    </Routes>
  )
}

export default App