
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

export const updateBill = async (id: string, billData: Partial<Bill>): Promise<Bill | null> => {
  try {
    const updates: any = {
      ...billData,
      updated_at: new Date().toISOString(),
    };
    
    // Add paid_at if marking as paid
    if (billData.paymentStatus === 'paid' && !billData.paidAt) {
      updates.paid_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      items: [], // We don't have items here, would need to fetch separately if needed
      createdAt: new Date(data.created_at || Date.now()),
      paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const createBill = async (orderId: string): Promise<Bill | null> => {
  try {
    // First fetch the order to get its details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();
    
    if (orderError) throw orderError;
    if (!order) throw new Error('Order not found');
    
    // Create the bill
    const { data: bill, error: billError } = await supabase
      .from('bills')
      .insert([{
        order_id: orderId,
        table_number: order.table_number,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (billError) throw billError;
    if (!bill) throw new Error('Failed to create bill');
    
    // Update order payment status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_status: 'billed' })
      .eq('id', orderId);
    
    if (updateError) throw updateError;
    
    return {
      ...bill,
      items: order.items || [],
      createdAt: new Date(bill.created_at || Date.now()),
      paidAt: undefined,
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};
