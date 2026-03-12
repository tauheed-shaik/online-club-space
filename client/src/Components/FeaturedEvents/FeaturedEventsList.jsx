import React, { useState, useEffect } from 'react'
import EventCard from '../EventCard/EventCard'
import { fetchFeaturedEvents } from '../../utils/api'
import './FeaturedEvents.css'

const FeaturedEventsList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        const res = await fetchFeaturedEvents()
        const data = await res.json()
        if (res.ok && data.data) {
          setEvents(data.data)
        } else {
          setError(data.message || 'Failed to load featured events.')
        }
      } catch (err) {
        setError('Network error. Please ensure the server is running.')
      } finally {
        setLoading(false)
      }
    }
    loadFeaturedEvents()
  }, [])

  if (loading) {
    return (
      <div className="featured-loading">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="featured-error">
        <p>⚠️ {error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="featured-empty">
        <p>No featured events at the moment. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className='featured-event-section'>
      {events.map(event => (
        <div key={event._id}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  )
}

export default FeaturedEventsList
