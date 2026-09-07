import supabase from '../config/supabase'
import {
  taperFadeImg,
  buzzCutImg,
  crewCutImg,
  frenchCropImg,
  undercutImg,
  scissorCutImg,
  lowFadeImg,
  kidsCutImg,
  midFadeImg,
  pompadourImg,
  servicesScissorIcon,
} from '../assets/images'

// Image map for known local assets
const LOCAL_IMAGE_MAP = {
  'Taper Fade': taperFadeImg,
  'Buzz Cut': buzzCutImg,
  'Crew Cut': crewCutImg,
  'French Crop': frenchCropImg,
  'Undercut': undercutImg,
  'Beard Trim & Shave': scissorCutImg,
  'Beard Trim': scissorCutImg,
  'Hair Treatment & Wash': lowFadeImg,
  'Kids Haircut': kidsCutImg,
  'Mid Fade': midFadeImg,
  'Pompadour': pompadourImg,
  'Scissor Cut': scissorCutImg,
  'Hair Cut': taperFadeImg,
  'Hair & Beard Combo': crewCutImg,
  'Hair Color': lowFadeImg,
}

export const INITIAL_DEFAULT_SERVICES = [
  {
    id: 1,
    name: 'Taper Fade',
    category: 'Haircut',
    price: '₱250',
    price_value: 250,
    duration: '45 mins',
    status: 'Active',
    description: 'Clean fade with seamless blend on sides and back, scissor styled top.',
    image: taperFadeImg,
  },
  {
    id: 2,
    name: 'Buzz Cut',
    category: 'Haircut',
    price: '₱180',
    price_value: 180,
    duration: '30 mins',
    status: 'Active',
    description: 'Even length all over with clean edge lineup.',
    image: buzzCutImg,
  },
  {
    id: 3,
    name: 'Crew Cut',
    category: 'Haircut',
    price: '₱200',
    price_value: 200,
    duration: '35 mins',
    status: 'Active',
    description: 'Classic tapered short cut, styled neatly at the top.',
    image: crewCutImg,
  },
  {
    id: 4,
    name: 'French Crop',
    category: 'Haircut',
    price: '₱250',
    price_value: 250,
    duration: '40 mins',
    status: 'Active',
    description: 'Modern textured crop with blunt fringe and tapered fade sides.',
    image: frenchCropImg,
  },
  {
    id: 5,
    name: 'Undercut',
    category: 'Haircut',
    price: '₱250',
    price_value: 250,
    duration: '45 mins',
    status: 'Active',
    description: 'Short sides and back with distinct long top contrast.',
    image: undercutImg,
  },
  {
    id: 6,
    name: 'Beard Trim & Shave',
    category: 'Beard & Shave',
    price: '₱150',
    price_value: 150,
    duration: '25 mins',
    status: 'Active',
    description: 'Precision beard shaping and hot towel razor line detailing.',
    image: scissorCutImg,
  },
  {
    id: 7,
    name: 'Hair Treatment & Wash',
    category: 'Hair Care',
    price: '₱300',
    price_value: 300,
    duration: '50 mins',
    status: 'Inactive',
    description: 'Deep conditioning scalp wash with relaxing head massage.',
    image: lowFadeImg,
  },
]

const LOCAL_STORAGE_KEY = 'tb_services_data'
const SERVICES_CHANGE_EVENT = 'tb_services_changed'

// BroadcastChannel for cross-tab realtime synchronization if supported
let broadcastChannel = null
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('tb_services_channel')
  } catch {
    broadcastChannel = null
  }
}

const notifyServicesChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SERVICES_CHANGE_EVENT))
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'SERVICES_CHANGED', timestamp: Date.now() })
      } catch {
        // ignore
      }
    }
  }
}

const getLocalServices = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error reading local services:', err)
  }
  return null
}

const saveLocalServices = (services) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services))
    notifyServicesChanged()
  } catch (err) {
    console.error('Error saving local services:', err)
  }
}

