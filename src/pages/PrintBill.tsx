
import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBill } from '@/api/billService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PrintBill = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const { currentCafe } = useAuth();
  
  const { data: bill, isLoading } = useQuery({
    queryKey: ['bill', id],
    queryFn: () => fetchBill(id!),
    enabled: !!id
  });
  
  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = `
        <div style="padding: 20px;">
          ${printContents}
        </div>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };
  
  useEffect(() => {
    if (!id) {
      navigate('/bills');
    }
  }, [id, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-96">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-24 mx-auto" />
        </div>
      </div>
    );
  }
  
  if (!bill) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-xl mb-4">Bill not found</p>
        <Button variant="outline" onClick={() => navigate('/bills')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bills
        </Button>
      </div>
    );
  }
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-8" ref={printRef}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">{currentCafe?.name || 'RestroLive Cafe'}</h1>
            <p className="text-muted-foreground">{currentCafe?.address || '123 Cafe Street, City'}</p>
            <p className="text-sm text-muted-foreground mt-2">Tax Invoice / Receipt</p>
          </div>
          
          <div className="flex justify-between mb-6 text-sm">
            <div>
              <p><strong>Bill #:</strong> {bill.id.substring(0, 8).toUpperCase()}</p>
              <p><strong>Table:</strong> {bill.table_number}</p>
            </div>
            <div className="text-right">
              <p><strong>Date:</strong> {formatDate(bill.createdAt)}</p>
              <p><strong>Status:</strong> {bill.paymentStatus.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2">{item.menuItemName}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-2 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>${bill.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between my-2">
              <span className="font-medium">Tax:</span>
              <span>${bill.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-300">
              <span>Total:</span>
              <span>${bill.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-muted-foreground">
            <p>Payment Method: {bill.paymentMethod ? bill.paymentMethod.toUpperCase() : 'PENDING'}</p>
            {bill.paidAt && <p>Paid on: {formatDate(bill.paidAt)}</p>}
            <p className="mt-4">Thank you for your visit!</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate('/bills')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bills
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </div>
  );
};

export default PrintBill;
