import { useEffect, useState } from 'react'
import './styles/global.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/services/Services'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/user/UserDashboard'
import {
  fetchAppointments,
  createAppointmentApi,
  updateAppointmentApi
} from './services/appointmentService'
import supabase from './config/supabase'
import {
  getCurrentSession,
  saveSession,
  logoutUser,
  updateUserProfile
} from './services/authService'

const INITIAL_SHARED_APPOINTMENTS = [
  {
    id: 101,
    refCode: '#TB-84920',
    customer: 'Juan Dela Cruz',
    service: { id: 3, name: 'Hair & Beard Combo', desc: 'Haircut and beard trim combo', price: 22.00 },
    barber: { id: 1, name: 'Mark Reyes', role: 'Master Barber', rating: '⭐ 4.9' },
    date: 'Aug 26, 2026',
    time: '10:30 AM',
    price: 22.00,
    status: 'confirmed',
    duration: '45 mins',
    paymentMode: 'Pay at Shop (Cash / Card)',
    requestedTime: '10:30 AM',
    confirmedTime: '10:30 AM',
  },
  {
    id: 102,
    refCode: '#TB-73104',
    customer: 'Juan Dela Cruz',
    service: { id: 4, name: 'Scissor Cut', desc: 'Premium scissor haircut', price: 20.00 },
    barber: { id: 2, name: 'John Carlio', role: 'Senior Barber', rating: '⭐ 4.8' },
    date: 'Aug 12, 2026',
    time: '02:00 PM',
    price: 20.00,
    status: 'completed',
    duration: '40 mins',
    paymentMode: 'Paid (Card)',
    rating: 5,
    review: 'Clean finish and great scissor work!',
    requestedTime: '02:00 PM',
    confirmedTime: '02:00 PM',
  },
  {
    id: 103,
    refCode: '#TB-62095',
    customer: 'Juan Dela Cruz',
    service: { id: 1, name: 'Hair Cut', desc: 'Classic haircut with wash and style', price: 15.00 },
    barber: { id: 3, name: 'Luis Santos', role: 'Fade Specialist', rating: '⭐ 4.9' },
    date: 'Jul 28, 2026',
    time: '11:00 AM',
    price: 15.00,
    status: 'cancelled',
    duration: '35 mins',
    paymentMode: 'Pay at Shop',
    cancelReason: 'Schedule conflict',
    requestedTime: '11:00 AM',
    confirmedTime: '',
  },
]

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => getCurrentSession())
  const [currentView, setCurrentView] = useState(() => {
    const session = getCurrentSession()
    if (session?.role === 'admin') return 'dashboard'
    if (session?.role === 'user') return 'user-dashboard'
    return 'website'
  })

  // ── Single shared appointments state ────────────────────────
  const [sharedAppointments, setSharedAppointments] = useState(() => {
    const saved = localStorage.getItem('tb_appointments')
    return saved ? JSON.parse(saved) : INITIAL_SHARED_APPOINTMENTS
  })

  // Sync with backend API on mount + cross-tab & realtime subscriptions
  useEffect(() => {
    let isMounted = true
    const loadBackendData = async () => {
      const data = await fetchAppointments()
      if (isMounted && data && Array.isArray(data) && data.length > 0) {
        setSharedAppointments(data)
        localStorage.setItem('tb_appointments', JSON.stringify(data))
      }
    }
    loadBackendData()

    // 1. Cross-tab listener for instant multi-tab notification
    const handleStorage = (e) => {
      if (e.key === 'tb_appointments' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) {
            setSharedAppointments(parsed)
          }
        } catch (err) {
          console.error('Cross-tab sync error:', err)
        }
      }
    }
    window.addEventListener('storage', handleStorage)

    // 2. Realtime Supabase channel
    const channel = supabase
      .channel('realtime-appointments-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        async () => {
          const data = await fetchAppointments()
          if (isMounted && data && Array.isArray(data)) {
            setSharedAppointments(data)
          }
        }
      )
      .subscribe()

    // 3. Heartbeat polling fallback (every 8s)
    const pollTimer = setInterval(loadBackendData, 8000)

    return () => {
      isMounted = false
      window.removeEventListener('storage', handleStorage)
      supabase.removeChannel(channel)
      clearInterval(pollTimer)
    }
  }, [])

  // Save to localStorage whenever sharedAppointments changes
  useEffect(() => {
    localStorage.setItem('tb_appointments', JSON.stringify(sharedAppointments))
  }, [sharedAppointments])

  // Add a new appointment (from user booking) — defaults to 'pending'
  const handleAddSharedAppointment = async (newAppt) => {
    setSharedAppointments((prev) => [newAppt, ...prev])
    const created = await createAppointmentApi(newAppt)
    if (created && created.id) {
      setSharedAppointments((prev) =>
        prev.map((appt) =>
          (appt.refCode === created.refCode || appt.id === newAppt.id) ? { ...appt, ...created } : appt
        )
      )
    }
  }

  // Update an appointment by id (admin status changes + user reschedule/cancel/review)
  const handleUpdateSharedAppointment = async (id, updates) => {
    setSharedAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, ...updates } : appt))
    )
    await updateAppointmentApi(id, updates)
  }

  const handleLoginSuccess = (userData) => {
    saveSession(userData)
    setCurrentUser(userData)
    setIsLoginOpen(false)
    if (userData.role === 'admin') {
      setCurrentView('dashboard')
    } else {
      setCurrentView('user-dashboard')
    }
  }

  // Logout: clear session and return to landing page
  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    setCurrentView('website')
    setIsLoginOpen(false)
  }

  const handleUserUpdate = async (updates) => {
    setCurrentUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      saveSession(updated)
      return updated
    })
    if (currentUser?.id || currentUser?.email) {
      await updateUserProfile(currentUser.id || currentUser.email, updates)
    }
  }

  // ── Admin Dashboard ─────────────────────────────────────────
  if (currentView === 'dashboard' && currentUser?.role === 'admin') {
    return (
      <Dashboard
        user={currentUser}
        onBackToSite={handleLogout}
        appointments={sharedAppointments}
        onUpdateAppointment={handleUpdateSharedAppointment}
        onUserUpdate={handleUserUpdate}
      />
    )
  }

  // ── User / Client Dashboard ─────────────────────────────────
  if (currentView === 'user-dashboard' && currentUser) {
    return (
      <UserDashboard
        user={currentUser}
        onLogout={handleLogout}
        onUserUpdate={handleUserUpdate}
        appointments={sharedAppointments}
        onUpdateAppointment={handleUpdateSharedAppointment}
        onAddAppointment={handleAddSharedAppointment}
      />
    )
  }

  return (
    <>
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        isLoggedIn={false}
      />

      <main>
        <Home />
        <div className="section-cut-divider">Classic Cuts · Modern Style</div>
        <About />
        <div className="section-cut-divider">Premium Grooming</div>
        <Services />
        <Contact />
      </main>

      <Footer />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  )
}

export default App
