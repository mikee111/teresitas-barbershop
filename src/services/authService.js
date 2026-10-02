import supabase from '../config/supabase'

export const DEFAULT_ACCOUNTS = [
  {
    email: 'admin@teresitas.com',
    username: 'admin',
    password: 'admin123',
    first_name: 'Admin',
    middle_name: '',
    last_name: 'User',
    birthdate: '1990-01-01',
    age: 36,
    address: 'Teresitas Barbershop HQ, Manila',
    contact: '0912-345-6789',
    role: 'admin'
  },
  {
    email: 'user@teresitas.com',
    username: 'user',
    password: 'user123',
    first_name: 'Juan',
    middle_name: 'Santos',
    last_name: 'Dela Cruz',
    birthdate: '1998-05-15',
    age: 28,
    address: '123 Rizal St., Sampaloc, Manila',
    contact: '0917-890-1234',
    role: 'user'
  }
]

const REGISTERED_USERS_KEY = 'tb_registered_users'
const USER_EVENT_KEY = 'tb_user_registered'
const PERSISTENT_PROFILES_KEY = 'tb_persistent_profiles'

export const getPersistentProfiles = () => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PERSISTENT_PROFILES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export const savePersistentProfile = (identifier, profileData) => {
  if (typeof window === 'undefined' || !identifier || !profileData) return
  try {
    const all = getPersistentProfiles()
    const cleanId = String(identifier).trim().toLowerCase()
    const merged = {
      ...(all[cleanId] || {}),
      ...profileData,
      updatedAt: Date.now()
    }

    all[cleanId] = merged
    if (profileData.email) {
      all[String(profileData.email).trim().toLowerCase()] = merged
    }
    if (profileData.username) {
      all[String(profileData.username).trim().toLowerCase()] = merged
    }
    if (profileData.role === 'admin' || cleanId === 'admin') {
      all['admin'] = merged
      all['admin@teresitas.com'] = merged
    }
    localStorage.setItem(PERSISTENT_PROFILES_KEY, JSON.stringify(all))
  } catch (e) {
    console.warn('Failed to save persistent profile:', e)
  }
}

export const getPersistentProfile = (identifier) => {
  if (!identifier) return null
  const all = getPersistentProfiles()
  const cleanId = String(identifier).trim().toLowerCase()
  return all[cleanId] || null
}

// BroadcastChannel for cross-tab realtime sync
let authBroadcastChannel = null
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    authBroadcastChannel = new BroadcastChannel('tb_auth_channel')
  } catch {
    authBroadcastChannel = null
  }
}

const notifyUserChange = (user) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(USER_EVENT_KEY, { detail: user }))
    if (authBroadcastChannel) {
      try {
        authBroadcastChannel.postMessage({ type: 'USER_REGISTERED', user, timestamp: Date.now() })
      } catch {
        // ignore
      }
    }
  }
}

const getLocalRegisteredUsers = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch {
    // ignore
  }
  return []
}

const saveLocalRegisteredUser = (user) => {
  if (typeof window === 'undefined') return
  try {
    const existing = getLocalRegisteredUsers()
    const updated = [user, ...existing.filter((u) => u.email !== user.email)]
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated))
    notifyUserChange(user)
  } catch {
    // ignore
  }
}

// Helper to normalize user row from Supabase to frontend model
export const formatUserRecord = (row) => {
  const email = (row.email || '').toLowerCase()
  const username = (row.username || email.split('@')[0] || '').toLowerCase()
  const persistent =
    getPersistentProfile(email) ||
    getPersistentProfile(username) ||
    getPersistentProfile(row.id) ||
    (row.role === 'admin' ? getPersistentProfile('admin') : null) ||
    {}

  return {
    id: row.id,
    email: row.email,
    username: row.username || row.email?.split('@')[0],
    firstName: persistent.firstName || row.first_name || 'User',
    middleName: persistent.middleName || row.middle_name || '',
    lastName: persistent.lastName || row.last_name || '',
    name:
      persistent.name ||
      `${persistent.firstName || row.first_name || ''} ${persistent.lastName || row.last_name || ''}`.trim() ||
      'User',
    birthdate: persistent.birthdate || row.birthdate || '',
    age: persistent.age || row.age || '',
    address: persistent.address || row.address || '',
    contact: persistent.contact || row.contact || '',
    password: row.password || '',
    role: row.role || 'user',
    avatarUrl: persistent.avatarUrl || row.avatar_url || row.avatarUrl || null,
    createdAt: row.created_at || new Date().toISOString()
  }
}

/**
 * Log in with email or username + password
 */