export const parsePriceNumber = (priceVal) => {
  if (typeof priceVal === 'number') return priceVal
  if (!priceVal) return 0
  const cleaned = String(priceVal).replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export const formatPriceString = (val) => {
  if (typeof val === 'string' && (val.startsWith('₱') || val.startsWith('$'))) {
    return val
  }
  const num = parsePriceNumber(val)
  return `₱${num}`
}

export const resolveServiceImage = (service) => {
  if (service?.image_url && typeof service.image_url === 'string' && service.image_url.trim()) {
    return service.image_url
  }
  if (service?.imageUrl && typeof service.imageUrl === 'string' && service.imageUrl.trim()) {
    return service.imageUrl
  }
  if (service?.image) {
    return service.image
  }
  if (service?.name && LOCAL_IMAGE_MAP[service.name]) {
    return LOCAL_IMAGE_MAP[service.name]
  }
  return taperFadeImg || servicesScissorIcon
}

export const normalizeServiceRow = (row) => {
  const priceValue = row.price_value !== undefined && row.price_value !== null
    ? Number(row.price_value)
    : parsePriceNumber(row.price)

  const priceStr = row.price
    ? (row.price.startsWith('₱') || row.price.startsWith('$') ? row.price : `₱${row.price}`)
    : `₱${priceValue}`

  const img = resolveServiceImage(row)

  return {
    id: row.id,
    name: row.name || 'Unnamed Service',
    category: row.category || 'Haircut',
    price: priceStr,
    price_value: priceValue,
    priceValue: priceValue,
    duration: row.duration || '30 mins',
    description: row.description || '',
    desc: row.description || '',
    status: row.status || 'Active',
    image_url: row.image_url || '',
    imageUrl: row.image_url || '',
    image: img,
    created_at: row.created_at || new Date().toISOString(),
  }
}

/**
 * Fetch all services.
 * Tries Supabase first, falls back to localStorage, then defaults.
 */
export const fetchServices = async () => {
  try {
    let { data, error } = await supabase
      .from('services')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.warn('Supabase fetch error for services, falling back to local storage:', error.message)
      const local = getLocalServices()
      if (local && local.length > 0) {
        return local.map(normalizeServiceRow)
      }
      return INITIAL_DEFAULT_SERVICES.map(normalizeServiceRow)
    }

    // If table exists but is completely empty, seed it
    if (!data || data.length === 0) {
      try {
        const seedPayload = INITIAL_DEFAULT_SERVICES.map((s) => ({
          name: s.name,
          category: s.category,
          price: s.price,
          price_value: s.price_value,
          duration: s.duration,
          description: s.description,
          status: s.status,
        }))

        const { data: seeded, error: seedErr } = await supabase
          .from('services')
          .insert(seedPayload)
          .select()
          .order('id', { ascending: true })

        if (!seedErr && seeded && seeded.length > 0) {
          data = seeded
        } else {
          data = INITIAL_DEFAULT_SERVICES
        }
      } catch {
        data = INITIAL_DEFAULT_SERVICES
      }
    }

    const normalized = (data || []).map(normalizeServiceRow)
    saveLocalServices(normalized)
    return normalized
  } catch (err) {
    console.error('Failed to fetch services:', err)
    const local = getLocalServices()
    if (local && local.length > 0) {
      return local.map(normalizeServiceRow)
    }
    return INITIAL_DEFAULT_SERVICES.map(normalizeServiceRow)
  }
}

/**
 * Create a new service.
 */
export const createService = async (serviceData) => {
  const priceNum = parsePriceNumber(serviceData.price ?? serviceData.priceValue)
  const priceStr = formatPriceString(serviceData.price ?? priceNum)

  const dbPayload = {
    name: serviceData.name || 'New Service',
    category: serviceData.category || 'Haircut',
    price: priceStr,
    price_value: priceNum,
    duration: serviceData.duration || '30 mins',
    description: serviceData.description || serviceData.desc || '',
    status: serviceData.status || 'Active',
    image_url: serviceData.imageUrl || serviceData.image_url || '',
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .insert([dbPayload])
      .select()
      .single()

    if (error) {
      console.warn('Supabase create error for service, storing locally:', error.message)
      const localService = normalizeServiceRow({
        id: Date.now(),
        ...dbPayload,
      })
      const existing = getLocalServices() || INITIAL_DEFAULT_SERVICES.map(normalizeServiceRow)
      saveLocalServices([localService, ...existing])
      return localService
    }

    const created = normalizeServiceRow(data)
    const existing = getLocalServices() || []
    saveLocalServices([created, ...existing.filter((s) => s.id !== created.id)])
    return created
  } catch (err) {
    console.error('Failed to create service:', err)
    const localService = normalizeServiceRow({
      id: Date.now(),
      ...dbPayload,
    })
    const existing = getLocalServices() || INITIAL_DEFAULT_SERVICES.map(normalizeServiceRow)
    saveLocalServices([localService, ...existing])
    return localService
  }
}

/**
 * Update an existing service.
 */
