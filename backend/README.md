# User Role Fix

## Issue
When creating a new user, the role field was missing in the database document. This happened because the default role value in the schema wasn't being applied correctly.

## Solution
1. Modified the User model's pre-save hook to ensure the role field is always set to 'user' if it's missing or undefined.
2. Created a script to update existing users in the database that are missing the role field.

## How to Run the Update Script
To update existing users that are missing the role field:

```bash
cd backend
node scripts/updateUserRoles.js
```

This script will:
1. Connect to your MongoDB database
2. Find all users without a role field
3. Update each user to have the default 'user' role
4. Log the results to the console