
import { motion } from 'framer-motion';

const Companies = () => {
  return (
    <div className="mt-16 my-3 mx-6">
      {/* Companies Section - Content removed as requested */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl pb-12"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Content removed as requested */}
        </div>
      </motion.div>
    </div>
  );
};

export default Companies;

