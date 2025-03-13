
import { useState } from 'react';
import { Layout, PageHeader } from '@/components/layout/Layout';
import { MenuItem } from '@/components/menu/MenuItem';
import { menuItems as initialMenuItems, categories } from '@/utils/dummyData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus } from 'lucide-react';

const Menu = () => {
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  
  const filteredItems = menuItems.filter(item => {
    // Filter by search (item name)
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    
    // Filter by category
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
    
    // Filter by availability
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && item.available) || 
      (availabilityFilter === 'unavailable' && !item.available);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });
  
  return (
    <Layout>
      <PageHeader 
        title="Menu" 
        subtitle="Manage and organize your restaurant's menu items"
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </PageHeader>
      
      <Tabs defaultValue="items" className="mb-6">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search menu items..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={availabilityFilter} 
              onValueChange={setAvailabilityFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">No menu items found with the current filters</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                  setAvailabilityFilter('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="bg-muted/50 p-6 rounded-lg hover:shadow-sm transition-all cursor-pointer"
              >
                <h3 className="font-medium text-lg">{category.name}</h3>
                {category.description && (
                  <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
                )}
                <p className="text-sm mt-2">
                  {menuItems.filter(item => item.categoryId === category.id).length} items
                </p>
              </div>
            ))}
            
            <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground">
              <Plus className="h-8 w-8 mb-2" />
              <p>Add New Category</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Menu;
