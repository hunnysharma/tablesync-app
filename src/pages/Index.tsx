
import { useState, useEffect } from 'react';
import { Layout, PageHeader } from '@/components/layout/Layout';
import { TableGrid } from '@/components/dashboard/TableGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Utensils, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTables } from '@/services/tableService';
import { fetchOrders } from '@/services/orderService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeOrders: 0,
    occupiedTables: 0,
    availableTables: 0,
    totalSales: 0
  });
  
  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: fetchTables
  });
  
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });
  
  useEffect(() => {
    // Calculate dashboard stats from fetched data
    if (tables.length > 0 && orders.length > 0) {
      const activeOrders = orders.filter(order => order.status === 'active').length;
      const occupiedTables = tables.filter(table => table.status === 'occupied').length;
      const availableTables = tables.filter(table => table.status === 'available').length;
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      
      setStats({
        activeOrders,
        occupiedTables,
        availableTables,
        totalSales
      });
    }
  }, [tables, orders]);
  
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
    
  const statCards = [
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: Utensils,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Occupied Tables',
      value: stats.occupiedTables,
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      title: 'Available Tables',
      value: stats.availableTables,
      icon: Users,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      title: 'Today\'s Sales',
      value: `$${stats.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your restaurant's current status"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-semibold">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Table Status</CardTitle>
                <Button 
                  variant="ghost" 
                  className="text-sm"
                  onClick={() => navigate('/tables')}
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TableGrid tables={tables.slice(0, 8)} isLoading={tablesLoading} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button 
                  variant="ghost" 
                  className="text-sm"
                  onClick={() => navigate('/orders')}
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ordersLoading ? (
                  <p className="text-center text-muted-foreground py-6">
                    Loading orders...
                  </p>
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg animate-slide-in">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">Table {order.tableNumber}</span>
                          <StatusBadge status={order.status} className="ml-2 text-xs" />
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · ${order.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center text-muted-foreground text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(order.createdAt)}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="mt-1 h-7 text-xs"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    No recent orders
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
