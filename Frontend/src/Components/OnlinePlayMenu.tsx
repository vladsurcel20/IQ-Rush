import React from 'react'
import { useState, useEffect} from 'react';
import { Quiz } from '../PlayPage';
import quizHubService from '../Services/quizHubService';
import { Room } from '../Services/quizHubService';
import api from '../api/answers'
import { AxiosResponse, AxiosError} from 'axios';
import userApi from '../api/users'
import { User } from '../Context/AuthContext';

interface Answer { 
    id:number; 
    quizId: number;
    answer: string;
    isCorrect: boolean;
}

const OnlinePlayMenu: React.FC<{ room: Room }> = ({ room }) => {

    const [answers, setAnswers] = useState<Answer[]>([]);
    let [currentIndex, setCurrentIndex] = useState<number>(0)
    let [currentAnswers, setCurrentAnswers] = useState<Answer[]>([])
    let [answerInput, setAnswerInput] = useState<string>('')
    const[isGameFinished, setIsGameFinished] = useState<boolean>(false)
    let [timer, setTimer] = useState<number>(7)
    const [selectedAnswer, setSelectedAnswer] = useState<Answer | undefined>(undefined)
    const [gamePoints, setGamePoints] = useState<number>(0)
    const [gameQuizzes, setGameQuizzes] = useState<Quiz[]>(room.quizzes);

    const pointsLogic = () => {
        if(selectedAnswer?.isCorrect == true) setGamePoints(gamePoints+1)
        setSelectedAnswer(undefined)
    }

    useEffect(() => {
        quizHubService.start();

        quizHubService.onGameStarted = (room: Room) => {
            setGameQuizzes(room.quizzes);
            setAnswers(Object.values(room.answers).flat());
            setIsGameFinished(false);
        };

        return () => {
            quizHubService.connection.stop();
        };
    }, [room.name]);


    // useEffect(() => {
    //     const fetchAnswers = async () => {
    //         const answersSet = new Set<Answer>();

    //         for (const q of gameQuizzes) {
    //             try {
    //                 const res: AxiosResponse<Answer[]> = await api.get(`/getByQuiz/${q.id}`);
    //                 res.data.forEach(answer => answersSet.add(answer));
    //             } catch (err) {
    //                 const error = err as AxiosError;
    //                 if (error.response?.data) {
    //                     alert(error.response.data);
    //                 } else {
    //                     console.log(`Error: ${error.message}`);
    //                 }
    //             }
    //         }
    //         setAnswers(Array.from(answersSet));
    //     }

    //     fetchAnswers()
    // },[])


    useEffect(() => {
        if (gameQuizzes[currentIndex]) {
            setCurrentAnswers(answers.filter((a) => gameQuizzes[currentIndex].id == a.quizId));
        }
        pointsLogic()
      }, [currentIndex, answers]);

      useEffect(() => {
        const timerInterval = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer <= 1) {
              setCurrentIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) === gameQuizzes.length ? 0 : prevIndex + 1;
                if (newIndex === 0) {
                  clearInterval(timerInterval);
                  setIsGameFinished(true);
                }
                return newIndex;
              });
              return 7;
            }
            return prevTimer - 1;
          });
        }, 1000);
    
        return () => {
          clearInterval(timerInterval);
        };
      }, [gameQuizzes]);



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
        if(isGameFinished){
            const userString = localStorage.getItem('user')
            let user:User
            const updateUser = async () => {
                if(userString) {
                    user = JSON.parse(userString)
                } else {throw Error("User isn't logged")}
                const findId = user.id
                let updatedUser = {...user, points: user.points+gamePoints, quizzesDone: user.quizzesDone+gameQuizzes.length}
                            
                try{
                    const res:AxiosResponse = await userApi.put(`/${findId}`, 
                        updatedUser,
                        { headers: { 'Content-Type': 'application/json' }}    
                    )
                    localStorage.setItem('user', JSON.stringify(updatedUser))
                } catch(err){
                    console.error("Failed to fetch user data", err);
                    const error = err as AxiosError
                    console.log(error.response?.data);   
                }
            }
            
            updateUser()
        }

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
            <button className='backBtn' onClick={() => setIsGameFinished(true)}>Go back</button>
        </>
    )}
    </>      
  )
}

export default OnlinePlayMenu