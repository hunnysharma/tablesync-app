
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

export const createTable = async (tableData: Omit<Table, 'id'>): Promise<Table | null> => {
  try {
    const { data, error } = await supabase
      .from('tables')
      .insert([tableData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const updateTable = async (id: string, tableData: Partial<Table>): Promise<Table | null> => {
  try {
    const { data, error } = await supabase
      .from('tables')
      .update(tableData)
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

export const deleteTable = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleSupabaseError(error as Error);
    return false;
  }
};
