
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { MenuItem, Category } from '@/utils/types';

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error as Error);
    return [];
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error as Error);
    return [];
  }
};
