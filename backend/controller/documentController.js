import Document from '../models/documentModel.js';
import Tenant from '../models/tenantModel.js';
import { uploadToStorage, deleteFromStorage } from '../middleware/fileStorage.js';
import { createNotification } from '../controller/adminNotificationController.js';

// Get all documents (with role-based filtering)
export const getAllDocuments = async (req, res) => {
  try {
    const { role } = req.user;
    let query = {};
    
    // Check if tenantId query parameter is provided
    if (req.query.tenantId) {
      console.log('Filtering documents by tenantId:', req.query.tenantId);
      query.tenantId = req.query.tenantId;
    } else {
      // Filter documents based on user role
      if (role !== 'admin') {
        // For tenants, find their tenant record first
        if (role === 'tenant') {
          const tenant = await Tenant.findOne({ userId: req.user._id });
          if (tenant) {
            console.log('Found tenant record for user:', tenant._id);
            query = {
              $or: [
                { tenantId: tenant._id },
                { accessRoles: role },
                { accessUsers: req.user._id },
                { isPublic: true },
                { uploadedBy: req.user._id }
              ]
            };
          } else {
            console.log('No tenant record found for user');
            query = {
              $or: [
                { accessRoles: role },
                { accessUsers: req.user._id },
                { isPublic: true },
                { uploadedBy: req.user._id }
              ]
            };
          }
        } else {
          query = {
            $or: [
              { accessRoles: role },
              { accessUsers: req.user._id },
              { isPublic: true },
              { uploadedBy: req.user._id }
            ]
          };
        }
      }
    }
    
    const documents = await Document.find(query)
      .populate('uploadedBy', 'name email')
      .populate({
        path: 'tenantId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .populate('property', 'title location')
      .populate('signature.signedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get document by ID
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id)
      .populate('uploadedBy', 'name email')
      .populate('property', 'title location')
      .populate('signature.signedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user has access to this document
    const { role, _id } = req.user;
    const hasAccess = 
      role === 'admin' || 
      document.isPublic || 
      document.accessRoles.includes(role) || 
      document.accessUsers.includes(_id) ||
      document.uploadedBy.equals(_id);
    
    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload new document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('Upload request body:', req.body);
    console.log('TenantId from request:', req.body.tenantId);
    
    // Upload file to storage and get URL
    const fileUrl = await uploadToStorage(req.file);
    
    const documentData = {
      title: req.body.title,
      description: req.body.description || '',
      fileUrl,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      property: req.body.property || null,
      accessRoles: req.body.accessRoles ? JSON.parse(req.body.accessRoles) : ['admin'],
      accessUsers: req.body.accessUsers ? JSON.parse(req.body.accessUsers) : [],
      isPublic: req.body.isPublic === 'true'
    };
    
    // Add tenantId if provided
    if (req.body.tenantId) {
      documentData.tenantId = req.body.tenantId;
      console.log('Setting tenantId:', req.body.tenantId);
      
      // Also add tenant to accessUsers
      try {
        const tenant = await Tenant.findById(req.body.tenantId);
        if (tenant && tenant.userId) {
          if (!documentData.accessUsers) {
            documentData.accessUsers = [];
          }
          documentData.accessUsers.push(tenant.userId);
          documentData.accessRoles.push('tenant');
          console.log('Added tenant user to accessUsers:', tenant.userId);
          
          // Save document first
          const newDocument = new Document(documentData);
          const savedDocument = await newDocument.save();
          
          // Add document to tenant's documents array
          if (!tenant.documents) {
            tenant.documents = [];
          }
          tenant.documents.push(savedDocument._id);
          await tenant.save();
          console.log('Document added to tenant documents');
          
          // Return the saved document
          console.log('Saved document:', {
            id: savedDocument._id,
            title: savedDocument.title,
            tenantId: savedDocument.tenantId,
            fileUrl: savedDocument.fileUrl
          });
          
          return res.status(201).json(savedDocument);
        }
      } catch (err) {
        console.error('Error finding tenant:', err);
      }
    }
    
    console.log('Document data to save:', documentData);
    
    const newDocument = new Document(documentData);
    const savedDocument = await newDocument.save();
    
    console.log('Saved document:', {
      id: savedDocument._id,
      title: savedDocument.title,
      tenantId: savedDocument.tenantId,
      fileUrl: savedDocument.fileUrl
    });
    
    res.status(201).json(savedDocument);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload new document for tenant
// Export the uploadDocumentForTenant function
export const uploadDocumentForTenant = async (req, res) => {
  try {
    const { tenantId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }

    console.log('Uploading document for tenant:', tenantId);
    
    // Find tenant first to verify it exists
    const tenant = await Tenant.findById(tenantId).populate('userId');
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    console.log('Found tenant:', tenant._id, 'with user:', tenant.userId?._id);

    // Upload file to ImageKit
    const fileUrl = await uploadToStorage(req.file);
    console.log('File uploaded to:', fileUrl);

    // Create document with tenant access
    const newDocument = new Document({
      title: req.body.title,
      description: req.body.description || '',
      fileUrl,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      tenantId: tenantId,
      uploadedBy: req.user._id,
      accessRoles: ['admin', 'tenant'],
      accessUsers: tenant.userId ? [tenant.userId._id] : [],
      isPublic: false
    });

    const savedDocument = await newDocument.save();
    console.log('Document saved with ID:', savedDocument._id);

    // Add document to tenant's documents array
    if (!tenant.documents) {
      tenant.documents = [];
    }
    tenant.documents.push(savedDocument._id);
    await tenant.save();
    console.log('Document added to tenant documents');

    res.status(201).json(savedDocument);
  } catch (error) {
    console.error('Error uploading document for tenant:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update document
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user is admin or the original uploader
    if (req.user.role !== 'admin' && !document.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this document' });
    }
    
    const updates = {
      title: req.body.title || document.title,
      description: req.body.description || document.description,
      property: req.body.property || document.property,
      accessRoles: req.body.accessRoles ? JSON.parse(req.body.accessRoles) : document.accessRoles,
      accessUsers: req.body.accessUsers ? JSON.parse(req.body.accessUsers) : document.accessUsers,
      isPublic: req.body.isPublic === 'true' ? true : req.body.isPublic === 'false' ? false : document.isPublic
    };
    
    const updatedDocument = await Document.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sign document
export const signDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { signatureData } = req.body;
    
    if (!signatureData) {
      return res.status(400).json({ message: 'Signature data is required' });
    }
    
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user has access to sign this document
    const { _id, role } = req.user;
    const hasAccess = 
      document.accessUsers.includes(_id) || 
      (document.accessRoles.includes(role) && role === 'tenant');
    
    if (!hasAccess) {
      return res.status(403).json({ message: 'Not authorized to sign this document' });
    }
    
    // Update document with signature
    document.signature = {
      hasSigned: true,
      signedBy: _id,
      signatureData,
      signedAt: new Date()
    };
    
    const updatedDocument = await document.save();
    
    // Create admin notification for signed document
    await createNotification({
      title: 'Document Signed',
      message: `${req.user.name} has signed document "${document.title}"`,
      type: 'inquiry',
      relatedId: document._id,
      relatedModel: 'Document'
    });
    
    res.status(200).json({
      success: true,
      message: 'Document signed successfully',
      document: updatedDocument
    });
  } catch (error) {
    console.error('Error signing document:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload signed document
export const uploadSignedDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { tenantId } = req.body;
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID is required' });
    }
    
    // Find tenant to verify it exists
    const tenant = await Tenant.findById(tenantId).populate('userId');
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Upload file to storage
    const fileUrl = await uploadToStorage(req.file);
    
    // Create document with tenant access and mark as signed
    const newDocument = new Document({
      title: req.body.title || 'Signed Document',
      description: req.body.description || 'Signed document uploaded by tenant',
      fileUrl,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      tenantId: tenantId,
      uploadedBy: req.user._id,
      accessRoles: ['admin', 'tenant'],
      accessUsers: tenant.userId ? [tenant.userId._id] : [],
      isPublic: false,
      signature: {
        hasSigned: true,
        signedBy: req.user._id,
        signedAt: new Date()
      }
    });
    
    const savedDocument = await newDocument.save();
    
    // Add document to tenant's documents array
    if (!tenant.documents) {
      tenant.documents = [];
    }
    tenant.documents.push(savedDocument._id);
    await tenant.save();
    
    // Create admin notification for uploaded signed document
    await createNotification({
      title: 'Signed Document Uploaded',
      message: `${req.user.name} has uploaded a signed document: "${savedDocument.title}"`,
      type: 'inquiry',
      relatedId: savedDocument._id,
      relatedModel: 'Document'
    });
    
    // Check if this is a form submission (has a target iframe)
    const isFormSubmission = req.headers['content-type'] && 
                            req.headers['content-type'].includes('multipart/form-data') &&
                            req.body.token;
    
    if (isFormSubmission) {
      // Redirect to success page for form submissions
      res.redirect('/public/upload-success.html');
    } else {
      // Return JSON for API calls
      res.status(201).json(savedDocument);
    }
  } catch (error) {
    console.error('Error uploading signed document:', error);
    
    // Check if this is a form submission
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data') && req.body.token) {
      res.status(500).send(`<html><body><h1>Error</h1><p>${error.message}</p></body></html>`);
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Check if user is admin or the original uploader
    if (req.user.role !== 'admin' && !document.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }
    
    // Delete file from storage
    await deleteFromStorage(document.fileUrl);
    
    // Delete document from database
    await Document.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
