import { createClient, Session, User } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // Persist session in localStorage
    autoRefreshToken: true,       // Auto-refresh access tokens
    detectSessionInUrl: true,     // Detect session from URL (OAuth callbacks)
    flowType: 'pkce'              // Use PKCE flow for enhanced security
  }
})

// Export types for convenience
export type { Session, User }
