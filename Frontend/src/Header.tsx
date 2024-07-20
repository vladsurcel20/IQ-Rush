import React from 'react'
import NavbarNotLogged from './Components/NavbarNotLogged'
import NavbarLogged from './Components/NavbarLogged'
import { useState } from 'react'



const Header = () => {

    const [logged, setLogged] = useState<boolean>(false);

  return (
    <div className='header'>
        {logged ? ( <NavbarLogged />) : ( <NavbarNotLogged setLogged={setLogged}/> )}
    </div>
  )
}

export default Header