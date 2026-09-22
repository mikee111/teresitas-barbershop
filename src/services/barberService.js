import supabase from '../config/supabase'

export const INITIAL_DEFAULT_BARBERS = [
  {
    id: 1,
    name: 'Juan Cruz',
    position: 'Senior Barber',
    specialty: 'Fade Specialist',
    status: 'Active',
    phone: '0917 123 4567',
    email: 'juan@email.com',
    schedule: 'Monday - Saturday',
    start_time: '9:00 AM',
    end_time: '6:00 PM',
    hours: '9:00 AM - 6:00 PM',
  },
  {
    id: 2,
    name: 'Pedro Santos',
    position: 'Barber',
    specialty: 'Classic Cuts & Scissor Work',
    status: 'Active',
    phone: '0918 234 5678',
    email: 'pedro@email.com',
    schedule: 'Tuesday - Sunday',
    start_time: '9:00 AM',
    end_time: '6:00 PM',
    hours: '9:00 AM - 6:00 PM',
  },
  {
    id: 3,
    name: 'Carlos Reyes',
    position: 'Barber',
    specialty: 'Beard Grooming & Styling',
    status: 'Inactive',
    phone: '0919 345 6789',
    email: 'carlos@email.com',
    schedule: 'Monday - Friday',
    start_time: '10:00 AM',
    end_time: '7:00 PM',
    hours: '10:00 AM - 7:00 PM',
  },
  {
    id: 4,
    name: 'Luis Garcia',
    position: 'Barber',
    specialty: 'Hair Styling & Color',
    status: 'Active',
    phone: '0920 456 7890',
    email: 'luis@email.com',
    schedule: 'Wednesday - Monday',
    start_time: '9:00 AM',
    end_time: '6:00 PM',
    hours: '9:00 AM - 6:00 PM',
  },
  {
    id: 5,
    name: 'Marco Rivera',
    position: 'Junior Barber',
    specialty: 'Buzz Cut & Lineup',
    status: 'Active',
    phone: '0921 567 8901',
    email: 'marco@email.com',
    schedule: 'Monday - Saturday',
    start_time: '8:00 AM',
    end_time: '5:00 PM',
    hours: '8:00 AM - 5:00 PM',
  },
  {
    id: 6,
    name: 'Gudencio palero',
    position: 'Barber',
    specialty: 'aesthitic cut all around',
    status: 'Active',
    phone: '0922 678 9012',
    email: 'gudencio@email.com',
    schedule: 'Monday - Saturday',
    start_time: '9:00 AM',
    end_time: '6:00 PM',
    hours: '9:00 AM - 6:00 PM',
  },
]

export const LOCAL_STORAGE_KEY = 'tb_barbers_crew_data'

const getLocalBarbers = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Error reading local barbers:', err)
  }
  return null
}

const saveLocalBarbers = (barbers) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(barbers))
  } catch (err) {
    console.error('Error saving local barbers:', err)
  }
}

export const normalizeBarberRow = (row) => ({
  id: row.id,
  name: row.name || 'Unnamed Barber',
  position: row.position || 'Barber',
  specialty: row.specialty || 'General Barbering',
  status: row.status || 'Active',
  phone: row.phone || '0917 123 4567',
  email: row.email || `${(row.name || 'barber').toLowerCase().replace(/\s+/g, '')}@email.com`,
  schedule: row.schedule || 'Monday - Saturday',
  startTime: row.start_time || row.startTime || '9:00 AM',
  endTime: row.end_time || row.endTime || '6:00 PM',
  hours: row.hours || `${row.start_time || row.startTime || '9:00 AM'} - ${row.end_time || row.endTime || '6:00 PM'}`,
  createdAt: row.created_at,
})

export const fetchBarbers = async () => {
  try {
    let { data, error } = await supabase
      .from('barbers')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.warn('Supabase fetch error for barbers, falling back to local storage/default:', error.message)
      const local = getLocalBarbers()
      return local || INITIAL_DEFAULT_BARBERS.map(normalizeBarberRow)
    }

    // Auto-seed initial barbers if table is empty
    if (!data || data.length === 0) {
      const seedPayload = INITIAL_DEFAULT_BARBERS.map((b) => ({
        name: b.name,
        position: b.position,
        specialty: b.specialty,
        phone: b.phone,
        email: b.email,
        schedule: b.schedule,
        start_time: b.start_time,
        end_time: b.end_time,
        hours: b.hours,
        status: b.status,
      }))

      const { data: seededData, error: seedErr } = await supabase
        .from('barbers')
        .insert(seedPayload)
        .select()
        .order('id', { ascending: true })

      if (!seedErr && seededData && seededData.length > 0) {
        data = seededData
      } else {
        data = INITIAL_DEFAULT_BARBERS
      }
    }

    const normalized = (data || []).map(normalizeBarberRow)
    saveLocalBarbers(normalized)
    return normalized
  } catch (err) {
    console.error('Failed to fetch barbers from Supabase:', err)
    const local = getLocalBarbers()
    return local || INITIAL_DEFAULT_BARBERS.map(normalizeBarberRow)
  }
}

