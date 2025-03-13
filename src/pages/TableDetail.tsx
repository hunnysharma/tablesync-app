
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, PageHeader } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchTables } from '@/services/tableService';
import { fetchMenuItems } from '@/services/menuItemService';
import { OrderForm } from '@/components/orders/OrderForm';
import { ArrowLeft, Users, ClipboardList, Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderItem } from '@/utils/types';
import { createOrder } from '@/services/orderService';
import { toast } from 'sonner';

const TableDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  const { data: tables, isLoading: isLoadingTables } = useQuery({
    queryKey: ['tables'],
    queryFn: fetchTables
  });
  
  const { data: menuItems, isLoading: isLoadingMenuItems } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems
  });
  
  const table = tables?.find(t => t.id === id);
  
  const handlePlaceOrder = async (items: OrderItem[]) => {
    if (!table) return;
    
    try {
      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;
      
      // Create the order
      await createOrder(
        table.id,
        table.number,
        items,
        subtotal,
        tax,
        total
      );
      
      toast.success(`Order placed for Table ${table.number}`);
      setShowOrderForm(false);
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };
  
  if (isLoadingTables) {
    return (
      <Layout>
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }
  
  if (!table) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Table Not Found</h2>
          <p className="text-muted-foreground mb-4">The table you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/tables')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tables
          </Button>
        </div>
      </Layout>
    );
  }
  
  if (showOrderForm && menuItems) {
    return (
      <Layout>
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => setShowOrderForm(false)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Table Details
        </Button>
        
        <OrderForm
          tableId={table.id}
          tableNumber={table.number}
          menuItems={menuItems}
          onSubmit={handlePlaceOrder}
          onCancel={() => setShowOrderForm(false)}
        />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button 
          variant="outline" 
          size="icon"
          className="mr-4"
          onClick={() => navigate('/tables')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Table {table.number}</h1>
          <p className="text-sm text-muted-foreground">
            {table.capacity} {table.capacity === 1 ? 'Person' : 'People'} · {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-medium">Capacity</h3>
              </div>
              <span>{table.capacity}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-medium">Current Order</h3>
              </div>
              <span>{table.currentOrderId ? `#${table.currentOrderId}` : 'None'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-muted-foreground" />
                <h3 className="font-medium">Status</h3>
              </div>
              <span className="capitalize">{table.status}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="actions">
        <TabsList>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="actions" className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              size="lg" 
              className="h-auto py-6 flex flex-col items-center justify-center"
              onClick={() => setShowOrderForm(true)}
              disabled={table.status === 'inactive'}
            >
              <ClipboardList className="h-8 w-8 mb-2" />
              <span>Place Order</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-auto py-6 flex flex-col items-center justify-center"
              disabled={!table.currentOrderId}
            >
              <Receipt className="h-8 w-8 mb-2" />
              <span>Generate Bill</span>
            </Button>
            
            <Button 
              variant={table.status === 'available' ? 'outline' : 'default'}
              size="lg" 
              className="h-auto py-6 flex flex-col items-center justify-center"
              disabled={table.status === 'inactive'}
            >
              <Users className="h-8 w-8 mb-2" />
              <span>{table.status === 'reserved' ? 'Cancel Reservation' : 'Reserve Table'}</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="pt-6">
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No order history available for this table</p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TableDetail;
