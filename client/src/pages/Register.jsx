import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/login.css'
import loginImg from '../assets/images/login.png'
import userIcon from '../assets/images/user.png'
import { registerUser } from '../utils/api'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.')
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    setError('')

    try {
      const res = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }

      // Success — redirect to login
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } })
    } catch (err) {
      setError('Network error. Please make sure the server is running.')
    }
    setLoading(false)
  }

  return (
    <div className='form__container'>
      <div className="login__container">
        <div className="login__content">
          <img src={loginImg} alt="register illustration" />
        </div>

        <div className="login__form">
          <div className="user">
            <img src={userIcon} alt="user icon" />
          </div>
          <h2>Register</h2>

          {error && (
            <div className="auth__error">
              <i className="ri-error-warning-line"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='Username'
              required
              id='username'
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder='Email'
              required
              id='email'
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder='Password'
              required
              id='password'
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder='Confirm Password'
              required
              id='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              className='btn primary__btn auth__btn'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p>Already have an account? <Link to='/login'>Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
