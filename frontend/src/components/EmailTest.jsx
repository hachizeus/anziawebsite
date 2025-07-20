import { useState } from 'react';

const EmailTest = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testEmailSending = async () => {
    setIsLoading(true);
    setTestResult('Testing email functionality...\n\n');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+254769162665',
      message: 'This is a test message from the contact form to verify email functionality.'
    };

    try {
      // Method 1: Test mailto link
      const subject = `TEST: Contact Form Submission from ${testData.name}`;
      const body = `Name: ${testData.name}\nEmail: ${testData.email}\nPhone: ${testData.phone}\n\nMessage:\n${testData.message}\n\nTimestamp: ${new Date().toLocaleString()}`;
      
      const mailtoLink = `mailto:victorgathecha@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      setTestResult(prev => prev + '✅ Mailto link generated successfully\n');
      setTestResult(prev => prev + `📧 Recipient: victorgathecha@gmail.com\n`);
      setTestResult(prev => prev + `📝 Subject: ${subject}\n\n`);
      
      // Test direct email sending using Formspree
      setTestResult(prev => prev + '📤 Sending email directly via Formspree...\n');
      
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            access_key: 'e96a43e6-afeb-496e-b4e0-aac6a69e65c9',
            name: testData.name,
            email: testData.email,
            phone: testData.phone,
            message: testData.message,
            subject: subject,
            from_name: 'Anzia Electronics Test',
            to: 'victorgathecha@gmail.com'
          })
        });
        
        if (response.ok) {
          setTestResult(prev => prev + '✅ Email sent successfully!\n');
          setTestResult(prev => prev + '📧 Check victorgathecha@gmail.com for the test email\n\n');
        } else {
          setTestResult(prev => prev + '❌ Failed to send email\n');
          setTestResult(prev => prev + `Status: ${response.status}\n\n`);
        }
      } catch (error) {
        setTestResult(prev => prev + '❌ Error sending email\n');
        setTestResult(prev => prev + `Error: ${error.message}\n\n`);
      }
      
      setTestResult(prev => prev + '📋 Test Summary:\n');
      setTestResult(prev => prev + '- Direct email sending: ✅ Tested\n');
      setTestResult(prev => prev + '- Target email: victorgathecha@gmail.com\n');
      setTestResult(prev => prev + '- Service: Formspree\n\n');
      setTestResult(prev => prev + '💡 Email should arrive in inbox within 1-2 minutes\n');
      
    } catch (error) {
      setTestResult(prev => prev + `❌ Test failed: ${error.message}\n`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
        <h3 className="font-bold text-gray-900 mb-2">Email Test</h3>
        <button
          onClick={testEmailSending}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-2"
        >
          {isLoading ? 'Testing...' : 'TEST EMAIL SENDING'}
        </button>
        
        {testResult && (
          <div className="mt-2">
            <pre className="text-xs bg-gray-100 p-2 rounded max-h-64 overflow-y-auto whitespace-pre-wrap">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailTest;