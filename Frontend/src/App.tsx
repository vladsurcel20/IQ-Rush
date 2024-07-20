import {Routes, Route} from "react-router-dom"
import LandingPage from "./LandingPage"
import Header from "./Header"
import QuizPage from './QuizPage'
import PlayPage from "./PlayPage"




function App() {


  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quizzes" element={<QuizPage />} />
        <Route path="/quizzes/play" element={<PlayPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  )
}

export default App
