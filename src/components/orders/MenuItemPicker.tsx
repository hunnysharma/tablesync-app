
import { MenuItem } from '@/utils/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface MenuItemPickerProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem, quantity: number, notes: string) => void;
}

export function MenuItemPicker({ menuItems, onAddItem }: MenuItemPickerProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value) || 1;
    setQuantities({
      ...quantities,
      [itemId]: quantity
    });
  };

  const handleNotesChange = (itemId: string, value: string) => {
    setNotes({
      ...notes,
      [itemId]: value
    });
  };

  const getQuantity = (itemId: string): number => {
    return quantities[itemId] || 1;
  };

  const getNotes = (itemId: string): string => {
    return notes[itemId] || '';
  };

  // Extract unique categories
  const categories = ['all', ...new Set(menuItems.map(item => item.categoryId))];
  
  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === selectedCategory);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add Items</h3>
      
      <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
        {categories.map(catId => {
          const category = catId === 'all' 
            ? { id: 'all', name: 'All' } 
            : { id: catId, name: menuItems.find(item => item.categoryId === catId)?.categoryId || catId };
          
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
      
      {filteredItems.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">No menu items available</p>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="border rounded-md p-3">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
              <div className="text-sm font-medium mt-1">${item.price.toFixed(2)}</div>
              <div className="mt-2 space-y-2">
                <div className="flex space-x-2">
                  <Input 
                    type="number" 
                    placeholder="Qty" 
                    className="w-20" 
                    min="1"
                    value={getQuantity(item.id)}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  />
                  <Button 
                    onClick={() => onAddItem(item, getQuantity(item.id), getNotes(item.id))}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <Textarea
                  placeholder="Special instructions..."
                  value={getNotes(item.id)}
                  onChange={(e) => handleNotesChange(item.id, e.target.value)}
                  className="text-sm resize-none h-16"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
