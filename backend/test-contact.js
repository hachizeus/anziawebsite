import axios from 'axios';

const testContactForm = async () => {
  try {
    console.log('Testing contact form...');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+254769162665',
      message: 'This is a test message from the contact form.',
      formType: 'contact'
    };

    const response = await axios.post('https://anzia-electronics-api.onrender.com/api/forms/submit', testData);
    
    console.log('Response:', response.data);
    console.log('Status:', response.status);
    
    if (response.data.success) {
      console.log('✅ Contact form test PASSED');
    } else {
      console.log('❌ Contact form test FAILED');
    }
    
  } catch (error) {
    console.log('❌ Contact form test ERROR:', error.message);
    if (error.response) {
      console.log('Error response:', error.response.data);
    }
  }
};

testContactForm();