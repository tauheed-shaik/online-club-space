
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllEvents, deleteEvent } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import '../styles/AdminDashboard.css'

const AdminDashboard = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { role } = useAuth()

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await fetchAllEvents(0) // Fetch first page
        const data = await res.json()
        if (res.ok) {
          setEvents(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    getEvents()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await deleteEvent(id)
        if (res.ok) {
          setEvents(prev => prev.filter(event => event._id !== id))
        } else {
          const data = await res.json()
          alert(data.message || "Failed to delete")
        }
      } catch (err) {
        alert("Network error")
      }
    }
  }

  if (role !== 'admin') {
    return <div className="section__container"><h2>Access Denied</h2></div>
  }

  return (
    <div className="admin__dashboard section__container">
      <div className="admin__header">
        <h2>Admin Dashboard</h2>
        <div className="d-flex gap-3">
          <Link to="/admin/bookings" className="btn secondary__btn" style={{ border: '1px solid var(--secondary-color)' }}>Manage Bookings</Link>
          <Link to="/admin/create-event" className="btn primary__btn">Create New Event</Link>
        </div>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="admin__events-table">
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Venue</th>
                <th>Price</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{event.venue}</td>
                  <td>${event.price}</td>
                  <td>{event.featured ? 'Yes' : 'No'}</td>
                  <td className="admin__actions">
                    <Link to={`/admin/edit-event/${event._id}`} className="edit-btn">Edit</Link>
                    <button onClick={() => handleDelete(event._id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
