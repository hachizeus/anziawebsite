import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "../utils/eye-icons";
import { motion } from "framer-motion";
import { Loader } from '../utils/icons.jsx';
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';
import { supabase, loginUser, registerUser } from '../services/api';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    

    
    setLoading(true);
    try {
      // Create a cancel token source for the login request
      const source = axios.CancelToken.source();
      const timeoutId = setTimeout(() => {
        source.cancel('Login request timed out');
      }, 15000);
      
      try {
        const response = await api.post('/api/users/login', formData, {
          cancelToken: source.token
        });
        
        clearTimeout(timeoutId);
        
        if (response.data.success) {
          console.log('Login response:', response.data);
          console.log('User role from API:', response.data.user.role);
          
          // Ensure role is properly set
          const userData = response.data.user;
          console.log('User data before login:', userData);
          
          // Store user data in localStorage immediately
          localStorage.setItem('token', response.data.accessToken);
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('loginTime', Date.now().toString());
          

          
          // Update auth context
          await login(response.data.accessToken, userData);
          
          toast.success("Login successful!");
          
          // Redirect based on role with a small delay
          setTimeout(() => {
            if (userData.role === 'tenant') {
              window.location.href = "/dashboard";
            } else if (userData.role === 'admin') {
              window.location.href = "/admin";
            } else {
              window.location.href = "/";
            }
          }, 1000);
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (axios.isCancel(err)) {
          console.log('Login request canceled:', err.message);
          toast.error("Login request timed out. Please try again.");
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        if (error.response.status === 429) {
          toast.error('Server is busy. Please try again in a moment.');
        } else {
          toast.error(error.response.data?.message || "Invalid credentials");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mt-14">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Anzia Electronics 
              </h2>
            </Link>
            <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 dark:text-white"
                placeholder="name@company.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link 
                to="/forget-password"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/signup"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 transition-all duration-200"
            >
              Create an account
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

Login.propTypes = {
  // No props are passed to Login, so no propTypes needed here
};

export default Login;


