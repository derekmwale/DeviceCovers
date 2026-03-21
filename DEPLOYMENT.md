# SafeTech Deployment Guide

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/safetech
NODE_ENV=development

# Server
PORT=3000
APP_URL=http://localhost:3000

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Stripe Payment
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Email Service (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Admin Credentials
ADMIN_EMAIL=admin@safetech.com
ADMIN_PASSWORD=admin_secure_password_123

# Insurance Calculation
BASE_MONTHLY_PREMIUM=5
INSURANCE_PERCENTAGE=0.05
```

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
```bash
# Using Homebrew on macOS
brew services start mongodb-community

# Or run with:
mongod
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Production Deployment

### Using Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create safetech-platform

# Set environment variables
heroku config:set MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/safetech
heroku config:set JWT_SECRET=your_production_secret_key
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Using AWS EC2

1. Launch Ubuntu instance
2. Install Node.js, MongoDB, Nginx
3. Clone repository
4. Install dependencies
5. Set up PM2 for process management
6. Configure Nginx reverse proxy
7. Set up SSL with Let's Encrypt

### Using DigitalOcean

1. Create Ubuntu Droplet
2. SSH into droplet
3. Install Node.js, MongoDB, Nginx
4. Clone repository
5. Install dependencies
6. Set up Nginx
7. Configure SSL certificate

## Database Initialization

### Create Admin User (Manual)
```bash
node scripts/createAdmin.js
```

### Seed Sample Data (Development)
```bash
npm run seed
```

## Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get API keys from Settings → API Keys
3. Add to `.env`:
   - STRIPE_PUBLIC_KEY (Publishable key)
   - STRIPE_SECRET_KEY (Secret key)

## Gmail Setup for Email Notifications

1. Enable 2-Step Verification on Gmail
2. Generate App Password
3. Use App Password in EMAIL_PASSWORD

## MongoDB Atlas Setup (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Add to `MONGODB_URI` in `.env`

## Backup & Recovery

### Backup MongoDB Data
```bash
mongodump --uri="mongodb://localhost:27017/safetech" --out=./backup
```

### Restore MongoDB Data
```bash
mongorestore --uri="mongodb://localhost:27017/safetech" ./backup/safetech
```

## Monitoring & Logging

Implement monitoring services:
- **New Relic** - Application performance
- **Sentry** - Error tracking
- **LogRocket** - User session replay
- **CloudFlare** - DNS & DDoS protection

## Performance Optimization

1. Enable gzip compression
2. Implement caching with Redis
3. Use CDN for static assets
4. Optimize database queries
5. Implement rate limiting
6. Use clustering for multiple cores

## Security Checklist

- [ ] Change all default passwords
- [ ] Use HTTPS only
- [ ] Enable CORS properly
- [ ] Set security headers (Helmet.js)
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Secure password reset
- [ ] Session timeout
- [ ] API authentication

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ping')"
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Email Not Sending
- Verify Gmail App Password is correct
- Check "Less secure apps" settings
- Verify SMTP settings

### Stripe Payment Issues
- Verify API keys are correct
- Check Stripe webhook configuration
- Test with Stripe test cards

## Support & Resources

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Stripe Integration Guide](https://stripe.com/docs)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides)
