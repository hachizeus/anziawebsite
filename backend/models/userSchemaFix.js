// This file is a patch to ensure the User model always has a role field
// Import this file at the top of your server.js file

import mongoose from 'mongoose';

// Force Mongoose to include defaults even when the field is not in the document
mongoose.set('setDefaultsOnInsert', true);

// Add a middleware that runs before all operations to ensure role field exists
const originalCreate = mongoose.Model.create;
mongoose.Model.create = async function(...args) {
  // If this is the User model and we're creating a new document
  if (this.modelName === 'User') {
    const doc = args[0];
    // Ensure role is set
    if (!doc.role) {
      doc.role = 'user';
      console.log(`[Schema Fix] Setting default role 'user' for new user`);
    }
  }
  return originalCreate.apply(this, args);
};

console.log('[Schema Fix] User model patched to ensure role field is always set');
