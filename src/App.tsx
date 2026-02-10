import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from './auth/ProtectedRoute'
import ChatPage from './pages/ChatPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
