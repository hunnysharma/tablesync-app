
import { supabase } from '@/lib/supabase';
import { MenuItem } from '@/utils/types';

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching menu items:', error);
    throw new Error(error.message);
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || undefined,
    price: item.price,
    categoryId: item.category_id,
    image: item.image || undefined,
    available: item.available
  }));
}

export async function addMenuItem(menuItem: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      name: menuItem.name,
      description: menuItem.description || null,
      price: menuItem.price,
      category_id: menuItem.categoryId,
      image: menuItem.image || null,
      available: menuItem.available,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding menu item:', error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    price: data.price,
    categoryId: data.category_id,
    image: data.image || undefined,
    available: data.available
  };
}

export async function updateMenuItemAvailability(id: string, available: boolean): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .update({ available })
    .eq('id', id);

  if (error) {
    console.error('Error updating menu item availability:', error);
    throw new Error(error.message);
  }
}
