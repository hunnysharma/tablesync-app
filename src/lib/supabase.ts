
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Use environment variables or fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yrictvhvyycafqolplhn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyaWN0dmh2eXljYWZxb2xwbGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzAxNjUsImV4cCI6MjA1NzQ0NjE2NX0.rxT3lmh8Phb37rkA4tp1zXwmZ3Cbj_yDOgNVHrMjYe4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: Error) => {
  console.error('Supabase error:', error);
  toast.error('An error occurred while fetching data');
  return null;
};
