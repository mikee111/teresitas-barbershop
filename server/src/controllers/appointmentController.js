import db from '../config/database.js'

// Get all appointments (with optional status/search filters)
export const getAppointments = async (req, res) => {
  try {
    const { data: rows, error } = await db
      .from('appointments')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Error fetching appointments from Supabase:', error)
      return res.status(500).json({ error: error.message || 'Failed to fetch appointments from database' })
    }

    // Format JSON response to match React frontend structure
    const formatted = (rows || []).map((row) => ({
      id: row.id,
      refCode: row.ref_code,
      customer: row.customer_name,
      service: {
        id: row.service_id,
        name: row.service_name,
        price: Number(row.price)
      },
      barber: {
        id: row.barber_id,
        name: row.barber_name
      },
      date: row.date,
      time: row.time,
      requestedTime: row.requested_time || row.time,
      confirmedTime: row.confirmed_time || row.time,
      price: Number(row.price),
      status: row.status,
      duration: row.duration,
      paymentMode: row.payment_mode,
      cancelReason: row.cancel_reason,
      rating: row.rating,
      review: row.review
    }))

    res.json(formatted)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    res.status(500).json({ error: 'Failed to fetch appointments from database' })
  }
}

// Create new booking (Status: pending)
export const createAppointment = async (req, res) => {
  try {
    const {
      refCode,
      customer,
      service,
      barber,
      date,
      time,
      price,
      duration,
      paymentMode
    } = req.body

    const generatedRef = refCode || `#TB-${Math.floor(10000 + Math.random() * 90000)}`
    const serviceName = service?.name || service || 'Hair Cut'
    const serviceId = service?.id || null
    const barberName = barber?.name || barber || 'Mark Reyes'
    const barberId = barber?.id || null
    const finalPrice = price || service?.price || 15.00
    const customerName = customer || 'Juan Dela Cruz'

    const recordToInsert = {
      ref_code: generatedRef,
      customer_name: customerName,
      service_id: serviceId,
      barber_id: barberId,
      service_name: serviceName,
      barber_name: barberName,
      date: date || '',
      time: time || '',
      requested_time: time || '',
      price: finalPrice,
      status: 'pending',
      duration: duration || '45 mins',
      payment_mode: paymentMode || 'Pay at Shop (Cash / Card)'
    }

    const { data, error } = await db
      .from('appointments')
      .insert([recordToInsert])
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment in Supabase:', error)
      return res.status(500).json({ error: error.message || 'Failed to create appointment in database' })
    }

    const newAppointment = {
      id: data.id,
      refCode: data.ref_code,
      customer: data.customer_name,
      service: { id: data.service_id, name: data.service_name, price: Number(data.price) },
      barber: { id: data.barber_id, name: data.barber_name },
      date: data.date,
      time: data.time,
      requestedTime: data.requested_time || data.time,
      confirmedTime: '',
      price: Number(data.price),
      status: data.status || 'pending',
      duration: data.duration || '45 mins',
      paymentMode: data.payment_mode || 'Pay at Shop (Cash / Card)'
    }

    res.status(201).json(newAppointment)
  } catch (error) {
    console.error('Error creating appointment:', error)
    res.status(500).json({ error: 'Failed to create appointment in database' })
  }
}

// Update appointment status / reschedule / cancel / review
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const recordUpdates = {}

    if (updates.status !== undefined) {
      recordUpdates.status = updates.status.toLowerCase()
    }
    if (updates.confirmedTime !== undefined) {
      recordUpdates.confirmed_time = updates.confirmedTime
    }
    if (updates.time !== undefined) {
      recordUpdates.time = updates.time
    }
    if (updates.date !== undefined) {
      recordUpdates.date = updates.date
    }
    if (updates.cancelReason !== undefined) {
      recordUpdates.cancel_reason = updates.cancelReason
    }
    if (updates.rating !== undefined) {
      recordUpdates.rating = updates.rating
    }
    if (updates.review !== undefined) {
      recordUpdates.review = updates.review
    }
    if (updates.barber !== undefined) {
      const barberName = typeof updates.barber === 'object' ? updates.barber.name : updates.barber
      recordUpdates.barber_name = barberName
    }

    if (Object.keys(recordUpdates).length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' })
    }

    const { data, error } = await db
      .from('appointments')
      .update(recordUpdates)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating appointment in Supabase:', error)
      return res.status(500).json({ error: error.message || 'Failed to update appointment' })
    }

    res.json({ message: 'Appointment updated successfully', id, data })
  } catch (error) {
    console.error('Error updating appointment:', error)
    res.status(500).json({ error: 'Failed to update appointment' })
  }
}
