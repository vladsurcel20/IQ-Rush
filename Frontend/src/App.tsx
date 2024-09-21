import {Routes, Route} from "react-router-dom"
import LandingPage from "./LandingPage"
import Header from "./Header"
import QuizPage from './QuizPage'
import PlayPage from "./PlayPage"
import Dashboard from "./Dashboard"
import { AuthProvider } from "./Context/AuthContext"
import ProtectedRoute from "./Components/ProtectedRoute"
import AccessPage from "./AccessPage"


function App() {

  return (
    <>
    <AuthProvider > 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/access" element={<AccessPage/>} /> 
        <Route path="/quizzes" element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>} />
        <Route path="/quizzes/play" element={
          <ProtectedRoute>
          <PlayPage />
        </ProtectedRoute>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AuthProvider>
    </>
  )
}

export default App
