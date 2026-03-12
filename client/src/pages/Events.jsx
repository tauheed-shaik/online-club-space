import React, { useState, useEffect } from 'react'
import EventCard from '../Components/EventCard/EventCard'
import SearchBar from '../Components/SearchBar/SearchBar'
import Subtitle from '../Components/Subtitle/Subtitle'
import { fetchAllEvents, fetchEventCount } from '../utils/api'
import '../styles/events.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalEvents, setTotalEvents] = useState(0)
  const eventsPerPage = 8

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      setError(null)
      try {
        const [eventsRes, countRes] = await Promise.all([
          fetchAllEvents(page),
          fetchEventCount()
        ])
        const eventsData = await eventsRes.json()
        const countData = await countRes.json()

        if (eventsRes.ok) {
          setEvents(eventsData.data || [])
        } else {
          setError(eventsData.message || 'Failed to load events.')
        }
        if (countRes.ok) {
          setTotalEvents(countData.data || 0)
        }
      } catch (err) {
        setError('Network error. Please ensure the server is running.')
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [page])

  const totalPages = Math.ceil(totalEvents / eventsPerPage)

  return (
    <>
      <section className="events-page">
        <div className="events-page__header">
          <Subtitle title="All Events" />
          <p className="events-count">
            {totalEvents > 0 && `${totalEvents} event${totalEvents !== 1 ? 's' : ''} available`}
          </p>
        </div>

        <SearchBar />

        {loading && (
          <div className="events-loading">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        )}

        {error && (
          <div className="events-error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="events-empty">
            <p>No events found. Check back later!</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <div className="events-grid">
              {events.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn pagination__btn"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  ‹ Previous
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`page-num ${page === i ? 'active' : ''}`}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="btn pagination__btn"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next ›
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}

export default Events