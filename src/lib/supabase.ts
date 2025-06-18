
import { createClient } from '@supabase/supabase-js'

// Use import.meta.env for Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nhavocnyyzziqvtyocyj.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oYXZvY255eXp6aXF2dHlvY3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzk4OTQsImV4cCI6MjA2NTc1NTg5NH0.PCC6C60fIXMIKibCnw3j7i7s5D0-U6b3_aTmSN8qiR8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
