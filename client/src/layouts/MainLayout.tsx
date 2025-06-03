import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useUser } from '../UserContext'

const MainLayout = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/nickname')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-xl font-bold"
                style={{ color: '#FF8800' }} // 오렌지색 (tailwind primary-600에 준하는 색상)
              >
                당근 딥슬립
              </Link>
            </div>
            <nav className="flex space-x-4">
              {user && (
                <button
                  className="text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      <footer className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} 당근 딥슬립. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout