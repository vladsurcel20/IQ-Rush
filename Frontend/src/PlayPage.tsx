import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PlayPage = () => {
    const navigate = useNavigate();

    const [quizzesNr, setQuizzesNr] = useState<number | null>(null)

    const handleNrBtnClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setQuizzesNr(parseInt(e.currentTarget.textContent || '0', 10))
    }

  return (
    <div className='playPage'>

        <span>
            <img src='/left-arrow64.png' onClick={() => navigate('/quizzes')}></img>
            <p className="intro">Select the number of questions</p>
        </span>


        <div className='numberBtnsDiv'>
            <button type='button' onClick={handleNrBtnClick}>3</button>
            <button type='button' onClick={handleNrBtnClick}>5</button>
            <button type='button' onClick={handleNrBtnClick}>7</button>
        </div>

        <button className='startBtn'>Start</button>
        <p>Nr. of quizzes:{quizzesNr}</p>
    </div>
  )
}

export default PlayPage