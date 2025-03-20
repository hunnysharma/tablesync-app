
import { MenuItem } from '@/utils/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface MenuItemPickerProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem, quantity: number, notes: string) => void;
}

export function MenuItemPicker({ menuItems, onAddItem }: MenuItemPickerProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value) || 1;
    setQuantities({
      ...quantities,
      [itemId]: quantity
    });
  };

  const getQuantity = (itemId: string): number => {
    return quantities[itemId] || 1;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add Items</h3>
      {menuItems.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">Loading menu items...</p>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {menuItems.map((item) => (
            <div key={item.id} className="border rounded-md p-3">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
              <div className="text-sm font-medium mt-1">${item.price.toFixed(2)}</div>
              <div className="mt-2 flex space-x-2">
                <Input 
                  type="number" 
                  placeholder="Qty" 
                  className="w-20" 
                  min="1"
                  value={getQuantity(item.id)}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                />
                <Button 
                  onClick={() => onAddItem(item, getQuantity(item.id), '')}
                  size="sm"
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
