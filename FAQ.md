# SafeTech FAQ & Troubleshooting

## ❓ Frequently Asked Questions

### Installation & Setup

**Q: What are the system requirements?**
A: Node.js 14+, npm, MongoDB (local or Atlas), and a modern web browser.

**Q: How do I install dependencies?**
A: Run `npm install` in the project root directory.

**Q: Where do I set my configuration?**
A: Copy `.env.example` to `.env` and edit it with your settings.

**Q: Do I need MongoDB installed locally?**
A: No, you can use MongoDB Atlas (cloud) instead. Just update MONGODB_URI in .env.

### Authentication

**Q: How do I create an admin account?**
A: Run `node scripts/createAdmin.js` or manually update a user's role to 'admin' in MongoDB.

**Q: What's the default login?**
A: Check your .env file for ADMIN_EMAIL and ADMIN_PASSWORD.

**Q: How do I reset a forgotten password?**
A: Currently not implemented. Manual reset via database recommended.

**Q: What's the JWT token expiration?**
A: Set in .env as JWT_EXPIRE (default: 7 days).

### Features

**Q: Can users have multiple laptops?**
A: Yes, one user can register and insure multiple devices.

**Q: Can users have multiple insurance plans per laptop?**
A: Currently one active plan per laptop. Can upgrade by canceling and creating new.

**Q: How do I integrate Stripe?**
A: Add your test/live keys to .env (STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY).

**Q: How do claims work?**
A: Users submit claims with evidence, admins review and approve/reject with amounts.

**Q: Are email notifications working?**
A: Not yet implemented, but emailService.js is ready. Configure Gmail settings.

### Insurance Plans

**Q: How is the premium calculated?**
A: Based on device value and plan type. See insuranceCalculator.js for logic.

**Q: Can I customize plan names and features?**
A: Yes, modify InsurancePlan schema and adjust controller logic.

**Q: What currencies are supported?**
A: Currently USD only. Multi-currency support is a future feature.

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solutions:**
- Make sure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- Use MongoDB Atlas for cloud database
- Verify MongoDB is installed

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solutions:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### 3. Module Not Found
```
Error: Cannot find module 'express'
```
**Solutions:**
- Run `npm install`
- Delete node_modules and package-lock.json, then reinstall
- Check Node.js version: `node --version`

#### 4. JWT Token Expired
```
Error: Token is not valid / TokenExpiredError
```
**Solutions:**
- User needs to login again
- Check JWT_SECRET matches across requests
- Verify JWT_EXPIRE setting

#### 5. Stripe Payment Error
```
Error: Invalid API Key
```
**Solutions:**
- Verify STRIPE_PUBLIC_KEY and STRIPE_SECRET_KEY in .env
- Use test keys for development
- Check Stripe account is active

#### 6. Email Not Sending
```
Error: EAUTH - invalid credentials
```
**Solutions:**
- Generate new Gmail app password
- Enable 2-Step Verification on Gmail
- Check EMAIL_USER and EMAIL_PASSWORD
- Verify SMTP settings

#### 7. File Upload Error
```
Error: ENOENT - no such file or directory
```
**Solutions:**
- Create uploads directories: `mkdir -p uploads/{receipts,claims}`
- Check file permissions
- Verify disk space available

#### 8. CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solutions:**
- Check CORS middleware in app.js
- Verify APP_URL in .env
- Update frontend requests with correct headers

---

## 🐛 Debugging

### Enable Detailed Logging
```javascript
// In app.js, add before routes:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### Check MongoDB Connection
```javascript
// Test connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected'))
  .catch(err => console.error('❌ Error:', err));
```

### Verify API Endpoints
```bash
# Use curl to test endpoints
curl -X GET http://localhost:3000/api/user/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Or use Postman for GUI testing
```

### Check Database Collections
```bash
# Connect to MongoDB
mongo

# Select database
use safetech

# View collections
show collections

# Query users
db.users.find()
```

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Update JWT_SECRET to a strong random string
- [ ] Update all API keys (Stripe, Email, etc.)
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas for database
- [ ] Configure email service
- [ ] Test all payment flows
- [ ] Review security headers (Helmet)
- [ ] Set up HTTPS/SSL
- [ ] Enable rate limiting
- [ ] Configure CORS for your domain
- [ ] Set up database backups
- [ ] Implement monitoring (New Relic, Sentry)
- [ ] Create admin account
- [ ] Test email notifications
- [ ] Verify file upload paths
- [ ] Test claims workflow

---

## 📊 Performance Optimization

### Database Optimization
```javascript
// Add indexes for faster queries
db.users.createIndex({ email: 1 })
db.plans.createIndex({ user: 1 })
db.claims.createIndex({ status: 1 })
```

### Caching Strategy
- Implement Redis for session caching
- Cache frequently accessed data
- Use CDN for static assets

### API Optimization
- Implement pagination for large datasets
- Use projection to fetch only needed fields
- Compress responses with gzip

---

## 🔐 Security Checklist

- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Sanitize database queries
- [ ] Use HTTPS only
- [ ] Set secure cookies
- [ ] Implement CSRF tokens
- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Implement logging
- [ ] Regular backups
- [ ] PCI compliance for payments

---

## 📞 Getting Help

### Resources
- **MongoDB**: https://docs.mongodb.com
- **Express.js**: https://expressjs.com
- **Stripe**: https://stripe.com/docs
- **Node.js**: https://nodejs.org/docs

### Debug Tools
- **Postman**: API testing
- **MongoDB Compass**: Database GUI
- **Chrome DevTools**: Frontend debugging
- **VS Code Debugger**: Node.js debugging

### Community
- Stack Overflow (tag: node.js, express)
- GitHub Issues (for this project)
- Discord/Community forums

---

## 🚨 Emergency Procedures

### Database Is Down
1. Check MongoDB service status
2. Attempt reconnection
3. Switch to backup database
4. Contact database administrator

### Stripe Payment Processing Failed
1. Check Stripe API status
2. Verify API keys
3. Contact Stripe support
4. Use alternative payment method

### Email Service Down
1. Check email provider status
2. Verify SMTP credentials
3. Test connection manually
4. Implement email queue system

### Security Breach
1. Rotate all secrets
2. Review access logs
3. Notify users if needed
4. Increase monitoring
5. Conduct security audit

---

## 📈 Monitoring Recommendations

### Key Metrics to Monitor
- API response time
- Error rate
- Active users
- Payment success rate
- Claims processing time
- Database connection pool
- Server CPU/Memory usage
- Disk space
- Network bandwidth

### Recommended Tools
- New Relic (APM)
- Sentry (Error tracking)
- DataDog (Monitoring)
- CloudFlare (CDN/DDoS)
- AWS CloudWatch (if using AWS)

---

## 🔄 Update & Maintenance

### Regular Tasks
- Daily: Monitor error logs
- Weekly: Review API metrics
- Monthly: Update dependencies
- Quarterly: Security audit
- Annually: Infrastructure review

### Update Process
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Major version update (careful!)
npm install <package>@latest

# Run tests after updates
npm test
```

---

**Last Updated**: March 21, 2026  
**Version**: 1.0.0
