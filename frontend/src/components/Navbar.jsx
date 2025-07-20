import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// Font Awesome icons used directly in JSX
// Use direct path to logo instead of import
const logoPath = "/images/logo.svg";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import PropTypes from "prop-types";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { isLoggedIn, user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  // Handle click outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  
  // Get user role
  const getUserRole = () => {
    if (user?.role) {
      return user.role;
    }
    
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData?.role || '';
      }
    } catch (e) {
      console.error("Error parsing userData:", e);
    }
    
    return '';
  };
  
  const userRole = getUserRole();
  
  // Get cart count from backend
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        if (user?._id && isLoggedIn) {
          const token = localStorage.getItem('token');
          const response = await fetch(`https://anzia-electronics-api.onrender.com/api/cart/${user._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.status === 401 || response.status === 403) {
            // Token expired or invalid, logout user
            logout();
            return;
          }
          
          const data = await response.json();
          if (data.success) {
            const count = data.cart.items?.length || 0;
            console.log('Cart count updated:', count, 'items in cart:', data.cart.items);
            setCartCount(count);
          }
        } else {
          setCartCount(0);
        }
      } catch (e) {
        console.error('Error getting cart count:', e);
        setCartCount(0);
      }
    };
    
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [user, isLoggedIn, logout]);

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/", icon: "fas fa-home" },
    { name: "Products", path: "/products", icon: "fas fa-search" },
    { name: "Categories", path: "/categories", icon: "fas fa-th-large" },
    { name: "About", path: "/about", icon: "fas fa-users" },
    { name: "Contact", path: "/contact", icon: "fas fa-envelope" },
    { 
      name: "Help", 
      path: "/help", 
      icon: "fas fa-question-circle",
      dropdown: [
        { name: "FAQs", path: "/help#faqs" },
        { name: "Shipping", path: "/help#shipping" },
        { name: "Returns & Refunds", path: "/help#returns" },
        { name: "Payment", path: "/help#payment" },
        { name: "Contact Us", path: "/help#contact" },
      ]
    },
  ];
  
  // Add Dashboard link for users
  if (isLoggedIn && userRole === 'user') {
    navLinks.push({ name: "Dashboard", path: "/dashboard", icon: "fas fa-tachometer-alt" });
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? darkMode ? "bg-gray-900 shadow-md backdrop-blur-lg" : "bg-white shadow-md backdrop-blur-lg"
          : darkMode ? "bg-gray-900 border-b border-gray-700" : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-1 group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="p-0.5 rounded-lg"
              >
                <img src={logoPath} alt="Anzia Electronics  logo" className="w-16 h-16 object-contain" />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-500 transition-all duration-300">
                Anzia Electronics
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <NavLinks currentPath={location.pathname} user={user} navLinks={navLinks} />
          </div>

          {/* Auth Buttons - Right */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <i className="fas fa-shopping-cart text-xl"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      console.log('User object:', user);
                      console.log('Profile picture URL:', user?.profilePicture || user?.profileImage);
                      toggleDropdown();
                    }}
                    className="flex items-center space-x-1 focus:outline-none"
                    aria-label="User menu"
                    aria-expanded={isDropdownOpen}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium text-sm shadow-md hover:shadow-lg transition-shadow">
                        {(user?.profilePicture || user?.profileImage) ? (
                          <img 
                            src={user.profilePicture || user.profileImage}
                            alt={user?.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentNode;
                              if (parent && !parent.querySelector('.fallback-initials')) {
                                const fallback = document.createElement('span');
                                fallback.className = 'fallback-initials';
                                fallback.textContent = getInitials(user?.name || "");
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          getInitials(user?.name || "")
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border-1 border-white rounded-full"></div>
                    </div>
                    <i className="fas fa-chevron-down text-gray-600"></i>
                  </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        <p className="text-xs mt-1 font-medium text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded-full">
                          {userRole === 'admin' ? 'Administrator' : 'Customer'}
                        </p>
                      </div>

                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleTheme();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 flex items-center space-x-2 transition-colors"
                      >
                        {darkMode ? <i className="fas fa-sun text-yellow-500"></i> : <i className="fas fa-moon"></i>}
                        <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>

                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 flex items-center space-x-2 transition-colors"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Sign out</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <i className="fas fa-shopping-cart text-xl"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-all duration-200 font-medium text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMobileMenu}
              className="rounded-lg p-2 transition-colors focus:outline-none z-50"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <div className={`w-5 h-0.5 ${darkMode ? 'bg-gray-300' : 'bg-gray-800'} transform rotate-45 absolute`}></div>
                  <div className={`w-5 h-0.5 ${darkMode ? 'bg-gray-300' : 'bg-gray-800'} transform -rotate-45 absolute`}></div>
                </div>
              ) : (
                <div className="w-6 h-5 flex flex-col justify-center items-center gap-1">
                  <div className={`w-5 h-0.5 ${darkMode ? 'bg-gray-300' : 'bg-gray-800'}`}></div>
                  <div className={`w-5 h-0.5 ${darkMode ? 'bg-gray-300' : 'bg-gray-800'}`}></div>
                  <div className={`w-5 h-0.5 ${darkMode ? 'bg-gray-300' : 'bg-gray-800'}`}></div>
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="px-2 pt-3 pb-4">
              <div className="flex flex-col space-y-1 pb-3">
                {/* Navigation Links */}
                {navLinks.map(({ name, path, icon, dropdown }) => {
                  const isActive =
                    path === "/" ? location.pathname === path : location.pathname.startsWith(path);

                  if (dropdown) {
                    return (
                      <div key={name} className="space-y-1">
                        <motion.div whileTap={{ scale: 0.97 }}>
                          <Link
                            to={path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                              ${
                                isActive
                                  ? "bg-primary-500 text-white font-medium"
                                  : "text-gray-800 hover:bg-primary-500 hover:text-white"
                              }
                            `}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <i className={icon}></i>
                            {name}
                          </Link>
                        </motion.div>
                        
                        <div className="pl-4 space-y-1">
                          {dropdown.map((item) => (
                            <motion.div key={item.name} whileTap={{ scale: 0.97 }}>
                              <Link
                                to={item.path}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                {item.name}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <motion.div key={name} whileTap={{ scale: 0.97 }}>
                      <Link
                        to={path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                          ${
                            isActive
                              ? "bg-primary-500 text-white font-medium"
                              : "text-gray-800 hover:bg-primary-500 hover:text-white"
                          }
                        `}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <i className={icon}></i>
                        {name}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Auth Buttons for Mobile */}
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                  {isLoggedIn ? (
                    <div className="space-y-3 px-3">
                      <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                          {(user?.profilePicture || user?.profileImage) ? (
                            <img 
                              src={user.profilePicture || user.profileImage}
                              alt={user?.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const parent = e.target.parentNode;
                                if (parent && !parent.querySelector('.fallback-initials')) {
                                  const fallback = document.createElement('span');
                                  fallback.className = 'fallback-initials';
                                  fallback.textContent = getInitials(user?.name || "");
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            getInitials(user?.name || "")
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                          <p className="text-xs mt-1 font-medium text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded-full">
                            {userRole === 'admin' ? 'Administrator' : 'Customer'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Role-specific links for mobile */}
                      {userRole === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <span className="w-5 h-5 flex items-center justify-center">⚙️</span>
                          <span className="font-medium">Admin Dashboard</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleTheme();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        {darkMode ? <i className="fas fa-sun text-yellow-500"></i> : <i className="fas fa-moon"></i>}
                        <span className="font-medium">{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                      </button>
                      
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="font-medium">Sign out</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3 px-3">
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Link
                          to="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
                        >
                          Sign in
                        </Link>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.97 }}>
                        <Link
                          to="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full flex items-center justify-center px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-medium shadow-md"
                        >
                          Create account
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLinks = ({ currentPath, navLinks }) => {
  // Special animation for sparkles
  const [sparkleKey, setSparkleKey] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkleKey((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && 
          !dropdownRefs.current[openDropdown].contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="flex items-center space-x-2">
      {navLinks.map(({ name, path, icon, dropdown }) => {
        const isActive =
          path === "/" ? currentPath === path : currentPath.startsWith(path);

        if (dropdown) {
          return (
            <div key={name} className="relative" ref={el => dropdownRefs.current[name] = el}>
              <button
                onClick={() => toggleDropdown(name)}
                className={`relative font-medium transition-colors duration-200 flex items-center gap-1 px-2 py-1.5 rounded-md text-sm
                  ${
                    isActive
                      ? "text-white bg-primary-500"
                      : "text-gray-800 hover:text-white hover:bg-primary-500"
                  }
                `}
              >
                <i className={icon}></i>
                <span>{name}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openDropdown === name && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {dropdown.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={name}
            to={path}
            className={`relative font-medium transition-colors duration-200 flex items-center gap-1 px-2 py-1.5 rounded-md text-sm
              ${
                isActive
                  ? "text-white bg-primary-500"
                  : "text-gray-800 hover:text-white hover:bg-primary-500"
              }
            `}
          >
            <i className={icon}></i>
            <span>{name}</span>
          </Link>
        );
      })}
    </div>
  );
};

NavLinks.propTypes = {
  currentPath: PropTypes.string.isRequired,
  navLinks: PropTypes.array.isRequired,
};

export default Navbar;