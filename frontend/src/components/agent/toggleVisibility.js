// Function to toggle property visibility
const handleToggleVisibility = async (property, onPropertyUpdated) => {
  try {
    const token = localStorage.getItem('token');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const response = await fetch(
      `${backendUrl}/api/agents/properties/${property._id}/toggle-visibility`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      onPropertyUpdated(data.property);
      return { success: true, message: `Property is now ${data.property.visible ? 'visible' : 'hidden'}` };
    } else {
      return { success: false, message: 'Failed to update visibility' };
    }
  } catch (error) {
    console.error('Error toggling visibility:', error);
    return { success: false, message: 'Failed to update visibility' };
  }
};

export default handleToggleVisibility;

