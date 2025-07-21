import { useState, useEffect, useRef } from 'react';
import { Bell, Check, User, Home, Wrench, Mail, X } from 'lucide-react';

const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling with local change preservation
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 60000);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const fetchNotifications = async (preserveLocalChanges = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token available for notifications');
        return;
      }
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-notifications`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      

      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success) {
        const serverNotifications = data.notifications || [];
        
        if (preserveLocalChanges) {
          setNotifications(prev => {
            const localReadIds = new Set(
              prev.filter(n => n.isRead).map(n => n._id)
            );
            
            return serverNotifications.map(serverNotif => {
              if (localReadIds.has(serverNotif._id)) {
                return { ...serverNotif, isRead: true, readAt: new Date().toISOString() };
              }
              return serverNotif;
            });
          });
        } else {
          setNotifications(serverNotifications);
        }
        
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  const markAsRead = async (id) => {
    const readAt = new Date().toISOString();
    
    // Update local state immediately
    setNotifications(prev => 
      prev.map(notification => 
        notification._id === id ? { ...notification, isRead: true, readAt } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-notifications/${id}/read`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ readAt })
        }
      );
      

    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications(true);
    }
    setIsOpen(!isOpen);
  };
  
  const markAllAsRead = async () => {
    const readAt = new Date().toISOString();
    
    // Update local state immediately
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true, readAt }))
    );
    setUnreadCount(0);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-notifications/read-all`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ readAt })
        }
      );
      

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'agent_request':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'property_approval':
        return <Home className="w-5 h-5 text-primary-500" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-orange-500" />;
      case 'inquiry':
        return <Mail className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative flex items-center p-1 hover:bg-gray-700 rounded-full transition-colors"
        title="Notifications"
      >
        <Bell className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            <button 
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800"
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                >
                  <div className="flex">
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="notification-title">
                        {notification.title}
                      </p>
                      <p className="notification-time">
                        {formatDate(notification.createdAt)}
                      </p>
                      <p className="notification-message">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="notification-action"
                        >
                          <Check className="w-3 h-3 mr-1" /> Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBadge;