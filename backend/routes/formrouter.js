import express from 'express';
import { submitForm } from '../controller/formcontroller.js';

const router = express.Router();

router.post('/submit', submitForm);
router.post('/contact', submitForm);

// Test endpoint with full system check
router.get('/test', async (req, res) => {
  try {
    // Test 1: Check models
    const Form = (await import('../models/formmodel.js')).default;
    const AdminNotification = (await import('../models/adminNotificationModel.js')).default;
    
    // Test 2: Check notification controller
    const { createNotification } = await import('../controller/adminNotificationController.js');
    
    // Test 3: Count existing data
    const formCount = await Form.countDocuments();
    const notificationCount = await AdminNotification.countDocuments();
    
    res.json({ 
      success: true, 
      message: 'All form components are working correctly',
      systemStatus: {
        modelsLoaded: true,
        controllerLoaded: true,
        existingForms: formCount,
        existingNotifications: notificationCount,
        supportedNotificationTypes: ['agent_request', 'product_approval', 'maintenance', 'inquiry', 'contact_message', 'system'],
        supportedRelatedModels: ['Agent', 'product', 'User', 'MaintenanceRequest', 'Document', 'Form', null]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'System check failed'
    });
  }
});

// Test form submission with full verification
router.post('/test-submit', async (req, res) => {
  try {
    console.log('\n=== STARTING COMPREHENSIVE FORM TEST ===');
    
    const testForm = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '123456789',
      message: 'This is a test contact message',
      formType: 'contact',
      productTitle: 'Test product'
    };
    
    console.log('Test form data:', testForm);
    
    // Test 1: Check if Form model works
    const Form = (await import('../models/formmodel.js')).default;
    const testFormDoc = new Form(testForm);
    const savedForm = await testFormDoc.save();
    console.log('✅ Form model test passed - ID:', savedForm._id);
    
    // Test 2: Check if notification creation works
    const { createNotification } = await import('../controller/adminNotificationController.js');
    const notification = await createNotification({
      title: 'Test Contact Message',
      message: `${testForm.name} (${testForm.email}) sent a test message about ${testForm.productTitle}.`,
      type: 'contact_message',
      relatedId: savedForm._id,
      relatedModel: 'Form'
    });
    console.log('✅ Notification test passed - ID:', notification._id);
    
    // Test 3: Verify notification was saved
    const AdminNotification = (await import('../models/adminNotificationModel.js')).default;
    const savedNotification = await AdminNotification.findById(notification._id);
    console.log('✅ Notification verification passed:', {
      id: savedNotification._id,
      title: savedNotification.title,
      type: savedNotification.type,
      relatedModel: savedNotification.relatedModel
    });
    
    // Test 4: Count total notifications
    const totalNotifications = await AdminNotification.countDocuments();
    console.log('✅ Total notifications in database:', totalNotifications);
    
    res.json({
      success: true,
      message: 'All tests passed successfully!',
      results: {
        formSaved: {
          id: savedForm._id,
          formType: savedForm.formType
        },
        notificationCreated: {
          id: notification._id,
          type: notification.type,
          title: notification.title
        },
        totalNotifications
      }
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Test agent request
router.post('/test-agent', async (req, res) => {
  try {
    const testAgentForm = {
      name: 'Test Agent',
      email: 'agent@example.com',
      phone: '987654321',
      message: 'I want to become an agent',
      formType: 'agent-request'
    };
    
    const Form = (await import('../models/formmodel.js')).default;
    const savedForm = await Form.create(testAgentForm);
    
    const { createNotification } = await import('../controller/adminNotificationController.js');
    const notification = await createNotification({
      title: 'New Agent Request',
      message: `${testAgentForm.name} (${testAgentForm.email}) has requested to become an agent.`,
      type: 'agent_request',
      relatedId: savedForm._id,
      relatedModel: 'Form'
    });
    
    res.json({
      success: true,
      message: 'Agent request test passed!',
      formId: savedForm._id,
      notificationId: notification._id
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
