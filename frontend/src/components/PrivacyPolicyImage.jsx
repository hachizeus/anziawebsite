import React from 'react';
import { Shield, Lock, Eye, Database } from '../utils/icons.jsx';

const PrivacyPolicyImage = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
      {/* Document Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 mr-3" />
          <h1 className="text-3xl font-bold">MAKINI REALTORS – PRIVACY POLICY</h1>
        </div>
        <p className="text-center text-blue-100">Effective Date: 7/03/2025</p>
      </div>

      {/* Document Body */}
      <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="space-y-8">
          
          {/* Section 1 */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center mb-3">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. OUR COMMITMENT TO PRIVACY</h2>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <p>Makini Realtors respects your right to privacy as guaranteed under Article 31 of the Constitution of Kenya and the Data Protection Act, 2019.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center mb-3">
              <Database className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. WHAT DATA WE COLLECT</h2>
            </div>
            <div className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>• Identification: Name, ID/passport number, phone, email, address</p>
              <p>• Property information: Lease agreements, tenancy records</p>
              <p>• Financial information: Payment details (M-PESA, bank details)</p>
              <p>• Usage data: Portal logins, device information, IP addresses</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <Eye className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. HOW WE USE YOUR INFORMATION</h2>
            </div>
            <div className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>• Deliver property management and rent collection services</p>
              <p>• Manage leases, payments and compliance obligations</p>
              <p>• Communicate about your tenancy or account</p>
              <p>• Improve operations and enhance customer experience</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="border-l-4 border-red-500 pl-6">
            <div className="flex items-center mb-3">
              <Lock className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. YOUR RIGHTS</h2>
            </div>
            <div className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>• Access your personal data</p>
              <p>• Correct inaccurate information</p>
              <p>• Request deletion (where legally allowed)</p>
              <p>• Withdraw consent for certain uses</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Us</h3>
            <div className="text-gray-700 dark:text-gray-300 space-y-1">
              <p>Email: admin@Anzia Electronics .co.ke</p>
              <p>Website: www.Anzia Electronics .co.ke</p>
              <p>Address: Nairobi, Kenya</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Effective Date: 7/03/2025 | © 2024 Makini Realtors. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyImage;


