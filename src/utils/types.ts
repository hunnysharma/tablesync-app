
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'inactive';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
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
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
}

export interface Order {
  id: string;
  tableId: string;
  table_number: number;
  items: OrderItem[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'upi';
}

export interface Bill {
  id: string;
  orderId: string;
  table_number: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'upi';
  createdAt: Date;
  paidAt?: Date;
}
