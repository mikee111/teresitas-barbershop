import express from 'express'
import cors from 'cors'
import appointmentRoutes from './routes/appointmentRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/appointments', appointmentRoutes)

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Teresitas Barbershop API is running' })
})

export default app
