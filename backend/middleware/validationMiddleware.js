import validator from 'validator';

// Validation schemas
const schemas = {
  email: (value) => validator.isEmail(value),
  password: (value) => value && value.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
  name: (value) => value && value.length >= 2 && value.length <= 50 && /^[a-zA-Z\s'-]+$/.test(value),
  phone: (value) => !value || /^[0-9+\s()-]{10,15}$/.test(value),
  price: (value) => !isNaN(value) && value >= 0,
  productName: (value) => value && value.length >= 2 && value.length <= 200,
  category: (value) => value && value.length >= 2 && value.length <= 100
};

// Generic validation middleware
export const validateFields = (fieldRules) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(fieldRules)) {
      const value = req.body[field];
      
      // Check required fields
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      // Skip validation if field is optional and empty
      if (!rules.required && (!value || value.toString().trim() === '')) {
        continue;
      }
      
      // Apply validation rules
      if (rules.type && schemas[rules.type] && !schemas[rules.type](value)) {
        errors.push(`${field} is invalid`);
      }
      
      // Custom validation
      if (rules.custom && !rules.custom(value)) {
        errors.push(rules.message || `${field} is invalid`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// Specific validation middlewares
export const validateUserRegistration = validateFields({
  name: { required: true, type: 'name' },
  email: { required: true, type: 'email' },
  password: { required: true, type: 'password' }
});

export const validateUserLogin = validateFields({
  email: { required: true, type: 'email' },
  password: { required: true }
});

export const validateProduct = validateFields({
  name: { required: true, type: 'productName' },
  price: { required: true, type: 'price' },
  category: { required: true, type: 'category' },
  brand: { required: false },
  description: { required: false }
});

export const validateContactForm = validateFields({
  name: { required: true, type: 'name' },
  email: { required: true, type: 'email' },
  phone: { required: false, type: 'phone' },
  message: { 
    required: true,
    custom: (value) => value && value.length >= 10 && value.length <= 1000,
    message: 'Message must be between 10 and 1000 characters'
  }
});

// Sanitize input data
export const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return validator.escape(value.trim());
    }
    return value;
  };
  
  // Sanitize body
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = sanitizeValue(req.body[key]);
    }
  }
  
  // Sanitize query params
  if (req.query) {
    for (const key in req.query) {
      req.query[key] = sanitizeValue(req.query[key]);
    }
  }
  
  next();
};

export default { validateFields, validateUserRegistration, validateUserLogin, validateProduct, validateContactForm, sanitizeInput };