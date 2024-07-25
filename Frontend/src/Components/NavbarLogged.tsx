import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { AxiosResponse, AxiosError } from 'axios';
import api from '../api/users'
import { User } from '../Context/AuthContext';

const NavbarLogged = () => {

  const {logout, isLogged} = useAuth()
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    const fetchApi = async () => {
      const token  = sessionStorage.getItem('jwt')

      if (!token) {
        console.error('No token found in session storage');
        return;
      }

      try{
        const res:AxiosResponse = await api.get('/user-data', {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        sessionStorage.setItem("user", JSON.stringify(res.data))
        const userString = sessionStorage.getItem("user")
        if(userString) setUser(JSON.parse(userString))

      }catch(err){
        console.error("Failed to fetch user data", err);
        const error = err as AxiosError
        console.log(error.response?.data);
      }
    }

    fetchApi();

  }, [isLogged])


  return (
    <nav className='navbar Logged'>
        <Link to='/'><img src='/whitehouse.png'/></Link>
        <ul>
          {user ? (
            <li>{user.username}</li>
          ) : (
            <></>
          )}
            <li onClick={logout}>Logout</li>
        </ul>
    </nav>
  )
}

export default NavbarLogged