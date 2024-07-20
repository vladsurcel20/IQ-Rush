import React from 'react'
import {Link} from 'react-router-dom';

const NavbarLogged = () => {
  return (
    <nav className='navbar Logged'>
        <Link to='/'><img src='/whitehouse.png'/></Link>
        <ul>
            <li>test</li>
            <li>test</li>
        </ul>
    </nav>
  )
}

export default NavbarLogged