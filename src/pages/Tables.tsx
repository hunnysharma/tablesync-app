
import { useState } from 'react';
import { Layout, PageHeader } from '@/components/layout/Layout';
import { TableGrid } from '@/components/dashboard/TableGrid';
import { tables as initialTables } from '@/utils/dummyData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableStatus } from '@/utils/types';
import { Search, RefreshCw } from 'lucide-react';

const Tables = () => {
  const [tables, setTables] = useState(initialTables);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredTables = tables.filter(table => {
    // Filter by search (table number)
    const matchesSearch = table.number.toString().includes(search);
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <Layout>
      <PageHeader 
        title="Tables" 
        subtitle="Manage and view the status of all tables"
      >
        <Button>
          Add New Table
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
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {filteredTables.length > 0 ? (
        <TableGrid tables={filteredTables} />
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No tables found with the current filters</p>
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

export default Tables;
