
import React, { useState, useEffect } from 'react'
import { fetchAllBookings, cancelBooking } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import '../styles/AdminDashboard.css'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { role } = useAuth()

  useEffect(() => {
    const getAllBookings = async () => {
      try {
        const res = await fetchAllBookings()
        const data = await res.json()
        if (res.ok) {
          setBookings(data.data)
        } else {
          setError(data.message)
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }
    getAllBookings()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel/delete this booking?")) {
      try {
        const res = await cancelBooking(id)
        if (res.ok) {
          setBookings(prev => prev.filter(b => b._id !== id))
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
        <h2>Manage Bookings</h2>
      </div>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="admin__events-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Event</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user_id?.username || 'Unknown'} <br/> <small>{booking.user_id?.email}</small></td>
                  <td>{booking.event_id?.name || 'N/A'}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>{booking.guestSize}</td>
                  <td className="admin__actions">
                    <button onClick={() => handleDelete(booking._id)} className="delete-btn">Cancel Booking</button>
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

export default AdminBookings
