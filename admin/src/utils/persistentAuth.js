// Persistent authentication for admin - NEVER logout automatically
export const ensurePersistentAuth = () => {
  // Prevent any automatic logout
  const originalClear = localStorage.clear;
  const originalRemoveItem = localStorage.removeItem;
  
  // Override localStorage methods to prevent auth data removal
  localStorage.clear = function() {
    console.warn('localStorage.clear() blocked to preserve admin authentication');
  };
  
  localStorage.removeItem = function(key) {
    if (key === 'token' || key === 'user' || key === 'isAdmin') {
      console.warn(`Blocked removal of ${key} to preserve admin authentication`);
      return;
    }
    originalRemoveItem.call(this, key);
  };
};

// Initialize persistent auth
if (typeof window !== 'undefined') {
  ensurePersistentAuth();
}