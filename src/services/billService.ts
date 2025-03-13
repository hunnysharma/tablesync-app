
import { supabase } from '@/lib/supabase';
import { Bill, OrderItem } from '@/utils/types';
import { v4 as uuidv4 } from 'uuid';

export async function fetchBills(): Promise<Bill[]> {
  // First fetch all bills
  const { data: billData, error: billError } = await supabase
    .from('bills')
    .select('*')
    .order('created_at', { ascending: false });

  if (billError) {
    console.error('Error fetching bills:', billError);
    throw new Error(billError.message);
  }

  // Then fetch all order items for these bills
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .in('id', billData.map(bill => bill.order_id));

  if (orderError) {
    console.error('Error fetching related orders:', orderError);
    throw new Error(orderError.message);
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderData.map(order => order.id));

  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    throw new Error(itemsError.message);
  }

  // Map the database records to our application types
  return billData.map(bill => {
    const orderItems = itemsData
      .filter(item => item.order_id === bill.order_id)
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
      id: bill.id,
      orderId: bill.order_id,
      tableNumber: bill.table_number,
      items: orderItems,
      subtotal: bill.subtotal,
      tax: bill.tax,
      total: bill.total,
      paymentStatus: bill.payment_status as 'pending' | 'paid',
      paymentMethod: bill.payment_method as 'cash' | 'card' | 'upi' | undefined,
      createdAt: new Date(bill.created_at),
      paidAt: bill.paid_at ? new Date(bill.paid_at) : undefined
    };
  });
}

export async function createBill(
  orderId: string,
  tableNumber: number,
  items: OrderItem[],
  subtotal: number,
  tax: number,
  total: number
): Promise<Bill> {
  const now = new Date().toISOString();
  const billId = uuidv4();
  
  const { error } = await supabase
    .from('bills')
    .insert({
      id: billId,
      order_id: orderId,
      table_number: tableNumber,
      subtotal,
      tax,
      total,
      payment_status: 'pending',
      created_at: now
    });

  if (error) {
    console.error('Error creating bill:', error);
    throw new Error(error.message);
  }

  return {
    id: billId,
    orderId,
    tableNumber,
    items,
    subtotal,
    tax,
    total,
    paymentStatus: 'pending',
    createdAt: new Date(now)
  };
}

export async function updateBillPayment(
  id: string,
  paymentMethod: 'cash' | 'card' | 'upi'
): Promise<void> {
  const now = new Date().toISOString();
  
  const { error } = await supabase
    .from('bills')
    .update({ 
      payment_status: 'paid',
      payment_method: paymentMethod,
      paid_at: now
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating bill payment:', error);
    throw new Error(error.message);
  }
}
