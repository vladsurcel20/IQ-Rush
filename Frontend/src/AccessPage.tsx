import React from 'react'
import { useState, useEffect } from 'react'
import { Axios, AxiosResponse, AxiosError } from 'axios'
import { useAuth } from './Context/AuthContext'
import api from './api/users'
import { Navigate, useNavigate } from 'react-router-dom'
import { grey } from '@mui/material/colors'

const AccessPage = () => {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [retypedPassword, setRetypedPassword] = useState<string>('')
    const {login, isLogged} = useAuth()
    const navigate = useNavigate()

    const handleSubmitLogin = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    
        const fetchApi = async () => {
          try{
            const res:AxiosResponse = await api.post(`/login`, 
              {username, password},
              { headers: { 'Content-Type': 'application/json' }}
            )
    
            if(res.data){ 
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
        if(isLogged) navigate('/') 
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

  return (
    <div className='access-page'>
        <div className='credentials-wrapper'>
            <div className='login-card access-card'>
                <h2>Log In</h2>
                <form onSubmit={handleSubmitLogin}>
                    {/* <label htmlFor='username'>Username</label> */}
                    <input id='username' type='text' placeholder='Username' required onChange={(e) => setUsername(e.target.value.trim())}></input>

                    {/* <label htmlFor='password'>Password</label> */}
                    <input id='password' type='password' placeholder='Password' required onChange={(e) => setPassword(e.target.value.trim())}></input>

                    <button type='submit'>Log In</button>
                </form>
            </div>
            <p className='or-text'>OR</p>
            <div className='signup-card access-card'> 
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmitSignup}>
                    {/* <label htmlFor='username'>Username</label> */}
                    <input id='username' type='text' placeholder='Username' required minLength={6} onChange={(e) => setUsername(e.target.value.trim())}></input>

                    {/* <label htmlFor='password'>Password</label> */}
                    <input id='password' type='password' placeholder='Password' required minLength={10} onChange={(e) => setPassword(e.target.value.trim())}></input>

                    {/* <label htmlFor='password'>Retype Password</label> */}
                    <input id='retypedPassword' type='password' placeholder='Retype Password' required minLength={10} onChange={(e) => setRetypedPassword(e.target.value.trim())}></input>

                    <button type='submit'>Sign Up</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AccessPage