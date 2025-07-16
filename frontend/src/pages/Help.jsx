import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Package, 
  RefreshCw, 
  Truck, 
  CreditCard, 
  Shield, 
  Phone, 
  Mail,
  MessageCircle
} from '../utils/icons.jsx';

const Help = () => {
  const [activeSection, setActiveSection] = useState('faqs');
  const sectionRefs = {
    faqs: useRef(null),
    shipping: useRef(null),
    returns: useRef(null),
    payment: useRef(null),
    contact: useRef(null)
  };

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that section
    const hash = window.location.hash.replace('#', '');
    if (hash && sectionRefs[hash]) {
      setActiveSection(hash);
      setTimeout(() => {
        sectionRefs[hash].current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const scrollToSection = (section) => {
    setActiveSection(section);
    sectionRefs[section].current?.scrollIntoView({ behavior: 'smooth' });
    // Update URL hash without page jump
    window.history.pushState(null, null, `#${section}`);
  };

  const helpSections = [
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'contact', label: 'Contact Us', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help You?</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to frequently asked questions and learn more about our services.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {helpSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center px-4 py-2 rounded-full transition-colors ${activeSection === section.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              <section.icon className="w-5 h-5 mr-2" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* FAQs Section */}
          <section ref={sectionRefs.faqs} id="faqs" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-primary-600" />
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <FAQItem 
                  question="How do I track my order?"
                  answer="You can track your order by logging into your account and visiting the 'My Orders' section. Alternatively, you can use the tracking number provided in your shipping confirmation email."
                />
                <FAQItem 
                  question="What payment methods do you accept?"
                  answer="We accept M-Pesa mobile payments. We ensure all transactions are secure and protected."
                />
                <FAQItem 
                  question="How long will it take to receive my order?"
                  answer="Delivery times vary depending on your location. Orders within Nairobi typically arrive within 1-3 business days. Orders to other regions may take 3-7 business days."
                />
                <FAQItem 
                  question="Do you offer international shipping?"
                  answer="Currently, we only ship within Kenya. We're working on expanding our shipping options to other countries in East Africa."
                />
                <FAQItem 
                  question="What is your return policy?"
                  answer="We offer a 7-day return policy for most products. Items must be in their original condition with all packaging and accessories. Please visit our Returns & Refunds section for more details."
                />
              </div>
            </div>
          </section>

          {/* Shipping Section */}
          <section ref={sectionRefs.shipping} id="shipping" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Truck className="w-6 h-6 mr-2 text-primary-600" />
                Shipping Information
              </h2>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold mb-3">Delivery Areas</h3>
                  <p className="text-gray-700 mb-4">We currently deliver to all major cities and towns across Kenya.</p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Nairobi Metropolitan Area</li>
                    <li>Mombasa</li>
                    <li>Kisumu</li>
                    <li>Nakuru</li>
                    <li>Eldoret</li>
                    <li>And many more locations</li>
                  </ul>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold mb-3">Delivery Times</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-1">Nairobi</span>
                      <span className="text-gray-700">1-3 business days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-1">Major Cities</span>
                      <span className="text-gray-700">2-5 business days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-1">Other Areas</span>
                      <span className="text-gray-700">3-7 business days</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Shipping Costs</h3>
                  <p className="text-gray-700 mb-4">Our shipping costs are calculated based on your location and the size/weight of your order.</p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    <li>Free shipping on orders above KSh 5,000 within Nairobi</li>
                    <li>Standard shipping within Nairobi: KSh 200 - 400</li>
                    <li>Shipping to other regions: KSh 300 - 800</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Returns Section */}
          <section ref={sectionRefs.returns} id="returns" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <RefreshCw className="w-6 h-6 mr-2 text-primary-600" />
                Returns & Refunds
              </h2>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold mb-3">Return Policy</h3>
                  <p className="text-gray-700 mb-4">We want you to be completely satisfied with your purchase. If you're not, you may be eligible to return it for a refund.</p>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>Returns must be initiated within 7 days of receiving your order</li>
                    <li>Products must be in their original condition with all packaging and accessories</li>
                    <li>Some products, such as software and personal items, are not eligible for return</li>
                    <li>Defective products can be returned for replacement or refund within the warranty period</li>
                  </ul>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold mb-3">How to Return an Item</h3>
                  <ol className="list-decimal pl-5 text-gray-700 space-y-2">
                    <li>Contact our customer service team to initiate a return</li>
                    <li>Fill out the return form provided by our team</li>
                    <li>Package the item securely in its original packaging if possible</li>
                    <li>Ship the item back using our recommended shipping method</li>
                    <li>Once received and inspected, we'll process your refund</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Refund Process</h3>
                  <p className="text-gray-700 mb-4">Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.</p>
                  <p className="text-gray-700">If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section ref={sectionRefs.payment} id="payment" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-primary-600" />
                Payment Methods
              </h2>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold mb-3">M-Pesa Payments</h3>
                  <p className="text-gray-700 mb-4">We accept M-Pesa mobile payments for all purchases.</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">How to Pay with M-Pesa:</h4>
                    <ol className="list-decimal pl-5 text-gray-700 space-y-2">
                      <li>Select M-Pesa as your payment method at checkout</li>
                      <li>You'll receive an STK push to your registered phone number</li>
                      <li>Enter your M-Pesa PIN to complete the payment</li>
                      <li>You'll receive a confirmation message once the payment is processed</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Secure Payments</h3>
                  <div className="flex items-start space-x-4">
                    <Shield className="w-8 h-8 text-primary-600 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 mb-2">All payments are processed securely. We use industry-standard encryption to protect your personal and financial information.</p>
                      <p className="text-gray-700">We never store your M-Pesa PIN or sensitive payment details on our servers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section ref={sectionRefs.contact} id="contact" className="scroll-mt-24">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-2 text-primary-600" />
                Contact Us
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                  <p className="text-gray-700 mb-6">Have questions or need assistance? Our customer support team is here to help.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-700">+254 700 000 000</p>
                        <p className="text-sm text-gray-500">Mon-Fri, 8am-6pm</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-700">support@anziaelectronics.com</p>
                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MessageCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="text-gray-700">+254 700 000 000</p>
                        <p className="text-sm text-gray-500">Available for quick inquiries</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Send Us a Message</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                        placeholder="Your email"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        id="message" 
                        rows="4" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden">
        <p className="py-3 text-gray-600">{answer}</p>
      </motion.div>
    </div>
  );
};

export default Help;