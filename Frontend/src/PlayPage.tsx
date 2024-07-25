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

    const [quizzesNr, setQuizzesNr] = useState<number>(0)
    const [gameQuizzes, setGameQuizzes] = useState<Quiz[]>([])
    const [startBtnClick, setStartBtnClick] = useState<boolean>(false);


  return (
    <div className='playPage'>
        {!startBtnClick ? 
            (<StartMenu setStartBtnClick={setStartBtnClick} setGameQuizzes={setGameQuizzes}/>) 
            : (<PlayMenu setStartBtnClick={setStartBtnClick} gameQuizzes={gameQuizzes}/>)
        }
    </div>
  )
}

export default PlayPage