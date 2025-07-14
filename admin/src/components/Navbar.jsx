import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotificationBadge from './NotificationBadge';
import { 
  Home, 
  Menu, 
  X, 
  LogOut,
  List,
  Plus,
  Calendar,
  FileText,
  BarChart2,
  User,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-[#4B4B4B] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <Link to="/dashboard" className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-[#91BB3E] rounded-lg">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="ml-2 text-base sm:text-xl font-bold text-white truncate">Admin Panel</span>
          </Link>
          
          {/* Navigation - Center */}
          <div className="hidden md:flex items-center justify-center flex-1">
            {/* Navigation links will be in the sidebar */}
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notification Badge - Always visible */}
            <div className="relative">
              <NotificationBadge />
            </div>
            
            {/* Logout Button - Hidden on mobile */}
            <button
              onClick={handleLogout}
              className="hidden md:flex px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-red-600 transition-colors"
            >
              <div className="flex items-center">
                <LogOut className="h-4 w-4 mr-1.5" />
                Logout
              </div>
            </button>
          </div>
          
          {/* Mobile Menu Button - Removed */}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#4B4B4B] border-t border-gray-700 shadow-lg"
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            {/* Dashboard */}
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </div>
            </Link>
            
            {/* Properties */}
            <Link
              to="/list"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <List className="h-5 w-5 mr-2" />
                Properties
              </div>
            </Link>
            
            {/* Add Property */}
            <Link
              to="/add"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </div>
            </Link>
            
            {/* Appointments */}
            <Link
              to="/appointments"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Appointments
              </div>
            </Link>
            
            {/* Analytics */}
            <Link
              to="/analytics/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Analytics
              </div>
            </Link>
            
            {/* Documents */}
            <Link
              to="/documents"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documents
              </div>
            </Link>
            
            {/* Users */}
            <Link
              to="/users"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Users
              </div>
            </Link>
            

            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-600"
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;