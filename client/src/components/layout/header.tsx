import { useState } from "react";
import { 
  Menu, Search, Bell, ChevronDown, 
  SunMedium, Moon, LogOut, User, Settings,
  Lightbulb
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  collapsed: boolean;
  onToggleSidebar: () => void;
  userName: string;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function Header({ title, collapsed, onToggleSidebar, userName, isDarkMode, onThemeToggle }: HeaderProps) {
  const { logoutMutation } = useAuth();
  const [hasNotifications] = useState(true);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center z-10 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90">
      <div className="flex-1 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center">
          <button 
            onClick={onToggleSidebar} 
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            data-component-name="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="ml-4 text-lg font-semibold text-gray-700 dark:text-gray-200 hidden sm:block">
            {title}
          </div>
          
          {/* Theme toggle button */}
          <button
            onClick={onThemeToggle}
            className="ml-3 p-2 rounded-md focus:outline-none transition-colors duration-200 animate-in"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Lightbulb 
              className={cn(
                "h-5 w-5 transition-colors duration-300",
                isDarkMode 
                  ? "text-yellow-300 fill-yellow-300 drop-shadow-[0_0_2px_rgba(253,224,71,0.7)]" 
                  : "text-gray-400"
              )} 
            />
          </button>
        </div>
        
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-3 py-2 border dark:bg-slate-800 text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {hasNotifications && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(userName)}
                </div>
                <span className="hidden md:inline-block text-gray-700 dark:text-gray-300 text-sm">
                  {userName}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
