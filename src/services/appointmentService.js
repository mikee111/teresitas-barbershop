import supabase from '../config/supabase'

export const INITIAL_DEFAULT_APPOINTMENTS = [
  {
    ref_code: '#TB-84920',
    customer_name: 'Juan Dela Cruz',
    service_id: 3,
    service_name: 'Hair & Beard Combo',
    barber_id: 1,
    barber_name: 'Mark Reyes',
    date: 'Aug 26, 2026',
    time: '10:30 AM',
    requested_time: '10:30 AM',
    confirmed_time: '10:30 AM',
    price: 22.00,
    status: 'confirmed',
    duration: '45 mins',
    payment_mode: 'Pay at Shop (Cash / Card)'
  },
  {
    ref_code: '#TB-73104',
    customer_name: 'Juan Dela Cruz',
    service_id: 4,
    service_name: 'Scissor Cut',
    barber_id: 2,
    barber_name: 'John Carlio',
    date: 'Aug 12, 2026',
    time: '02:00 PM',
    requested_time: '02:00 PM',
    confirmed_time: '02:00 PM',
    price: 20.00,
    status: 'completed',
    duration: '40 mins',
    payment_mode: 'Paid (Card)',
    rating: 5,
    review: 'Clean finish and great scissor work!'
  },
  {
    ref_code: '#TB-62095',
    customer_name: 'Juan Dela Cruz',
    service_id: 1,
    service_name: 'Hair Cut',
    barber_id: 3,
    barber_name: 'Luis Santos',
    date: 'Jul 28, 2026',
    time: '11:00 AM',
    requested_time: '11:00 AM',
    confirmed_time: '',
    price: 15.00,
    status: 'cancelled',
    duration: '35 mins',
    payment_mode: 'Pay at Shop',
    cancel_reason: 'Schedule conflict'
  }
]

export const fetchAppointments = async () => {
  try {
    let { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.error('Supabase fetch error:', error)
      return null
    }

    // If table is brand new and empty, auto-seed with initial mock records
    if (!data || data.length === 0) {
      const { data: seededData, error: seedError } = await supabase
        .from('appointments')
        .insert(INITIAL_DEFAULT_APPOINTMENTS)
        .select()
        .order('id', { ascending: false })

      if (!seedError && seededData) {
        data = seededData
      }
    }

    return (data || []).map((row) => ({
      id: row.id,
      refCode: row.ref_code,
      customer: row.customer_name || 'Juan Dela Cruz',
      service: {
        id: row.service_id,
        name: row.service_name || 'Haircut Service',
        price: Number(row.price || 0)
      },
      barber: {
        id: row.barber_id,
        name: row.barber_name || 'Mark Reyes'
      },
      date: row.date,
      time: row.time,
      requestedTime: row.requested_time || row.time,
      confirmedTime: row.confirmed_time || row.time,
      price: Number(row.price || 0),
      status: row.status || 'pending',
      duration: row.duration || '45 mins',
      paymentMode: row.payment_mode || 'Pay at Shop (Cash / Card)',
      cancelReason: row.cancel_reason,
      rating: row.rating,
      review: row.review
    }))
  } catch (error) {
    console.error('Failed to fetch from Supabase:', error)
    return null
  }
}

export const createAppointmentApi = async (newBooking) => {
  try {
    const serviceName = newBooking.service?.name || (typeof newBooking.service === 'string' ? newBooking.service : 'Hair Cut')
    const serviceId = newBooking.service?.id || null
    const barberName = newBooking.barber?.name || (typeof newBooking.barber === 'string' ? newBooking.barber : 'Mark Reyes')
    const barberId = newBooking.barber?.id || null
    const finalPrice = Number(newBooking.price || newBooking.service?.price || 15.00)
    const customerName = newBooking.customer || 'Juan Dela Cruz'
    const generatedRef = newBooking.refCode || `#TB-${Math.floor(10000 + Math.random() * 90000)}`

    const rowToInsert = {
      ref_code: generatedRef,
      customer_name: customerName,
      service_id: serviceId,
      barber_id: barberId,
      service_name: serviceName,
      barber_name: barberName,
      date: newBooking.date || '',
      time: newBooking.time || '',
      requested_time: newBooking.requestedTime || newBooking.time || '',
      confirmed_time: newBooking.confirmedTime || '',
      price: finalPrice,
      status: (newBooking.status || 'pending').toLowerCase(),
      duration: newBooking.duration || '45 mins',
      payment_mode: newBooking.paymentMode || 'Pay at Shop (Cash / Card)'
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([rowToInsert])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return newBooking
    }

    return {
      id: data.id,
      refCode: data.ref_code,
      customer: data.customer_name,
      service: { id: data.service_id, name: data.service_name, price: Number(data.price) },
      barber: { id: data.barber_id, name: data.barber_name },
      date: data.date,
      time: data.time,
      requestedTime: data.requested_time || data.time,
      confirmedTime: data.confirmed_time || '',
      price: Number(data.price),
      status: data.status,
      duration: data.duration,
      paymentMode: data.payment_mode
    }
  } catch (error) {
    console.error('Failed to create in Supabase:', error)
    return newBooking
  }
}

export const updateAppointmentApi = async (id, updates) => {
  try {
    const recordUpdates = {}

    if (updates.status !== undefined) recordUpdates.status = updates.status.toLowerCase()
    if (updates.confirmedTime !== undefined) recordUpdates.confirmed_time = updates.confirmedTime
    if (updates.time !== undefined) recordUpdates.time = updates.time
    if (updates.date !== undefined) recordUpdates.date = updates.date
    if (updates.cancelReason !== undefined) recordUpdates.cancel_reason = updates.cancelReason
    if (updates.rating !== undefined) recordUpdates.rating = updates.rating
    if (updates.review !== undefined) recordUpdates.review = updates.review
    if (updates.barber !== undefined) {
      recordUpdates.barber_name = typeof updates.barber === 'object' ? updates.barber?.name : updates.barber
    }

    const { data, error } = await supabase
      .from('appointments')
      .update(recordUpdates)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase update error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to update in Supabase:', error)
    return null
  }
}
