import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Home, 
  Phone, 
  Mail, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  User
} from '../utils/icons.jsx';

const ExplorePropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/agents/explore/properties/${id}`);
      
      if (response.data.success) {
        setProperty(response.data.property);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (!property || !property.image.length) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.image.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!property || !property.image.length) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? property.image.length - 1 : prevIndex - 1
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getWhatsAppLink = () => {
    const agent = property.agentId;
    const whatsappNumber = agent.whatsapp || agent.phone || '';
    const message = `Hello, I'm interested in your property: ${property.title} (${window.location.href})`;
    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const getEmailLink = () => {
    const agent = property.agentId;
    const email = agent.email || '';
    const subject = `Inquiry about: ${property.title}`;
    const body = `Hello,\n\nI'm interested in your property: ${property.title} (${window.location.href}).\n\nPlease contact me with more information.\n\nThank you.`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getPhoneLink = () => {
    const agent = property.agentId;
    const phone = agent.phone || '';
    return `tel:${phone.replace(/[^0-9+]/g, '')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Property not found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/explore"
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Back to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const agent = property.agentId;
  const agentName = agent?.userId?.name || 'Agent';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/explore"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Explore
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Property Images */}
          <div className="relative h-96">
            {property.image && property.image.length > 0 ? (
              <>
                <img 
                  src={property.image[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {property.image.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {property.image.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Home className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span>{property.location}</span>
                </div>
                
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Bed className="w-5 h-5 mr-2" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Bath className="w-5 h-5 mr-2" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Home className="w-5 h-5 mr-2" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {property.type}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {property.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.availability === 'available' ? 'bg-green-100 text-green-800' : 
                    property.availability === 'sold' ? 'bg-red-100 text-red-800' : 
                    property.availability === 'rented' ? 'bg-blue-100 text-blue-800' : 
                    property.availability === 'booked' ? 'bg-purple-100 text-purple-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.availability.charAt(0).toUpperCase() + property.availability.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.purpose === 'sale' ? 'bg-indigo-100 text-indigo-800' : 
                    property.purpose === 'rent' ? 'bg-pink-100 text-pink-800' : 
                    property.purpose === 'lease' ? 'bg-amber-100 text-amber-800' : 
                    'bg-cyan-100 text-cyan-800'
                  }`}>
                    {property.purpose === 'sale' ? 'For Sale' :
                     property.purpose === 'rent' ? 'For Rent' :
                     property.purpose === 'lease' ? 'For Lease' :
                     'For Booking'}
                  </span>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-primary-600">
                {formatPrice(property.price)}
              </div>
            </div>
            
            <hr className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <div className="text-gray-700 mb-6 whitespace-pre-line">
                  {property.description}
                </div>
                
                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="mt-6 text-sm text-gray-500">
                  Listed on {formatDate(property.createdAt)}
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      {(agent.profilePicture || agent.userId?.profilePicture || agent.userId?.profileImage) ? (
                        <img 
                          src={`${agent.profilePicture || agent.userId?.profilePicture || agent.userId?.profileImage}?tr=w-96,h-96,c-face`}
                          alt={agentName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          key={agent.profilePicture || agent.userId?.profilePicture || agent.userId?.profileImage}
                          onError={(e) => {
                            console.log('Agent profile image failed to load:', e.target.src);
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center"><div class="w-6 h-6 text-primary-600 flex items-center justify-center font-bold">${agentName.charAt(0)}</div></div>`;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 text-primary-600 flex items-center justify-center font-bold text-lg">
                            {agentName.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{agentName}</div>
                      <div className="text-sm text-gray-500">Property Agent</div>
                    </div>
                  </div>
                  
                  {agent.bio && (
                    <div className="mb-4 text-sm text-gray-700">
                      {agent.bio}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <a 
                      href={getWhatsAppLink()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      WhatsApp
                    </a>
                    
                    <a 
                      href={getPhoneLink()}
                      className="flex items-center justify-center w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Call
                    </a>
                    
                    <a 
                      href={getEmailLink()}
                      className="flex items-center justify-center w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePropertyDetail;


