import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { RiStarFill, RiMapPinLine, RiGroupLine, RiMoneyDollarCircleLine } from 'react-icons/ri'
import { fetchSingleEvent, fetchReviewsByEvent, submitReview, fetchTimeslots, createBooking } from '../utils/api'
import { useAuth } from '../context/AuthContext'
import calculateAvgRating from '../utils/avgRating'
import '../styles/events.css'

const EventDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Event state
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')

  // Booking state
  const [timeslots, setTimeslots] = useState([])
  const [booking, setBooking] = useState({
    bookingDate: '',
    timeslot_id: '',
    guestSize: 1,
    phone: ''
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [eventRes, reviewRes, slotRes] = await Promise.all([
          fetchSingleEvent(id),
          fetchReviewsByEvent(id),
          fetchTimeslots()
        ])
        const eventData = await eventRes.json()
        const reviewData = await reviewRes.json()
        const slotData = await slotRes.json()

        if (eventRes.ok) setEvent(eventData.data)
        else setError(eventData.message || 'Event not found.')

        if (reviewRes.ok) setReviews(reviewData.data || [])
        if (slotRes.ok) setTimeslots(slotData.data || [])
      } catch (err) {
        setError('Network error. Please ensure the server is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleBookingChange = e => {
    setBooking(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setBookingError('')
  }

  const handleBooking = async e => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!booking.bookingDate) return setBookingError('Please select a booking date.')
    if (!booking.guestSize || booking.guestSize < 1) return setBookingError('Please enter a valid guest size.')

    setBookingLoading(true)
    setBookingError('')
    setBookingSuccess('')

    try {
      const res = await createBooking({
        user_id: user._id,
        event_id: id,
        timeslot_id: booking.timeslot_id || undefined,
        bookingDate: booking.bookingDate,
        guestSize: parseInt(booking.guestSize),
      })
      const data = await res.json()

      if (res.ok) {
        setBookingSuccess(`🎉 ${data.message}`)
        setBooking({ bookingDate: '', timeslot_id: '', guestSize: 1, phone: '' })
      } else {
        setBookingError(data.message || 'Booking failed. Please try again.')
      }
    } catch (err) {
      setBookingError('Network error. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleReviewSubmit = async e => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!reviewText.trim()) return setReviewError('Please write a review.')
    if (rating === 0) return setReviewError('Please select a rating.')

    setReviewLoading(true)
    setReviewError('')
    setReviewSuccess('')

    try {
      const res = await submitReview({
        user_id: user._id,
        event_id: id,
        reviewText,
        rating
      })
      const data = await res.json()

      if (res.ok) {
        // Refresh reviews
        const refreshed = await fetchReviewsByEvent(id)
        const refreshedData = await refreshed.json()
        if (refreshed.ok) setReviews(refreshedData.data || [])
        setReviewText('')
        setRating(0)
        setReviewSuccess('✅ ' + (data.message || 'Review submitted!'))
      } else {
        setReviewError(data.message || 'Failed to submit review.')
      }
    } catch (err) {
      setReviewError('Network error. Please try again.')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return (
    <div className="events-loading" style={{ paddingTop: '15rem' }}>
      <div className="spinner"></div>
      <p>Loading event...</p>
    </div>
  )

  if (error) return (
    <div className="events-error" style={{ paddingTop: '15rem' }}>
      <p>⚠️ {error}</p>
      <Link to="/events" className="btn primary__btn" style={{ marginTop: '2rem', display: 'inline-block' }}>
        Back to Events
      </Link>
    </div>
  )

  if (!event) return null

  const { name, venue, address, photo, price, desc, minGuestSize, maxGuestSize, featured } = event
  const { avgRating } = calculateAvgRating(reviews)

  const today = new Date().toISOString().split('T')[0]

  return (
    <section className="event-details">
      <div className="event-details__wrapper">
        {/* ── Left column: Event info + Reviews ── */}
        <div>
          <div className="event-details__img">
            <img src={photo} alt={name} onError={e => { e.target.src = 'https://via.placeholder.com/800x400?text=Event+Image' }} />
          </div>

          {featured && <span className="featured-badge">⭐ Featured Event</span>}
          <h2>{name}</h2>

          <div className="event-rating">
            <i><RiStarFill /></i>
            <strong>{avgRating || 'No ratings yet'}</strong>
            {reviews.length > 0 && <span>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>}
          </div>

          <p>{desc}</p>

          <ul className="event-details__info">
            <li><i><RiMapPinLine /></i><span>Venue:</span>{venue}</li>
            <li><i><RiMapPinLine /></i><span>Address:</span>{address}</li>
            <li><i><RiMoneyDollarCircleLine /></i><span>Price:</span>${price} per person</li>
            <li><i><RiGroupLine /></i><span>Min Guests:</span>{minGuestSize} people</li>
            <li><i><RiGroupLine /></i><span>Max Guests:</span>{maxGuestSize} people</li>
          </ul>

          {/* ── Reviews Section ── */}
          <div className="reviews-section">
            <h3>Reviews ({reviews.length})</h3>

            {reviews.length === 0 && (
              <p style={{ fontSize: '1.4rem', color: 'var(--text-color)' }}>
                No reviews yet. Be the first to review!
              </p>
            )}

            {reviews.map((review, i) => {
              const authorName = review.user_id?.username || 'Anonymous'
              return (
                <div key={review._id || i} className="review-card">
                  <div className="review-avatar">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="review-author">{authorName}</div>
                    <div className="review-rating">
                      {Array.from({ length: 5 }, (_, si) => (
                        <i key={si}><RiStarFill style={{ color: si < review.rating ? '#f5a623' : '#ddd' }} /></i>
                      ))}
                    </div>
                    <p className="review-text">{review.reviewText}</p>
                    <p className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Add review form */}
            {user ? (
              <div className="add-review-form">
                <h4>Leave a Review</h4>
                {reviewSuccess && <div className="booking-success" style={{ marginBottom: '1rem' }}>{reviewSuccess}</div>}
                {reviewError && <div className="booking-error" style={{ marginBottom: '1rem' }}>{reviewError}</div>}
                <form onSubmit={handleReviewSubmit}>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`rating-star ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                      >★</span>
                    ))}
                  </div>
                  <textarea
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={e => { setReviewText(e.target.value); setReviewError('') }}
                  />
                  <button className="btn primary__btn review-submit-btn" type="submit" disabled={reviewLoading}>
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <p className="login-to-review">
                <Link to="/login">Login</Link> to leave a review.
              </p>
            )}
          </div>
        </div>

        {/* ── Right column: Booking card ── */}
        <div className="booking-card">
          <h4>Book This Event</h4>
          <div className="price">${price}<span> /per person</span></div>

          {bookingSuccess ? (
            <div className="booking-success">
              {bookingSuccess}
              <br />
              <Link to="/my-bookings" style={{ marginTop: '1rem', display: 'block', color: 'inherit', textDecoration: 'underline' }}>
                View My Bookings →
              </Link>
            </div>
          ) : (
            <>
              {bookingError && <div className="booking-error" style={{ marginBottom: '1rem' }}>{bookingError}</div>}
              <form className="booking-form" onSubmit={handleBooking}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={user?.username || ''}
                  readOnly
                  style={{ background: '#f9f9f9' }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={user?.email || ''}
                  readOnly
                  style={{ background: '#f9f9f9' }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  id="phone"
                  value={booking.phone}
                  onChange={handleBookingChange}
                />
                <input
                  type="date"
                  id="bookingDate"
                  value={booking.bookingDate}
                  min={today}
                  onChange={handleBookingChange}
                  required
                />
                {timeslots.length > 0 && (
                  <select id="timeslot_id" value={booking.timeslot_id} onChange={handleBookingChange}>
                    <option value="">Select Time Slot (optional)</option>
                    {timeslots.map(slot => (
                      <option key={slot._id} value={slot._id}>
                        {slot.start_time} – {slot.end_time}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="number"
                  id="guestSize"
                  placeholder="Number of Guests"
                  min={minGuestSize}
                  max={maxGuestSize}
                  value={booking.guestSize}
                  onChange={handleBookingChange}
                  required
                />
                <p className="guests-range">Min: {minGuestSize} — Max: {maxGuestSize} guests</p>

                {user ? (
                  <button className="btn primary__btn booking__btn" type="submit" disabled={bookingLoading}>
                    {bookingLoading ? 'Booking...' : 'Book Now'}
                  </button>
                ) : (
                  <Link to="/login" className="btn primary__btn booking__btn" style={{ textAlign: 'center' }}>
                    Login to Book
                  </Link>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default EventDetails
