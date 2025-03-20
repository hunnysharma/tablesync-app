
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Bill, OrderItem } from '@/utils/types';

export const fetchBills = async (): Promise<Bill[]> => {
  try {
    // Fetch bills
    const { data: bills, error: billsError } = await supabase
      .from('bills')
      .select('*');
    
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
      orderId: bill.order_id,
      table_number: bill.table_number,
      subtotal: bill.subtotal,
      tax: bill.tax,
      total: bill.total,
      payment_status: bill.payment_status,
      paymentMethod: bill.payment_method,
      items: billItems?.filter(item => item.order_id === bill.order_id).map(item => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        menuItemName: item.menu_item_name,
        quantity: item.quantity,
        price: item.price || 0, // Ensure price is never undefined
        notes: item.notes,
        status: item.status
      })) || [],
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

    // Then fetch its items from order_items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', bill.order_id);
    
    if (itemsError) throw itemsError;
    
    return {
      ...bill,
      id: bill.id,
      orderId: bill.order_id,
      table_number: bill.table_number,
      subtotal: bill.subtotal,
      tax: bill.tax,
      total: bill.total,
      payment_status: bill.payment_status,
      paymentMethod: bill.payment_method,
      items: items?.map(item => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        menuItemName: item.menu_item_name,
        quantity: item.quantity,
        price: item.price || 0, // Ensure price is never undefined
        notes: item.notes,
        status: item.status
      })) || [],
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
    const updates: any = {};
    
    // Map from our interface to the database schema
    if (billData.payment_status !== undefined) updates.payment_status = billData.payment_status;
    if (billData.paymentMethod !== undefined) updates.payment_method = billData.paymentMethod;
    
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
      orderId: data.order_id,
      table_number: data.table_number,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      payment_status: data.payment_status,
      paymentMethod: data.payment_method,
      items: items?.map(item => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        menuItemName: item.menu_item_name,
        quantity: item.quantity,
        price: item.price || 0, // Ensure price is never undefined
        notes: item.notes,
        status: item.status
      })) || [],
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
    
    // Update order payment status to billed
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_status: 'billed' })
      .eq('id', orderId);
    
    if (updateError) throw updateError;
    
    const orderItems = order.items || [];
    const transformedItems = orderItems.map((item: any) => ({
      id: item.id,
      menuItemId: item.menu_item_id,
      menuItemName: item.menu_item_name,
      quantity: item.quantity,
      price: item.price || 0, // Ensure price is never undefined
      notes: item.notes,
      status: item.status
    }));
    
    return {
      ...bill,
      id: bill.id,
      orderId: bill.order_id,
      table_number: bill.table_number,
      subtotal: bill.subtotal,
      tax: bill.tax,
      total: bill.total,
      payment_status: bill.payment_status,
      items: transformedItems,
      createdAt: new Date(bill.created_at || Date.now()),
      paidAt: undefined,
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};
