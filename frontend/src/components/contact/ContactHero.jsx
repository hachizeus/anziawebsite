import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center my-3 sm:my-6 mx-2 sm:mx-6 rounded-xl sm:rounded-2xl overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-gray-600"
          animate={{
            background: [
              'linear-gradient(to bottom right, rgba(145, 187, 62, 1), rgba(121, 158, 51, 0.9), rgba(75, 75, 75, 0.8))',
              'linear-gradient(to bottom right, rgba(121, 158, 51, 0.9), rgba(75, 75, 75, 0.8), rgba(145, 187, 62, 1))',
              'linear-gradient(to bottom right, rgba(75, 75, 75, 0.8), rgba(145, 187, 62, 1), rgba(121, 158, 51, 0.9))'
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Animated shapes */}
        <div className="absolute inset-0 opacity-20">
          <motion.div 
            className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-primary-300"
            animate={{ 
              x: [0, 30, 0, -30, 0],
              y: [0, -30, 0, 30, 0],
              scale: [1, 1.1, 1, 0.9, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-gray-400"
            animate={{ 
              x: [0, -40, 0, 40, 0],
              y: [0, 40, 0, -40, 0],
              scale: [1, 0.9, 1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjMiPjxwYXRoIGQ9Ik01IDEwQzMuODk1IDEwIDMgMTAuODk1IDMgMTJ2MzhjMCAxLjEwNS44OTUgMiAyIDJoMzhWMTBINXptMzgtMkg1QzIuODEgOCAxIDkuODEgMSAxMnYzOGMwIDIuMTkgMS43OSA0IDQgNGg0MWMxLjEwNSAwIDItLjg5NSAyLTJWMTBjMC0xLjEwNS0uODk1LTItMi0yaC0zeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative text-center text-white px-2 sm:px-4 max-w-4xl mx-auto z-10"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 leading-tight">
          Get in Touch With Us
        </h1>
        <p className="text-base sm:text-lg md:text-xl leading-relaxed font-light">
          Have questions about our properties? Need assistance with finding your perfect home?
          Our team is here to help you every step of the way.
        </p>
        
        {/* Decorative line */}
        <motion.div 
          className="w-24 h-1 bg-white mx-auto mt-8"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 96, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
      </motion.div>
    </div>
  );
}

