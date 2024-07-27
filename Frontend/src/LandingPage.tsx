import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './Context/AuthContext'



const LandingPage = () => {

  const {isLogged} = useAuth()
  const [attemptClick, setAttempClick] = useState<boolean>(false)

  const verifyClick = () => {
    if(!isLogged) setAttempClick(true)
  }

  return(
    
    <div className='mainPage'>
      <p className='intro'>Challenge Your Mind, Compete with Friends!</p>
      <p className='below-intro'> Beat the clock, and see who reigns supreme!</p>

      {isLogged ? (
        <Link to='/quizzes' className='playBtn'><button className='playBtnA' type='button'>Ready, Set, Quiz!</button></Link>
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