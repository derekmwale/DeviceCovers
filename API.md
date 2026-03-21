# SafeTech API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+260123456789",
  "country": "Zambia"
}

Response: 201 Created
{
  "message": "Registration successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "message": "Logged out successfully"
}
```

---

## 👤 User Profile Endpoints

### Get Current User
```
GET /user/me
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+260123456789",
  "country": "Zambia",
  "role": "user",
  "verified": true
}
```

### Update Profile
```
PUT /user/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+260987654321",
  "country": "Zambia"
}

Response: 200 OK
{
  "message": "Profile updated",
  "user": { ... }
}
```

### Change Password
```
PUT /user/change-password
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

---

## 💻 Laptop Endpoints

### Add Laptop
```
POST /laptop
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- brand: "Dell"
- model: "XPS 13"
- serialNumber: "DL123456"
- purchaseValue: "1200"
- purchaseDate: "2024-01-15"
- condition: "excellent"
- receipt: (image file)

Response: 201 Created
{
  "message": "Laptop added successfully",
  "laptop": {
    "_id": "507f1f77bcf86cd799439012",
    "brand": "Dell",
    "model": "XPS 13",
    "serialNumber": "DL123456",
    "purchaseValue": 1200,
    "status": "active"
  }
}
```

### Get All Laptops
```
GET /laptop
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "brand": "Dell",
    "model": "XPS 13",
    "serialNumber": "DL123456",
    "purchaseValue": 1200,
    "status": "active",
    "currentPlan": { ... }
  }
]
```

### Get Specific Laptop
```
GET /laptop/:id
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439012",
  "brand": "Dell",
  "model": "XPS 13",
  "serialNumber": "DL123456",
  "purchaseValue": 1200,
  "status": "active",
  "currentPlan": { ... }
}
```

### Update Laptop
```
PUT /laptop/:id
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- brand: "Dell"
- condition: "good"
- receipt: (optional image file)

Response: 200 OK
{
  "message": "Laptop updated successfully",
  "laptop": { ... }
}
```

### Delete Laptop
```
DELETE /laptop/:id
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "message": "Laptop deleted successfully"
}
```

### Get Suggested Plans
```
GET /laptop/:id/suggested-plans
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "type": "basic",
    "name": "Basic Coverage",
    "monthly": 7.50,
    "coverage": 500,
    "description": "Water damage & basic protection"
  },
  {
    "type": "premium",
    "name": "Premium Protection",
    "monthly": 15.00,
    "coverage": 1500,
    "description": "Theft, accidental damage & water protection"
  },
  {
    "type": "pro",
    "name": "Pro Full Coverage",
    "monthly": 25.00,
    "coverage": 1080,
    "description": "Complete coverage including theft, damage, loss & warranty"
  }
]
```

---

## 🛡️ Insurance Plan Endpoints

### Create Insurance Plan
```
POST /plan
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "laptopId": "507f1f77bcf86cd799439012",
  "planType": "premium"
}

Response: 201 Created
{
  "message": "Insurance plan created. Awaiting approval.",
  "plan": {
    "_id": "507f1f77bcf86cd799439013",
    "planType": "premium",
    "monthlyPremium": 15.00,
    "coverageAmount": 1500,
    "status": "pending"
  }
}
```

### Get All Plans
```
GET /plan
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "planType": "premium",
    "monthlyPremium": 15.00,
    "coverageAmount": 1500,
    "status": "active",
    "startDate": "2024-03-21T00:00:00Z",
    "laptop": { ... }
  }
]
```

### Get Plan Details
```
GET /plan/:id/details
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "plan": { ... },
  "payments": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "amount": 15.00,
      "status": "completed",
      "paidDate": "2024-03-21T10:30:00Z"
    }
  ]
}
```

### Cancel Plan
```
PUT /plan/:id/cancel
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "message": "Plan cancelled successfully",
  "plan": { ... }
}
```

---

## 💳 Payment Endpoints

### Get All Payments
```
GET /payment
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "amount": 15.00,
    "status": "completed",
    "dueDate": "2024-04-21T00:00:00Z",
    "paidDate": "2024-03-21T10:30:00Z",
    "receiptNumber": "REC-1711000000000"
  }
]
```

### Get Payment Statistics
```
GET /payment/stats
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "totalPaid": 45.00,
  "totalPending": 15.00,
  "totalFailed": 0,
  "completedCount": 3
}
```

### Create Payment Intent
```
POST /payment/create-intent
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "paymentId": "507f1f77bcf86cd799439014"
}

Response: 200 OK
{
  "clientSecret": "pi_1234567890_secret_abcd...",
  "paymentIntentId": "pi_1234567890"
}
```

