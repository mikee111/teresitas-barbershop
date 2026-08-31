import express from 'express'
import {
  getAppointments,
  createAppointment,
  updateAppointment
} from '../controllers/appointmentController.js'

const router = express.Router()

// GET /api/appointments — list all appointments
router.get('/', getAppointments)

// POST /api/appointments — create new booking
router.post('/', createAppointment)

// PUT /api/appointments/:id — update appointment status/details
router.put('/:id', updateAppointment)

export default router
