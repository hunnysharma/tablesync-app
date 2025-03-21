
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Order, OrderItem } from '@/utils/types';
import { createBill } from './billService';

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)');
    
    if (error) throw error;
    
    // Transform data to match the expected format
    return (data || []).map(order => ({
      ...order,
      createdAt: new Date(order.created_at || Date.now()),
      updatedAt: new Date(order.updated_at || Date.now()),
    }));
  } catch (error) {
    handleSupabaseError(error as Error);
    return [];
  }
};

export const fetchOrder = async (id: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> => {
  try {
    const { items, ...orderDetails } = orderData;
    
    // First create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        ...orderDetails,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    if (!order) throw new Error('Failed to create order');
    
    // Then create the order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      menu_item_name: item.menu_item_name,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes || null,
      status: item.status
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // Update table status
    const { error: tableError } = await supabase
      .from('tables')
      .update({ 
        status: 'occupied',
        current_order_id: order.id,
      })
      .eq('id', orderDetails.table_id);
    
    if (tableError) throw tableError;
    
    // Return the complete order
    return {
      ...order,
      items,
      createdAt: new Date(order.created_at || Date.now()),
      updatedAt: new Date(order.updated_at || Date.now()),
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order | null> => {
  try {
    // Update the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        ...orderData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, items:order_items(*)')
      .single();
    
    if (orderError) throw orderError;
    
    if (!order) return null;
    
    // If order is marked as completed, create a bill
    if (orderData.status === 'completed') {
      // Create a bill
      await createBill(id);
      
      // Make the table available again
      const { error: tableError } = await supabase
        .from('tables')
        .update({ 
          status: 'available',
          current_order_id: null,
        })
        .eq('id', order.table_id);
      
      if (tableError) throw tableError;
    }
    
    return {
      ...order,
      createdAt: new Date(order.created_at || Date.now()),
      updatedAt: new Date(order.updated_at || Date.now()),
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};

export const updateOrderItemStatus = async (
  itemId: string, 
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
): Promise<OrderItem | null> => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .update({ status })
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      menu_item_id: data.menu_item_id,
      menu_item_name: data.menu_item_name,
      quantity: data.quantity,
      price: data.price || 0,
      notes: data.notes || undefined,
      status: data.status,
    };
  } catch (error) {
    handleSupabaseError(error as Error);
    return null;
  }
};
