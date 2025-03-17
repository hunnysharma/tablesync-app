
import { cn } from "@/lib/utils";
import { Home, Utensils, ShoppingBag, LayoutGrid, Receipt, Settings, Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const isMobile = useIsMobile();
  
  const menuItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/tables", icon: LayoutGrid, label: "Tables" },
    { to: "/orders", icon: ShoppingBag, label: "Orders" },
    { to: "/menu", icon: Utensils, label: "Menu" },
    { to: "/bills", icon: Receipt, label: "Bills" },
    { to: "/setup", icon: Settings, label: "Setup" },
  ];
  
  return (
    <SidebarComponent className={className}>
      <SidebarHeader className="flex items-center">
        <h2 className="px-2 text-xl font-semibold tracking-tight">
          Restaurant Manager
        </h2>
        {!isMobile && <SidebarTrigger className="ml-auto" />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <NavLink to={item.to}>
                {({ isActive }) => (
                  <SidebarMenuButton tooltip={item.label} isActive={isActive}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Restaurant Manager
          </p>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
}
