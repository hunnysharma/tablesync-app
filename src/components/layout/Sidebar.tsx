
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AlignJustify, 
  LayoutDashboard, 
  Coffee, 
  ClipboardList, 
  ReceiptText, 
  Calculator,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/api/authService';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentCafe } = useAuth();

  const NavItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tables', label: 'Tables', icon: ClipboardList },
    { path: '/menu', label: 'Menu', icon: Coffee },
    { path: '/orders', label: 'Orders', icon: ReceiptText },
    { path: '/bills', label: 'Bills', icon: Calculator },
  ];
  
  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <aside 
      className={cn(
        "glass h-screen fixed top-0 left-0 z-50 flex flex-col border-r border-border/40",
        "transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/40">
        {!collapsed && (
          <h1 className="text-xl font-semibold animate-fade-in">RestroLive</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "ml-auto rounded-full hover:bg-muted",
            collapsed && "mx-auto"
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <AlignJustify className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {currentCafe && !collapsed && (
        <div className="px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            <span className="font-medium">{currentCafe.name}</span>
          </div>
        </div>
      )}
      
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {NavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200",
                "hover:bg-muted/80",
                isActive ? "bg-muted/80 font-medium" : "text-muted-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              {!collapsed && (
                <span className="animate-fade-in">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border/40">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-muted-foreground",
            collapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!collapsed && "Logout"}
        </Button>
      </div>
      
      <div className="p-4 border-t border-border/40 text-xs text-muted-foreground text-center">
        {!collapsed ? "RestroLive © 2025" : "©"}
      </div>
    </aside>
  );
}
