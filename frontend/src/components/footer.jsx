import { useState } from 'react';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Youtube,
} from '../utils/icons.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import logoImg from '../assets/images/logo.svg';
import whatsAppIcon from '../../public/images/32px-WhatsApp.png';
import twitterIcon from '../../public/images/32px-X_logo_2023.png';
import facebookIcon from '../../public/images/64px-Facebook_f_logo_(2019).png';
import instagramIcon from '../../public/images/32px-Instagram_logo_2022.png';
import youtubeIcon from '../../public/images/32px-YouTube_full-color_icon_(2017).png';
import locationIcon from '../../public/images/32px-Pin_point_location_SVG_black.png';
import phoneIcon from '../../public/images/32px-VK_icons_phone_36.png';
import emailIcon from '../../public/images/32px-Ic_email_48px.png';
import SocialLinks from './SocialLinks';

// Mobile Collapsible Footer Section
const MobileFooterSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-3 lg:border-none lg:py-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left lg:hidden"
      >
        <h3 className="text-sm font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase">
          {title}
        </h3>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-3 lg:mt-0 lg:h-auto lg:opacity-100"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

MobileFooterSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

// Footer Column Component
const FooterColumn = ({ title, children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {title && (
        <h3 className="hidden lg:block text-sm font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase mb-4">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
};

FooterColumn.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number
};

// Footer Link Component
const FooterLink = ({ href, children }) => {
  return (
    <a 
      href={href} 
      className="flex items-center text-base text-gray-600 dark:text-gray-400 transition-all duration-200 hover:text-primary-600 hover:translate-x-1 py-1.5 lg:py-0"
    >
      <ChevronRight className="w-3.5 h-3.5 mr-1 text-primary-500 opacity-0 transition-all duration-200 group-hover:opacity-100" />
      {children}
    </a>
  );
};

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

// WhatsApp Button Component
const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const message = "Hi, I'm interested in your electronic products. Can you provide more information?";
    const phoneNumber = "+254700000000";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <img 
        src={whatsAppIcon} 
        alt="WhatsApp" 
        className="w-6 h-6" 
      />
      <span className="ml-2 hidden md:inline">Chat with us</span>
    </motion.button>
  );
};

