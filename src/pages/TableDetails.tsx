
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { fetchTable, updateTable } from '@/api/tableService';
import { fetchOrder } from '@/api/orderService';
import { Table, Order } from '@/utils/types';
import { toast } from 'sonner';
import { ArrowLeft, PenLine, Utensils, Users } from 'lucide-react';
import { OrderItemComponent } from '@/components/orders/OrderItem';

const TableDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [table, setTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTableData = async () => {
      if (!id) return;
      
      try {
        const tableData = await fetchTable(id);
        setTable(tableData);
        
        // If table has a current order, fetch it
        if (tableData?.currentOrderId) {
          const orderData = await fetchOrder(tableData.currentOrderId);
          setCurrentOrder(orderData);
        }
      } catch (error) {
        console.error('Error loading table data:', error);
        toast.error('Failed to load table details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTableData();
  }, [id]);
  
  const handleCreateOrder = () => {
    if (table) {
      navigate(`/orders/new?table_id=${table.id}`);
    }
  };
  
  const handleChangeStatus = async (status: 'available' | 'occupied' | 'reserved' | 'inactive') => {
    if (!table) return;
    
    try {
      const updatedTable = await updateTable(table.id, { status });
      setTable(updatedTable);
      toast.success(`Table status updated to ${status}`);
    } catch (error) {
      console.error('Error updating table status:', error);
      toast.error('Failed to update table status');
    }
  };
  
  if (isLoading) {
    return (
      <Layout title="Table Details">
        <div className="p-8 text-center">
          <p>Loading table details...</p>
        </div>
      </Layout>
    );
  }
  
  if (!table) {
    return (
      <Layout title="Table Details">
        <div className="p-8 text-center">
          <p>Table not found</p>
          <Button 
            onClick={() => navigate('/tables')}
            variant="outline"
            className="mt-4"
          >
            Back to Tables
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={`Table ${table.number}`}>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate('/tables')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tables
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Table {table.number}</CardTitle>
                <StatusBadge status={table.status} />
              </div>
              <div className="flex items-center mt-1 text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                <span>Capacity: {table.capacity} {table.capacity === 1 ? 'Person' : 'People'}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={table.status === 'available' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleChangeStatus('available')}
                  >
                    Available
                  </Button>
                  <Button 
                    variant={table.status === 'occupied' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleChangeStatus('occupied')}
                  >
                    Occupied
                  </Button>
                  <Button 
                    variant={table.status === 'reserved' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleChangeStatus('reserved')}
                  >
                    Reserved
                  </Button>
                  <Button 
                    variant={table.status === 'inactive' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleChangeStatus('inactive')}
                  >
                    Inactive
                  </Button>
                </div>
                
                {currentOrder && (
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold mb-2">Current Order</h3>
                    <div className="space-y-2">
                      {currentOrder.items.map((item) => (
                        <OrderItemComponent
                          key={item.id}
                          item={item}
                        />
                      ))}
                      <div className="flex justify-between pt-2 mt-2 border-t">
                        <span className="font-medium">Total:</span>
                        <span className="font-medium">₹{currentOrder.total.toFixed(2)}</span>
                      </div>
                      <Button
                        className="w-full mt-2"
                        onClick={() => navigate(`/orders/${currentOrder.id}`)}
                      >
                        View Order Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              {!currentOrder && table.status !== 'inactive' && (
                <Button
                  className="w-full"
                  onClick={handleCreateOrder}
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              )}
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/tables/edit/${table.id}`)}
              >
                <PenLine className="h-4 w-4 mr-2" />
                Edit Table
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TableDetails;
