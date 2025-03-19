
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
import { Table, MenuItem, OrderItem as OrderItemType } from '@/utils/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { OrderFormFields } from '@/components/orders/OrderFormFields';
import { OrderItemsList } from '@/components/orders/OrderItemsList';
import { MenuItemPicker } from '@/components/orders/MenuItemPicker';

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
                <OrderFormFields control={form.control} tables={tables} />
                
                <OrderItemsList 
                  control={form.control} 
                  selectedItems={selectedItems} 
                  onRemoveItem={handleRemoveItem} 
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
          <MenuItemPicker 
            menuItems={menuItems} 
            onAddItem={handleAddItem} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreateOrder;
