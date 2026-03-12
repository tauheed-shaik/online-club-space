import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchUserBookings, cancelBooking } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import '../styles/events.css'

const MyBookings = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    const load = async () => {
      try {
        const res = await fetchUserBookings(user._id)
        const data = await res.json()
        if (res.ok) setBookings(data.data || [])
        else setError(data.message || 'Failed to load bookings.')
      } catch (err) {
        setError('Network error.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, navigate])

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(bookingId)
    try {
      const res = await cancelBooking(bookingId)
      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== bookingId))
      } else {
        alert('Failed to cancel booking. Please try again.')
      }
    } catch (err) {
      alert('Network error.')
    } finally {
      setCancellingId(null)
    }
  }

  if (!user) return null

  return (
    <section className="my-bookings">
      <h2>My Bookings</h2>

      {loading && (
        <div className="events-loading">
          <div className="spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      )}

      {error && <div className="events-error"><p>⚠️ {error}</p></div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="no-bookings">
          <p>You haven't made any bookings yet.</p>
          <p><Link to="/events">Browse events →</Link></p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Event</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Guests</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, i) => {
              const event = booking.event_id
              const slot = booking.timeslot_id
              const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })
              const totalPrice = event ? event.price * booking.guestSize : '—'
              return (
                <tr key={booking._id}>
                  <td>{i + 1}</td>
                  <td>
                    {event
                      ? <Link to={`/events/${event._id}`} style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>{event.name}</Link>
                      : 'N/A'}
                  </td>
                  <td>{event?.venue || '—'}</td>
                  <td>{bookingDate}</td>
                  <td>{slot ? `${slot.start_time} – ${slot.end_time}` : '—'}</td>
                  <td>{booking.guestSize}</td>
                  <td>{event ? `$${totalPrice}` : '—'}</td>
                  <td><span className="badge-confirmed">Confirmed</span></td>
                  <td>
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancellingId === booking._id}
                    >
                      {cancellingId === booking._id ? '...' : 'Cancel'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default MyBookings
