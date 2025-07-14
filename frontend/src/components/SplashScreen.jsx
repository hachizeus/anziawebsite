import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.svg';

const SplashScreen = ({ onComplete }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Wait for exit animation to complete
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: showSplash ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          duration: 0.5 
        }}
        className="flex flex-col items-center"
      >
        <motion.img 
          src={logo} 
          alt="Makini Realtors" 
          className="w-48 h-48"
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="mt-6 h-1 w-32 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "8rem" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;

