import { clearAllAttempts } from '../middleware/rateLimitMiddleware.js';

console.log('Clearing all rate limit attempts...');
clearAllAttempts();
console.log('Rate limits cleared successfully!');
process.exit(0);
