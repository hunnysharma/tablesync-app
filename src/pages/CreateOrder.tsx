
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout, PageHeader } from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { fetchTables } from '@/api/tableService';
import { fetchMenuItems } from '@/api/menuService';
import { createOrder } from '@/api/orderService';
import { MenuItem } from '@/utils/types';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MenuItem as MenuItemComponent } from '@/components/menu/MenuItem';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const orderSchema = z.object({
  tableId: z.string().min(1, 'Table is required'),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderItemForm {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

const CreateOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<OrderItemForm[]>([]);
  const navigate = useNavigate();
  
  const { data: tables = [] } = useQuery({
    queryKey: ['tables'],
    queryFn: fetchTables
  });
  
  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems
  });
  
  const availableTables = tables.filter(table => 
    table.status === 'available' || table.status === 'reserved'
  );
  
  const availableMenuItems = menuItems.filter(item => item.available);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      tableId: '',
    },
  });
  
  const addItemToOrder = (menuItem: MenuItem) => {
    // Check if item already exists in order
    const existingItemIndex = selectedItems.findIndex(
      item => item.menuItem.id === menuItem.id
    );
    
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      setSelectedItems([
        ...selectedItems,
        { menuItem, quantity: 1, notes: '' }
      ]);
    }
  };
  
  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    setSelectedItems(updatedItems);
  };
  
  const updateItemNotes = (index: number, notes: string) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].notes = notes;
    setSelectedItems(updatedItems);
  };
  
  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };
  
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  };
  
  const onSubmit = async (values: OrderFormValues) => {
    if (selectedItems.length === 0) {
      toast.error('Please add at least one item to the order');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Find table number based on tableId
      const table = tables.find(t => t.id === values.tableId);
      
      if (!table) {
        throw new Error('Selected table not found');
      }
      
      // Format order data
      const orderItems = selectedItems.map(item => ({
        menuItemId: item.menuItem.id,
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price,
        notes: item.notes,
        status: 'pending',
      }));
      
      const subtotal = calculateTotal();
      const tax = subtotal * 0.1; // 10% tax as example
      
      await createOrder({
        tableId: values.tableId,
        tableNumber: table.number,
        items: orderItems,
        status: 'active',
        subtotal,
        tax,
        total: subtotal + tax,
        paymentStatus: 'pending',
      });
      
      toast.success('Order created successfully');
      navigate('/orders');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="Create New Order" 
        subtitle="Add a new order for a table"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="mb-6">
            <CardContent className="p-6">
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="tableId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Table</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a table" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTables.map((table) => (
                              <SelectItem key={table.id} value={table.id}>
                                Table {table.number} ({table.capacity} seats)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <h3 className="text-lg font-medium mb-4">Menu Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableMenuItems.map((item) => (
              <MenuItemComponent 
                key={item.id} 
                item={item} 
                onAddToOrder={addItemToOrder}
                showAddButton={true}
              />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              {selectedItems.length > 0 ? (
                <div className="space-y-4">
                  {selectedItems.map((item, index) => (
                    <div key={index} className="pb-4 border-b border-border/40">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{item.menuItem.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => updateItemQuantity(index, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, parseInt(e.target.value, 10))}
                          className="h-7 w-16 mx-2 text-center"
                        />
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => updateItemQuantity(index, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                        
                        <div className="ml-auto">
                          ${(item.menuItem.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder="Special instructions..."
                        className="h-16 text-sm"
                        value={item.notes}
                        onChange={(e) => updateItemNotes(index, e.target.value)}
                      />
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between my-2">
                      <span>Tax (10%):</span>
                      <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total:</span>
                      <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No items added to order yet
                </p>
              )}
              
              <div className="mt-6 flex gap-4">
                <Button 
                  variant="outline" 
                  className="w-1/2"
                  onClick={() => navigate('/orders')}
                >
                  Cancel
                </Button>
                <Button 
                  className="w-1/2" 
                  disabled={isSubmitting || selectedItems.length === 0 || !form.getValues().tableId}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateOrder;
