import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StartMenu from './Components/StartMenu';
import PlayMenu from './Components/PlayMenu';

export interface Quiz {
    id: number;
    question: string; 
    category: string;
    type: string;
    }


const PlayPage = () => {
    const navigate = useNavigate();

    const [quizzesNr, setQuizzesNr] = useState<number | null>(null)
    const [gameQuizzes, setGameQuizzes] = useState<Quiz[]>([])
    const [startBtnClick, setStartBtnClick] = useState<boolean>(false);


  return (
    <div className='playPage'>
{/* 
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
        <p>Nr. of quizzes:{quizzesNr}</p> */}
        {!startBtnClick ? 
            (<StartMenu setStartBtnClick={setStartBtnClick} setGameQuizzes={setGameQuizzes}/>) 
            : (<PlayMenu setStartBtnClick={setStartBtnClick} gameQuizzes={gameQuizzes}/>)
        }
    </div>
  )
}

export default PlayPage