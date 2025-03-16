
import { useState } from 'react';
import { Layout, PageHeader } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Printer, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBills } from '@/services/billService';
import { Skeleton } from '@/components/ui/skeleton';

const Bills = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['bills'],
    queryFn: fetchBills
  });
  
  const filteredBills = bills.filter(bill => {
    // Filter by search (table number)
    const matchesSearch = bill.tableNumber.toString().includes(search);
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || bill.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Bills" 
        subtitle="View and manage all generated bills"
      />
      
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
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
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
      ) : filteredBills.length > 0 ? (
        <div className="space-y-4">
          {filteredBills.map((bill) => (
            <Card 
              key={bill.id} 
              className="hover:shadow-sm cursor-pointer animate-scale-in"
              onClick={() => navigate(`/bills/${bill.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">Table {bill.tableNumber}</h3>
                      <StatusBadge status={bill.paymentStatus} className="ml-2" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <div>{formatDate(bill.createdAt)}</div>
                      <span>·</span>
                      <div>{bill.items.length} {bill.items.length === 1 ? 'item' : 'items'}</div>
                      {bill.paymentMethod && (
                        <>
                          <span>·</span>
                          <div className="capitalize">{bill.paymentMethod}</div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="text-right">
                      <div className="font-medium">${bill.total.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        Bill #{bill.id.substring(0, 8)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        alert('Printing bill...');
                      }}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No bills found with the current filters</p>
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

export default Bills;
