import React from 'react'
import { useState, useEffect } from 'react';
import { Quiz } from '../PlayPage';
import api from '../api/answers'
import { AxiosResponse, AxiosError} from 'axios';
import { useNavigate } from 'react-router-dom';


interface Props {
    setStartBtnClick: React.Dispatch<React.SetStateAction<boolean>>
    gameQuizzes: Quiz[];
}

interface Answer { 
    id:number; 
    quizId: number;
    answer: string;
    isCorrect: boolean;
}

const PlayMenu = ({setStartBtnClick, gameQuizzes}: Props) => {

    const [answers, setAnswers] = useState<Answer[]>([]);
    let [currentIndex, setCurrentIndex] = useState<number>(0)
    let [currentAnswers, setCurrentAnswers] = useState<Answer[]>([])
    let [answerInput, setAnswerInput] = useState<string>('')
    const[isGameFinished, setIsGameFinished] = useState<boolean>(true)
    let [timer, setTimer] = useState<number>(5)

    const quizzesNr:number = 3;
    const timeToAnswer:number = 5000;

    const timerInterval = setInterval(() => {
        if(timer > 0) setTimer(timer-1)
        else clearInterval(timerInterval)
    }, 1000)

    
    useEffect(() => {
        
        gameQuizzes.forEach( async q => {
            try{
                const res:AxiosResponse = await api.get(`/getByQuiz/${q.id}`)
                setAnswers(prevAnswers => [...prevAnswers, ...res.data]);
            } catch(err) {
                const error = err as AxiosError;
                if(error.response?.data){
                  alert(error.response.data);
                } else {
                  console.log(`Error: ${error.message}`);                  
                }
            } 
        });  
    },[])

    useEffect(() => {
        if (gameQuizzes[currentIndex]) {
            setCurrentAnswers(answers.filter((a) => gameQuizzes[currentIndex].id == a.quizId));
        }
      }, [currentIndex, answers]);


      useEffect(() => {
        let x:number=0;
        const interval = setInterval(() => {
            x++;
            setCurrentIndex((prevIndex) => 
                prevIndex + 1 === gameQuizzes.length ? 0 : prevIndex + 1
            );
            if(x >=3) {
                clearInterval(interval)
                setIsGameFinished(true);
            }
        }, timeToAnswer);
    
      }, []);



  useEffect(() => {
    setTimer(5); 
    timerInterval;
    // return () => clearInterval(timerInterval);
  }, [currentIndex]);



    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setAnswerInput(e.target.value)
    }

    

  return (
    <>
        <div>{timer}</div>
        <div className='questionDiv'>
            <p>{gameQuizzes[currentIndex].question}</p>
        </div>

        <div className='answersDiv'>
            {gameQuizzes[currentIndex].type !== 'input' ? (
                currentAnswers.map((a) => (
                    <div className='answerDiv' key={a.id}>
                        <p>{a.answer}</p>
                    </div>
                )) 
            ) : (
                <input value={answerInput} onChange={handleInputChange}></input>
            )
            }
        </div>
    </>
  )
}

export default PlayMenu