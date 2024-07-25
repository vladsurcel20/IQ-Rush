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
      {isLogged ? (
        <Link to='/quizzes' className='playBtn'><button className='playBtnA' type='button'>PLAY</button></Link>
      ) : !attemptClick ? ( 
        <button className='playBtn' type='button' onClick={verifyClick}>PLAY</button>
      ) : (
        <>
          <button className='playBtn' type='button' onClick={verifyClick}>PLAY</button>
          <p className='alertP'>You must log in first</p>
        </>
      )}
    </div>
  )
}

export default LandingPage