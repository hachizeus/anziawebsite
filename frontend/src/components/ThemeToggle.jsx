import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from '../utils/icons.jsx';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-full transition-colors
        dark:bg-gray-700 bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;


