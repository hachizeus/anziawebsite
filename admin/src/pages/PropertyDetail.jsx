import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Home, Users, Upload } from 'lucide-react';
import BanknoteIcon from '../components/BanknoteIcon';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [document, setDocument] = useState({
    title: '',
    file: null
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const token = localStorage.getItem('token');
        
        // Fetch property details
        const propertyResponse = await axios.get(`${backendUrl}/api/products/single/${id}`);
        setProperty(propertyResponse.data.property);
        
        // Fetch tenant details if property is rented
        if (propertyResponse.data.property.availability === 'rented') {
          try {
            const tenantResponse = await axios.get(`${backendUrl}/api/tenants/property/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (tenantResponse.data && tenantResponse.data.tenant) {
              setTenant(tenantResponse.data.tenant);
            }
          } catch (err) {
            console.log('No tenant found for this property:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        toast.error('Failed to load property details');
      }
      setLoading(false);
    };

    fetchPropertyDetails();
  }, [id]);

  const handleDocumentChange = (e) => {
    if (e.target.name === 'file') {
      setDocument({
        ...document,
        file: e.target.files[0]
      });
    } else {
      setDocument({
        ...document,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    
    if (!document.title || !document.file) {
      toast.error('Please provide both title and file');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', document.title);
    formData.append('file', document.file);
    formData.append('propertyId', id);
    if (tenant) {
      formData.append('userId', tenant.userId._id);
    }
    
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
      
      await axios.post(`${backendUrl}/api/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Document uploaded successfully');
      setShowDocumentUpload(false);
      setDocument({ title: '', file: null });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    }
  };

  const calculateNextPaymentDate = () => {
    if (!tenant) return null;
    
    const leaseStart = new Date(tenant.leaseStart);
    const leaseEnd = new Date(tenant.leaseEnd);
    const today = new Date();
    
    // Check if rent was paid in full
    if (tenant.paymentHistory && tenant.paymentHistory.some(payment => 
      payment.amount >= tenant.rentAmount * 6 || payment.notes?.toLowerCase().includes('paid in full'))) {
      // If paid in full, next payment is at lease end
      const daysRemaining = Math.ceil((leaseEnd - today) / (1000 * 60 * 60 * 24));
      
      return {
        date: leaseEnd,
        daysRemaining,
        isPaidInFull: true
      };
    }
    
    // For new leases, next payment is 14 days after lease start
    const twoWeeksAfterStart = new Date(leaseStart);
    twoWeeksAfterStart.setDate(leaseStart.getDate() + 14);
    
    if (today < twoWeeksAfterStart) {
      const daysRemaining = Math.ceil((twoWeeksAfterStart - today) / (1000 * 60 * 60 * 24));
      return {
        date: twoWeeksAfterStart,
        daysRemaining,
        isFirstPayment: true
      };
    }
    
    // Regular monthly payment calculation
    const nextPaymentDate = new Date(today.getFullYear(), today.getMonth(), leaseStart.getDate());
    
    // If today is past the payment date this month, move to next month
    if (today.getDate() > leaseStart.getDate()) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
    
    // Calculate days remaining
    const daysRemaining = Math.ceil((nextPaymentDate - today) / (1000 * 60 * 60 * 24));
    
    return {
      date: nextPaymentDate,
      daysRemaining
    };
  };

  const nextPayment = calculateNextPaymentDate();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#91BB3E]"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Property not found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-6">
        <Link to="/list" className="text-blue-600 hover:underline">
          &larr; Back to Properties
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Link
            to={`/update/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Edit Property
          </Link>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Property Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {property.image && property.image.length > 0 && (
              <img 
                src={property.image[0]} 
                alt={property.title} 
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-6">
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Home className="w-5 h-5 mx-auto text-gray-600" />
                  <p className="mt-1 text-sm text-gray-500">Type</p>
                  <p className="font-medium">{property.type}</p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <BanknoteIcon className="w-5 h-5 mx-auto text-gray-600" />
                  <p className="mt-1 text-sm text-gray-500">Price</p>
                  <p className="font-medium">KSh {property.price.toLocaleString('en-KE')}</p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 mx-auto text-gray-600" />
                  <p className="mt-1 text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{property.availability}</p>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Home className="w-5 h-5 mx-auto text-gray-600" />
                  <p className="mt-1 text-sm text-gray-500">Purpose</p>
                  <p className="font-medium capitalize">
                    {property.purpose === 'sale' ? 'For Sale' :
                     property.purpose === 'rent' ? 'For Rent' :
                     property.purpose === 'lease' ? 'For Lease' :
                     property.purpose === 'booking' ? 'For Booking' : 'N/A'}
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 mb-6">{property.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Beds</p>
                  <p className="font-medium">{property.beds}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Baths</p>
                  <p className="font-medium">{property.baths}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Sq Ft</p>
                  <p className="font-medium">{property.sqft}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{property.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Information */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Tenant Information
            </h2>
            
            {tenant ? (
              <div>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">{tenant.userId.name}</h3>
                  <p className="text-sm text-gray-500">{tenant.userId.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lease Period:</span>
                    <span>
                      {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent:</span>
                    <span className="font-medium">KSh {tenant.rentAmount.toLocaleString('en-KE')}</span>
                  </div>
                  
                  {nextPayment && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700">
                        {nextPayment.isPaidInFull ? 'Lease End Date' : 
                         nextPayment.isFirstPayment ? 'First Payment Due' : 'Next Payment'}
                      </h4>
                      <p className="text-sm">
                        {nextPayment.date.toLocaleDateString()}
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {nextPayment.daysRemaining} days remaining
                        </span>
                      </p>
                      {nextPayment.isPaidInFull && (
                        <p className="text-xs text-blue-600 mt-1">Rent paid in full for lease duration</p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Link
                      to={`/tenants/${tenant._id}`}
                      className="block w-full text-center bg-[#91BB3E] hover:bg-[#82a737] text-white font-medium py-2 px-4 rounded-md"
                    >
                      View Tenant Details
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No tenant assigned to this property.</p>
                {property.availability !== 'rented' && (
                  <Link
                    to={`/tenants/add?propertyId=${id}`}
                    className="inline-block bg-[#91BB3E] hover:bg-[#82a737] text-white font-medium py-2 px-4 rounded-md"
                  >
                    Add Tenant
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;