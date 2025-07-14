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
        className={`fixed left-0 top-16 h-full bg-white shadow-lg z-40 transition-all duration-300 overflow-hidden
        ${expanded ? 'md:w-64 w-64' : 'md:w-16 w-0'} 
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
            to="/dashboard"
            className={`flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
              isActive('/dashboard') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
            }`}
          >
            <Home className="w-5 h-5 min-w-[20px]" />
            {expanded && <span className="ml-4 whitespace-nowrap">Dashboard</span>}
          </Link>
          
          {/* Products */}
          <Link
            to="/list"
            className={`flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
              isActive('/list') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
            }`}
          >
            <List className="w-5 h-5 min-w-[20px]" />
            {expanded && <span className="ml-4 whitespace-nowrap">Products</span>}
          </Link>
          
          {/* Add Product */}
          <Link
            to="/add"
            className={`flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
              isActive('/add') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
            }`}
          >
            <Plus className="w-5 h-5 min-w-[20px]" />
            {expanded && <span className="ml-4 whitespace-nowrap">Add Product</span>}
          </Link>
          
          {/* Orders */}
          <Link
            to="/orders"
            className={`flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
              isActive('/orders') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
            }`}
          >
            <Calendar className="w-5 h-5 min-w-[20px]" />
            {expanded && <span className="ml-4 whitespace-nowrap">Orders</span>}
          </Link>
          
          {/* Analytics Dropdown */}
          <div>
            <button
              onClick={() => toggleMenu('analytics')}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors ${
                isSubActive(['/analytics']) ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 min-w-[20px]" />
                {expanded && <span className="ml-4 whitespace-nowrap">Analytics</span>}
              </div>
              {expanded && (
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenus.analytics ? 'rotate-90' : ''}`} />
              )}
            </button>
            
            {expanded && expandedMenus.analytics && (
              <div className="pl-4 space-y-1 bg-gray-50">
                <Link
                  to="/analytics/dashboard"
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isActive('/analytics/dashboard') ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <PieChart className="w-4 h-4 min-w-[16px]" />
                  <span className="ml-4 whitespace-nowrap">Overview</span>
                </Link>
                
                <Link
                  to="/analytics/financial"
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isActive('/analytics/financial') ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <DollarSign className="w-4 h-4 min-w-[16px]" />
                  <span className="ml-4 whitespace-nowrap">Financial</span>
                </Link>
                
                <Link
                  to="/analytics/properties"
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isActive('/analytics/properties') ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4 min-w-[16px]" />
                  <span className="ml-4 whitespace-nowrap">Properties</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Documents Dropdown */}
          <div>
            <button
              onClick={() => toggleMenu('documents')}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors ${
                isSubActive(['/documents']) ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 min-w-[20px]" />
                {expanded && <span className="ml-4 whitespace-nowrap">Documents</span>}
              </div>
              {expanded && (
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenus.documents ? 'rotate-90' : ''}`} />
              )}
            </button>
            
            {expanded && expandedMenus.documents && (
              <div className="pl-4 space-y-1 bg-gray-50">
                <Link
                  to="/documents"
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isActive('/documents') ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4 min-w-[16px]" />
                  <span className="ml-4 whitespace-nowrap">All Documents</span>
                </Link>
                
                <Link
                  to="/documents/upload"
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isActive('/documents/upload') ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4 min-w-[16px]" />
                  <span className="ml-4 whitespace-nowrap">Upload Document</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Blog Management Dropdown */}
          <div>
            <button
              onClick={() => toggleMenu('blogs')}
              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors ${
                isSubActive(['/blogs']) ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 min-w-[20px]" />
                {expanded && <span className="ml-4 whitespace-nowrap">Blog</span>}
              </div>
              {expanded && (
                <ChevronRight className={`w-4 h-4 transition-transform ${expandedMenus.blogs ? 'rotate-90' : ''}`} />
              )}
            </button>
            
            {expanded && expandedMenus.blogs && (
              <div className="pl-4 space-y-1 bg-gray-50">
                <Link
                  to="/blogs"
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isActive('/blogs') ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4 min-w-[16px]" />
                  <span className="ml-4 whitespace-nowrap">All Posts</span>
                </Link>
                
                <Link
                  to="/blogs/create"
                  className={`flex items-center px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isActive('/blogs/create') ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  <Plus className="w-4 h-4 min-w-[16px]" />
                  <span className="ml-4 whitespace-nowrap">Create Post</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Users */}
          <Link
            to="/users"
            className={`flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
              isActive('/users') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
            }`}
          >
            <User className="w-5 h-5 min-w-[20px]" />
            {expanded && <span className="ml-4 whitespace-nowrap">Users</span>}
          </Link>
          
          {/* Newsletter */}
          <Link
            to="/newsletter"
            className={`flex items-center px-4 py-3 hover:bg-gray-100 transition-colors ${
              isActive('/newsletter') ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'
            }`}
          >
            <Mail className="w-5 h-5 min-w-[20px]" />
            {expanded && <span className="ml-4 whitespace-nowrap">Newsletter</span>}
          </Link>
          

          

          
          {/* Agents link removed as it's now part of the Users page */}
        </div>
        
        <div className="space-y-1">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-100 transition-colors text-gray-700"
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {expanded && <span className="ml-4 whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;