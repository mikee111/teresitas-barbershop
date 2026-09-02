import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qxjpkojwjwxrutgiktdt.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1SHmoiu5u5aG2s2Epyu89Q_45TVQOBW'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default supabase
