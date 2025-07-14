import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from '../utils/icons.jsx';
import { toast } from 'react-toastify';
import shareIcon from '../../../public/images/32px-Noun_Project_Share_icon_3282968.png';
import ScheduleViewing from './ScheduleViewing';
import VideoPlayer from './VideoPlayer';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Use the explore endpoint which includes agent details with profile picture
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/explore/property/${id}`);
        if (response.data.success) {
          console.log('Property data:', response.data.property);
          setProperty(response.data.property);
          setLoading(false);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        // Fallback to the original endpoint if the explore endpoint fails
        try {
          const fallbackResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/products/single/${id}`);
          if (fallbackResponse.data.success) {
            setProperty(fallbackResponse.data.property);
            setLoading(false);
          } else {
            throw new Error(fallbackResponse.data.message);
          }
        } catch (fallbackErr) {
          setError('Failed to fetch property details.');
          setLoading(false);
          console.error('Error fetching property:', fallbackErr);
        }
      }
    };
    fetchProperty();
  }, [id]);

  // Preload the current image when it changes
  useEffect(() => {
    if (property && property.image && property.image.length > 0) {
      setImageLoaded(false);
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', property.image[currentImageIndex]);
        setImageLoaded(true); // Still mark as loaded to show placeholder
      };
      
      img.src = property.image[currentImageIndex];
    }
  }, [property, currentImageIndex]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
        toast.success('Property shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Unable to share property.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/inquiries`, {
        ...formData,
        propertyId: id,
      });
      if (response.data.success) {
        toast.success('Inquiry sent successfully!');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to send inquiry.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.image.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.image.length) % property.image.length);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Residential': 
        return <img src="/images/home-regular-24.png" alt="Residential" className="w-5 h-5" />;
      case 'Commercial': 
        return <img src="/images/32px-Office_building_icon.svg.png" alt="Commercial" className="w-5 h-5" />;
      case 'Specialty': 
        return <img src="/images/32px-Hotel_building_icon.svg.png" alt="Specialty" className="w-5 h-5" />;
      case 'Land & Agricultural': 
        return <img src="/images/32px-Map_pin_icon.svg.png" alt="Land" className="w-5 h-5" />;
      default: 
        return <img src="/images/home-regular-24.png" alt="Property" className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <img src="/images/home-regular-24.png" alt="Loading" className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading property details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-600 p-6 rounded-lg bg-red-50"
        >
          <p className="font-medium mb-4">{error || 'Property not found.'}</p>
          <button
            onClick={() => navigate('/properties')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </motion.div>
      </div>
    );
  }

  const isPropertyAvailable = property.availability === 'available' && property.paymentStatus !== 'paid';
  const currentImage = property.image[currentImageIndex] || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{property.title}</h1>
          {property.propertyCode && (
            <div className="mt-1 text-sm font-medium text-blue-600">
              Property ID: {property.propertyCode}
            </div>
          )}
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            <span>{property.location}</span>
          </div>
          
          {/* Property Type with Category */}
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Combined category and type in one badge */}
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 flex items-center">
              
              <span className="ml-1">
                {property.category && <span className="font-medium">{property.category}</span>}
                {property.category && property.type && <span className="mx-1">·</span>}
                {property.type}
              </span>
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPropertyAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isPropertyAvailable ? 'Available' : 'Not Available'}
            </span>
            {property.purpose && (
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
            )}
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden mb-6 shadow-lg">
              {!imageLoaded ? (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Loading image...</span>
                </div>
              ) : (
                <img
                  src={currentImage}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"><span class="text-lg font-bold">No Image</span></div>';
                  }}
                />
              )}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {property.image.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentImageIndex === index ? 'bg-blue-600' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  KSh {property.price.toLocaleString()}
                  {property.frequency && property.frequency !== 'one-time' && (
                    <span className="text-sm font-normal ml-1 text-gray-600">{property.frequency}</span>
                  )}
                </p>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700 mr-4">
                    Listed on {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    <img src={shareIcon} alt="Share" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Property Video */}
              {property.video && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Property Tour</h2>
                  <VideoPlayer videoUrl={property.video} />
                </div>
              )}
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-6">
                {/* Beds */}
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                  <img
                    src="/images/32px-Ionicons_bed-sharp.svg.png"
                    alt="Beds"
                    className="w-5 h-5 mb-1"
                  />
                  <span className="text-sm text-gray-600">{property.beds} Beds</span>
                </div>

                {/* Baths */}
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                  <img
                    src="/images/32px-Font_Awesome_5_solid_bath.svg.png"
                    alt="Baths"
                    className="w-5 h-5 mb-1"
                  />
                  <span className="text-sm text-gray-600">{property.baths} Baths</span>
                </div>

                {/* Square Footage */}
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                  <img
                    src="/images/Untitled.png"
                    alt="Square Footage"
                    className="w-5 h-5 mb-1"
                  />
                  <span className="text-sm text-gray-600">{property.sqft.toLocaleString()} sqft</span>
                </div>

                {/* Amenities */}
                {property.amenities?.map((amenity, index) => (
                  <div key={index} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <img
                      src="/images/3631229-200.png"
                      alt="Amenity"
                      className="w-5 h-5 mb-1"
                    />
                    <span className="text-sm text-gray-600 text-center">{amenity}</span>
                  </div>
                ))}
              </div>

              {/* Call-to-Action Buttons - Below features */}
              {isPropertyAvailable && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <img src="\images\16px-Bimetrical_icon_clipboard_black.png" alt="Calendar" className="w-4 h-4 mr-1" />
                    Schedule Viewing
                  </button>
                  <a
                    href="tel:+254726171515"
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <img src="/images/32px-VK_icons_phone_36.png" alt="Phone" className="w-4 h-4 mr-1" />
                    Call Agent
                  </a>
                  <a
                    href="https://wa.me/254726171515?text=I'm%20interested%20in%20the%20property:%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white py-2 px-3 rounded-md hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <img src="/images/32px-WhatsApp.png" alt="WhatsApp" className="w-4 h-4 mr-1" />
                    WhatsApp 
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Inquiry
                </button>
              </form>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Agent Contact</h3>
                
                {/* Agent Profile Picture */}
                {property.agentId ? (
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-100 mr-3">
                      <img 
                        src={
                          property.agentId.profilePicture || 
                          (property.agentId.userId && (property.agentId.userId.profilePicture || property.agentId.userId.profileImage)) || 
                          ''
                        } 
                        alt={(property.agentId.userId && property.agentId.userId.name) || "Agent"} 
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">A</div>';
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{(property.agentId.userId && property.agentId.userId.name) || "Agent"}</p>
                      <p className="text-sm text-primary-600">Property Agent</p>
                    </div>
                  </div>
                ) : null}
                
                <div className="space-y-2">
                  {/* Phone */}
                  <a
                    href={`tel:${property.agentId?.phone || '+254726171515'}`}
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <img src="/images/32px-VK_icons_phone_36.png" alt="Phone" className="w-5 h-5 mr-2" />
                    {property.agentId?.phone || '+254726171515'}
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${property.agentId?.whatsapp?.replace(/[^0-9]/g, '') || '254726171515'}?text=I'm%20interested%20in%20the%20property:%20${property.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-green-600"
                  >
                    <img src="/images/32px-WhatsApp.png" alt="WhatsApp" className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${property.agentId?.email || 'inquiries@Anzia Electronics .co.ke'}`}
                    className="flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <img src="/images/32px-Ic_email_48px.png" alt="Email" className="w-5 h-5 mr-2" />
                    {property.agentId?.email || 'inquiries@Anzia Electronics .co.ke'}
                  </a>
                </div>
              </div>

              {/* Map Section */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBHIcD9gmQX1tyFUoOq2u4vSMz8RJKcCgE&q=${encodeURIComponent(property.location)}`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleViewing
          property={property}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </motion.div>
  );
};

export default PropertyDetail;


