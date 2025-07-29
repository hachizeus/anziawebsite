import { useState, useEffect, useContext, createContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  List,
  Plus,
  Calendar,
  FileText,
  LogOut,
  ChevronRight,
  BarChart2,
  DollarSign,
  PieChart,
  User,
  ChevronLeft,
  BookOpen,
  UserPlus,
  Wrench,
  Mail
} from 'lucide-react';

// Create context for sidebar state
export const SidebarContext = createContext({
  expanded: false,
  setExpanded: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  // Default to collapsed on desktop, but use media query to check screen size
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  const [expanded, setExpanded] = useState(false);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false); // Always collapse on mobile
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { expanded, setExpanded } = useSidebar();
  const [expandedMenus, setExpandedMenus] = useState({
    analytics: false,
    documents: false,
    blogs: false
  });
  
  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const isSubActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  return (
    <>
      {/* Overlay for mobile */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300 overflow-hidden border-r border-gray-200
        ${expanded ? 'w-64 sm:w-72 md:w-64' : 'w-0 md:w-16'} 
        ${expanded ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full'}`}
      >
      <div className="h-full flex flex-col justify-between py-4">
        <div className="space-y-1">
          {/* Toggle Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex justify-end px-4 py-2 text-gray-500 hover:text-gray-900"
          >
            {expanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
          
          {/* Dashboard */}
          <Link
            to="/"
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 transition-colors rounded-lg mx-2 ${
              isActive('/') ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'
            }`}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 min-w-[16px] sm:min-w-[20px] flex-shrink-0" />
            {expanded && <span className="ml-3 sm:ml-4 whitespace-nowrap text-sm sm:text-base">Dashboard</span>}
          </Link>
          
          {/* Products */}
          <Link
            to="/list"
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 transition-colors rounded-lg mx-2 ${
              isActive('/list') ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'
            }`}
          >
            <List className="w-4 h-4 sm:w-5 sm:h-5 min-w-[16px] sm:min-w-[20px] flex-shrink-0" />
            {expanded && <span className="ml-3 sm:ml-4 whitespace-nowrap text-sm sm:text-base">Products</span>}
          </Link>
          
          {/* Add Product */}
          <Link
            to="/add"
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 transition-colors rounded-lg mx-2 ${
              isActive('/add') ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'
            }`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 min-w-[16px] sm:min-w-[20px] flex-shrink-0" />
            {expanded && <span className="ml-3 sm:ml-4 whitespace-nowrap text-sm sm:text-base">Add Product</span>}
          </Link>
          
          {/* Orders removed */}
          
          {/* Analytics section removed */}
          
          {/* Documents section removed */}
          
          {/* Blog section removed */}
          
          {/* Users */}
          <Link
            to="/users"
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 transition-colors rounded-lg mx-2 ${
              isActive('/users') ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'
            }`}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 min-w-[16px] sm:min-w-[20px] flex-shrink-0" />
            {expanded && <span className="ml-3 sm:ml-4 whitespace-nowrap text-sm sm:text-base">Users</span>}
          </Link>
          
          {/* Newsletter */}
          <Link
            to="/newsletter"
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 transition-colors rounded-lg mx-2 ${
              isActive('/newsletter') ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'
            }`}
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 min-w-[16px] sm:min-w-[20px] flex-shrink-0" />
            {expanded && <span className="ml-3 sm:ml-4 whitespace-nowrap text-sm sm:text-base">Newsletter</span>}
          </Link>
          

          

          
          {/* Agents link removed as it's now part of the Users page */}
        </div>
        
        <div className="space-y-1">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-red-50 hover:text-red-600 transition-colors text-gray-700 rounded-lg mx-2"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 min-w-[16px] sm:min-w-[20px] flex-shrink-0" />
            {expanded && <span className="ml-3 sm:ml-4 whitespace-nowrap text-sm sm:text-base">Logout</span>}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;