export const updateService = async (id, updatedFields) => {
  const dbPayload = {}
  if (updatedFields.name !== undefined) dbPayload.name = updatedFields.name
  if (updatedFields.category !== undefined) dbPayload.category = updatedFields.category
  if (updatedFields.price !== undefined || updatedFields.priceValue !== undefined) {
    const pNum = parsePriceNumber(updatedFields.price ?? updatedFields.priceValue)
    dbPayload.price = formatPriceString(updatedFields.price ?? pNum)
    dbPayload.price_value = pNum
  }
  if (updatedFields.duration !== undefined) dbPayload.duration = updatedFields.duration
  if (updatedFields.description !== undefined) dbPayload.description = updatedFields.description
  if (updatedFields.desc !== undefined && updatedFields.description === undefined) {
    dbPayload.description = updatedFields.desc
  }
  if (updatedFields.status !== undefined) dbPayload.status = updatedFields.status
  if (updatedFields.imageUrl !== undefined) dbPayload.image_url = updatedFields.imageUrl
  if (updatedFields.image_url !== undefined) dbPayload.image_url = updatedFields.image_url

  try {
    const { data, error } = await supabase
      .from('services')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.warn('Supabase update service error, saving locally:', error.message)
    }

    const existing = getLocalServices() || INITIAL_DEFAULT_SERVICES.map(normalizeServiceRow)
    const updated = data
      ? normalizeServiceRow(data)
      : normalizeServiceRow({
          ...(existing.find((s) => s.id === id) || {}),
          ...dbPayload,
          id,
        })

    const nextList = existing.map((s) => (s.id === id ? { ...s, ...updated } : s))
    saveLocalServices(nextList)
    return updated
  } catch (err) {
    console.error('Failed to update service:', err)
    const existing = getLocalServices() || INITIAL_DEFAULT_SERVICES.map(normalizeServiceRow)
    const current = existing.find((s) => s.id === id) || { id }
    const updated = normalizeServiceRow({ ...current, ...dbPayload })
    saveLocalServices(existing.map((s) => (s.id === id ? updated : s)))
    return updated
  }
}

/**
 * Toggle or change service status ('Active' | 'Inactive').
 */
export const updateServiceStatus = async (id, status) => {
  return updateService(id, { status })
}

/**
 * Delete a service.
 */
export const deleteService = async (id) => {
  try {
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) {
      console.warn('Supabase delete service error:', error.message)
    }
  } catch (err) {
    console.error('Failed to delete service from Supabase:', err)
  }

  const existing = getLocalServices() || []
  const nextList = existing.filter((s) => s.id !== id)
  saveLocalServices(nextList)
}

/**
 * Real-time subscription to service changes.
 * Listens to Supabase Realtime postgres_changes AND local storage/custom events.
 *
 * @param {Function} onUpdate - callback function called whenever services change
 * @returns {Function} unsubscribe function
 */
export const subscribeToServices = (onUpdate) => {
  if (typeof onUpdate !== 'function') return () => {}

  // 1. Supabase Postgres Realtime Subscription (unique channel per subscriber)
  const channelId = `public:services_${Math.random().toString(36).slice(2, 9)}`
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'services' },
      async (payload) => {
        console.log('Realtime services change detected from Supabase:', payload)
        const updatedList = await fetchServices()
        onUpdate(updatedList)
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to Supabase real-time services channel (${channelId})`)
      }
    })

  // 2. Local DOM Event listener (for instant updates in same browser tab)
  const handleLocalChange = async () => {
    const local = getLocalServices()
    if (local && local.length > 0) {
      onUpdate(local)
    } else {
      const currentList = await fetchServices()
      onUpdate(currentList)
    }
  }

  // 3. Storage event listener (for cross-tab updates when running with localStorage fallback)
  const handleStorageChange = (e) => {
    if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue).map(normalizeServiceRow)
        onUpdate(parsed)
      } catch {
        // ignore
      }
    }
  }

  // 4. BroadcastChannel listener (for modern cross-tab broadcast)
  const handleBroadcast = async (e) => {
    if (e.data?.type === 'SERVICES_CHANGED') {
      const local = getLocalServices()
      if (local && local.length > 0) {
        onUpdate(local)
      } else {
        const currentList = await fetchServices()
        onUpdate(currentList)
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener(SERVICES_CHANGE_EVENT, handleLocalChange)
    window.addEventListener('storage', handleStorageChange)
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleBroadcast)
    }
  }

  return () => {
    supabase.removeChannel(channel)
    if (typeof window !== 'undefined') {
      window.removeEventListener(SERVICES_CHANGE_EVENT, handleLocalChange)
      window.removeEventListener('storage', handleStorageChange)
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleBroadcast)
      }
    }
  }
}
