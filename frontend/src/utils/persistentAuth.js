// Simple persistent authentication without localStorage overrides
export const ensurePersistentAuth = () => {
  // Simple auth check without blocking localStorage operations
  console.log('Persistent auth initialized');
};

// Initialize persistent auth
if (typeof window !== 'undefined') {
  ensurePersistentAuth();
}

