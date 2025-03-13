
import { MenuItem as MenuItemType } from '@/utils/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  item: MenuItemType;
  onAddToOrder?: (item: MenuItemType) => void;
  showAddButton?: boolean;
}

export function MenuItem({ item, onAddToOrder, showAddButton = false }: MenuItemProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 animate-scale-in",
      "hover:shadow-md", 
      !item.available && "opacity-70"
    )}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row h-full">
          {item.image ? (
            <div className="sm:w-1/3 h-24 sm:h-auto bg-muted">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="sm:w-1/3 h-24 sm:h-auto bg-muted flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          
          <div className="p-4 sm:w-2/3 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                {!item.available && (
                  <Badge variant="outline" className="mt-1 bg-destructive/10 text-destructive">
                    Unavailable
                  </Badge>
                )}
              </div>
              <span className="font-medium">${item.price.toFixed(2)}</span>
            </div>
            
            {item.description && (
              <p className="text-sm text-muted-foreground mb-auto line-clamp-2">
                {item.description}
              </p>
            )}
            
            {showAddButton && item.available && (
              <Button 
                onClick={() => onAddToOrder?.(item)}
                size="sm"
                className="mt-3 self-end"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" /> Add to Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
