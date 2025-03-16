
import { useState } from 'react';
import { Layout, PageHeader } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '@/services/orderService';
import { Skeleton } from '@/components/ui/skeleton';

const Orders = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });
  
  const filteredOrders = orders.filter(order => {
    // Filter by search (table number)
    const matchesSearch = order.tableNumber.toString().includes(search);
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Orders" 
        subtitle="Manage and track all customer orders"
      >
        <Button onClick={() => navigate('/tables')}>
          <Plus className="h-4 w-4 mr-2" /> New Order
        </Button>
      </PageHeader>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by table number..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              className="hover:shadow-sm cursor-pointer animate-scale-in"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">Table {order.tableNumber}</h3>
                      <StatusBadge status={order.status} className="ml-2" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(order.createdAt)}
                      </div>
                      <span>·</span>
                      <div>{formatDate(order.createdAt)}</div>
                      <span>·</span>
                      <div>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No orders found with the current filters</p>
          <Button 
            variant="link" 
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default Orders;
