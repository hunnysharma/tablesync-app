
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'inactive';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  current_order_id?: string;
  cafe_id: string;
  user_id?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  cafe_id: string;
  user_id?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  price_half: number;
  price_full: number;
  category_id: string;
  image?: string;
  available: boolean;
  cafe_id: string;
  user_id?: string;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
}

export interface Order {
  id: string;
  table_id: string;
  table_number: number;
  items: OrderItem[];
  status: 'active' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  subtotal: number;
  tax: number;
  total: number;
  payment_status: 'pending' | 'paid';
  payment_method?: 'cash' | 'card' | 'upi';
  cafe_id: string;
  user_id?: string;
}

export interface Bill {
  id: string;
  order_id: string;
  table_number: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment_status: 'pending' | 'paid';
  payment_method?: 'cash' | 'card' | 'upi';
  created_at: Date;
  paid_at?: Date;
  cafe_id: string;
  user_id?: string;
}
