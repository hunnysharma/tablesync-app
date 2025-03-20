
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { fetchBill, updateBill } from '@/api/billService';
import { Bill } from '@/utils/types';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Printer, Receipt } from 'lucide-react';
import { OrderItemComponent } from '@/components/orders/OrderItem';

const BillDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const loadBill = async () => {
      if (!id) return;
      
      try {
        const data = await fetchBill(id);
        setBill(data);
      } catch (error) {
        console.error('Error loading bill:', error);
        toast.error('Failed to load bill details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBill();
  }, [id]);
  
  const handleMarkAsPaid = async () => {
    if (!bill) return;
    
    setIsProcessing(true);
    try {
      const updatedBill = await updateBill(bill.id, {
        payment_status: 'paid',
        paymentMethod: 'card', // Default to card payment
        paidAt: new Date()
      });
      
      if (updatedBill) {
        setBill(updatedBill);
        toast.success('Bill marked as paid!');
      }
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
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
      <Layout title="Bill Details">
        <div className="p-8 text-center">
          <p>Loading bill details...</p>
        </div>
      </Layout>
    );
  }
  
  if (!bill) {
    return (
      <Layout title="Bill Details">
        <div className="p-8 text-center">
          <p>Bill not found</p>
          <Button 
            onClick={() => navigate('/bills')}
            variant="outline"
            className="mt-4"
          >
            Back to Bills
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Bill Details">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate('/bills')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bills
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bill for Table {bill.table_number}</CardTitle>
                <StatusBadge status={bill.payment_status} />
              </div>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(bill.createdAt)}
                {bill.paidAt && ` • Paid: ${formatDate(bill.paidAt)}`}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-semibold">Items</h3>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                  {bill.items.map((item) => (
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
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${bill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${bill.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${bill.total.toFixed(2)}</span>
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Bill #:</span> {bill.id.substring(0, 8)}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="text-muted-foreground">Order #:</span> {bill.orderId.substring(0, 8)}
                  </p>
                  {bill.paymentMethod && (
                    <p className="text-sm text-muted-foreground">
                      Payment Method: <span className="capitalize">{bill.paymentMethod}</span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              {bill.payment_status !== 'paid' && (
                <Button 
                  className="w-full"
                  onClick={handleMarkAsPaid}
                  disabled={isProcessing}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Mark as Paid'}
                </Button>
              )}
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/bills/${bill.id}/print`)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Bill
              </Button>
              <Button
                className="w-full" 
                variant="outline"
                onClick={() => alert('Email receipt functionality not implemented')}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Email Receipt
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BillDetails;
