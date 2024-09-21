import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import api from '../api/users'
import { AxiosError, AxiosResponse } from 'axios'
import { User } from '../Context/AuthContext'


const Navbar = () => {

  const [logInClick, setLogInClick] = useState<boolean>(false)
  const [signUpClick, setSignUpClick] = useState<boolean>(false)
  const [showHome, setShowHome] = useState<boolean>(false)
  const [previousLocation, setPreviousLocation] =useState<string | null>(null)
  const [isUsernameClicked, setIsUsernameClicked] = useState<boolean>(false)
  const { logout, isLogged} = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null);
  

  useEffect(() => {
    if(location.pathname !== '/dashboard') setPreviousLocation(location.pathname)
    if(location.pathname !== '/') setShowHome(true)
    else setShowHome(false)
  },[location])

  useEffect(() => {

    const fetchApi = async () => {
      const token  = localStorage.getItem('jwt')

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

        localStorage.setItem("user", JSON.stringify(res.data))
        const userString = localStorage.getItem("user")
        if(userString) setUser(JSON.parse(userString))

      }catch(err){
        console.error("Failed to fetch user data", err);
        const error = err as AxiosError
        if(error.response?.data == 'User is not authorized.'){
        console.log(error.response?.data);
        logout()
        }
      }
    }

    fetchApi();

  }, [isLogged])


  const handleUsernameClick = () => {
    setIsUsernameClicked(!isUsernameClicked)
  }

  useEffect(() =>{
    if(isUsernameClicked) navigate('/dashboard')
    else if(previousLocation != null ) navigate(`${previousLocation}`)
  },[isUsernameClicked])

  return (
    <>
      {!isLogged ? (
        <nav className={`navbar notLogged ${showHome ? 'show-home' : 'hide-home'}`}>
          {showHome && (
            <Link to='/'><img src='/whitehouse.png'/></Link>
          )}
          <ul>
              <button onClick={() => navigate('/access')}><li>Log In</li></button>
              <button onClick={() => navigate('/access')}><li >Sign Up</li></button>
          </ul>
        </nav>
      ) : (
        <nav className={`navbar Logged ${showHome ? 'show-home' : 'hide-home'}`}>
           {showHome && (
            <Link to='/'><img src='/whitehouse.png'/></Link>
          )}
          <ul>
            {user ? (
              <button><li onClick={handleUsernameClick}>{user.username}</li></button>
            ) : (
              <></>
            )}
              <button><li onClick={logout}>Logout</li></button>
          </ul>
        </nav>
      )}
    </>
  )
}

export default Navbar