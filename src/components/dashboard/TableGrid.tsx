
import { Table } from '@/utils/types';
import { TableCard } from '@/components/tables/TableCard';
import { useNavigate } from 'react-router-dom';

interface TableGridProps {
  tables: Table[];
}

export function TableGrid({ tables }: TableGridProps) {
  const navigate = useNavigate();
  
  const handleTableClick = (table: Table) => {
    navigate(`/tables/${table.id}`);
  };
  
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
