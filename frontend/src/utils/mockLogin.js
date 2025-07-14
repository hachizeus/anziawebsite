// Mock login utility for testing when the backend is rate-limited

export const mockLogin = (email, password) => {
  // Simple mock data for testing
  const mockUsers = [
    {
      email: 'tenant@example.com',
      password: 'password123',
      userData: {
        _id: 'mock123',
        name: 'Mock Tenant',
        email: 'tenant@example.com',
        role: 'tenant'
      },
      token: 'mock-token-tenant-123456789'
    },
    {
      email: 'admin@example.com',
      password: 'admin123',
      userData: {
        _id: 'mock456',
        name: 'Mock Admin',
        email: 'admin@example.com',
        role: 'admin'
      },
      token: 'mock-token-admin-123456789'
    }
  ];
  
  // Find matching user
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Store mock data in localStorage
    localStorage.setItem('token', user.token);
    localStorage.setItem('userData', JSON.stringify(user.userData));
    
    return {
      success: true,
      accessToken: user.token,
      user: user.userData
    };
  }
  
  return { success: false, message: 'Invalid credentials' };
};

