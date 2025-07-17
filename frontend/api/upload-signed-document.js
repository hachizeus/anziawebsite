// This is a serverless function for Vercel/Netlify
// It acts as a proxy to avoid CORS issues

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { tenantId, title, description } = req.body;
    const token = req.headers.authorization;

    if (!tenantId || !title || !token) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Generate a unique filename
    const filename = `signed-doc-${Date.now()}.pdf`;
    
    // Create a pre-signed URL for direct upload
    // This is a simplified example - in a real implementation, 
    // you would integrate with your storage provider (S3, etc.)
    const uploadUrl = `https://anzia-electronics-api.onrender.com/api/documents/upload-url?filename=${filename}&tenantId=${tenantId}`;
    
    // Return the upload URL to the client
    res.status(200).json({ 
      uploadUrl,
      message: 'Upload URL generated successfully' 
    });
    
  } catch (error) {
    console.error('Error in upload-signed-document proxy:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}