// Newsletter Component
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [optIn, setOptIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!optIn) {
      toast.error('Please confirm you want to receive updates');
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://anzia-electronics-api.onrender.com';
      const response = await axios.post(`${API_URL}/api/newsletter/subscribe`, { email });
      if (response.status === 200 || response.status === 201) {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
        setOptIn(false);
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error('Email already subscribed or invalid.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase mb-4">Stay Updated</h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
        Subscribe to our newsletter for the latest product updates, special offers, and electronics insights.
      </p>
      
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex flex-col gap-3">
          <div className="relative flex-grow">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 pr-4 py-3 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex items-start mb-2">
            <div className="flex items-center h-5">
              <input
                id="newsletter-opt-in"
                name="newsletter-opt-in"
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <label htmlFor="newsletter-opt-in" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              I want to receive updates and newsletter emails
            </label>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="bg-primary-500 text-white px-4 py-3 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 disabled:opacity-70 sm:w-auto w-full"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                <span>Subscribe</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        By subscribing, you agree to our <a href="/policy-document" className="underline hover:text-primary-600">Privacy Policy</a>.
      </p>
    </div>
  );
};

// Main Footer Component
const companyLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const helpLinks = [
  { name: 'Customer Support', href: '/contact' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Terms & Conditions', href: '/policy-document' },
  { name: 'Privacy Policy', href: '/policy-document' },
];

const contactInfo = [
  { 
    icon: MapPin, 
    text: 'Nairobi, Kenya - Serving Nationwide',
    href: 'https://maps.google.com/?q=Nairobi,Kenya',
    imgSrc: locationIcon
  },
  { 
    icon: Phone, 
    text: '+254 700 000 000',
    href: 'tel:+254700000000',
    imgSrc: phoneIcon
  },
  { 
    icon: Mail, 
    text: 'info@anziaelectronics.co.ke',
    href: 'mailto:info@anziaelectronics.co.ke',
    imgSrc: emailIcon
  },
];

const Footer = () => {
  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-12 lg:pt-16 pb-12 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand section - Always visible above other sections on mobile */}
          <div className="mb-10">
            <div className="flex items-center justify-center lg:justify-start">
              <img 
                src={logoImg} 
                alt="Anzia Electronics" 
                className="h-12 w-auto" 
              />
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700">
                ANZIA ELECTRONICS
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-center lg:text-left lg:mt-6 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Your trusted supplier of high-quality electronic tools, appliances, and machinery for homes, businesses, and workshops. We specialize in both light and heavy-duty equipment for professionals and DIY enthusiasts.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <SocialLinks />
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:grid grid-cols-12 gap-8">
            {/* Quick Links Column */}
            <FooterColumn title="Quick Links" className="col-span-2" delay={0.2}>
              <ul className="space-y-3">
                {companyLinks.map(link => (
                  <li key={link.name} className="group">
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            {/* Help Column */}
            <FooterColumn title="Support" className="col-span-2" delay={0.3}>
              <ul className="space-y-3">
                {helpLinks.map(link => (
                  <li key={link.name} className="group">
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            {/* Contact Info */}
            <FooterColumn title="Contact Us" className="col-span-3" delay={0.4}>
              <ul className="space-y-4">
                {contactInfo.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className="flex items-start text-gray-600 hover:text-primary-600 transition-colors duration-200"
                      target={item.icon === MapPin ? "_blank" : undefined}
                      rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                    >
                      {item.imgSrc ? (
                        <img 
                          src={item.imgSrc} 
                          alt={item.text} 
                          className="w-5 h-5 mt-1 mr-3 flex-shrink-0" 
                        />
                      ) : (
                        <item.icon className="w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                      )}
                      <span className="text-sm">{item.text}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a 
                    href="https://wa.me/254726171515" 
                    className="flex items-start text-gray-600 hover:text-green-600 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img 
                      src={whatsAppIcon} 
                      alt="WhatsApp" 
                      className="w-5 h-5 mt-1 mr-3 flex-shrink-0" 
                    />
                    <span className="text-sm">WhatsApp Chat</span>
                  </a>
                </li>
              </ul>
            </FooterColumn>
            
            {/* Newsletter */}
            <div className="col-span-5">
              <Newsletter />
            </div>
          </div>

          {/* Mobile Accordions */}
          <div className="lg:hidden space-y-4">
            <MobileFooterSection title="Quick Links">
              <ul className="space-y-2 py-2">
                {companyLinks.map(link => (
                  <li key={link.name} className="group">
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </MobileFooterSection>

            <MobileFooterSection title="Support">
              <ul className="space-y-2 py-2">
                {helpLinks.map(link => (
                  <li key={link.name} className="group">
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </MobileFooterSection>

            <MobileFooterSection title="Contact Us">
              <ul className="space-y-3 py-2">
                {contactInfo.map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.href} 
                      className="flex items-start text-gray-600 hover:text-primary-600 transition-colors duration-200"
                      target={item.icon === MapPin ? "_blank" : undefined}
                      rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                    >
                      {item.imgSrc ? (
                        <img 
                          src={item.imgSrc} 
                          alt={item.text} 
                          className="w-5 h-5 mt-1 mr-3 flex-shrink-0" 
                        />
                      ) : (
                        <item.icon className="w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                      )}
                      <span className="text-sm">{item.text}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a 
                    href="https://wa.me/254726171515" 
                    className="flex items-start text-gray-600 hover:text-green-600 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img 
                      src={whatsAppIcon} 
                      alt="WhatsApp" 
                      className="w-5 h-5 mt-1 mr-3 flex-shrink-0" 
                    />
                    <span className="text-sm">WhatsApp Chat</span>
                  </a>
                </li>
              </ul>
            </MobileFooterSection>

            <div className="pt-6 pb-4">
              <Newsletter />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} ANZIA ELECTRONICS. All Rights Reserved.
          </p>
          
          <motion.a
            href="/products"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Browse Our Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.a>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </footer>
  );
};

export default Footer;


