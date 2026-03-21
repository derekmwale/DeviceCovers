# Vercel Deployment Guide for SafeTech

## Issues Fixed

1. ✅ **vercel.json** - Updated to proper Vercel v2 config format with correct builds and routes
2. ✅ **api/index.js** - Added health check endpoint, proper error handling, and MongoDB connection retry logic
3. ✅ **Environment Variables** - Configured for Vercel deployment

## Deployment Steps

### 1. MongoDB Atlas Setup
- Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Whitelist IP `0.0.0.0/0` (or Vercel's IPs) in Network Access
- Ensure connection string includes proper credentials

### 2. Vercel Environment Variables
Go to your Vercel Project → Settings → Environment Variables

Add these variables:
```
MONGODB_URI=mongodb+srv://tayantchain_db_user:8wQE79fhN099dQ1F@cluster0.q68uwrg.mongodb.net/safetech
JWT_SECRET=your_strong_secret_key_here_minimum_32_chars
NODE_ENV=production
APP_URL=https://your-project-name.vercel.app
PORT=3000
APIbaseURL=https://your-project-name.vercel.app/api
STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@safetech.com
ADMIN_PASSWORD=admin_secure_password
BASE_MONTHLY_PREMIUM=5
INSURANCE_PERCENTAGE=0.05
```

### 3. Deployment
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

Vercel will automatically deploy when you push to main.

### 4. Test Deployment
- Visit your-project-name.vercel.app/health to check status
- Should return: `{"status":"ok","mongodb":"connected"}`

## Troubleshooting

### Error: FUNCTION_INVOCATION_FAILED
- Check Vercel logs: Settings → Deployments → View Logs
- Ensure all environment variables are set
- Verify MongoDB connection string is correct

### Error: Cannot find module
- Check that all paths in api/index.js are relative to api/ folder
- Paths use ../src and ../views from api/index.js

### Error: MongoDB Connection Timeout
- Whitelist all IPs in MongoDB Atlas (0.0.0.0/0)
- Check MONGODB_URI is valid
- Ensure database exists: safetech

### Error: CORS or Origin Issues
- Verify APP_URL matches your Vercel domain
- Check CORS origin in api/index.js

## Key Configuration Files

1. **vercel.json** - Specifies builds and routes for Vercel
2. **api/index.js** - Main entry point for serverless functions
3. **.vercelignore** - Files to exclude from deployment
4. **package.json** - Build script configured

## Testing Locally vs Production

### Local Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
# Vercel will run this automatically
```

## Security Notes

1. **Never commit real credentials** - Use Vercel's environment variables
2. **Keep JWT_SECRET secret** - Generate a strong random string
3. **Use HTTPS only** - Vercel provides SSL by default
4. **Whitelist MongoDB IPs properly** - For production, consider IP-specific rules

## Monitoring

- Vercel Analytics: https://vercel.com/dashboard
- MongoDB Atlas Charts: Monitor database metrics
- Vercel Logs: Check function execution logs

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 500 Internal Server Error | Check Vercel logs, verify MONGODB_URI |
| Cannot render views | Ensure ejs files exist in /views folder |
| Static files not loading | Check paths in HTML, verify public/ folder |
| API returning 404 | Check route definitions in api/index.js |
| Slow response | Optimize MongoDB queries, add indexes |

---

**Last Updated**: March 21, 2026
**Deployment Status**: Ready for production
