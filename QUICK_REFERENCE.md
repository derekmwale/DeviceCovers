# 🚀 SafeTech Quick Reference Guide

## 📋 Quick Commands

### Installation & Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Create admin user
node scripts/createAdmin.js

# Seed sample data
npm run seed

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test
```

### Database
```bash
# Start MongoDB
mongod

# Backup database
./backup.sh

# Connect to MongoDB
mongo

# Seed data
node scripts/seedDatabase.js
```

---

## 🔑 Key Files Reference

| Purpose | File | Lines |
|---------|------|-------|
| Main Server | `src/app.js` | ~150 |
| User Model | `src/models/User.js` | ~80 |
| Auth Controller | `src/controllers/authController.js` | ~120 |
| Auth Routes | `src/routes/authRoutes.js` | ~10 |
| Admin Routes | `src/routes/adminRoutes.js` | ~200 |
| Dashboard UI | `views/user/dashboard.ejs` | ~100 |
| Styling | `public/css/style.css` | ~600 |
| Dashboard JS | `public/js/dashboard.js` | ~300 |

---

## 🌐 API Quick Reference

### Authentication
```
POST   /api/auth/register      ← User signup
POST   /api/auth/login         ← User login
POST   /api/auth/logout        ← User logout
```

### User
```
GET    /api/user/me            ← Get profile
PUT    /api/user/profile       ← Update profile
PUT    /api/user/change-password ← Change password
```

### Laptops
```
POST   /api/laptop             ← Add laptop
GET    /api/laptop             ← Get all laptops
GET    /api/laptop/:id         ← Get specific laptop
PUT    /api/laptop/:id         ← Update laptop
DELETE /api/laptop/:id         ← Delete laptop
GET    /api/laptop/:id/suggested-plans ← Get plan suggestions
```

### Plans
```
POST   /api/plan               ← Create plan
GET    /api/plan               ← Get all plans
GET    /api/plan/:id           ← Get plan details
PUT    /api/plan/:id/cancel    ← Cancel plan
```

### Payments
```
GET    /api/payment            ← Get payments
GET    /api/payment/stats      ← Payment statistics
POST   /api/payment/create-intent ← Stripe payment
POST   /api/payment/confirm    ← Confirm payment
```

### Claims
```
POST   /api/claim              ← Submit claim
GET    /api/claim              ← Get claims
GET    /api/claim/track/:id    ← Track claim
GET    /api/claim/stats        ← Claim statistics
```

### Admin
```
GET    /admin/dashboard        ← Dashboard overview
GET    /admin/users            ← All users
GET    /admin/plans/pending    ← Pending plans
PUT    /admin/plans/:id/approve ← Approve plan
GET    /admin/claims/review    ← Claims for review
PUT    /admin/claims/:id/approve ← Approve claim
```

---

## 📊 Database Models Quick View

### User
```javascript
{ firstName, lastName, email, password, phone, country, role, verified, profileImage }
```

### Laptop
```javascript
{ user, brand, model, serialNumber, purchaseValue, purchaseDate, status, specs, currentPlan }
```

### InsurancePlan
```javascript
{ user, laptop, planType, monthlyPremium, coverageAmount, status, deductible, startDate }
```

### Payment
```javascript
{ user, plan, amount, status, stripeTransactionId, paidDate, receiptNumber }
```

### Claim
```javascript
{ user, laptop, plan, claimNumber, claimType, description, status, estimatedCost, evidence }
```

---

## 🎨 UI Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/login` | Login page |
| `/register` | Registration page |
| `/dashboard` | User dashboard |
| `/admin/dashboard` | Admin panel |

---

## 🔒 Authentication

### User Roles
- **user** - Regular user
- **admin** - Administrator

### Endpoints Requiring Auth
- All `/api/user/*` routes
- All `/api/laptop/*` routes
- All `/api/plan/*` routes
- All `/api/payment/*` routes
- All `/api/claim/*` routes

### Admin-Only Routes
- All `/admin/*` routes

