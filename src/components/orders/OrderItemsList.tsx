
import { OrderItem } from '@/utils/types';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { OrderItemCard } from './OrderItemCard';

interface OrderItemsListProps {
  control: Control<any>;
  selectedItems: OrderItem[];
  onRemoveItem: (itemId: string) => void;
}

export function OrderItemsList({ control, selectedItems, onRemoveItem }: OrderItemsListProps) {
  return (
    <FormField
      control={control}
      name="items"
      render={() => (
        <FormItem>
          <FormLabel>Order Items</FormLabel>
          <div className="space-y-4">
            {selectedItems.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">No items added to the order yet</p>
            ) : (
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <OrderItemCard
                    key={item.id}
                    item={item}
                    onRemove={() => onRemoveItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
