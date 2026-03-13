import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout'
import { PlannerPage } from '@/pages/PlannerPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { SchedulesProvider } from '@/contexts/ScheduleContext'
import { LoginScreen } from '@/components/auth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('field-rep-authenticated') === 'true'
  })

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <SchedulesProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<PlannerPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SchedulesProvider>
  )
}

export default App
