
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Cafe, User } from '@/utils/authTypes';
import { toast } from 'sonner';

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch user profile with cafe information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, cafe_id, role, created_at, cafes(cafe_id, name, address, logo, created_at)')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    // Store the user and cafe data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('currentCafe', JSON.stringify(userData.cafes));
    
    toast.success('Login successful!');
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Invalid email or password');
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentCafe');
    
    toast.success('Logged out successfully');
  } catch (error) {
    handleSupabaseError(error as Error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // First check if we have the user in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // Otherwise check with Supabase
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!data.user) return null;

    // Fetch user profile with cafe information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, cafe_id, role, created_at, cafes(cafe_id, name, address, logo, created_at)')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;
    
    // Store user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('currentCafe', JSON.stringify(userData.cafes));
    
    return userData;
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const getCurrentCafe = async (): Promise<Cafe | null> => {
  try {
    // First check if we have the cafe in localStorage
    const storedCafe = localStorage.getItem('currentCafe');
    if (storedCafe) {
      return JSON.parse(storedCafe);
    }

    // If not in localStorage, get the current user and then the cafe
    const user = await getCurrentUser();
    if (!user) return null;

    // Fetch cafe information
    const { data: cafeData, error: cafeError } = await supabase
      .from('cafes')
      .select('*')
      .eq('cafe_id', user.cafe_id)
      .single();

    if (cafeError) throw cafeError;
    
    // Store cafe in localStorage
    localStorage.setItem('currentCafe', JSON.stringify(cafeData));
    
    return cafeData;
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const registerCafe = async (cafeData: Partial<Cafe>, userData: { email: string, password: string, role: 'admin' }): Promise<{ cafe: Cafe | null, user: User | null }> => {
  try {
    // 1. Create cafe
    const { data: newCafe, error: cafeError } = await supabase
      .from('cafes')
      .insert([cafeData])
      .select()
      .single();
    
    if (cafeError) throw cafeError;
    
    // 2. Create user auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    if (authError) throw authError;
    
    // 3. Create user profile linked to cafe
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([{
        id: authData.user?.id,
        email: userData.email,
        cafe_id: newCafe.id,
        role: userData.role
      }])
      .select()
      .single();
    
    if (userError) throw userError;
    
    toast.success('Cafe registered successfully!');
    return { cafe: newCafe, user: newUser };
  } catch (error) {
    handleSupabaseError(error as Error);
    return { cafe: null, user: null };
  }
};
