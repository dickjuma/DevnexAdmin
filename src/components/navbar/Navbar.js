import React from 'react'
import './navbar.css'
import logo from '../../assets/account.png'
const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt=''  className='nav-logo'/>
      <img src={logo} alt='' className='nav-profile'/>
    </div>
  )
}

export default Navbar

