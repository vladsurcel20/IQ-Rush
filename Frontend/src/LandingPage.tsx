import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './Context/AuthContext'
import { useNavigate } from 'react-router-dom'



const LandingPage = () => {

  const {isLogged} = useAuth()
  const [attemptClick, setAttempClick] = useState<boolean>(false)
  const navigate = useNavigate()

  const verifyClick = () => {
    if(!isLogged) setAttempClick(true)
    else navigate('/quizzes')
  }

  return(
    
    <div className='mainPage'>
      <p className='intro'>Challenge Your Mind, Compete with Friends!</p>
      <p className='below-intro'> Beat the clock, and see who reigns supreme!</p>

      {isLogged ? (
        <button className='playBtn' type='button' onClick={verifyClick}>Ready, Set, Quiz!</button>
      ) : !attemptClick ? ( 
        <button className='playBtn' type='button' onClick={verifyClick}>Ready, Set, Quiz!</button>
      ) : (
        <>
          <button className='playBtn' type='button' onClick={verifyClick}>Ready, Set, Quiz!</button>
          <p className='alertP'>You must log in first</p>
        </>
      )}
    </div>
  )
}

export default LandingPage