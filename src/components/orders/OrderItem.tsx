
import { OrderItem as OrderItemType } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface OrderItemProps {
  item: OrderItemType;
  editable?: boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

export function OrderItemComponent({ 
  item, 
  editable = false,
  onQuantityChange,
  onRemove
}: OrderItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 animate-slide-in">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">{item.menuItemName}</h4>
            {item.notes && (
              <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
            )}
          </div>
          <span className="font-medium ml-2">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          {editable ? (
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onQuantityChange?.(item.id, Math.max(1, item.quantity - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={item.quantity}
                min={1}
                className="w-10 h-7 text-center"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    onQuantityChange?.(item.id, value);
                  }
                }}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => onQuantityChange?.(item.id, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive ml-2"
                onClick={() => onRemove?.(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground">
                {item.quantity} × ${item.price.toFixed(2)}
              </span>
              <StatusBadge status={item.status} className="ml-2 text-xs" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
