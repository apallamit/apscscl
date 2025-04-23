import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/hooks/use-auth";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Start with sidebar collapsed as per requirement
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && 
         window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [location] = useLocation();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Get page title based on current route
  const getPageTitle = () => {
    if (location === '/') return 'Dashboard';
    if (location.startsWith('/master/good-seeds')) return 'Good Seeds Routes';
    if (location.startsWith('/master/vehicle')) return 'Vehicle';
    if (location.startsWith('/master/buffer-gowdan')) return 'Buffer Gowdan';
    if (location.startsWith('/master/mls-points')) return 'MLS Points';
    if (location.startsWith('/major/vehicles')) return 'Vehicles Management';
    
    // Default title for other pages
    const path = location.split('/');
    return path[path.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar with z-index to control visibility */}
      <div className={`absolute inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30 md:relative ${sidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'translate-x-0 w-64'}`}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
          isDarkMode={isDarkMode} 
          onThemeToggle={toggleTheme} 
        />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title={getPageTitle()}
          collapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          userName={user?.username || ''}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
        />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
