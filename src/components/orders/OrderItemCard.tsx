
import { OrderItem } from '@/utils/types';
import { Button } from '@/components/ui/button';

interface OrderItemCardProps {
  item: OrderItem;
  onRemove: () => void;
}

export function OrderItemCard({ item, onRemove }: OrderItemCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-background">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{item.menuItemName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Qty: {item.quantity} × ${item.price.toFixed(2)}
        </div>
        {item.notes && (
          <div className="text-xs italic mt-1">{item.notes}</div>
        )}
      </div>
    </div>
  );
}
