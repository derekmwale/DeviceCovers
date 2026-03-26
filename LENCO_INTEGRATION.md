# Lenco Mobile Money Integration Guide

## Overview

SafeTech now supports mobile money payments through **Lenco**, enabling users to pay insurance premiums using MTN, Airtel, and Vodafone mobile services in Zambia.

**Lenco API Documentation:** https://lenco-api.readme.io/v2.0/reference/get-collections

## Setup Instructions

### 1. Create Lenco Account

1. Visit [Lenco Dashboard](https://dashboard.lenco.io)
2. Create a business account
3. Complete verification
4. Generate API credentials

### 2. Environment Variables Configuration

Add the following to your `.env` file:

```env
# Lenco Mobile Money Configuration
LENCO_API_KEY=your_api_key_from_lenco_dashboard
LENCO_BUSINESS_ID=your_business_id_from_lenco_dashboard
```

### 3. Webhook Configuration in Lenco Dashboard

Configure your webhook URL in Lenco settings:

```
Webhook URL: https://yourdomain.com/api/payment/webhook/lenco
```

**Webhook Events to Listen:**
- `collection.completed` - Payment successful
- `collection.success` - Payment successful (alternative)
- `collection.failed` - Payment failed

### 4. Configure Phone Number Field

Ensure users have phone numbers in their profiles for Lenco payments:

- Phone field must be stored in `User.phoneNumber`
- Format: Any format, service handles normalization

## Features

### Supported Payment Methods
- 🇿🇲 **MTN Zambia** - Mobile money via MTN
- 🇿🇲 **Airtel Zambia** - Mobile money via Airtel
- 🇿🇲 **Vodafone Zambia** - Mobile money via Vodafone

### Supported Currencies
- `ZMW` - Zambian Kwacha (recommended)
- Other currencies via Lenco conversion rates

## API Endpoints

### 1. Initiate Mobile Money Payment

**Endpoint:** `POST /api/payment/lenco/initiate`

**Authentication:** Required (User session)

**Request Body:**
```json
{
  "paymentId": "payment_mongodb_id"
}
```

**Response:**
```json
{
  "message": "Mobile money payment initiated",
  "data": {
    "paymentId": "payment_mongodb_id",
    "transactionId": "lenco_transaction_id",
    "reference": "SAFE-payment_mongodb_id",
    "authorizationUrl": "https://lenco.io/authorize/...",
    "amount": 50.00,
    "currency": "ZMW"
  }
}
```

### 2. Verify Payment Status

**Endpoint:** `POST /api/payment/lenco/verify`

**Authentication:** Required (User session)

**Request Body:**
```json
{
  "lencoTransactionId": "lenco_transaction_id"
}
```

**Response (Completed):**
```json
{
  "message": "Payment verified successfully",
  "data": {
    "payment": { ... },
    "lencoData": {
      "id": "transaction_id",
      "status": "completed",
      "amount": 5000,
      "currency": "ZMW"
    }
  }
}
```

### 3. Get Available Payment Methods

**Endpoint:** `GET /api/payment/lenco/methods?currency=ZMW`

**Authentication:** Required (User session)

**Response:**
```json
{
  "message": "Payment methods retrieved",
  "data": [
    {
      "id": "mtn_zm",
      "name": "MTN Mobile Money",
      "currency": "ZMW",
      "minAmount": 100,
      "maxAmount": 1000000
    },
    {
      "id": "airtel_zm",
      "name": "Airtel Money",
      "currency": "ZMW",
      "minAmount": 100,
      "maxAmount": 1000000
    }
  ]
}
```

### 4. Webhook Handler

**Endpoint:** `POST /api/payment/webhook/lenco`

**Authentication:** Lenco Signature Verification

**Webhook Payload Example:**
```json
{
  "event": "collection.completed",
  "data": {
    "id": "lenco_transaction_id",
    "status": "completed",
    "amount": 5000,
    "currency": "ZMW",
    "reference": "SAFE-payment_mongodb_id",
    "metadata": {
      "payment_id": "payment_mongodb_id"
    }
  }
}
```

## Frontend Usage

### Payment Flow

```javascript
// 1. User initiates payment
const response = await fetch('/api/payment/lenco/initiate', {
  method: 'POST',
  body: JSON.stringify({ paymentId: 'payment_id' }),
  credentials: 'include'
});

const data = await response.json();

// 2. Redirect to Lenco authorization
window.location.href = data.data.authorizationUrl;

// 3. User completes payment on Lenco platform
// 4. User returns to callback URL

// 5. Verify payment status
const verification = await fetch('/api/payment/lenco/verify', {
  method: 'POST',
  body: JSON.stringify({ 
    lencoTransactionId: data.data.transactionId 
  }),
  credentials: 'include'
});
```

## Database Model

### Payment Schema Extensions

The `Payment` model now includes Lenco-specific fields:

```javascript
{
  // ... existing fields ...
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'manual', 'pending', 'lenco'],
    required: true
  },
  lencoTransactionId: String,      // Lenco transaction ID
  lencoReference: String,          // Payment reference (SAFE-...)
  // ... other fields ...
}
```

## Transaction Flow Diagram

```
User clicks "Pay Now"
    ↓
Select "Mobile Money" payment method
    ↓
POST /api/payment/lenco/initiate
    ↓
System creates Lenco collection request
    ↓
Returns authorizationUrl
    ↓
Redirect user to Lenco payment gateway
    ↓
User enters phone number & completes payment
    ↓
Lenco processes payment
    ↓
User redirected back to /payments?status=success
    ↓
Frontend verifies payment via POST /api/payment/lenco/verify
    ↓
Backend receives webhook from Lenco
    ↓
Payment marked as 'completed'
    ↓
Insurance plan activated
```

## Error Handling

### Common Errors

1. **Missing Phone Number**
   ```json
   {
     "message": "Phone number required for mobile money payment",
     "requiresPhoneUpdate": true
   }
   ```
   **Solution:** Update user profile with phone number

2. **Invalid Transaction ID**
   ```json
   {
     "message": "Failed to verify payment",
     "error": "Transaction not found"
   }
   ```
   **Solution:** Check transaction ID validity

3. **Payment Failed**
   ```json
   {
     "message": "Payment failed or was cancelled",
     "status": "failed"
   }
   ```
   **Solution:** Retry payment or use alternate method

## Testing

### Test Cards/Amounts

Lenco provides test phone numbers for development:
- Contact Lenco support for test credentials

### Manual Testing Flow

1. Start app in development mode
2. Add a payment (plan activation creates one)
3. Go to Payments page
4. Click "Pay Now" → "Mobile Money"
5. Verify transaction is created: `lencoTransactionId` should be set
6. Use Lenco test environment to simulate payment
7. Verify webhook receipt and payment status update

## Troubleshooting

### Webhook Not Received

1. Check Lenco dashboard webhook logs
2. Verify webhook URL is correct and accessible
3. Check signature verification logic
4. Ensure `APP_URL` environment variable is set correctly

### Payment Stuck in Pending

1. Check Lenco dashboard for transaction status
2. Manually verify payment via `/api/payment/lenco/verify` endpoint
3. Check database for `lencoTransactionId`
4. Monitor webhook logs for Lenco events

### API Key Issues

1. Verify credentials in `.env` file
2. Test API key directly with Lenco API
3. Check API key permissions in Lenco dashboard
4. Ensure business ID matches API key

## Security Considerations

1. **Webhook Signature Verification** ✅
   - All webhooks verified using HMAC-SHA256
   - Signature checked before processing

2. **User Ownership Validation** ✅
   - Payment verified to belong to logged-in user
   - Prevents payment manipulation

3. **Idempotency** ✅
   - Webhook handlers are idempotent
   - Safe to receive duplicate events

4. **Data Encryption** ✅
   - Phone numbers validated before transmission
   - SSL/TLS for all API communication

5. **Rate Limiting** ⏳
   - Implement rate limiting in production
   - Prevent abuse of payment endpoints

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Add Lenco live API credentials
- [ ] Configure webhook URL to production domain
- [ ] Test payment flow end-to-end
- [ ] Monitor transaction logs
- [ ] Set up error alerting
- [ ] Configure HTTPS only
- [ ] Enable rate limiting
- [ ] Review security policies
- [ ] Train support team

## Support

For Lenco-specific issues:
- **Lenco Documentation:** https://lenco-api.readme.io
- **Lenco Support:** support@lenco.io

For SafeTech integration issues:
- Check logs: `npm run dev` terminal output
- Enable verbose logging in `lencoService.js`
- Contact SafeTech development team

## Version History

- **v1.0** (2026-03-26) - Initial Lenco integration
  - Support for MTN, Airtel, Vodafone
  - Webhook processing
  - Payment verification
  - ZMW currency support