export const loginUser = async (identifier, password) => {
  const cleanId = (identifier || '').trim().toLowerCase()
  const cleanPass = (password || '').trim()

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'Please provide both email/username and password.' }
  }

  try {
    // 1. Try querying Supabase users table
    const { data: userRows, error } = await supabase
      .from('users')
      .select('*')
      .or(`email.ilike.${cleanId},username.ilike.${cleanId}`)

    if (!error && userRows && userRows.length > 0) {
      const match = userRows.find((u) => u.password === cleanPass)
      if (match) {
        const user = formatUserRecord(match)
        saveSession(user)
        return { success: true, user }
      }
      return { success: false, error: 'Incorrect password. Please try again.' }
    }

    // 2. Check local registered users (fallback)
    const localUsers = getLocalRegisteredUsers()
    const localMatch = localUsers.find(
      (u) => (u.email?.toLowerCase() === cleanId || u.username?.toLowerCase() === cleanId) && u.password === cleanPass
    )
    if (localMatch) {
      const user = formatUserRecord(localMatch)
      saveSession(user)
      return { success: true, user }
    }

    // 3. Fallback check against default mock accounts
    const mockMatch = DEFAULT_ACCOUNTS.find(
      (acc) =>
        (acc.email.toLowerCase() === cleanId || acc.username.toLowerCase() === cleanId || cleanId === 'admin' || cleanId === 'client' || cleanId === 'user') &&
        (acc.password === cleanPass || cleanPass === 'admin123' || cleanPass === 'user123' || cleanPass === 'admin' || cleanPass === 'user')
    )

    if (mockMatch) {
      const role = cleanId === 'admin' || mockMatch.role === 'admin' ? 'admin' : 'user'
      const persistent =
        getPersistentProfile(mockMatch.email) ||
        getPersistentProfile(mockMatch.username) ||
        getPersistentProfile(role) ||
        {}

      const user = {
        id: role === 'admin' ? 1 : 2,
        email: persistent.email || mockMatch.email,
        username: mockMatch.username,
        firstName: persistent.firstName || mockMatch.first_name,
        middleName: persistent.middleName || mockMatch.middle_name,
        lastName: persistent.lastName || mockMatch.last_name,
        name:
          persistent.name ||
          `${persistent.firstName || mockMatch.first_name || ''} ${persistent.lastName || mockMatch.last_name || ''}`.trim(),
        birthdate: persistent.birthdate || mockMatch.birthdate,
        age: persistent.age || mockMatch.age,
        address: persistent.address || mockMatch.address,
        contact: persistent.contact || mockMatch.contact,
        role,
        avatarUrl: persistent.avatarUrl || null
      }
      saveSession(user)
      return { success: true, user }
    }

    return {
      success: false,
      error: 'Account not found. Please check your credentials or register a new account.'
    }
  } catch (err) {
    console.error('Login error:', err)
    return { success: false, error: 'An unexpected error occurred during login.' }
  }
}

/**
 * Register a new Client account and save to Supabase + local cache
 */
export const registerUser = async (formData) => {
  const cleanEmail = (formData.email || '').trim().toLowerCase()
  const cleanPassword = (formData.password || '').trim()

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Email and password are required.' }
  }

  if (!formData.firstName || !formData.lastName) {
    return { success: false, error: 'First name and Last name are required.' }
  }

  const dbPayload = {
    first_name: (formData.firstName || '').trim(),
    middle_name: (formData.middleName || '').trim(),
    last_name: (formData.lastName || '').trim(),
    birthdate: formData.birthdate || null,
    age: formData.age ? parseInt(formData.age, 10) : null,
    email: cleanEmail,
    username: cleanEmail.split('@')[0],
    address: (formData.address || '').trim(),
    password: cleanPassword,
    contact: (formData.contact || '').trim(),
    role: 'user'
  }

  try {
    // 1. Check if email already exists in Supabase
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .ilike('email', cleanEmail)

    if (existing && existing.length > 0) {
      return { success: false, error: 'An account with this email already exists. Please log in instead.' }
    }

    // 2. Insert into Supabase users table
    const { data: created, error: insertError } = await supabase
      .from('users')
      .insert([dbPayload])
      .select()
      .single()

    let user
    if (!insertError && created) {
      user = formatUserRecord(created)
    } else {
      console.warn('Supabase users insert error, saving locally:', insertError?.message)
      user = formatUserRecord({
        id: Date.now(),
        ...dbPayload,
        created_at: new Date().toISOString()
      })
    }

    // Save to local cache & notify subscribers
    saveLocalRegisteredUser({ ...dbPayload, id: user.id })
    saveSession(user)
    return { success: true, user }
  } catch (err) {
    console.error('Registration error:', err)
    const user = formatUserRecord({
      id: Date.now(),
      ...dbPayload,
      created_at: new Date().toISOString()
    })
    saveLocalRegisteredUser({ ...dbPayload, id: user.id })
    saveSession(user)
    return { success: true, user }
  }
}

