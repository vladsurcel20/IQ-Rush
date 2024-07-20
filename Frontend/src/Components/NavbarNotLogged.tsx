import React from 'react'

export interface Props{
  setLogged: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar = (props: Props) => {
  return (
    <nav className='navbar notLogged'>
        <ul>
            <li onClick={() => props.setLogged(true)}>Log In</li>
            <li>Sign Up</li>
        </ul>
    </nav>
  )
}

export default Navbar