
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Order, OrderItem } from '@/utils/types';

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
      menu_item_id: item.menuItemId,
      menu_item_name: item.menuItemName,
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
      .eq('id', orderDetails.tableId);
    
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
