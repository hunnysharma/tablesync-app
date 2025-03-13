
import { Table } from '@/utils/types';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onClick?: (table: Table) => void;
}

export function TableCard({ table, onClick }: TableCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200",
        "hover:shadow-md cursor-pointer animate-scale-in",
        table.status === 'occupied' && "border-status-occupied/30",
        table.status === 'reserved' && "border-status-reserved/30",
        table.status === 'inactive' && "border-status-inactive/30 opacity-70"
      )}
      onClick={() => onClick?.(table)}
    >
      <div className={cn(
        "h-2 w-full",
        table.status === 'available' && "bg-status-available",
        table.status === 'occupied' && "bg-status-occupied",
        table.status === 'reserved' && "bg-status-reserved",
        table.status === 'inactive' && "bg-status-inactive"
      )} />
      
      <CardContent className="pt-6 pb-4 px-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-medium">Table {table.number}</h3>
            <div className="flex items-center mt-1 text-muted-foreground text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>{table.capacity} {table.capacity === 1 ? 'Person' : 'People'}</span>
            </div>
          </div>
          <StatusBadge status={table.status} />
        </div>
        
        {table.currentOrderId && (
          <div className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border/40">
            <p>Order #{table.currentOrderId}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
