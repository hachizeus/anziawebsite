import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProductApproval = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://anzia-electronics-api.onrender.com/api/products/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching pending products:', error);
      toast.error('Failed to fetch pending products');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (productId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`https://anzia-electronics-api.onrender.com/api/products/${action}`, {
        productId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success(`Product ${action}d successfully`);
        setProducts(products.filter(p => p._id !== productId));
      }
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
      toast.error(`Failed to ${action} product`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Approval</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products pending approval</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={product.image?.[0] || '/placeholder-product.jpg'} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <p className="text-green-600 font-bold mb-4">KSh {product.price?.toLocaleString()}</p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproval(product._id, 'approve')}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(product._id, 'reject')}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductApproval;