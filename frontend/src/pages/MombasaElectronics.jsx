import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const MombasaElectronics = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Mombasa electronics products
    const fetchProducts = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/products?location=Mombasa');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Mombasa electronics:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Mombasa Electronics | Power Tools & Equipment in Mombasa | Anzia Electronics</title>
        <meta 
          name="description" 
          content="Find quality electronics and power tools in Mombasa with Anzia Electronics. Browse generators, welding equipment, and professional tools in Nyali, Bamburi, and other Mombasa locations." 
        />
        <meta 
          name="keywords" 
          content="Mombasa electronics, power tools Mombasa, generators Mombasa, welding equipment Mombasa, electronics shop Mombasa, professional tools Mombasa" 
        />
        <link rel="canonical" href="https://anziaelectronics.co.ke/products/mombasa" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">
          Premium Electronics & Tools in Mombasa
        </h1>
        
        <p className="text-lg text-gray-700 mb-6">
          Discover exceptional electronics and power tools in Mombasa. From professional generators to welding equipment and workshop tools, Anzia Electronics offers the finest selection of equipment on Kenya's coast.
        </p>

        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-3">Service Areas in Mombasa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/products?area=nyali" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Nyali</Link>
            <Link to="/products?area=bamburi" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Bamburi</Link>
            <Link to="/products?area=shanzu" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Shanzu</Link>
            <Link to="/products?area=diani" className="p-3 bg-gray-100 rounded hover:bg-primary-50 text-center">Diani</Link>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Featured Electronics in Mombasa</h2>
        
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for products */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="/images/generator-placeholder.jpg" 
                alt="Professional Generator" 
                className="w-full h-48 object-cover"
                width="400"
                height="300"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">Professional Generator 5KVA</h3>
                <p className="text-gray-600">Silent | Fuel Efficient | Portable</p>
                <p className="font-bold mt-2">KSh 85,000</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No products found. Please check back later.</p>
          </div>
        )}
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibent mb-4">Why Choose Electronics in Mombasa?</h2>
          <p className="mb-4">
            Mombasa, Kenya's second-largest city and major coastal hub, offers excellent opportunities for electronics and power tools. With its growing industrial sector, port activities, and construction boom, there's high demand for quality equipment.
          </p>
          <p>
            Whether you're looking for generators, welding equipment, or professional tools, our team of electronics experts can help you find the perfect equipment for your needs in Mombasa.
          </p>
        </div>
      </div>
    </>
  );
};

export default MombasaElectronics;

