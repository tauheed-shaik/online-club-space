import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import EventCard from '../Components/EventCard/EventCard'
import Subtitle from '../Components/Subtitle/Subtitle'
import SearchBar from '../Components/SearchBar/SearchBar'
import { searchEvents } from '../utils/api'
import '../styles/events.css'

const SearchResultList = () => {
  const location = useLocation()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const query = new URLSearchParams(location.search)
  const name = query.get('name') || ''
  const area = query.get('area') || ''
  const maxGuestSize = query.get('maxGuestSize') || '0'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await searchEvents({ name, area, maxGuestSize })
        const data = await res.json()
        if (res.ok) {
          setEvents(data.data || [])
        } else {
          setError(data.message || 'Search failed.')
        }
      } catch (err) {
        setError('Network error. Please ensure the server is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [location.search])

  return (
    <section className="search-results">
      <div className="search-results__header">
        <Subtitle title="Search Results" />
        {!loading && (
          <p style={{ fontSize: '1.4rem', color: 'var(--text-color)', margin: '0.5rem 0 2rem' }}>
            {events.length > 0
              ? `Found ${events.length} event${events.length !== 1 ? 's' : ''} for "${name}" in "${area}"`
              : 'No results. Try a different search.'}
          </p>
        )}
      </div>

      <SearchBar />

      {loading && (
        <div className="events-loading">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {error && (
        <div className="events-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="events-empty">
          <p>No events matched your search. <Link to="/events">Browse all events →</Link></p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="search-results__grid">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}

export default SearchResultList