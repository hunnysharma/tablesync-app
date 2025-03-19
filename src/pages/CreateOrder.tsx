
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrder } from '@/api/orderService';
import { fetchTables } from '@/api/tableService';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, MenuItem, OrderItem as OrderItemType } from '@/utils/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { OrderForm } from '@/components/orders/OrderForm';

// Custom OrderItem component since we're having issues with the import
const OrderItem = ({ item, onRemove }: { 
  item: OrderItemType; 
  onRemove: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-background">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{item.menuItemName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Qty: {item.quantity} × ${item.price.toFixed(2)}
        </div>
        {item.notes && (
          <div className="text-xs italic mt-1">{item.notes}</div>
        )}
      </div>
    </div>
  );
};

const orderSchema = z.object({
  tableId: z.string().min(1, 'Table is required'),
  customerName: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string().min(1),
      menuItemId: z.string().min(1),
      menuItemName: z.string().min(1),
      quantity: z.number().min(1),
      price: z.number().min(0),
      notes: z.string().optional(),
      status: z.string()
    })
  ).min(1, 'At least one item is required'),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const CreateOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItemType[]>([]);
  const navigate = useNavigate();
  const { currentCafe } = useAuth();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      tableId: '',
      customerName: '',
      notes: '',
      items: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentCafe) {
          const tablesData = await fetchTables();
          setTables(tablesData);
          
          // Since getAllMenuItems doesn't exist, we'll need a mock for testing
          // In production, you'd want to implement this API method
          setMenuItems([
            {
              id: '1',
              name: 'Pizza',
              price: 12.99,
              categoryId: 'main',
              available: true
            },
            {
              id: '2',
              name: 'Burger',
              price: 8.99,
              categoryId: 'main',
              available: true
            },
            {
              id: '3',
              name: 'Salad',
              price: 6.99,
              categoryId: 'side',
              available: true
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      }
    };
    
    fetchData();
  }, [currentCafe]);

  useEffect(() => {
    form.setValue('items', selectedItems);
  }, [selectedItems, form]);

  const handleAddItem = (item: MenuItem, quantity: number, notes: string) => {
    const newItem: OrderItemType = {
      id: uuidv4(),
      menuItemId: item.id,
      menuItemName: item.name,
      quantity,
      price: item.price,
      notes,
      status: 'pending'
    };
    
    setSelectedItems([...selectedItems, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const onSubmit = async (values: OrderFormValues) => {
    if (!currentCafe) return;
    
    setIsLoading(true);
    try {
      await createOrder({
        tableId: values.tableId,
        items: values.items.map(item => ({
          id: item.id,
          menuItemId: item.menuItemId,
          menuItemName: item.menuItemName,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || '',
          status: 'pending'
        })),
        status: 'active',
        customer_name: values.customerName || 'Guest',
        notes: values.notes || '',
        cafe_id: currentCafe.id,
        subtotal: 0,
        tax: 0,
        total: 0,
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        tableNumber: Number(tables.find(t => t.id === values.tableId)?.number || 0)
      });
      
      toast.success('Order created successfully!');
      navigate('/orders');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Create New Order">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tableId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Table</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select a table</option>
                            {tables.map((table) => (
                              <option key={table.id} value={table.id}>
                                Table {table.number} (Capacity: {table.capacity})
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions for the order"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem>
                      <FormLabel>Order Items</FormLabel>
                      <div className="space-y-4">
                        {selectedItems.length === 0 ? (
                          <p className="text-muted-foreground text-sm italic">No items added to the order yet</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedItems.map((item) => (
                              <OrderItem
                                key={item.id}
                                item={item}
                                onRemove={() => handleRemoveItem(item.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/orders')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || selectedItems.length === 0}
                  >
                    {isLoading ? 'Creating...' : 'Create Order'}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Add Items</h3>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="border rounded-md p-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
                  <div className="mt-2 flex space-x-2">
                    <Input 
                      type="number" 
                      placeholder="Qty" 
                      className="w-20" 
                      defaultValue="1"
                      min="1"
                      id={`qty-${item.id}`}
                    />
                    <Button 
                      onClick={() => {
                        const qtyInput = document.getElementById(`qty-${item.id}`) as HTMLInputElement;
                        const qty = parseInt(qtyInput.value) || 1;
                        handleAddItem(item, qty, '');
                      }}
                      size="sm"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateOrder;
