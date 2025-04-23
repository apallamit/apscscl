import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, Wheat, Store, MapPin, DollarSign, 
  Truck, FileText, Navigation, History, CreditCard, 
  CheckSquare, Menu, LogOut, Settings, Package, User,
  Calendar, Send, Bookmark, Building, Users, Wrench,
  Droplet, Map, Database, Filter, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuItems, childMenus, MenuItem } from "@/config/menu";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

// Helper function to get icon component based on icon name or key
const getIconComponent = (item: MenuItem) => {
  // If class is specified and it's a custom icon class
  if (item.class && item.class.startsWith('icons-')) {
    return <span className={item.class} style={{ fontSize: item.fontSize || '18px' }}></span>;
  }

  // For standard icons, map by name or key
  switch (item.icon || item.key) {
    case 'Home':
    case 'dashboard':
      return <Home className="h-5 w-5" />;
    case 'Settings':
    case 'master':
      return <Settings className="h-5 w-5" />;
    case 'Package':
    case 'major':
      return <Package className="h-5 w-5" />;
    case 'User':
    case 'hr':
      return <User className="h-5 w-5" />;
    case 'MapPin':
      return <MapPin className="h-5 w-5" />;
    case 'Truck':
      return <Truck className="h-5 w-5" />;
    case 'Map':
      return <Map className="h-5 w-5" />;
    case 'DollarSign':
      return <DollarSign className="h-5 w-5" />;
    case 'Droplet':
      return <Droplet className="h-5 w-5" />;
    case 'Users':
      return <Users className="h-5 w-5" />;
    case 'Wrench':
      return <Wrench className="h-5 w-5" />;
    case 'CreditCard':
      return <CreditCard className="h-5 w-5" />;
    case 'Building':
      return <Building className="h-5 w-5" />;
    case 'Calendar':
      return <Calendar className="h-5 w-5" />;
    case 'Send':
      return <Send className="h-5 w-5" />;
    case 'Bookmark':
      return <Bookmark className="h-5 w-5" />;
    default:
      return <MapPin className="h-5 w-5" />;
  }
};

export function Sidebar({ collapsed, onToggle, isDarkMode, onThemeToggle }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [activeParent, setActiveParent] = useState<string | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  // Add a Dashboard item
  const dashboardItem: MenuItem = {
    key: 'dashboard',
    name: 'Dashboard',
    link: '/',
  };

  // Prepare the menu items with Dashboard at the top
  const allMenuItems = [dashboardItem, ...menuItems];

  // Handle parent menu click
  const handleParentClick = (key: string) => {
    if (collapsed) {
      onToggle(); // Expand sidebar if collapsed
    }
    
    setActiveParent(prev => prev === key ? null : key);
  };

  // Close submenu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setActiveParent(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex h-full">
      {/* Main sidebar */}
      <aside 
        className={cn(
          "h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 z-30 flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-20",
        )}
      >
        <div className="flex items-center justify-center h-16 px-1 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xl font-semibold text-primary px-2">
            AP
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto pt-4">
          <ul className="space-y-2 px-2">
            {allMenuItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleParentClick(item.key)}
                  className={cn(
                    "w-full flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                    activeParent === item.key 
                      ? "bg-primary/10 text-primary-600" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    item.key === 'dashboard' && "mb-4"
                  )}
                >
                  <div className="flex-shrink-0">
                    {getIconComponent(item)}
                  </div>
                  <span className="text-xs mt-1 font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button onClick={handleLogout} className="w-full flex flex-col items-center text-gray-500 hover:text-red-500 p-2">
            <LogOut className="h-5 w-5" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Submenu overlay */}
      {activeParent && !collapsed && (
        <div
          ref={submenuRef}
          className={cn(
            "h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto",
            "w-64 transition-all duration-300 ease-in-out"
          )}
        >
          {activeParent !== 'dashboard' && (
            <div className="px-4 py-3">
              <div className="text-sm text-blue-500 font-medium mt-2 mb-4">
                {activeParent === 'master' && "MASTER"}
                {activeParent === 'major' && "MAJOR"}
                {activeParent === 'hr' && "HR"}
              </div>
              
              <div className="space-y-2">
                {activeParent && childMenus[activeParent]?.map((childItem, childIdx) => (
                  <div key={childIdx} className="mb-3">
                    {/* For title items */}
                    {childItem.title && (
                      <div className="text-xs font-medium text-blue-500 mb-2 mt-4">
                        {childItem.name}
                      </div>
                    )}
                    
                    {/* For link items */}
                    {childItem.link && (
                      <Link
                        href={childItem.link}
                        className={cn(
                          "flex items-center p-2 text-gray-600 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg group",
                          location === childItem.link && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        )}
                      >
                        <div className="flex-shrink-0 mr-3 text-gray-400">
                          {getIconComponent(childItem)}
                        </div>
                        <span>{childItem.name}</span>
                        {childItem.badge && (
                          <span className="ml-auto bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5">
                            {childItem.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
