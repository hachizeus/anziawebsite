# RESTART BACKEND SERVER

The backend server needs to be restarted for all authentication fixes to take effect.

## Steps:
1. Stop the current backend server (Ctrl+C)
2. Navigate to backend folder: `cd backend`
3. Start server: `npm run dev` or `node server.js`

## Expected Result:
- No more 500 errors
- Agent dashboard loads properly
- No automatic logouts
- All authentication issues resolved

**The server must be restarted for changes to work!**