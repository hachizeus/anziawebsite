import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const MombasaProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Mombasa properties
    const fetchProperties = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/properties?location=Mombasa');
        const data = await response.json();
        setProperties(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Mombasa properties:', error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
      <Helmet>
        <title>Mombasa Real Estate | Beach Properties in Mombasa | Makini Realtors</title>
        <meta 
          name="description" 
          content="Find your dream coastal property in Mombasa with Makini Realtors. Browse beachfront apartments, villas, and commercial properties in Nyali, Bamburi, Shanzu, and other top Mombasa locations." 
        />
        <meta 
          name="keywords" 
          content="Mombasa real estate, property Mombasa, houses for sale Mombasa, beachfront property, Nyali beach apartments, Bamburi property, Shanzu villas, Mombasa property agents" 
        />
        <link rel="canonical" href="https://Anzia Electronics .co.ke/properties/mombasa" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">
          Premium Coastal Properties in Mombasa
        </h1>
        
        <p className="text-lg text-gray-700 mb-6">
          Discover exceptional beachfront and coastal properties in Mombasa. From luxury apartments with ocean views to spacious family villas near the beach, Makini Realtors offers the finest selection of real estate on Kenya's coast.
        </p>

        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-3">Popular Mombasa Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/properties/mombasa/nyali" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Nyali</Link>
            <Link to="/properties/mombasa/bamburi" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Bamburi</Link>
            <Link to="/properties/mombasa/shanzu" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Shanzu</Link>
            <Link to="/properties/mombasa/diani" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Diani</Link>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Featured Mombasa Properties</h2>
        
        {loading ? (
          <div className="text-center py-8">Loading properties...</div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for properties */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="/images/mombasa-beachfront.jpg" 
                alt="Beachfront Villa in Nyali" 
                className="w-full h-48 object-cover"
                width="400"
                height="300"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">Beachfront Villa in Nyali</h3>
                <p className="text-gray-600">4 Bed | 3 Bath | 2,500 sq.ft</p>
                <p className="font-bold mt-2">KSh 35,000,000</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No properties found. Please check back later.</p>
          </div>
        )}
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Why Invest in Mombasa Real Estate?</h2>
          <p className="mb-4">
            Mombasa, Kenya's second-largest city and major coastal destination, offers excellent investment opportunities in real estate. With its beautiful beaches, growing tourism industry, and strategic port location, property values in Mombasa continue to appreciate.
          </p>
          <p>
            Whether you're looking for a vacation home, an investment property, or commercial space, our team of expert real estate agents can help you find the perfect property in Mombasa.
          </p>
        </div>
      </div>
    </>
  );
};

export default MombasaProperties;

