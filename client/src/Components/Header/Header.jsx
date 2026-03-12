import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'reactstrap'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { AiOutlineMenu } from "react-icons/ai"
import { RiUserLine, RiLogoutBoxLine, RiCalendarEventLine } from "react-icons/ri"
import './Header.css'
import { useAuth } from '../../context/AuthContext'

const nav__links = [
  { path: '/home', display: 'Home' },
  { path: '/about', display: 'About' },
  { path: '/events', display: 'Events' },
  { path: '/gallery', display: 'Gallery' },
  { path: '/team', display: 'Team' },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, role, dispatch } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const toggleMenu = () => setIsMenuOpen(prev => !prev)

  const handleScroll = () => setIsMenuOpen(false)

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    setIsDropdownOpen(false)
    navigate('/login')
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <header className='header'>

      <div className={`menu-btn ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <i><AiOutlineMenu /></i>
      </div>

      <div className="navbar__logo">
        <Link to="/home"><img src={logo} alt="Online Club Space Logo" /></Link>
      </div>

      <nav className={`navbar__links ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          {nav__links.map((item, index) => (
            <li className="navbar__links__item" key={index} onClick={toggleMenu}>
              <NavLink to={item.path} className={navClass => navClass.isActive ? "active__link" : ""}>
                {item.display}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="navbar__right__btns">
        {user ? (
          <div className="user__menu" ref={dropdownRef}>
            <div className="user__avatar" onClick={() => setIsDropdownOpen(prev => !prev)}>
              <i><RiUserLine /></i>
              <span className="user__name">{user.username}</span>
            </div>
            {isDropdownOpen && (
              <div className="user__dropdown">
                <Link to={`/my-bookings`} onClick={() => setIsDropdownOpen(false)}>
                  <i><RiCalendarEventLine /></i> My Bookings
                </Link>
                {role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsDropdownOpen(false)}>
                    <i><RiUserLine /></i> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout}>
                  <i><RiLogoutBoxLine /></i> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
            <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header