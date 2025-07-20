// Eye icons for password visibility using Font Awesome
import React from 'react';

export const FaEye = ({ className = '', ...props }) => (
  <i className={`fas fa-eye ${className}`} {...props}></i>
);

export const FaEyeSlash = ({ className = '', ...props }) => (
  <i className={`fas fa-eye-slash ${className}`} {...props}></i>
);
