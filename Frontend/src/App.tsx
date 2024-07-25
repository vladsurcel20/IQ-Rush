import {Routes, Route} from "react-router-dom"
import { createContext } from "react"
import { useState } from "react"
import LandingPage from "./LandingPage"
import Header from "./Header"
import QuizPage from './QuizPage'
import PlayPage from "./PlayPage"
import { AuthContext } from "./Context/AuthContext"
import { AuthProvider } from "./Context/AuthContext"


function App() {

  return (
    <>
    <AuthProvider > 
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quizzes" element={<QuizPage />} />
        <Route path="/quizzes/play" element={<PlayPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AuthProvider>
    </>
  )
}

export default App
