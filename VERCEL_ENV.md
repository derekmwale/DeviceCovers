# Vercel Environment Variables Required

To deploy SafeTech on Vercel, add these environment variables in your Vercel project settings:

## Required Variables

```
MONGODB_URI=mongodb+srv://tayantchain_db_user:8wQE79fhN099dQ1F@cluster0.q68uwrg.mongodb.net/safetech
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
PORT=3000
```

## Optional Variables

```
APP_URL=https://your-project.vercel.app
APIbaseURL=https://your-project.vercel.app/api
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@safetech.com
ADMIN_PASSWORD=admin_secure_password
BASE_MONTHLY_PREMIUM=5
INSURANCE_PERCENTAGE=0.05
```

## Steps to Deploy

1. Go to https://vercel.com/dashboard
2. Select your SafeTech project
3. Go to Settings → Environment Variables
4. Add all required variables above
5. Redeploy from Deployments tab
6. Or push code: `git push` (auto-deploys)

## Important Notes

- MONGODB_URI is required for the app to work
- Without it, API endpoints will fail but UI will still render
- Make sure MongoDB Atlas whitelist includes Vercel IPs (0.0.0.0/0)
- For production, use a secure JWT_SECRET
