
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Bill } from '@/utils/types';

export const fetchBills = async (): Promise<Bill[]> => {
  try {
    // First fetch bills
    const { data: bills, error: billsError } = await supabase
      .from('bills')
      .select('*');
    
    if (billsError) throw billsError;

    // Then fetch bill items separately
    const { data: billItems, error: itemsError } = await supabase
      .from('bills')
      .select('*');
      
    if (itemsError) throw itemsError;
    
    // Combine the data
    return (bills || []).map(bill => ({
      ...bill,
      items: billItems?.filter(item => item.bill_id === bill.id) || [],
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
    // First fetch the bill
    const { data: bill, error: billError } = await supabase
      .from('bills')
      .select('*')
      .eq('id', id)
      .single();
    
    if (billError) throw billError;
    if (!bill) return null;

    // Then fetch its items
    const { data: items, error: itemsError } = await supabase
      .from('bills')
      .select('*')
      .eq('bill_id', id);
    
    if (itemsError) throw itemsError;
    
    return {
      ...bill,
      items: items || [],
      createdAt: new Date(bill.created_at || Date.now()),
      paidAt: bill.paid_at ? new Date(bill.paid_at) : undefined,
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};
