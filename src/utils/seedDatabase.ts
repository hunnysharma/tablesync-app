
import { supabase } from '@/lib/supabase';
import { tables, categories, menuItems, orders, bills } from './dummyData';
import { toast } from 'sonner';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding process...');
    
    // Insert tables
    const { data: tablesData, error: tablesError } = await supabase.from('tables').insert(
      tables.map(table => ({
        id: table.id,
        number: table.number,
        capacity: table.capacity,
        status: table.status,
        current_order_id: table.currentOrderId || null,
        created_at: new Date().toISOString()
      }))
    );
    
    if (tablesError) {
      console.error('Error seeding tables:', tablesError);
      throw new Error(`Error seeding tables: ${tablesError.message}`);
    }
    
    console.log('Tables seeded successfully');
    
    // Insert categories
    const { data: categoriesData, error: categoriesError } = await supabase.from('categories').insert(
      categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || null,
        created_at: new Date().toISOString()
      }))
    );
    
    if (categoriesError) {
      console.error('Error seeding categories:', categoriesError);
      throw new Error(`Error seeding categories: ${categoriesError.message}`);
    }
    
    console.log('Categories seeded successfully');
    
    // Insert menu items
    const { data: menuItemsData, error: menuItemsError } = await supabase.from('menu_items').insert(
      menuItems.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || null,
        price: item.price,
        category_id: item.categoryId,
        image: item.image || null,
        available: item.available,
        created_at: new Date().toISOString()
      }))
    );
    
    if (menuItemsError) {
      console.error('Error seeding menu items:', menuItemsError);
      throw new Error(`Error seeding menu items: ${menuItemsError.message}`);
    }
    
    console.log('Menu items seeded successfully');
    
    // Insert orders one by one
    for (const order of orders) {
      console.log(`Seeding order: ${order.id}`);
      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        id: order.id,
        table_id: order.tableId,
        table_number: order.tableNumber,
        status: order.status,
        created_at: order.createdAt.toISOString(),
        updated_at: order.updatedAt.toISOString(),
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        payment_status: order.paymentStatus,
        payment_method: order.paymentMethod || null
      });
      
      if (orderError) {
        console.error('Error seeding order:', orderError);
        throw new Error(`Error seeding order: ${orderError.message}`);
      }
      
      // Insert order items for each order
      const { data: orderItemsData, error: orderItemsError } = await supabase.from('order_items').insert(
        order.items.map(item => ({
          id: item.id,
          order_id: order.id,
          menu_item_id: item.menuItemId,
          menu_item_name: item.menuItemName,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || null,
          status: item.status,
          created_at: new Date().toISOString()
        }))
      );
      
      if (orderItemsError) {
        console.error('Error seeding order items:', orderItemsError);
        throw new Error(`Error seeding order items: ${orderItemsError.message}`);
      }
    }
    
    console.log('Orders seeded successfully');
    
    // Insert bills
    for (const bill of bills) {
      console.log(`Seeding bill: ${bill.id}`);
      const { data: billData, error: billError } = await supabase.from('bills').insert({
        id: bill.id,
        order_id: bill.orderId,
        table_number: bill.tableNumber,
        subtotal: bill.subtotal,
        tax: bill.tax,
        total: bill.total,
        payment_status: bill.paymentStatus,
        payment_method: bill.paymentMethod || null,
        created_at: bill.createdAt.toISOString(),
        paid_at: bill.paidAt?.toISOString() || null
      });
      
      if (billError) {
        console.error('Error seeding bill:', billError);
        throw new Error(`Error seeding bill: ${billError.message}`);
      }
    }
    
    console.log('Bills seeded successfully');
    console.log('Database seeding completed successfully!');
    
    toast.success('Database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    toast.error(`Error seeding database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}