export const createBarber = async (barberData) => {
  const dbPayload = {
    name: barberData.name,
    position: barberData.position || 'Barber',
    specialty: barberData.specialty || 'General Barbering',
    phone: barberData.phone || '',
    email: barberData.email || '',
    schedule: barberData.schedule || 'Monday - Saturday',
    start_time: barberData.startTime || '9:00 AM',
    end_time: barberData.endTime || '6:00 PM',
    hours: `${barberData.startTime || '9:00 AM'} - ${barberData.endTime || '6:00 PM'}`,
    status: barberData.status || 'Active',
  }

  try {
    const { data, error } = await supabase
      .from('barbers')
      .insert([dbPayload])
      .select()
      .single()

    if (error) {
      console.warn('Supabase create barber error, storing locally:', error.message)
      const localBarber = {
        id: Date.now(),
        ...barberData,
        hours: `${barberData.startTime || '9:00 AM'} - ${barberData.endTime || '6:00 PM'}`,
      }
      const existing = getLocalBarbers() || INITIAL_DEFAULT_BARBERS.map(normalizeBarberRow)
      const updated = [...existing, localBarber]
      saveLocalBarbers(updated)
      return localBarber
    }

    const created = normalizeBarberRow(data)
    const existing = getLocalBarbers() || []
    saveLocalBarbers([...existing, created])
    return created
  } catch (err) {
    console.error('Failed to create barber:', err)
    const localBarber = {
      id: Date.now(),
      ...barberData,
      hours: `${barberData.startTime || '9:00 AM'} - ${barberData.endTime || '6:00 PM'}`,
    }
    const existing = getLocalBarbers() || INITIAL_DEFAULT_BARBERS.map(normalizeBarberRow)
    saveLocalBarbers([...existing, localBarber])
    return localBarber
  }
}

export const updateBarber = async (id, updatedFields) => {
  const dbPayload = {
    ...(updatedFields.name !== undefined && { name: updatedFields.name }),
    ...(updatedFields.position !== undefined && { position: updatedFields.position }),
    ...(updatedFields.specialty !== undefined && { specialty: updatedFields.specialty }),
    ...(updatedFields.phone !== undefined && { phone: updatedFields.phone }),
    ...(updatedFields.email !== undefined && { email: updatedFields.email }),
    ...(updatedFields.schedule !== undefined && { schedule: updatedFields.schedule }),
    ...(updatedFields.startTime !== undefined && { start_time: updatedFields.startTime }),
    ...(updatedFields.endTime !== undefined && { end_time: updatedFields.endTime }),
    ...((updatedFields.startTime || updatedFields.endTime) && {
      hours: `${updatedFields.startTime || '9:00 AM'} - ${updatedFields.endTime || '6:00 PM'}`,
    }),
    ...(updatedFields.status !== undefined && { status: updatedFields.status }),
  }

  try {
    const { data, error } = await supabase
      .from('barbers')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.warn('Supabase update barber error, updating locally:', error.message)
    }

    const updated = data ? normalizeBarberRow(data) : { id, ...updatedFields }
    const existing = getLocalBarbers() || []
    const nextList = existing.map((b) => (b.id === id ? { ...b, ...updated } : b))
    saveLocalBarbers(nextList)
    return updated
  } catch (err) {
    console.error('Failed to update barber:', err)
    const updated = { id, ...updatedFields }
    const existing = getLocalBarbers() || []
    saveLocalBarbers(existing.map((b) => (b.id === id ? { ...b, ...updated } : b)))
    return updated
  }
}

export const updateBarberStatus = async (id, newStatus) => {
  return updateBarber(id, { status: newStatus })
}

export const subscribeToBarbers = (callback) => {
  if (typeof window === 'undefined') return () => {}

  const handleStorage = (e) => {
    if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue)
        if (Array.isArray(parsed)) {
          callback(parsed)
        }
      } catch (err) {
        console.error('Cross-tab barbers sync error:', err)
      }
    }
  }
  window.addEventListener('storage', handleStorage)

  const channel = supabase
    .channel('realtime-barbers-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'barbers' },
      async () => {
        const data = await fetchBarbers()
        if (data && Array.isArray(data)) {
          callback(data)
        }
      }
    )
    .subscribe()

  return () => {
    window.removeEventListener('storage', handleStorage)
    supabase.removeChannel(channel)
  }
}

