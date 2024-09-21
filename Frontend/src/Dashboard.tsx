import { useEffect, useState} from "react"
import api from './api/users'
import { AxiosResponse } from "axios"
import { User } from "./Context/AuthContext"
import quizzes from "./api/quizzes"
import Header from "./Header"
import Avatar from '@mui/material/Avatar';


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

    function stringToColor(string: string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
      }

      function stringAvatar(name: string) {
        const initials = name
        ? (name.split(' ') as string[])
            .filter(part => part.length > 0)
            .map(part => part[0])
            .join('')
        : 'NN';

        return {
          sx: {
            bgcolor: stringToColor(name || 'Default Name'),
          },
          children: initials.slice(0, 2),
        };
      }
      

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
    <>
        <Header/>
        
        <div className="dashboardPage">
            <div className="userInfo">
                <div className="section1">
                    <img className="avatar-logo" src="./avatar-logo2.png" alt="avatar"/>
                    <div className="basic-info">
                        <p><span>Username:</span> {currentUser?.username}</p>
                        <p><span>Register Date:</span> {currentUser?.registeredAt}</p>
                    </div>
                </div>
                <div className="statistics-info">
                    <div>
                        <div className="stats-circle">
                            {currentUser?.quizzesDone}
                        </div>
                        <p><span>Total Quizzes</span></p>
                    </div>
                    <div>
                        <div className="stats-circle">
                            {currentUser?.points}
                        </div>
                        <p><span>Points</span></p>
                    </div>
                    <div>
                        <div className="stats-circle">
                            {calculateAccuracy(currentUser?.quizzesDone, currentUser?.points)}
                        </div>
                        <p><span>Accuracy</span></p>
                    </div>
                </div>
            </div>

            <div className="leaderboard">
                <table className="users-table"  id="myTable">
                    <thead>
                        <tr>
                            <th style={{width: "10px"}}></th>
                            <th scope="col" >Username</th>
                            <th scope="col" onClick={() => sortUsers('points')}>Points <span><img className="sort-icon" src="./icons8-sort-desc.png" alt="sorteaza"/></span></th>
                            <th scope="col" onClick={() => sortUsers('quizzes')}>Quizzes <span><img className="sort-icon" src="./icons8-sort-desc.png" alt="sorteaza"/></span></th>
                            <th scope="col" onClick={() => sortUsers('accuracy')}>Accuracy (%)  <span><img className="sort-icon" src="./icons8-sort-desc.png" alt="sorteaza"/></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u:usersData, index:number) => (
                            <tr key={u.id}>
                                <td><span>{index === 0 ? (<img className="medal" src= "./icons8-gold-medal-48.png" alt="gold medal"/>) :
                                    index=== 1 ? (<img  className="medal" src="./icons8-silver-medal-48.png" alt="silver medal"/>) :
                                    index=== 2 ? (<img  className="medal" src="./icons8-bronze-medal-48.png"  alt="bronze medal"/>) :
                                    <></>
                                }</span>
                            </td>
                            <td>
                                {u.username}
                            </td>
                            <td>{u.points}</td>
                            <td>{u.quizzesDone}</td>
                            <td>{calculateAccuracy(u.quizzesDone, u.points) == 0 ? 'N/A' : `${calculateAccuracy(u.quizzesDone, u.points)} %`}</td>
                        </tr>
                        ))}                    
                    </tbody>
                </table>
            </div>

        </div>
    </>
  )
}

export default Dashboard