import crypto from 'crypto';

// Get encryption key from environment variables or generate one
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.warn('ENCRYPTION_KEY not set in environment variables. Using fallback key.');
    return 'default-encryption-key-change-in-prod';
  }
  // Ensure key is exactly 32 bytes (256 bits) for AES-256
  return crypto.createHash('sha256').update(String(key)).digest();
};

// Encrypt data
export const encrypt = (text) => {
  if (!text) return null;
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Decrypt data
export const decrypt = (text) => {
  if (!text) return null;
  
  try {
    const key = getEncryptionKey();
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Hash data (one-way)
export const hash = (text) => {
  if (!text) return null;
  
  try {
    return crypto.createHash('sha256').update(text).digest('hex');
  } catch (error) {
    console.error('Hashing error:', error);
    return null;
  }
};
