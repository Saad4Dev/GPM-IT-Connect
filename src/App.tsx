import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import { AppShell } from './components/AppShell'
import { useAuth } from './context/AuthContext'
import { AiAssistantPage } from './pages/AiAssistantPage'
import { AttendancePage } from './pages/AttendancePage'
import { DashboardPage } from './pages/DashboardPage'
import { DepartmentHubPage } from './pages/DepartmentHubPage'
import { LoginPage } from './pages/LoginPage'
import { NoticesPage } from './pages/NoticesPage'
import { OpportunitiesPage } from './pages/OpportunitiesPage'
import { ProfilePage } from './pages/ProfilePage'
import { ResourcesPage } from './pages/ResourcesPage'
import { TimetablePage } from './pages/TimetablePage'

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="portal-card w-full max-w-3xl p-6 md:p-8">
        <div className="h-4 w-44 rounded-full portal-loading-skeleton" />
        <div className="mt-5 h-10 w-2/3 rounded-2xl portal-loading-skeleton" />
        <div className="mt-3 h-5 w-1/2 rounded-full portal-loading-skeleton" />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 rounded-3xl portal-loading-skeleton" />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProtectedLayout() {
  const { token, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

function PublicOnlyRoute() {
  const { token, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return token ? <Navigate to="/dashboard" replace /> : <LoginPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/hub" element={<DepartmentHubPage />} />
        <Route path="/ai-assistant" element={<AiAssistantPage />} />
      </Route>
    </Routes>
  )
}
