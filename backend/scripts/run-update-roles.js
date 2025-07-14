// Simple script to run the updateUserRoles.js script
console.log('Starting user role update script...');

import('./updateUserRoles.js')
  .then(() => {
    console.log('Script import successful');
  })
  .catch(err => {
    console.error('Error running script:', err);
  });
