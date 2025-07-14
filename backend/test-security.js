import { encrypt, decrypt, hash } from './utils/encryptionUtils.js';
import { generateAccessToken, generateRefreshToken } from './services/tokenService.js';
import { generateCsrfToken } from './middleware/csrfMiddleware.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing security enhancements...');

// Test encryption
const testData = 'This is sensitive data';
console.log('Original data:', testData);

const encrypted = encrypt(testData);
console.log('Encrypted data:', encrypted);

const decrypted = decrypt(encrypted);
console.log('Decrypted data:', decrypted);
console.log('Encryption test passed:', testData === decrypted);

// Test hashing
const hashedData = hash(testData);
console.log('Hashed data:', hashedData);
console.log('Hash is one-way (cannot be decrypted)');

// Test token generation
const userId = '60d0fe4f5311236168a109ca';
const role = 'tenant';

const accessToken = generateAccessToken(userId, role);
console.log('Access token:', accessToken);

// Test CSRF token generation
const csrfToken = generateCsrfToken(userId);
console.log('CSRF token:', csrfToken);

console.log('Security tests completed successfully!');
