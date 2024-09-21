import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Quiz } from '../PlayPage'
import Header from '../Header'

interface Props { 
    setStartBtnClick: React.Dispatch<React.SetStateAction<boolean>>
    setGameQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>
}

const StartMenu = ({setStartBtnClick, setGameQuizzes}: Props) => {

    const navigate = useNavigate();
    const [quizzesNr, setQuizzesNr] = useState<number>(0)

    const handleNrBtnClick = (e:React.MouseEvent<HTMLButtonElement>) => {
        setQuizzesNr(parseInt(e.currentTarget.textContent || '0', 0))
    }

    const quizzes: Quiz[] = JSON.parse(sessionStorage.getItem('quizzes') || '[]');

    const handleStartClick = () => {
        if(quizzesNr > 0){
            const shuffledQuizzes: Quiz[] = quizzes.sort(() => 0.5 - Math.random())
            setStartBtnClick(true);
            setGameQuizzes(shuffledQuizzes.slice(0, quizzesNr));
        }
    }

  return (
    <>
        <Header />
        <span>
                <img className="left-arrow"src='/icons8-left-arrow-colored.png' onClick={() => navigate('/quizzes')}></img>
                <p className="intro">Select the number of questions</p>
            </span>


            <div className='numberBtnsDiv'>
                <button type='button' onClick={handleNrBtnClick}>3</button>
                <button type='button' onClick={handleNrBtnClick}>5</button>
                <button type='button' onClick={handleNrBtnClick}>7</button>
            </div>

            <button className='startBtn' onClick={handleStartClick}>Start</button>
            <p>Nr. of quizzes:{quizzesNr}</p>
    </>
  )
}

export default StartMenu