
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid, otherwise warn in development
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your-supabase-url' || 
    supabaseAnonKey === 'your-supabase-anon-key') {
  console.warn('Supabase credentials missing or using placeholder values. Please set valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables. Using mock client for development.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: Error) => {
  console.error('Supabase error:', error);
  toast.error('An error occurred while fetching data');
  return null;
};
