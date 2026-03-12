import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home'
import About from '../pages/About'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Events from '../pages/Events'
import EventDetails from '../pages/EventDetails'
import Notification from '../pages/Notification'
import SearchResultList from '../pages/SearchResultList'
import Gallery from '../pages/Gallery'
import Team from '../pages/Team'
import MyBookings from '../pages/MyBookings'
import AdminDashboard from '../pages/AdminDashboard'
import AdminCreateEvent from '../pages/AdminCreateEvent'
import AdminBookings from '../pages/AdminBookings'
import { useAuth } from '../context/AuthContext'


const Routers = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/team' element={<Team />} />
      <Route path='/gallery' element={<Gallery />} />
      <Route path='/login' element={user ? <Navigate to='/home' /> : <Login />} />
      <Route path='/register' element={user ? <Navigate to='/home' /> : <Register />} />
      <Route path='/events' element={<Events />} />
      <Route path='/events/search' element={<SearchResultList />} />
      <Route path='/events/:id' element={<EventDetails />} />
      <Route path='/notification' element={<Notification />} />
      <Route path='/my-bookings' element={<MyBookings />} />
      <Route path='/admin' element={<AdminDashboard />} />
      <Route path='/admin/bookings' element={<AdminBookings />} />
      <Route path='/admin/create-event' element={<AdminCreateEvent />} />
      <Route path='/admin/edit-event/:id' element={<AdminCreateEvent />} />
    </Routes>
  )
}

export default Routers
