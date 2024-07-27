import { useEffect, useState} from "react"
import api from './api/users'
import { AxiosResponse } from "axios"
import { User } from "./Context/AuthContext"
import quizzes from "./api/quizzes"

interface usersData{
    id: number,
    username: string,
    points: number,
    quizzesDone: number,
    accuracy: number
}

const Dashboard = () => {
    const [users,setUsers] = useState<usersData[]>([])
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const sortUsers = (criteria:string) =>{
        if(criteria == 'accuracy'){
            const sortedUsers = [...users].sort((a,b) => {
                const aValue:number = calculateAccuracy(a.quizzesDone, a.points)
                const bValue:number = calculateAccuracy(b.quizzesDone, b.points)
                return bValue - aValue;
            })
            setUsers(sortedUsers)
        } else if(criteria == 'points'){
            const sortedUsers = [...users].sort((a,b) => {
                return b.points - a.points;
            })
            setUsers(sortedUsers)
        } else if(criteria == 'quizzes'){
            const sortedUsers = [...users].sort((a,b) => {
                return b.quizzesDone - a.quizzesDone;
            })
            setUsers(sortedUsers)
        } else if(criteria == 'username'){
            const sortedUsers = [...users].sort((a,b) => {
                return a.username.localeCompare(b.username);
            })
            setUsers(sortedUsers)
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const res:AxiosResponse =  await api.get('/')
                const usersData: usersData[] = res.data.map((u:User) => ({
                    id: u.id,
                    username: u.username,
                    points: u.points,
                    quizzesDone: u.quizzesDone,
                    accuracy: calculateAccuracy(u.quizzesDone, u.points)
                }))

                const sortedUsers = usersData.sort((a, b) => b.accuracy - a.accuracy);
                setUsers(sortedUsers)
            } catch(err){
                console.error('Failed to fetch users', err)
            }  
        }

        fetchUsers()
    }, [])

    useEffect(() => {
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
            try {
                const parsedUser: User = JSON.parse(currentUser);
                setCurrentUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user data from localStorage", error);
            }
        }
    }, []);


    const calculateAccuracy = (quizzesDone: number = 0, points: number = 0):number => {
        if (quizzesDone == 0) return 0;
        return parseFloat(((points / quizzesDone) * 100).toFixed(2));
    };


  return (
    <div className="dashboardPage">
        <div className="userInfo">
            <p><span>Username:</span> {currentUser?.username}</p>
            <p><span>Points:</span> {currentUser?.points}</p>
            <p><span>Total Quizzes:</span> {currentUser?.quizzesDone}</p>
            <p><span>Accuracy:</span> {calculateAccuracy(currentUser?.quizzesDone, currentUser?.points)}</p>
            <p><span>Register Date:</span> {currentUser?.registeredAt}</p>
        </div>

        <div className="leaderboard">
            <table className="users-table">
                <thead>
                    <tr>
                        <th onClick={() => sortUsers('username')}>Username</th>
                        <th onClick={() => sortUsers('points')}>Points</th>
                        <th onClick={() => sortUsers('quizzes')}>Quizzes</th>
                        <th onClick={() => sortUsers('accuracy')}>Accuracy (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u:usersData) => (
                        <tr key={u.id}>
                        <td>{u.username}</td>
                        <td>{u.points}</td>
                        <td>{u.quizzesDone}</td>
                        <td>{calculateAccuracy(u.quizzesDone, u.points) == 0 ? 'N/A' : `${calculateAccuracy(u.quizzesDone, u.points)} %`}</td>
                    </tr>
                    ))}                    
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Dashboard