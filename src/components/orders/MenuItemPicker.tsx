
import { MenuItem } from '@/utils/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MenuItemPickerProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem, quantity: number, notes: string) => void;
}

export function MenuItemPicker({ menuItems, onAddItem }: MenuItemPickerProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add Items</h3>
      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="border rounded-md p-3">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-muted-foreground">${item.price.toFixed(2)}</div>
            <div className="mt-2 flex space-x-2">
              <Input 
                type="number" 
                placeholder="Qty" 
                className="w-20" 
                defaultValue="1"
                min="1"
                id={`qty-${item.id}`}
              />
              <Button 
                onClick={() => {
                  const qtyInput = document.getElementById(`qty-${item.id}`) as HTMLInputElement;
                  const qty = parseInt(qtyInput.value) || 1;
                  onAddItem(item, qty, '');
                }}
                size="sm"
              >
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
