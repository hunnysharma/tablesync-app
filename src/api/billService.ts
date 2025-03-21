
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Bill, OrderItem } from '@/utils/types';
import { useAuth } from '@/contexts/AuthContext';

export const fetchBills = async (): Promise<Bill[]> => {
  try {
    const { currentCafe } = useAuth();
    
    if (!currentCafe) {
      console.error('No cafe selected');
      return [];
    }
    
    // Fetch bills
    const { data: bills, error: billsError } = await supabase
      .from('bills')
      .select('*')
      .eq('cafe_id', currentCafe.id);
    
    if (billsError) throw billsError;

    // Fetch all bill items
    const { data: billItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', bills?.map(bill => bill.order_id) || []);
      
    if (itemsError) throw itemsError;
    
    // Map bills to our expected format
    return (bills || []).map(bill => ({
      ...bill,
      id: bill.id,
      order_id: bill.order_id,
      table_number: bill.table_number,
      subtotal: bill.subtotal,
      tax: bill.tax,
      total: bill.total,
      payment_status: bill.payment_status,
      payment_method: bill.payment_method,
      items: billItems?.filter(item => item.order_id === bill.order_id).map(item => ({
        id: item.id,
        menu_item_id: item.menu_item_id,
        menu_item_name: item.menu_item_name,
        quantity: item.quantity,
        price: item.price || 0, // Ensure price is never undefined
        notes: item.notes,
        status: item.status
      })) || [],
      createdAt: new Date(bill.created_at || Date.now()),
      paidAt: bill.paid_at ? new Date(bill.paid_at) : undefined,
      cafe_id: bill.cafe_id,
      user_id: bill.user_id
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

    // Then fetch its items from order_items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', bill.order_id);
    
    if (itemsError) throw itemsError;
    
    return {
      ...bill,
      id: bill.id,
      order_id: bill.order_id,
      table_number: bill.table_number,
      subtotal: bill.subtotal,
      tax: bill.tax,
      total: bill.total,
      payment_status: bill.payment_status,
      payment_method: bill.payment_method,
      items: items?.map(item => ({
        id: item.id,
        menu_item_id: item.menu_item_id,
        menu_item_name: item.menu_item_name,
        quantity: item.quantity,
        price: item.price || 0, // Ensure price is never undefined
        notes: item.notes,
        status: item.status
      })) || [],
      createdAt: new Date(bill.created_at || Date.now()),
      paidAt: bill.paid_at ? new Date(bill.paid_at) : undefined,
      cafe_id: bill.cafe_id,
      user_id: bill.user_id
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const updateBill = async (id: string, billData: Partial<Bill>): Promise<Bill | null> => {
  try {
    const updates: any = {};
    
    // Map from our interface to the database schema
    if (billData.payment_status !== undefined) updates.payment_status = billData.payment_status;
    if (billData.payment_method !== undefined) updates.payment_method = billData.payment_method;
    
    // Add updated_at and paid_at if relevant
    updates.updated_at = new Date().toISOString();
    if (billData.payment_status === 'paid' && !billData.paidAt) {
      updates.paid_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Fetch the bill items after update
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', data.order_id);
      
    if (itemsError) throw itemsError;
    
    return {
      ...data,
      id: data.id,
      order_id: data.order_id,
      table_number: data.table_number,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      payment_status: data.payment_status,
      payment_method: data.payment_method,
      items: items?.map(item => ({
        id: item.id,
        menu_item_id: item.menu_item_id,
        menu_item_name: item.menu_item_name,
        quantity: item.quantity,
        price: item.price || 0, // Ensure price is never undefined
        notes: item.notes,
        status: item.status
      })) || [],
      createdAt: new Date(data.created_at || Date.now()),
      paidAt: data.paid_at ? new Date(data.paid_at) : undefined,
      cafe_id: data.cafe_id,
      user_id: data.user_id
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const createBill = async (orderId: string): Promise<Bill | null> => {
  try {
    const { currentUser, currentCafe } = useAuth();
    
    if (!currentCafe) {
      console.error('No cafe selected');
      return null;
    }
    
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
        cafe_id: currentCafe.id,
        user_id: currentUser?.id
      }])
      .select()
      .single();
    
    if (billError) throw billError;
    if (!bill) throw new Error('Failed to create bill');
    
    // Update order payment status to billed
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_status: 'billed' })
      .eq('id', orderId);
    
    if (updateError) throw updateError;
    
    const orderItems = order.items || [];
    const transformedItems = orderItems.map((item: any) => ({
      id: item.id,
      menu_item_id: item.menu_item_id,
      menu_item_name: item.menu_item_name,
      quantity: item.quantity,
      price: item.price || 0, // Ensure price is never undefined
      notes: item.notes,
      status: item.status
    }));
    
    return {
      ...bill,
      id: bill.id,
      order_id: bill.order_id,
      table_number: bill.table_number,
      subtotal: bill.subtotal,
      tax: bill.tax,
      total: bill.total,
      payment_status: bill.payment_status,
      items: transformedItems,
      createdAt: new Date(bill.created_at || Date.now()),
      paidAt: undefined,
      cafe_id: bill.cafe_id,
      user_id: bill.user_id
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};
