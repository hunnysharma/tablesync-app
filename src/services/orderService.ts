
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';

export async function fetchOrders(): Promise<Order[]> {
  // First fetch all orders
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (orderError) {
    console.error('Error fetching orders:', orderError);
    throw new Error(orderError.message);
  }

  // Then fetch all order items for these orders
  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderData.map(order => order.id));

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    throw new Error(itemsError.message);
  }

  // Map the database records to our application types
  return orderData.map(order => {
    const orderItems = itemsData
      .filter(item => item.order_id === order.id)
      .map(item => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        menuItemName: item.menu_item_name,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes || undefined,
        status: item.status as 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
      }));

    return {
      id: order.id,
      tableId: order.table_id,
      tableNumber: order.table_number,
      items: orderItems,
      status: order.status as 'active' | 'completed' | 'cancelled',
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at),
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      paymentStatus: order.payment_status as 'pending' | 'paid',
      paymentMethod: order.payment_method as 'cash' | 'card' | 'upi' | undefined
    };
  });
}

export async function createOrder(
  tableId: string,
  tableNumber: number,
  items: Omit<OrderItem, 'id'>[],
  subtotal: number,
  tax: number,
  total: number
): Promise<Order> {
  // Start a Supabase transaction
  const now = new Date().toISOString();
  const orderId = uuidv4();
  
  // Create the order first
  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      table_id: tableId,
      table_number: tableNumber,
      status: 'active',
      created_at: now,
      updated_at: now,
      subtotal,
      tax,
      total,
      payment_status: 'pending'
    });

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error(orderError.message);
  }

  // Then create the order items
  const orderItems = items.map(item => ({
    id: uuidv4(),
    order_id: orderId,
    menu_item_id: item.menuItemId,
    menu_item_name: item.menuItemName,
    quantity: item.quantity,
    price: item.price,
    notes: item.notes || null,
    status: item.status,
    created_at: now
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw new Error(itemsError.message);
  }

  // Update the table status to occupied with this order
  const { error: tableError } = await supabase
    .from('tables')
    .update({ 
      status: 'occupied',
      current_order_id: orderId
    })
    .eq('id', tableId);

  if (tableError) {
    console.error('Error updating table status:', tableError);
    throw new Error(tableError.message);
  }

  // Return the created order
  return {
    id: orderId,
    tableId,
    tableNumber,
    items: items.map((item, index) => ({
      ...item,
      id: orderItems[index].id
    })),
    status: 'active',
    createdAt: new Date(now),
    updatedAt: new Date(now),
    subtotal,
    tax,
    total,
    paymentStatus: 'pending'
  };
}

export async function updateOrderItemStatus(
  id: string, 
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled'
): Promise<void> {
  const { error } = await supabase
    .from('order_items')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating order item status:', error);
    throw new Error(error.message);
  }
}
