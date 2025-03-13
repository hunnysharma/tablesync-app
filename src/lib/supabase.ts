
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Try to get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock Supabase client if credentials are missing
// This allows the app to load even without proper credentials
let supabase: ReturnType<typeof createClient<Database>>;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn(
    'Supabase credentials missing or using placeholder values. Please set valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables. ' +
    'Using mock client for development.'
  );
  
  // Create a more comprehensive mock client that provides better error handling
  supabase = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: {}, error: null }),
      }),
      insert: () => Promise.resolve({ 
        data: [],
        error: new Error('Cannot perform database operations with mock client. Please configure valid Supabase credentials.') 
      }),
      update: () => Promise.resolve({ 
        data: [],
        error: new Error('Cannot perform database operations with mock client. Please configure valid Supabase credentials.') 
      }),
      eq: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  } as any;
} else {
  // Create a real Supabase client if credentials are available
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    // Fallback to mock client if initialization fails
    supabase = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: {}, error: null }),
        }),
        insert: () => Promise.resolve({ 
          data: [],
          error: new Error('Failed to initialize Supabase client. Please check your credentials.') 
        }),
        update: () => Promise.resolve({ 
          data: [],
          error: new Error('Failed to initialize Supabase client. Please check your credentials.') 
        }),
        eq: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    } as any;
  }
}

export { supabase };
