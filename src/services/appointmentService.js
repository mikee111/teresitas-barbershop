/**
 * API Service for interacting with Node.js / Express + XAMPP MySQL backend
 */

const API_BASE_URL = 'http://localhost:5000/api/appointments'

export const fetchAppointments = async () => {
  try {
    const res = await fetch(API_BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch from backend')
    return await res.json()
  } catch (error) {
    console.warn('Backend connection failed, using local state fallback:', error)
    return null
  }
}

export const createAppointmentApi = async (newBooking) => {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    })
    if (!res.ok) throw new Error('Failed to create appointment on backend')
    return await res.json()
  } catch (error) {
    console.warn('Backend connection failed, using local state fallback:', error)
    return newBooking
  }
}

export const updateAppointmentApi = async (id, updates) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!res.ok) throw new Error('Failed to update appointment on backend')
    return await res.json()
  } catch (error) {
    console.warn('Backend connection failed, using local state fallback:', error)
    return null
  }
}
