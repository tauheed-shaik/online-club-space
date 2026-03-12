import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'
import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'
import { loginUser } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { dispatch } = useAuth()

  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setError('')
  }

  const handleClick = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      dispatch({ type: 'LOGIN_START' })

      const res = await loginUser(credentials)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed. Please try again.')
        dispatch({ type: 'LOGIN_FAILURE', payload: data.message })
        setLoading(false)
        return
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: data.data,
          role: data.role,
          token: data.token
        }
      })

      navigate('/home')
    } catch (err) {
      setError('Network error. Please make sure the server is running.')
      dispatch({ type: 'LOGIN_FAILURE', payload: err.message })
    }
    setLoading(false)
  }

  return (
    <div className='form__container'>
      <div className="login__container">
        <div className="login__content">
          <img src={loginImg} alt="login illustration" />
        </div>

        <div className="login__form">
          <div className="user">
            <img src={userIcon} alt="user icon" />
          </div>
          <h2>Login</h2>

          {error && (
            <div className="auth__error">
              <i className="ri-error-warning-line"></i> {error}
            </div>
          )}

          <form onSubmit={handleClick}>
            <input
              type="email"
              placeholder='Email'
              required
              id='email'
              value={credentials.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder='Password'
              required
              id='password'
              value={credentials.password}
              onChange={handleChange}
            />
            <button
              className='btn primary__btn auth__btn'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p>Don't have an account? <Link to='/register'>Register</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
