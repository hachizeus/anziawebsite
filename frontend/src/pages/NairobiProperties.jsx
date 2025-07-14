import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// Import components as needed
// import PropertyCard from '../components/properties/Propertycard';

const NairobiProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Nairobi properties
    const fetchProperties = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/properties?location=Nairobi');
        const data = await response.json();
        setProperties(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Nairobi properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      <Helmet>
        <title>Nairobi Real Estate | Premium Properties in Nairobi | Makini Realtors</title>
        <meta 
          name="description" 
          content="Find your dream home in Nairobi with Makini Realtors. Browse premium apartments, houses, and commercial properties in Westlands, Karen, Kilimani, and other top Nairobi neighborhoods." 
        />
        <meta 
          name="keywords" 
          content="Nairobi real estate, property Nairobi, houses for sale Nairobi, apartments Nairobi, Westlands property, Karen houses, Kilimani apartments, Nairobi property agents" 
        />
        <link rel="canonical" href="https://Anzia Electronics .co.ke/properties/nairobi" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">
          Premium Real Estate in Nairobi
        </h1>
        
        <p className="text-lg text-gray-700 mb-6">
          Discover exceptional properties in Nairobi's most sought-after neighborhoods. From luxury apartments in Westlands to spacious family homes in Karen, Makini Realtors offers the finest selection of real estate in Kenya's capital.
        </p>

        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-3">Popular Nairobi Neighborhoods</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/properties/nairobi/westlands" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Westlands</Link>
            <Link to="/properties/nairobi/karen" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Karen</Link>
            <Link to="/properties/nairobi/kilimani" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Kilimani</Link>
            <Link to="/properties/nairobi/lavington" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Lavington</Link>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Featured Nairobi Properties</h2>
        
        {loading ? (
          <div className="text-center py-8">Loading properties...</div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map through properties and render PropertyCard components */}
            {/* {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))} */}
            
            {/* Placeholder for properties */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="/images/nairobi-apartment.jpg" 
                alt="Luxury Apartment in Westlands" 
                className="w-full h-48 object-cover"
                width="400"
                height="300"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">Luxury Apartment in Westlands</h3>
                <p className="text-gray-600">3 Bed | 2 Bath | 1,500 sq.ft</p>
                <p className="font-bold mt-2">KSh 25,000,000</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No properties found. Please check back later.</p>
          </div>
        )}
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Why Invest in Nairobi Real Estate?</h2>
          <p className="mb-4">
            Nairobi, Kenya's capital and largest city, offers excellent investment opportunities in real estate. With a growing economy, expanding middle class, and strategic location as East Africa's business hub, property values in Nairobi continue to appreciate.
          </p>
          <p>
            Whether you're looking for a family home, an investment property, or commercial space, our team of expert real estate agents can help you find the perfect property in Nairobi.
          </p>
        </div>
      </div>
    </>
  );
};

export default NairobiProperties;

