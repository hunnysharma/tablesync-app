
import { supabase } from '@/lib/supabase';
import { Category } from '@/utils/types';

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message);
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || undefined
  }));
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: category.name,
      description: category.description || null,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding category:', error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined
  };
}
