import React from 'react'
import NavbarNotLogged from './Components/NavbarNotLogged'
import NavbarLogged from './Components/NavbarLogged'
import { useState } from 'react'
import { useAuth } from './Context/AuthContext'



const Header = () => {

    const {isLogged} = useAuth()

  return (
    <div className='header'>
        {isLogged ? ( <NavbarLogged />) : ( <NavbarNotLogged/> )}
    </div>
  )
}

export default Header