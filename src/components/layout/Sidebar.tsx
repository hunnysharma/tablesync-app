import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import { Home, Utensils, ShoppingBag, LayoutGrid, Receipt, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isMobile } = useMobile();
  
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Restaurant Manager
          </h2>
          <div className="space-y-1">
            <NavLink to="/" className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )
            }>
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/tables" className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )
            }>
              <LayoutGrid className="h-4 w-4" />
              <span>Tables</span>
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )
            }>
              <ShoppingBag className="h-4 w-4" />
              <span>Orders</span>
            </NavLink>
            <NavLink to="/menu" className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )
            }>
              <Utensils className="h-4 w-4" />
              <span>Menu</span>
            </NavLink>
            <NavLink to="/bills" className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )
            }>
              <Receipt className="h-4 w-4" />
              <span>Bills</span>
            </NavLink>
            <NavLink to="/setup" className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )
            }>
              <Settings className="h-4 w-4" />
              <span>Setup</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
