
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'inactive';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  current_order_id?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  image?: string;
  available: boolean;
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
  createdAt: Date;
  updatedAt: Date;
  subtotal: number;
  tax: number;
  total: number;
  payment_status: 'pending' | 'paid' | 'billed';
  payment_method?: 'cash' | 'card' | 'upi';
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
  createdAt: Date;
  paidAt?: Date;
}
