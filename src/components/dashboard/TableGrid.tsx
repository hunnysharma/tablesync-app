
import { Table } from '@/utils/types';
import { TableCard } from '@/components/tables/TableCard';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface TableGridProps {
  tables: Table[];
  isLoading?: boolean;
}

export function TableGrid({ tables, isLoading = false }: TableGridProps) {
  const navigate = useNavigate();
  
  const handleTableClick = (table: Table) => {
    navigate(`/tables/${table.id}`);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard 
          key={table.id} 
          table={table} 
          onClick={handleTableClick}
        />
      ))}
    </div>
  );
}
