import { motion } from 'framer-motion';
import { Moon, Sun } from '../utils/icons.jsx';
import { useTheme } from '../context/ThemeContext';

const FloatingThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg
        bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
        hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="h-6 w-6 text-yellow-400" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </motion.button>
  );
};

export default FloatingThemeToggle;


