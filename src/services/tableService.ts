
import { supabase } from '@/lib/supabase';
import { Table } from '@/utils/types';

export async function fetchTables(): Promise<Table[]> {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .order('number');

  if (error) {
    console.error('Error fetching tables:', error);
    throw new Error(error.message);
  }

  return data.map(item => ({
    id: item.id,
    number: item.number,
    capacity: item.capacity,
    status: item.status as 'available' | 'occupied' | 'reserved' | 'inactive',
    currentOrderId: item.current_order_id || undefined
  }));
}

export async function addTable(table: Omit<Table, 'id'>): Promise<Table> {
  const { data, error } = await supabase
    .from('tables')
    .insert({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
      current_order_id: table.currentOrderId || null,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding table:', error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    number: data.number,
    capacity: data.capacity,
    status: data.status as 'available' | 'occupied' | 'reserved' | 'inactive',
    currentOrderId: data.current_order_id || undefined
  };
}

export async function updateTableStatus(
  id: string, 
  status: 'available' | 'occupied' | 'reserved' | 'inactive',
  currentOrderId?: string
): Promise<void> {
  const { error } = await supabase
    .from('tables')
    .update({ 
      status, 
      current_order_id: currentOrderId || null 
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating table status:', error);
    throw new Error(error.message);
  }
}
