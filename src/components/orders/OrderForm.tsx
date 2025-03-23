
import { useState, useEffect } from 'react';
import { MenuItem, OrderItem } from '@/utils/types';
import { OrderItemComponent } from './OrderItem';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface OrderFormProps {
  table_id: string;
  tableNumber: number;
  menuItems: MenuItem[];
  existingItems?: OrderItem[];
  onSubmit: (items: OrderItem[]) => void;
  onCancel: () => void;
}

export function OrderForm({ 
  table_id, 
  tableNumber, 
  menuItems, 
  existingItems = [],
  onSubmit,
  onCancel
}: OrderFormProps) {
  const [items, setItems] = useState<OrderItem[]>(existingItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notes, setNotes] = useState<string>('');
  
  const categories = ['all', ...new Set(menuItems.map(item => item.category_id))];
  
  const addItem = (menuItem: MenuItem) => {
    const existingItem = items.find(item => item.menu_item_id === menuItem.id);
    
    if (existingItem) {
      // Increase quantity if item already exists
      setItems(items.map(item => 
        item.menu_item_id === menuItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item
      const newItem: OrderItem = {
        id: uuidv4(),
        menu_item_id: menuItem.id,
        menu_item_name: menuItem.name,
        quantity: 1,
        price: menuItem.price,
        status: 'pending'
      };
      
      setItems([...items, newItem]);
    }
    
    toast.success(`Added ${menuItem.name} to order`);
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleSubmit = () => {
    // Add notes to the last item if provided
    if (notes.trim() && items.length > 0) {
      const updatedItems = [...items];
      const lastIndex = updatedItems.length - 1;
      updatedItems[lastIndex] = {
        ...updatedItems[lastIndex],
        notes
      };
      onSubmit(updatedItems);
    } else {
      onSubmit(items);
    }
  };
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category_id === selectedCategory);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Menu Items</h3>
        
        <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
          {categories.map(catId => {
            const category = catId === 'all' 
              ? { id: 'all', name: 'All' } 
              : { id: catId, name: menuItems.find(item => item.category_id === catId)?.category_id || catId };
            
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            );
          })}
        </div>
        
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-350px)]">
          {filteredMenuItems.map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer hover:shadow-sm"
              onClick={() => item.available && addItem(item)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-medium">₹{item.price.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Order for Table {tableNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length > 0 ? (
              <div className="space-y-1 max-h-[calc(100vh-450px)] overflow-y-auto">
                {items.map((item) => (
                  <OrderItemComponent
                    key={item.id}
                    item={item}
                    editable={true}
                    onQuantityChange={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                No items added to the order yet
              </p>
            )}
            
            <div className="mt-4">
              <Textarea
                placeholder="Add special instructions or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
              />
            </div>
            
            <div className="mt-6 pt-4 border-t border-border/40">
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tax (10%)</span>
                <span>₹{(subtotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium mt-4 pt-2 border-t border-border/40">
                <span>Total</span>
                <span>₹{(subtotal * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 justify-end border-t border-border/40 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={items.length === 0}
            >
              {existingItems.length > 0 ? 'Update Order' : 'Place Order'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
