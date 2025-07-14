import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from '../utils/icons.jsx';

export default function MissionVision() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Our Purpose</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At Anzia Electronics, our mission is to provide high-quality electronic tools, 
              appliances, and machinery that empower professionals, businesses, and individuals 
              to achieve their goals. We are committed to delivering exceptional products, 
              expert technical support, and reliable service that exceeds expectations. 
              By offering comprehensive solutions from trusted brands, we enable our customers 
              to work efficiently, safely, and successfully in their respective fields.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To be Kenya's leading supplier of electronic tools and equipment, recognized 
              for our commitment to quality, innovation, and customer satisfaction. We envision 
              a future where every professional, technician, and DIY enthusiast has access to 
              the best tools and equipment to bring their projects to life. Through continuous 
              innovation, strategic partnerships, and unwavering dedication to excellence, 
              we aim to power the success of our customers and contribute to Kenya's 
              technological advancement.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


