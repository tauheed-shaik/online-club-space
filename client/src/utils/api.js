const BASE_URL = 'http://localhost:8000/api/v1'

// Generic fetch wrapper with auth token support
const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token')
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    }
    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: 'include',
    })
    return response
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const loginUser = (credentials) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })

export const registerUser = (userData) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) })

// ── EVENTS ────────────────────────────────────────────────────────────────────
export const fetchAllEvents = (page = 0) =>
    apiFetch(`/events?page=${page}`)

export const fetchSingleEvent = (id) =>
    apiFetch(`/events/${id}`)

export const fetchFeaturedEvents = () =>
    apiFetch('/events/search/getFeaturedEvents')

export const searchEvents = ({ name, area, maxGuestSize }) =>
    apiFetch(`/events/search/getEventBySearch?name=${name}&area=${area}&maxGuestSize=${maxGuestSize}`)

export const fetchEventCount = () =>
    apiFetch('/events/search/getEventCount')

export const createEvent = (eventData) =>
    apiFetch('/events', { method: 'POST', body: JSON.stringify(eventData) })

export const updateEvent = (id, eventData) =>
    apiFetch(`/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) })

export const deleteEvent = (id) =>
    apiFetch(`/events/${id}`, { method: 'DELETE' })

// ── REVIEWS ───────────────────────────────────────────────────────────────────
export const fetchReviewsByEvent = (eventId) =>
    apiFetch(`/review/getReviewByEventId/${eventId}`)

export const submitReview = (reviewData) =>
    apiFetch('/review', { method: 'POST', body: JSON.stringify(reviewData) })

export const deleteReview = (reviewId) =>
    apiFetch(`/review/${reviewId}`, { method: 'DELETE' })

// ── BOOKINGS ──────────────────────────────────────────────────────────────────
export const createBooking = (bookingData) =>
    apiFetch('/booking', { method: 'POST', body: JSON.stringify(bookingData) })

export const fetchUserBookings = (userId) =>
    apiFetch(`/booking/user/${userId}`)

export const cancelBooking = (bookingId) =>
    apiFetch(`/booking/${bookingId}`, { method: 'DELETE' })

export const fetchAllBookings = () =>
    apiFetch('/booking')

// ── TIMESLOTS ─────────────────────────────────────────────────────────────────
export const fetchTimeslots = () =>
    apiFetch('/timeslot')

// ── USERS ─────────────────────────────────────────────────────────────────────
export const fetchAllUsers = () =>
    apiFetch('/users')
