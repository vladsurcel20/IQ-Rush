import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import api from '../api/users'
import { AxiosError, AxiosResponse } from 'axios'
import { User } from '../Context/AuthContext'


const Navbar = () => {

  const [logInClick, setLogInClick] = useState<boolean>(false)
  const [signUpClick, setSignUpClick] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [retypedPassword, setRetypedPassword] = useState<string>('')
  const [showHome, setShowHome] = useState<boolean>(false)
  const [isUsernameClicked, setIsUsernameClicked] = useState<boolean>(false)
  const [previousLocation, setPreviousLocation] =useState<string | null>(null)
  const {login, logout, isLogged} = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null);
  

  useEffect(() => {
    setUsername('')
    setPassword('')
    setRetypedPassword('')
  }, [logInClick, signUpClick])

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



  const handleSubmitLogin = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fetchApi = async () => {
      try{
        const res:AxiosResponse = await api.post(`/login`, 
          {username, password},
          { headers: { 'Content-Type': 'application/json' }}
        )

        if(res.data){ 
        setLogInClick(false);  
        const {token} = res.data;
        login(token);
        }
        console.log("Login successful");
      } catch(err) {
        const error= err as AxiosError ;
        if(error.response?.data){
          alert(error.response.data);
        } else {
          console.log(`Error: ${error.message}`);          
        } 
      }
    }

    fetchApi()
  }


  const handleSubmitSignup = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(retypedPassword !== password){
      alert("Incorrect typed password")
      return
    }

    const fetchApi = async () => {
      try{
        const res:AxiosResponse = await api.post('/signup', 
          {username, password},
          { headers: { 'Content-Type': 'application/json' }}
        )

        console.log("Signup successful");
        
        setSignUpClick(false)
      } catch(err){
        const error= err as AxiosError ;
        if(error.response?.data){
          alert(error.response.data);
        } else {
          console.log(`Error: ${error.message}`);        
        }
      }
    }

    fetchApi()
  }

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
              <li onClick={() => {setLogInClick(!logInClick); setSignUpClick(false)}}>Log In</li>
              <li onClick={() => {setSignUpClick(!signUpClick); setLogInClick(false)}}>Sign Up</li>
          </ul>
          {logInClick ? (
          <form onSubmit={handleSubmitLogin}>
            <label htmlFor='username'>Username</label>
            <input id='username' type='text' required onChange={(e) => setUsername(e.target.value.trim())}></input>

            <label htmlFor='password'>Password</label>
            <input id='password' type='password' required onChange={(e) => setPassword(e.target.value.trim())}></input>

            <button type='submit'>Log In</button>
          </form>
          ) : signUpClick ? (
          <form onSubmit={handleSubmitSignup}>
            <label htmlFor='username'>Username</label>
            <input id='username' type='text' required minLength={6} onChange={(e) => setUsername(e.target.value.trim())}></input>

            <label htmlFor='password'>Password</label>
            <input id='password' type='password' required minLength={10} onChange={(e) => setPassword(e.target.value.trim())}></input>

            <label htmlFor='password'>Retype Password</label>
            <input id='retypedPassword' type='password' required minLength={10} onChange={(e) => setRetypedPassword(e.target.value.trim())}></input>

            <button type='submit'>Sign Up</button>
          </form>
          ) : (<></>)}
    </nav>
      ) : (
        <nav className={`navbar Logged ${showHome ? 'show-home' : 'hide-home'}`}>
           {showHome && (
            <Link to='/'><img src='/whitehouse.png'/></Link>
          )}
          <ul>
            {user ? (
              <li onClick={handleUsernameClick}>{user.username}</li>
            ) : (
              <></>
            )}
              <li onClick={logout}>Logout</li>
          </ul>
        </nav>
      )}
    </>
  )
}

export default Navbar