import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    {
      id: 'power-tools',
      name: 'Power Tools & Workshop Gear',
      description: 'Drills, angle grinders, sanders, tool sets, and more.',
      icon: '🔧',
      count: 45,
      image: '/images/power-tools.jpg'
    },
    {
      id: 'generators',
      name: 'Generators & Power Equipment',
      description: 'Petrol and diesel generators, power inverters, and voltage regulators.',
      icon: '⚡',
      count: 28,
      image: '/images/generators.jpg'
    },
    {
      id: 'welding',
      name: 'Welding Machines & Accessories',
      description: 'ARC, MIG, and TIG welders, with cables and safety gear.',
      icon: '🔥',
      count: 32,
      image: '/images/welding.jpg'
    },
    {
      id: 'electronics',
      name: 'Electronics & Appliances',
      description: 'Extension cables, rechargeable lights, trimmers, solar accessories, and electronic components.',
      icon: '💡',
      count: 67,
      image: '/images/electronics.jpg'
    },
    {
      id: 'home-office',
      name: 'Home & Office Gadgets',
      description: 'Incubators, water pumps, fans, blenders, heaters, and electric cookers.',
      icon: '🏠',
      count: 54,
      image: '/images/home-office.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Product Categories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Explore our wide range of high-quality electronic tools, appliances, and machinery for homes, businesses, and workshops.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-6xl">{category.icon}</span>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {category.count} items
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {category.description}
                </p>
                
                <Link
                  to={`/products?category=${category.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:translate-x-1 transition-all duration-300"
                >
                  View Products
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-primary-600 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Need Help Finding the Right Product?</h2>
          <p className="text-xl mb-6 opacity-90">
            Our experts are here to help you choose the perfect equipment for your needs.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Contact Our Experts
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.436L3 21l2.436-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;

