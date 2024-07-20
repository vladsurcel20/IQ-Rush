import React from 'react'
import { Link } from 'react-router-dom'


const LandingPage = () => {
  return(
    <div className='mainPage'>
      <Link to='/quizzes' className='playBtn'><button className='playBtn' type='button'>PLAY</button></Link>
    </div>
  )
}

export default LandingPage