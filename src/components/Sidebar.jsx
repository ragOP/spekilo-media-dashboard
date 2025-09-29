import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FileText, 
  Archive, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Define all menu items
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/', roles: ['admin', 'signature', 'astro', 'astra'] },
    { id: 'records', label: 'Show Records', icon: FileText, path: '/records', roles: ['admin', 'signature', 'astro', 'astra'] },
    { id: 'abandoned', label: 'Abandoned Records', icon: Archive, path: '/abandoned', roles: ['admin', 'signature', 'astro', 'astra'] },
    { id: 'admins', label: 'Admin Management', icon: Users, path: '/admins', roles: ['admin'] },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    if (!user || !user.role) return false;
    return item.roles.includes(user.role.toLowerCase());
  });

  const getActiveItem = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.id : 'dashboard';
  };

  const MenuItem = ({ item }) => {
    const isActive = getActiveItem() === item.id;
    
    return (
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 h-11 transition-all duration-200",
          collapsed && !isMobile ? "px-2" : "px-3",
          isActive 
            ? "bg-primary text-primary-foreground shadow-md" 
            : "hover:bg-muted/80 hover:text-foreground"
        )}
        onClick={() => {
          navigate(item.path);
          if (isMobile) setMobileMenuOpen(false);
        }}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {(!collapsed || isMobile) && (
          <span className="flex-1 text-left">{item.label}</span>
        )}
      </Button>
    );
  };

  // Mobile menu toggle button
  const MobileMenuButton = () => (
    <Button
      variant="ghost"
      size="sm"
      className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm border border-border shadow-lg"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );

  return (
    <>
      {isMobile && <MobileMenuButton />}
      
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <div className={cn(
        "bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col shadow-lg",
        // Desktop behavior
        !isMobile && (collapsed ? "w-16" : "w-64"),
        // Mobile behavior
        isMobile && (
          mobileMenuOpen 
            ? "fixed inset-y-0 left-0 z-50 w-64 transform translate-x-0" 
            : "fixed inset-y-0 left-0 z-50 w-64 transform -translate-x-full"
        ),
        !isMobile && "relative"
      )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          {(!collapsed || isMobile) && (
            <div>
              <h2 className="font-semibold text-lg">Speklio Media</h2>
              <p className="text-xs text-muted-foreground">Dashboard v1.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button - Only show on desktop */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-3 top-6 z-10 rounded-full w-6 h-6 p-0 border border-border bg-background shadow-md hover:shadow-lg"
          onClick={onToggle}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* Main Menu */}
      <div className="flex-1 p-3 space-y-1">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* User Info and Logout */}
      <div className="p-3 border-t border-border space-y-2">
        {user && (
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-muted/50",
            collapsed && !isMobile && "justify-center"
          )}>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            {(!collapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                <p className="text-xs text-muted-foreground truncate">{user.role || 'User'}</p>
              </div>
            )}
          </div>
        )}
        
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed && !isMobile ? "px-2" : "px-3"
          )}
          onClick={() => {
            logout();
            navigate('/login');
            if (isMobile) setMobileMenuOpen(false);
          }}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {(!collapsed || isMobile) && (
            <span className="flex-1 text-left">Logout</span>
          )}
        </Button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
