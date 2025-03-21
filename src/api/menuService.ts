
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { MenuItem, Category } from '@/utils/types';
import { useAuth } from '@/contexts/AuthContext';

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const { currentCafe } = useAuth();
    
    if (!currentCafe) {
      console.error('No cafe selected');
      return [];
    }
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('cafe_id', currentCafe.id);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error as Error);
    return [];
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { currentCafe } = useAuth();
    
    if (!currentCafe) {
      console.error('No cafe selected');
      return [];
    }
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('cafe_id', currentCafe.id);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error as Error);
    return [];
  }
};

export const createMenuItem = async (itemData: Omit<MenuItem, 'id'>): Promise<MenuItem | null> => {
  try {
    const { currentUser, currentCafe } = useAuth();
    
    if (!currentCafe) {
      console.error('No cafe selected');
      return null;
    }
    
    const itemWithIds = {
      ...itemData,
      cafe_id: currentCafe.id,
      user_id: currentUser?.id
    };
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert([itemWithIds])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const updateMenuItem = async (id: string, itemData: Partial<MenuItem>): Promise<MenuItem | null> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(itemData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const deleteMenuItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleSupabaseError(error as Error);
    return false;
  }
};

export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category | null> => {
  try {
    const { currentUser, currentCafe } = useAuth();
    
    if (!currentCafe) {
      console.error('No cafe selected');
      return null;
    }
    
    const categoryWithIds = {
      ...categoryData,
      cafe_id: currentCafe.id,
      user_id: currentUser?.id
    };
    
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryWithIds])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};
