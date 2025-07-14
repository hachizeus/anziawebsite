import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a secure random string
const generateSecureString = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate security environment variables
const generateSecurityEnv = async () => {
  try {
    console.log('Generating secure environment variables...');
    
    const securityEnv = `# Security Environment Variables
# Generated on ${new Date().toISOString()}

# JWT Secrets
JWT_SECRET=${generateSecureString(64)}
JWT_REFRESH_SECRET=${generateSecureString(64)}

# CSRF Protection
CSRF_SECRET=${generateSecureString(64)}

# Cookie Security
COOKIE_SECRET=${generateSecureString(64)}

# Security Headers
STRICT_TRANSPORT_SECURITY=max-age=31536000; includeSubDomains; preload
CONTENT_SECURITY_POLICY=default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://res.cloudinary.com; connect-src 'self' https://api.cloudinary.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=3600000
AUTH_RATE_LIMIT_MAX_REQUESTS=10

# Password Security
PASSWORD_HASH_ROUNDS=12

# Admin Security
ADMIN_IP_WHITELIST=127.0.0.1,::1

# Session Security
SESSION_TIMEOUT_MINUTES=30
`;

    // Write to .env.security file
    const envPath = path.join(__dirname, '..', '.env.security');
    await fs.writeFile(envPath, securityEnv);
    
    console.log(`Security environment variables generated successfully at ${envPath}`);
    console.log('IMPORTANT: Keep this file secure and do not commit it to version control!');
    
  } catch (error) {
    console.error('Error generating security environment variables:', error);
    process.exit(1);
  }
};

// Run the generator
generateSecurityEnv();
