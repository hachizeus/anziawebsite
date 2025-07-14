import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from '../utils/icons.jsx';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 px-4 text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 text-gray-600 dark:text-gray-300">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQs = () => {
  const faqs = [
    {
      question: "What services does Makini Realtors provide?",
      answer: "Makini Realtors provides comprehensive property management services including property listing, tenant screening, rent collection, property maintenance, legal compliance, financial reporting, and property marketing. We also offer specialized services for property owners and personalized support for tenants."
    },
    {
      question: "How do I list my property with Makini Realtors?",
      answer: "To list your property with us, you can contact our team through the website contact form, call us directly, or visit our office. We'll arrange a property assessment, discuss your requirements, and create a tailored management plan for your property."
    },
    {
      question: "What areas do you serve?",
      answer: "We primarily serve properties across Kenya with a focus on Nairobi and surrounding areas. Our team has extensive knowledge of the local real estate market and can provide services throughout the country."
    },
    {
      question: "How do you screen potential tenants?",
      answer: "Our tenant screening process includes background checks, credit history review, employment verification, income validation, previous rental history, and personal references. This comprehensive approach helps ensure reliable tenants for your property."
    },
    {
      question: "What fees do you charge for property management?",
      answer: "Our fee structure varies based on the services required and property type. Typically, we charge a percentage of the monthly rental income. Please contact us for a personalized quote based on your specific needs."
    },
    {
      question: "How do you handle property maintenance issues?",
      answer: "We have a network of trusted maintenance professionals who can address issues promptly. Tenants can report maintenance needs through our online portal, and we coordinate repairs based on urgency and owner preferences."
    },
    {
      question: "How often will I receive financial reports?",
      answer: "Property owners receive detailed monthly financial reports showing rental income, expenses, and any maintenance costs. We also provide annual summaries for tax purposes and can customize reporting frequency based on your preferences."
    },
    {
      question: "Can I terminate the property management agreement?",
      answer: "Yes, our management agreements include provisions for termination. The specific terms, including notice periods and any applicable fees, are outlined in the management contract. We strive to maintain transparent relationships with all property owners."
    },
    {
      question: "How do tenants pay rent?",
      answer: "We offer multiple convenient payment options for tenants including online payments through our secure portal, mobile money transfers, direct bank deposits, and automatic recurring payments. This flexibility helps ensure timely rent collection."
    },
    {
      question: "What happens if a tenant doesn't pay rent?",
      answer: "We have established procedures for handling late payments, including prompt notifications, late fee assessment, and structured follow-up. If necessary, we initiate the legal eviction process in accordance with local regulations while keeping you informed throughout."
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <HelpCircle className="h-12 w-12 text-primary-600 mx-auto" />
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Find answers to common questions about our services
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Still have questions?
          </p>
          <a 
            href="/contact" 
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Contact Our Support Team
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQs;


