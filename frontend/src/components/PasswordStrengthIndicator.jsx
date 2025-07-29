import { checkPasswordStrength, getPasswordStrengthLabel } from '../utils/passwordStrength.js';

const PasswordStrengthIndicator = ({ password }) => {
  const { score, feedback } = checkPasswordStrength(password);
  const { label, color } = getPasswordStrengthLabel(score);
  
  const colorClasses = {
    red: 'bg-red-500 text-red-700',
    orange: 'bg-orange-500 text-orange-700',
    yellow: 'bg-yellow-500 text-yellow-700',
    green: 'bg-green-500 text-green-700'
  };
  
  if (!password) return null;
  
  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color].split(' ')[0]}`}
            style={{ width: `${(score / 6) * 100}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium ${colorClasses[color].split(' ')[1]}`}>
          {label}
        </span>
      </div>
      {feedback.length > 0 && (
        <ul className="text-xs text-gray-600 space-y-1">
          {feedback.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;