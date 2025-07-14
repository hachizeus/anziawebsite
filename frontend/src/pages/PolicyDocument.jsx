import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronDown, ChevronUp } from '../utils/icons.jsx';

const PolicyDocument = () => {
  // Define the policy document pages as styled content
  const policyPages = [
    {
      title: "MAKINI REALTORS – TERMS & CONDITIONS",
      subtitle: "Effective Date: 7/03/2025",
      content: [
        "1. WHO WE ARE",
        "Welcome to Makini Realtors, your trusted property management partner registered in Nairobi, Kenya. We provide professional management of residential and commercial properties on behalf of landlords, real estate investors, and institutional property owners.",
        "",
        "2. ACCEPTANCE OF THESE TERMS",
        "By using our services, website (www.Anzia Electronics .co.ke) or digital platforms, you agree to comply with these Terms & Conditions and all applicable Kenyan laws including the Constitution of Kenya, 2010.",
        "",
        "3. OUR SERVICES INCLUDE:",
        "• Tenant marketing, vetting, onboarding and digital lease execution",
        "• Rent collection through secure mobile money (M-PESA), bank transfers",
        "• Financial management and reporting to landlords",
        "• Routine and emergency property maintenance through vetted vendors",
        "",
        "4. YOUR OBLIGATIONS",
        "• Provide true, accurate and complete information",
        "• Make timely payments through approved channels",
        "• Respect lease obligations and maintain premises",
        "• Use digital platforms responsibly"
      ]
    },
    {
      title: "TERMS & CONDITIONS (CONTINUED)",
      content: [
        "5. PAYMENTS & CHARGES",
        "All payments must be made via official channels such as our M-PESA Paybill or approved bank account. Management fees will be as agreed in your signed agreement.",
        "",
        "6. MAINTENANCE & VENDORS",
        "Makini Realtors coordinates repairs through third-party contractors. We act in good faith to vet service providers but do not guarantee their work beyond reasonable follow-up.",
        "",
        "7. DATA PRIVACY & SECURITY",
        "We handle all personal data in accordance with the Constitution of Kenya, 2010 and the Data Protection Act, 2019.",
        "",
        "8. LIMITATION OF LIABILITY",
        "Makini Realtors will not be liable for indirect or consequential losses. Nothing excludes your rights under Kenyan law.",
        "",
        "Contact: admin@Anzia Electronics .co.ke | www.Anzia Electronics .co.ke"
      ]
    },
    {
      title: "MAKINI REALTORS – PRIVACY POLICY",
      subtitle: "Effective Date: 7/03/2025",
      content: [
        "1. OUR COMMITMENT TO PRIVACY",
        "Makini Realtors respects your right to privacy as guaranteed under Article 31 of the Constitution of Kenya and the Data Protection Act, 2019.",
        "",
        "2. WHAT DATA WE COLLECT",
        "• Identification: Name, ID/passport number, phone, email, address",
        "• Property information: Lease agreements, tenancy records",
        "• Financial information: Payment details (M-PESA, bank details)",
        "• Usage data: Portal logins, device information, IP addresses",
        "",
        "3. HOW WE USE YOUR INFORMATION",
        "• Deliver property management and rent collection services",
        "• Manage leases, payments and compliance obligations",
        "• Communicate about your tenancy or account",
        "• Improve operations and enhance customer experience"
      ]
    },
    {
      title: "PRIVACY POLICY (CONTINUED)",
      content: [
        "4. LEGAL BASIS",
        "Your information is processed with your consent, for contract performance, legal compliance, or legitimate interests.",
        "",
        "5. DATA SHARING",
        "We may share data with vetted third-party vendors, government regulators if legally required, or your landlord for contractual purposes.",
        "",
        "6. DATA SECURITY",
        "We use appropriate technical and organizational measures to secure your data. However, no online system is 100% secure.",
        "",
        "7. YOUR RIGHTS",
        "• Access your personal data",
        "• Correct inaccurate information",
        "• Request deletion (where legally allowed)",
        "• Withdraw consent for certain uses",
        "",
        "Contact: admin@Anzia Electronics .co.ke | www.Anzia Electronics .co.ke"
      ]
    }
  ];
  
  const [currentPage, setCurrentPage] = useState(0);
  
  // Handle navigation
  const nextPage = () => {
    if (currentPage < policyPages.length - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center mb-6">
            <FileText className="h-12 w-12 text-primary-600 mx-auto" />
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Terms & Conditions and Privacy Policy
            </h1>
          </div>
          
          <div className="prose dark:prose-invert prose-lg max-w-none">
            {/* Page navigation */}
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 0}
                className="px-4 py-2 flex items-center text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronUp className="mr-1" /> Previous Page
              </button>
              <span className="text-gray-600 dark:text-gray-300">
                Page {currentPage + 1} of {policyPages.length}
              </span>
              <button 
                onClick={nextPage} 
                disabled={currentPage === policyPages.length - 1}
                className="px-4 py-2 flex items-center text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Page <ChevronDown className="ml-1" />
              </button>
            </div>
            
            {/* Policy document as styled image-like content */}
            <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-inner">
              <div className="p-8 min-h-[600px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                fontFamily: 'Georgia, serif'
              }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {policyPages[currentPage].title}
                  </h2>
                  {policyPages[currentPage].subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {policyPages[currentPage].subtitle}
                    </p>
                  )}
                  <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
                </div>
                
                <div className="space-y-4 text-gray-800 dark:text-gray-200 leading-relaxed">
                  {policyPages[currentPage].content.map((line, index) => (
                    <div key={index} className={`${
                      line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') 
                        ? 'font-semibold text-lg mt-6 text-primary-700 dark:text-primary-400' 
                        : line === '' 
                        ? 'h-2' 
                        : 'text-base'
                    }`}>
                      {line}
                    </div>
                  ))}
                </div>
                
                {/* Document footer */}
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-600 text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>© 2024 Makini Realtors. All rights reserved.</p>
                  <p className="mt-1">Document Page {currentPage + 1} of {policyPages.length}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <a 
                href="/MAKINI REALTORS-Terms & Conditions n Privacy Policy.pdf" 
                download
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="mr-2 h-5 w-5" /> Download PDF
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PolicyDocument;