### Confirm Payment
```
POST /payment/confirm
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "paymentId": "507f1f77bcf86cd799439014",
  "paymentIntentId": "pi_1234567890"
}

Response: 200 OK
{
  "message": "Payment successful",
  "payment": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "completed",
    "paidDate": "2024-03-21T10:30:00Z"
  }
}
```

---

## 📋 Claims Endpoints

### Submit Claim
```
POST /claim
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- laptopId: "507f1f77bcf86cd799439012"
- claimType: "damage"
- incidentDate: "2024-03-20"
- description: "Screen cracked after accidental drop"
- estimatedCost: "350"
- reportedToPolice: "false"
- evidence: (multiple image files)

Response: 201 Created
{
  "message": "Claim submitted successfully",
  "claim": { ... },
  "claimNumber": "CLM-26-00001"
}
```

### Get All Claims
```
GET /claim
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "claimNumber": "CLM-26-00001",
    "claimType": "damage",
    "estimatedCost": 350,
    "status": "submitted",
    "createdAt": "2024-03-21T10:30:00Z"
  }
]
```

### Get Claim Details
```
GET /claim/:id
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439015",
  "claimNumber": "CLM-26-00001",
  "claimType": "damage",
  "estimatedCost": 350,
  "description": "Screen cracked after accidental drop",
  "status": "submitted",
  "evidence": [ ... ]
}
```

### Track Claim
```
GET /claim/track/:id
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "claim": {
    "_id": "507f1f77bcf86cd799439015",
    "claimNumber": "CLM-26-00001",
    "status": "under_review"
  },
  "timeline": [
    {
      "status": "submitted",
      "date": "2024-03-21T10:30:00Z",
      "description": "Claim submitted"
    },
    {
      "status": "under_review",
      "date": "2024-03-21T12:00:00Z",
      "description": "Under review by claims team"
    }
  ]
}
```

### Get Claim Statistics
```
GET /claim/stats
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "totalClaims": 5,
  "submitted": 1,
  "underReview": 2,
  "approved": 1,
  "rejected": 0,
  "paid": 1,
  "totalApproved": 1250.00
}
```

### Add Evidence to Claim
```
POST /claim/:id/evidence
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
- evidence: (multiple files)
- description: "Additional damage photos"

Response: 200 OK
{
  "message": "Evidence added successfully",
  "claim": { ... }
}
```

---

## 👨‍💼 Admin Endpoints

### Dashboard Overview
```
GET /admin/dashboard
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "totalUsers": 42,
  "totalPlans": 156,
  "totalClaims": 23,
  "pendingClaims": 5,
  "totalPayments": 320,
  "totalRevenue": 4850.00
}
```

### Get All Users
```
GET /admin/users
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+260123456789",
    "country": "Zambia",
    "active": true,
    "createdAt": "2024-03-21T10:30:00Z"
  }
]
```

### Get Pending Plans
```
GET /admin/plans/pending
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "planType": "premium",
    "monthlyPremium": 15.00,
    "coverageAmount": 1500,
    "user": { firstName: "John", lastName: "Doe", email: "john@example.com" },
    "laptop": { brand: "Dell", model: "XPS 13" }
  }
]
```

### Approve Plan
```
PUT /admin/plans/:id/approve
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "notes": "Plan approved. Device value verified."
}

Response: 200 OK
{
  "message": "Plan approved successfully",
  "plan": { ... }
}
```

### Reject Plan
```
PUT /admin/plans/:id/reject
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "reason": "Device value is too high. Please resubmit with verification."
}

Response: 200 OK
{
  "message": "Plan rejected successfully",
  "plan": { ... }
}
```

### Get Claims for Review
```
GET /admin/claims/review
Authorization: Bearer <TOKEN>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "claimNumber": "CLM-26-00001",
    "claimType": "damage",
    "estimatedCost": 350,
    "status": "submitted",
    "user": { ... }
  }
]
```

### Approve Claim
```
PUT /admin/claims/:id/approve
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "approvedAmount": 300,
  "notes": "Approved with $50 deductible"
}

Response: 200 OK
{
  "message": "Claim approved successfully",
  "claim": { ... }
}
```

### Reject Claim
```
PUT /admin/claims/:id/reject
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "reason": "Claim does not meet policy requirements"
}

Response: 200 OK
{
  "message": "Claim rejected successfully",
  "claim": { ... }
}
```

### Mark Claim as Paid
```
PUT /admin/claims/:id/paid
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "paymentMethod": "bank_transfer"
}

Response: 200 OK
{
  "message": "Claim marked as paid",
  "claim": { ... }
}
```

### Get Reports
```
GET /admin/reports/claims
GET /admin/reports/payments
Authorization: Bearer <TOKEN>

Response: 200 OK
(Various report data)
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "message": "Laptop not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Rate Limiting
API calls are limited to 100 requests per 15 minutes per IP address.

## Webhooks
Coming soon: Stripe webhook integration for automatic payment updates.
