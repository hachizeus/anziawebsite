import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from '../utils/icons.jsx';
import BlogCard from './BlogCard';
import PropTypes from 'prop-types';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  }
};

const BlogList = ({ posts, categories = ['All', 'Buying', 'Selling', 'Investment', 'Tips'] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (post.category || 'Real Estate') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search and filter section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredPosts.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} category={selectedCategory !== 'All' ? selectedCategory : null} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
        >
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-white mb-2">No articles found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            We could not find any articles matching your search criteria. 
            Try using different keywords or browse all categories.
          </p>
        </motion.div>
      )}
      
      {/* View all articles button */}
      <div className="text-center mt-16">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl 
            shadow-lg hover:shadow-xl transition-all font-medium inline-flex items-center"
        >
          View All Articles
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.button>
      </div>
    </div>
  );
};

BlogList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      category: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string)
};

export default BlogList;


