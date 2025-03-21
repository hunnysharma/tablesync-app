
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { OrderItemComponent } from '@/components/orders/OrderItem';
import { fetchOrder, updateOrder } from '@/api/orderService';
import { toast } from 'sonner';
import { Order } from '@/utils/types';
import { ArrowLeft, CheckCircle, Printer } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      
      try {
        const data = await fetchOrder(id);
        setOrder(data);
      } catch (error) {
        console.error('Error loading order:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrder();
  }, [id]);

  const handleCompleteOrder = async () => {
    if (!order) return;
    
    setIsCompleting(true);
    try {
      // Update order status to completed
      const updatedOrder = await updateOrder(order.id, {
        status: 'completed'
      });
      
      if (updatedOrder) {
        setOrder(updatedOrder);
        toast.success('Order completed successfully!');
        
        // Navigate to bills page or create bill
        navigate(`/bills`);
      }
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
    } finally {
      setIsCompleting(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  if (isLoading) {
    return (
      <Layout title="Order Details">
        <div className="p-8 text-center">
          <p>Loading order details...</p>
        </div>
      </Layout>
    );
  }
  
  if (!order) {
    return (
      <Layout title="Order Details">
        <div className="p-8 text-center">
          <p>Order not found</p>
          <Button 
            onClick={() => navigate('/orders')}
            variant="outline"
            className="mt-4"
          >
            Back to Orders
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Order Details">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order for Table {order.table_number}</CardTitle>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(order.createdAt)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold">Order Items</h3>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                  {order.items.map((item) => (
                    <OrderItemComponent
                      key={item.id}
                      item={item}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm text-muted-foreground">
                    Payment Status: {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              {order.status !== 'completed' && (
                <Button 
                  className="w-full"
                  onClick={handleCompleteOrder}
                  disabled={isCompleting}
                  variant="default"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isCompleting ? 'Completing...' : 'Complete Order'}
                </Button>
              )}
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => alert('Printing functionality not implemented')}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
