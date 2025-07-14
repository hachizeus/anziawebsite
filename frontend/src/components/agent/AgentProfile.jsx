import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Camera } from '../utils/icons.jsx';

const AgentProfile = ({ profile, loading, onProfileUpdated }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    whatsapp: '',
    email: '',
    currency: 'KSH'
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || '',
        email: profile.email || user?.email || '',
        currency: profile.currency || 'KSH'
      });
      
      if (profile.profilePicture) {
        setProfilePictureUrl(profile.profilePicture);
      }
    }
  }, [profile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setProfilePicture(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setProfilePictureUrl(e.target.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const updatedData = { ...formData };
      
      // If there's a new profile picture, include it for ImageKit upload
      if (profilePicture) {
        console.log('Adding profile picture to upload, size:', profilePictureUrl.length);
        updatedData.profilePictureBase64 = profilePictureUrl;
      }
      
      const response = await fetch(`http://localhost:4000/api/agents/profile`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Profile update response:', data);
      
      if (data.success) {
        // Update local state with new profile picture URL from ImageKit
        if (data.agent.profilePicture) {
          setProfilePictureUrl(data.agent.profilePicture);
          // Update user context with new profile picture
          updateUser({ 
            profilePicture: data.agent.profilePicture,
            profileImage: data.agent.profilePicture // Also update profileImage for consistency
          });
        }
        
        onProfileUpdated(data.agent);
        toast.success('Profile updated successfully');
        
        // Clear the file input
        setProfilePicture(null);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Agent Profile</h2>
      
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
        <h3 className="text-lg font-medium text-blue-800">Agent Information</h3>
        <p className="text-blue-700 mt-1">
          This information will be displayed to potential clients on your property listings.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 shadow-md mb-2">
              {profilePictureUrl && !profilePictureUrl.startsWith('data:') ? (
                <img 
                  src={`${profilePictureUrl}?tr=w-128,h-128,c-face`}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    setProfilePictureUrl('');
                  }}
                />
              ) : profilePictureUrl ? (
                <img 
                  src={profilePictureUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <span className="text-3xl font-bold">{user?.name?.charAt(0) || 'A'}</span>
                </div>
              )}
            </div>
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full shadow-md hover:bg-primary-600 transition-colors"
              disabled={submitting}
            >
              <Camera size={18} />
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleProfilePictureChange} 
            accept="image/jpeg,image/jpg,image/png,image/webp" 
            className="hidden" 
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload a professional profile picture (JPG, PNG, WebP - max 5MB)
          </p>
        </div>
        
        {/* Subscription Info */}
        {profile && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 mb-2">Subscription Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="font-medium">{profile.subscription || 'Basic'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="font-medium">
                  {profile.subscriptionExpiry 
                    ? new Date(profile.subscriptionExpiry).toLocaleDateString() 
                    : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${profile.active ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Visibility</p>
                <p className={`font-medium ${profile.visible ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.visible ? 'Visible to Public' : 'Hidden from Public'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="font-medium">
                  {profile.currency || 'KSH'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio / About Me
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Tell potential clients about yourself, your experience, and your expertise..."
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">
            This will be displayed on your property listings.
          </p>
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. +254 712 345 678"
            />
          </div>
          
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number
            </label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. +254 712 345 678"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to use the same as phone number.
            </p>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g. your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="KSH">KSH (Kenyan Shilling)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Saving...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentProfile;


