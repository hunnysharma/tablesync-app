
import { Table, Category, MenuItem, Order, Bill } from './types';

export const tables: Table[] = [
  { id: '1', number: 1, capacity: 4, status: 'available' },
  { id: '2', number: 2, capacity: 2, status: 'occupied', currentOrderId: '1' },
  { id: '3', number: 3, capacity: 6, status: 'reserved' },
  { id: '4', number: 4, capacity: 4, status: 'available' },
  { id: '5', number: 5, capacity: 2, status: 'occupied', currentOrderId: '2' },
  { id: '6', number: 6, capacity: 8, status: 'inactive' },
  { id: '7', number: 7, capacity: 4, status: 'available' },
  { id: '8', number: 8, capacity: 2, status: 'available' },
];

export const categories: Category[] = [
  { id: '1', name: 'Appetizers', description: 'Starters and small plates' },
  { id: '2', name: 'Main Course', description: 'Hearty entrées and mains' },
  { id: '3', name: 'Desserts', description: 'Sweet treats to finish your meal' },
  { id: '4', name: 'Beverages', description: 'Refreshing drinks' },
];

export const menuItems: MenuItem[] = [
  { id: '1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 5.99, categoryId: '1', available: true },
  { id: '2', name: 'Buffalo Wings', description: 'Spicy chicken wings with blue cheese dip', price: 9.99, categoryId: '1', available: true },
  { id: '3', name: 'Caesar Salad', description: 'Classic salad with romaine lettuce and croutons', price: 7.99, categoryId: '1', available: true },
  { id: '4', name: 'Margherita Pizza', description: 'Fresh tomato, mozzarella, and basil', price: 14.99, categoryId: '2', available: true },
  { id: '5', name: 'Spaghetti Carbonara', description: 'Pasta with eggs, cheese, pancetta, and pepper', price: 12.99, categoryId: '2', available: true },
  { id: '6', name: 'Grilled Salmon', description: 'With lemon butter sauce and seasonal vegetables', price: 18.99, categoryId: '2', available: true },
  { id: '7', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center', price: 6.99, categoryId: '3', available: true },
  { id: '8', name: 'Tiramisu', description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers', price: 5.99, categoryId: '3', available: true },
  { id: '9', name: 'Soft Drinks', description: 'Selection of sodas', price: 2.99, categoryId: '4', available: true },
  { id: '10', name: 'House Wine', description: 'Red or white, by the glass', price: 8.99, categoryId: '4', available: true },
];

export const orders: Order[] = [
  {
    id: '1',
    tableId: '2',
    tableNumber: 2,
    items: [
      { id: '101', menuItemId: '1', menuItemName: 'Garlic Bread', quantity: 1, price: 5.99, status: 'served' },
      { id: '102', menuItemId: '5', menuItemName: 'Spaghetti Carbonara', quantity: 2, price: 12.99, status: 'served' },
      { id: '103', menuItemId: '9', menuItemName: 'Soft Drinks', quantity: 2, price: 2.99, status: 'served' },
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 60000), // 1 hour ago
    updatedAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    subtotal: 37.95,
    tax: 3.80,
    total: 41.75,
    paymentStatus: 'pending',
  },
  {
    id: '2',
    tableId: '5',
    tableNumber: 5,
    items: [
      { id: '201', menuItemId: '2', menuItemName: 'Buffalo Wings', quantity: 1, price: 9.99, status: 'preparing' },
      { id: '202', menuItemId: '6', menuItemName: 'Grilled Salmon', quantity: 1, price: 18.99, status: 'pending' },
      { id: '203', menuItemId: '10', menuItemName: 'House Wine', quantity: 2, price: 8.99, status: 'served' },
    ],
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    updatedAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    subtotal: 46.96,
    tax: 4.70,
    total: 51.66,
    paymentStatus: 'pending',
  },
];

export const bills: Bill[] = [
  {
    id: '1',
    orderId: '1',
    tableNumber: 2,
    items: [
      { id: '101', menuItemId: '1', menuItemName: 'Garlic Bread', quantity: 1, price: 5.99, status: 'served' },
      { id: '102', menuItemId: '5', menuItemName: 'Spaghetti Carbonara', quantity: 2, price: 12.99, status: 'served' },
      { id: '103', menuItemId: '9', menuItemName: 'Soft Drinks', quantity: 2, price: 2.99, status: 'served' },
    ],
    subtotal: 37.95,
    tax: 3.80,
    total: 41.75,
    paymentStatus: 'pending',
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
  },
];