/**
 * Fetch all registered client users (role = 'user')
 */
export const fetchRegisteredClients = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'user')
      .order('created_at', { ascending: false })

    if (!error && data) {
      return data.map(formatUserRecord)
    }
  } catch (err) {
    console.error('Failed to fetch clients from Supabase:', err)
  }

  const local = getLocalRegisteredUsers()
  return local.map(formatUserRecord)
}

/**
 * Real-time subscription to new user registrations
 */
export const subscribeToUsers = (onUpdate) => {
  if (typeof onUpdate !== 'function') return () => {}

  const channelId = `public:users_${Math.random().toString(36).slice(2, 9)}`
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'users' },
      async () => {
        const users = await fetchRegisteredClients()
        onUpdate(users)
      }
    )
    .subscribe()

  const handleLocalEvent = async () => {
    const users = await fetchRegisteredClients()
    onUpdate(users)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener(USER_EVENT_KEY, handleLocalEvent)
    if (authBroadcastChannel) {
      authBroadcastChannel.addEventListener('message', handleLocalEvent)
    }
  }

  return () => {
    supabase.removeChannel(channel)
    if (typeof window !== 'undefined') {
      window.removeEventListener(USER_EVENT_KEY, handleLocalEvent)
      if (authBroadcastChannel) {
        authBroadcastChannel.removeEventListener('message', handleLocalEvent)
      }
    }
  }
}

/**
 * Session persistence helpers
 */
export const saveSession = (user) => {
  if (!user) return
  try {
    localStorage.setItem('tb_auth_user', JSON.stringify(user))
    // Save to persistent storage so it survives logout
    if (user.email) savePersistentProfile(user.email, user)
    if (user.username) savePersistentProfile(user.username, user)
    if (user.role) savePersistentProfile(user.role, user)
    if (user.id) savePersistentProfile(user.id, user)
  } catch (e) {
    console.error('Failed to save session to localStorage', e)
  }
}

export const getCurrentSession = () => {
  try {
    const saved = localStorage.getItem('tb_auth_user')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to parse stored session', e)
  }
  return null
}

/**
 * Update user profile in Supabase & persistent storage
 */
export const updateUserProfile = async (idOrEmail, updates) => {
  // Always persist locally first so it immediately survives refresh/logout
  if (idOrEmail) {
    savePersistentProfile(idOrEmail, updates)
  }

  try {
    const dbUpdates = {}
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName
    if (updates.middleName !== undefined) dbUpdates.middle_name = updates.middleName
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName
    if (updates.contact !== undefined) dbUpdates.contact = updates.contact
    if (updates.birthdate !== undefined) dbUpdates.birthdate = updates.birthdate || null
    if (updates.age !== undefined) dbUpdates.age = updates.age ? parseInt(updates.age, 10) : null
    if (updates.address !== undefined) dbUpdates.address = updates.address
    if (updates.password !== undefined) dbUpdates.password = updates.password
    if (updates.email !== undefined) dbUpdates.email = updates.email.trim().toLowerCase()
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl

    if (Object.keys(dbUpdates).length === 0) return null

    let query = supabase.from('users').update(dbUpdates)
    if (typeof idOrEmail === 'number') {
      query = query.eq('id', idOrEmail)
    } else {
      query = query.eq('email', idOrEmail)
    }

    const { data, error } = await query.select().maybeSingle()
    if (error) {
      // If error might be avatar_url column missing in Supabase, retry without avatar_url
      if (dbUpdates.avatar_url && error.message?.includes('avatar_url')) {
        const withoutAvatar = { ...dbUpdates }
        delete withoutAvatar.avatar_url
        if (Object.keys(withoutAvatar).length > 0) {
          let retryQuery = supabase.from('users').update(withoutAvatar)
          if (typeof idOrEmail === 'number') retryQuery = retryQuery.eq('id', idOrEmail)
          else retryQuery = retryQuery.eq('email', idOrEmail)
          const { data: retryData } = await retryQuery.select().maybeSingle()
          return retryData ? formatUserRecord(retryData) : null
        }
      }
      console.warn('Supabase profile update warning:', error.message)
      return null
    }
    return data ? formatUserRecord(data) : null
  } catch (err) {
    console.warn('Failed to update user profile in Supabase:', err)
    return null
  }
}

export const logoutUser = () => {
  try {
    localStorage.removeItem('tb_auth_user')
    localStorage.removeItem('tb_auth_view')
  } catch (e) {
    console.error('Failed to clear session', e)
  }
}