---

## 💡 Environment Variables

```env
PORT=3000                           # Server port
MONGODB_URI=mongodb://...           # Database URL
JWT_SECRET=your_secret_key          # JWT secret
JWT_EXPIRE=7d                       # Token expiry
STRIPE_PUBLIC_KEY=pk_test_...       # Stripe public
STRIPE_SECRET_KEY=sk_test_...       # Stripe secret
EMAIL_USER=your_email@gmail.com     # Email service
EMAIL_PASSWORD=app_password         # Email password
```

---

## 📱 Responsive Breakpoints

```css
Desktop:  > 1200px
Tablet:   768px - 1199px
Mobile:   < 768px
```

---

## 🎯 Insurance Plan Calculator

```
Monthly Premium = Max(BASE_PREMIUM, DeviceValue × PERCENTAGE × MULTIPLIER)

Basic:   Multiplier = 0.6    (Water damage)
Premium: Multiplier = 1.2    (Theft + damage)
Pro:     Multiplier = 2.0    (Full coverage)
```

---

## ✅ Verification Checklist

- [ ] MongoDB running
- [ ] `.env` file configured
- [ ] `npm install` completed
- [ ] `npm run dev` starts successfully
- [ ] `http://localhost:3000` loads
- [ ] Can register new user
- [ ] Can login as admin
- [ ] Can add laptop
- [ ] Can create insurance plan
- [ ] Can view dashboard

---

## 🐛 Quick Debugging

### Check if MongoDB is running
```bash
mongo --eval "db.adminCommand('ping')"
```

### View Node.js version
```bash
node --version
```

### Check npm packages
```bash
npm list --depth=0
```

### View .env variables
```bash
cat .env
```

### Kill process on port 3000
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📞 Support Files

- **README.md** - Full documentation
- **API.md** - API reference
- **FAQ.md** - Troubleshooting
- **DEPLOYMENT.md** - Deployment guide
- **PROJECT_SUMMARY.md** - Project overview

---

## 🎓 Technology Stack

**Backend**: Node.js, Express  
**Frontend**: EJS, HTML5, CSS3, Vanilla JavaScript  
**Database**: MongoDB, Mongoose  
**Authentication**: JWT, bcryptjs  
**Payment**: Stripe  
**Email**: Nodemailer  
**Security**: Helmet, CORS  

---

## 🔄 User Flow

```
1. User visits / (landing page)
2. User clicks "Register" or "Login"
3. User fills form → /register or /login
4. Redirected to /dashboard
5. User adds laptop
6. System suggests plans
7. User selects plan
8. Payment required → Stripe
9. Plan becomes active
10. User can submit claims
11. Admin reviews claims
12. Claims processed
```

---

## 📈 Admin Flow

```
1. Admin logs in
2. Goes to /admin/dashboard
3. Reviews pending plans
4. Approves/rejects plans
5. Reviews pending claims
6. Reviews claim evidence
7. Approves/rejects claims
8. Processes payments
9. Views financial reports
10. Monitors platform statistics
```

---

## 💾 File Upload Locations

- **Laptop Receipts**: `uploads/receipts/`
- **Claim Evidence**: `uploads/claims/`
- **Logs**: `logs/` (optional)

---

## 🚀 Deployment Commands

```bash
# Heroku
heroku create safetech-platform
heroku config:set MONGODB_URI=...
git push heroku main

# AWS/DigitalOcean
npm install
npm install -g pm2
pm2 start src/app.js --name safetech
pm2 save
```

---

## 📊 Useful MongoDB Queries

```javascript
// Count users
db.users.countDocuments()

// Find claims by status
db.claims.find({ status: "submitted" })

// Get total revenue
db.payments.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: null, total: { $sum: "$amount" } } }
])

// User with most claims
db.claims.aggregate([
  { $group: { _id: "$user", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

---

**Keep this file handy for quick reference!**

Last Updated: March 21, 2026  
Version: 1.0.0
