import React from 'react'
import { useState, useEffect } from 'react';
import { Quiz } from '../PlayPage';
import api from '../api/answers'
import { AxiosResponse, AxiosError} from 'axios';
import { useNavigate } from 'react-router-dom';
import userApi from '../api/users'
import { User } from '../Context/AuthContext';


interface Props {
    setStartBtnClick: React.Dispatch<React.SetStateAction<boolean>>
    gameQuizzes: Quiz[]
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
    const[isGameFinished, setIsGameFinished] = useState<boolean>(false)
    let [timer, setTimer] = useState<number>(7)
    const [selectedAnswer, setSelectedAnswer] = useState<Answer | undefined>(undefined)
    const [gamePoints, setGamePoints] = useState<number>(0)

    const timeToAnswer:number = 7000;

    const timerInterval = setInterval(() => {
        if(timer-1 > 0) setTimer(timer-1)
        else setTimer(7)
    }, 1000)


    const pointsLogic = () => {
        if(selectedAnswer?.isCorrect == true) setGamePoints(gamePoints+1)
        setSelectedAnswer(undefined)
    }

    // useEffect(() => {
    //     pointsLogic()
    // }, [selectedAnswer])
    
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
        pointsLogic()
      }, [currentIndex, answers]);


      useEffect(() => {
        timerInterval
        let x:number=0;
        const interval = setInterval(() => {
            x++;
            setCurrentIndex((prevIndex) => 
                prevIndex + 1 === gameQuizzes.length ? 0 : prevIndex + 1
            );
            if(x >=3) {
                setTimeout(() => {
                    clearInterval(interval)
                    setIsGameFinished(true);
                }, 200);
            }
        }, timeToAnswer);
    
      }, []);





    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setAnswerInput(e.target.value)
        if(currentAnswers[0].answer === answerInput) setGamePoints(gamePoints+1)
    }

    const handleAnswerClick = (e:React.MouseEvent<HTMLElement>) => {
        const key = e.currentTarget.getAttribute('data-id')
        if(!key) return;
        const answerId = parseInt(key)

        const answer = currentAnswers.find((a) => {
            return a.id == answerId
            
        })        
        setSelectedAnswer(answer)
    }


    useEffect(() => {
        const userString = localStorage.getItem('user')
        let user:User
        const updateUser = async () => {
            if(userString) {
                user = JSON.parse(userString)
            } else {throw Error("User isn't logged")}
            const findId = user.id
            let updatedUser = {...user, points: user.points+gamePoints, quizzesDone: user.quizzesDone+gameQuizzes.length}
            // const {id, ...newUser} = updatedUser;
            console.log(updateUser);
            console.log(findId);
            
            
            try{
                const res:AxiosResponse = await userApi.put(`/${findId}`, 
                    updatedUser,
                    { headers: { 'Content-Type': 'application/json' }} 
            )
            } catch(err){
                console.error("Failed to fetch user data", err);
                const error = err as AxiosError
                console.log(error.response?.data);   
            }
        }

        updateUser()

    }, [isGameFinished])

    

  return (
    <> 
    {!isGameFinished ? (
        <>
            <div className='timer'>
                <p>{timer}</p>
            </div>
            <div className='questionDiv'>
                <p>{gameQuizzes[currentIndex].question}</p>
            </div>

            <div className='answersDiv'>
                {gameQuizzes[currentIndex].type !== 'input' ? (
                    <span>
                        {currentAnswers.map((a) => (
                            <button type='button' className='answer' data-id={a.id} key={a.id} onClick={handleAnswerClick}>{a.answer}</button>
                        ))} 
                    </span>
                ) : (
                    <input value={answerInput} onChange={handleInputChange}></input>
                )
                }
            </div>
        </>
    ) : (
        <>
            <p className='pointsView'>Your points:{<span>{gamePoints}</span>}</p>
            <button className='backBtn' onClick={() => setStartBtnClick(false)}>Go back</button>
        </>
    )}
    </>      
  )
}

export default PlayMenu