
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavbarUserMenu = ({ user, handleLogout, isMobile = false }) => {
  // Check user role and fallback to cached data if user is null
  const cachedUser = user || (() => {
    try {
      const cached = localStorage.getItem("userData");
      const parsedData = cached ? JSON.parse(cached) : null;
      
      // Verify the cached data has required fields
      if (parsedData && (!parsedData.name || !parsedData.email)) {
        console.warn("Cached user data is incomplete:", parsedData);
        // Force a refresh by clearing localStorage
        localStorage.removeItem("userData");
        window.location.reload();
        return null;
      }
      
      return parsedData;
    } catch (e) {
      console.error("Error parsing cached user data:", e);
      return null;
    }
  })();
  
  const isAdmin = cachedUser?.role === 'admin';
  const isTenant = cachedUser?.role === 'tenant';
  
  if (isMobile) {
    return (
      <div className="space-y-3 px-3">
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium text-sm shadow-sm">
            {cachedUser?.name ? cachedUser.name[0].toUpperCase() : "U"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{cachedUser?.name}</p>
            <p className="text-xs text-gray-500 truncate">{cachedUser?.email}</p>
            {(isAdmin || isTenant) && (
              <p className="text-xs mt-1 font-medium text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded-full">
                {isAdmin ? 'Administrator' : 'Tenant'}
              </p>
            )}
          </div>
        </div>
        
       
        
        {/* Show dashboard link for all logged in users */}
        <Link 
          to="/dashboard" 
          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center gap-3"
        >
          <span className="w-5 h-5 flex items-center justify-center">🏠</span>
          <span className="font-medium">{isTenant ? 'Tenant Dashboard' : 'My Dashboard'}</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="w-5 h-5 flex items-center justify-center">🚪</span>
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">
          {cachedUser?.name}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {cachedUser?.email}
        </p>
        {(isAdmin || isTenant) && (
          <p className="text-xs mt-1 font-medium text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded-full">
            {isAdmin ? 'Administrator' : 'Tenant'}
          </p>
        )}
      </div>
      
     
      
      {/* Show dashboard link for all logged in users */}
      <Link 
        to="/dashboard" 
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 flex items-center space-x-2 transition-colors"
      >
        <span className="w-4 h-4 flex items-center justify-center">🏠</span>
        <span>{isTenant ? 'Tenant Dashboard' : 'My Dashboard'}</span>
      </Link>
      
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 transition-colors"
      >
        <span className="w-4 h-4 flex items-center justify-center">🚪</span>
        <span>Sign out</span>
      </button>
    </div>
  );
};

NavbarUserMenu.propTypes = {
  user: PropTypes.object,
  handleLogout: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

export default NavbarUserMenu;

