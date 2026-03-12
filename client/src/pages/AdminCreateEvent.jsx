
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createEvent, updateEvent, fetchSingleEvent } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import '../styles/AdminDashboard.css'

const AdminCreateEvent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    address: '',
    photo: '',
    desc: '',
    price: 0,
    minGuestSize: 1,
    maxGuestSize: 100,
    featured: false
  })

  useEffect(() => {
    if (id) {
      const getEvent = async () => {
        const res = await fetchSingleEvent(id)
        const data = await res.json()
        if (res.ok) {
          setFormData(data.data)
        }
      }
      getEvent()
    }
  }, [id])

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = id 
        ? await updateEvent(id, formData)
        : await createEvent(formData)
      
      const data = await res.json()
      if (res.ok) {
        alert(id ? "Event updated!" : "Event created!")
        navigate('/admin')
      } else {
        alert(data.message || "Failed to save")
      }
    } catch (err) {
      alert("Network error")
    } finally {
      setLoading(false)
    }
  }

  if (role !== 'admin') {
    return <div className="section__container"><h2>Access Denied</h2></div>
  }

  return (
    <div className="section__container">
      <div className="admin__form-container">
        <h3>{id ? 'Edit Event' : 'Create New Event'}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" id="name" placeholder="Event Name" value={formData.name} onChange={handleChange} required />
          <input type="text" id="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} required />
          <input type="text" id="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input type="text" id="photo" placeholder="Photo URL" value={formData.photo} onChange={handleChange} required />
          <textarea id="desc" placeholder="Description" value={formData.desc} onChange={handleChange} required />
          <input type="number" id="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <div className="d-flex gap-3">
             <input type="number" id="minGuestSize" placeholder="Min Guests" value={formData.minGuestSize} onChange={handleChange} required />
             <input type="number" id="maxGuestSize" placeholder="Max Guests" value={formData.maxGuestSize} onChange={handleChange} required />
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="featured" checked={formData.featured} onChange={handleChange} />
            <label htmlFor="featured">Featured Event</label>
          </div>
          <button type="submit" className="btn primary__btn w-100" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Event' : 'Create Event')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminCreateEvent
