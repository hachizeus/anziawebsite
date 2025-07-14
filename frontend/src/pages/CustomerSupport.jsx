import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  FileText, 
  AlertCircle, 
  CheckCircle 
} from '../utils/icons.jsx';

const CustomerSupport = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <MessageSquare className="h-12 w-12 text-primary-600 mx-auto" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Customer Support
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            We're here to help you with any questions or concerns
          </p>
        </div>
        
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
          >
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full mb-4">
              <Phone className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Speak directly with our customer service team
            </p>
            <a 
              href="tel:+254726171515" 
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              +254 726 171 515
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Available Monday-Friday, 8am-6pm EAT
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
          >
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full mb-4">
              <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Send us an email and we'll respond within 24 hours
            </p>
            <a 
              href="mailto:support@Anzia Electronics .co.ke" 
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              support@Anzia Electronics .co.ke
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Available 24/7
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
          >
            <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full mb-4">
              <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">WhatsApp Support</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Chat with us directly through WhatsApp
            </p>
            <a 
              href="https://wa.me/254726171515" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Start WhatsApp Chat
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Available Monday-Saturday, 8am-8pm EAT
            </p>
          </motion.div>
        </div>
        
        {/* Support Hours */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-16"
        >
          <div className="flex items-center mb-6">
            <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support Hours</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Office Hours</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>9:00 AM - 3:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday & Holidays</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Emergency Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                For urgent property emergencies outside of regular business hours:
              </p>
              <a 
                href="tel:+254726171515" 
                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                <Phone className="h-4 w-4 mr-1" />
                Emergency Hotline
              </a>
            </div>
          </div>
        </motion.div>
        
        {/* Common Support Topics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-16"
        >
          <div className="flex items-center mb-6">
            <HelpCircle className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Common Support Topics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Account Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Help with account creation, login issues, profile updates, and password resets.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Property Listings</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Assistance with property searches, saved listings, and viewing appointments.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Tenant Services</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Support for maintenance requests, rent payments, and lease questions.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Property Owner Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Help with property management services, financial reports, and tenant placement.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="/faqs" 
              className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              View our full FAQ section
            </a>
          </div>
        </motion.div>
        
        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center mb-6">
            <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send Us a Message</h2>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 dark:text-white"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 dark:text-white"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 dark:text-white"
                placeholder="How can we help you?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 dark:text-white"
                placeholder="Please describe your issue or question in detail"
                required
              ></textarea>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="privacy"
                  name="privacy"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="privacy" className="font-medium text-gray-700 dark:text-gray-300">
                  I agree to the <a href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomerSupport;


