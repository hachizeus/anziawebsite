import { motion } from 'framer-motion';
import { blogPosts } from '../../assets/blogdata';
import BlogList from './BlogList';

const BlogPage = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            Latest Insights
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-primary-600 rounded-full"></div>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-6">
            Expert advice and tips for your real estate journey
          </p>
        </motion.div>
        
        <BlogList posts={blogPosts} />
      </div>
    </section>
  );
};

export default BlogPage;

