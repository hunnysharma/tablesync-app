
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Try to get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock Supabase client if credentials are missing
// This allows the app to load even without proper credentials
let supabase: ReturnType<typeof createClient<Database>>;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables. ' +
    'Using mock client for development.'
  );
  
  // Create a mock client that returns empty data
  supabase = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: {}, error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: {}, error: null }),
        }),
      }),
    }),
  } as any;
} else {
  // Create a real Supabase client if credentials are available
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export { supabase };
