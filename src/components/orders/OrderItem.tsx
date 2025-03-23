
import { OrderItem as OrderItemType } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { updateOrderItemStatus } from '@/api/orderService';

interface OrderItemProps {
  item: OrderItemType;
  editable?: boolean;
  canChangeStatus?: boolean;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onStatusChange?: (id: string, status: OrderItemType['status']) => void;
}

export function OrderItemComponent({ 
  item, 
  editable = false,
  canChangeStatus = false,
  onQuantityChange,
  onRemove,
  onStatusChange
}: OrderItemProps) {
  const handleStatusChange = async (newStatus: string) => {
    try {
      if (onStatusChange) {
        onStatusChange(item.id, newStatus as OrderItemType['status']);
      } else {
        // If no callback is provided, update directly
        const result = await updateOrderItemStatus(
          item.id, 
          newStatus as OrderItemType['status']
        );
        
        if (result) {
          toast.success(`Status updated to ${newStatus}`);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0 animate-slide-in">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">{item.menu_item_name}</h4>
            {item.notes && (
              <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
            )}
          </div>
          <span className="font-medium ml-2">
            ₹{((item.price || 0) * item.quantity).toFixed(2)}
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {item.quantity} × ₹{(item.price || 0).toFixed(2)}
              </span>
              
              {canChangeStatus ? (
                <Select
                  value={item.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="served">Served</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <StatusBadge status={item.status} className="text-xs" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
