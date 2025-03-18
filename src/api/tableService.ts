
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Table } from '@/utils/types';

export const fetchTables = async (): Promise<Table[]> => {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error as Error);
    return [];
  }
};

export const fetchTable = async (id: string): Promise<Table | null> => {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};
