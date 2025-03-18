
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Order } from '@/utils/types';

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
