
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Bill } from '@/utils/types';

export const fetchBills = async (): Promise<Bill[]> => {
  try {
    const { data, error } = await supabase
      .from('bills')
      .select('*, items:bill_items(*)');
    
    if (error) throw error;
    
    // Transform data to match the expected format
    return (data || []).map(bill => ({
      ...bill,
      createdAt: new Date(bill.created_at || Date.now()),
      paidAt: bill.paid_at ? new Date(bill.paid_at) : undefined,
    }));
  } catch (error) {
    handleSupabaseError(error as Error);
    return [];
  }
};

export const fetchBill = async (id: string): Promise<Bill | null> => {
  try {
    const { data, error } = await supabase
      .from('bills')
      .select('*, items:bill_items(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      createdAt: new Date(data.created_at || Date.now()),
      paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};
