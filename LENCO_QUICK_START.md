# Lenco Mobile Money Payment - Quick Start Guide

## What's New? 📱

SafeTech now supports **mobile money payments** through Lenco, enabling users to pay insurance premiums using:
- 🇿🇲 **MTN Mobile Money** 
- 🇿🇲 **Airtel Money**
- 🇿🇲 **Vodafone Cash**

## Setup (5 Minutes)

### 1. Get Lenco Credentials

1. Go to [Lenco Dashboard](https://dashboard.lenco.io)
2. Sign up or log in
3. Navigate to **Settings → API Keys**
4. Copy your:
   - `API Key` → `LENCO_API_KEY`
   - `Business ID` → `LENCO_BUSINESS_ID`

### 2. Update `.env` File

```bash
# Add these lines to your .env file
LENCO_API_KEY=your_key_here
LENCO_BUSINESS_ID=your_business_id_here
```

### 3. Start the Server

```bash
npm run dev
```

✅ Done! Mobile money payments are now live.

## How It Works

### For Users 👥

1. User goes to **Payments** page
2. Clicks **"Pay Now"** on a pending payment
3. Selects **"Mobile Money"** payment method
4. Gets redirected to Lenco payment gateway
5. Enters their phone number
6. Completes payment on mobile device
7. Returns to app - payment verified automatically

### For Developers 🛠️

```
Frontend → POST /api/payment/lenco/initiate
         → Lenco creates collection request
         → Returns authorization URL
         → Redirect user to Lenco gateway
         → User completes payment
         → User redirected back
         → Frontend verifies payment
         → Lenco sends webhook
         → Payment marked completed
         → Plan activated
```

## Key Files Modified

### Backend

1. **`src/services/lencoService.js`** (NEW)
   - Lenco API integration
   - Collection requests
   - Payment verification
   - Webhook handling

2. **`src/controllers/paymentController.js`**
   - `initiateLencoPayment()` - Start payment
   - `verifyLencoPayment()` - Verify payment status
   - `handleLencoWebhook()` - Process Lenco webhooks
   - `getLencoPaymentMethods()` - Get available methods

3. **`src/routes/paymentRoutes.js`**
   - Added 4 new endpoints for Lenco

4. **`src/models/Payment.js`**
   - Added `lencoTransactionId` field
   - Added `lencoReference` field
   - Added `'lenco'` to paymentMethod enum

### Frontend

1. **`views/user/payments.ejs`**
   - New payment method selector UI
   - Mobile money specific flow
   - Payment verification after return
   - Notifications for payment status

2. **`public/css/style.css`**
   - Payment method card styles
   - Modal styles
   - Spinner animations
   - Notification styles

## API Endpoints

### Initiate Mobile Money Payment
```bash
POST /api/payment/lenco/initiate
Content-Type: application/json

{
  "paymentId": "payment_id_from_database"
}

Response:
{
  "data": {
    "transactionId": "lenco_transaction_id",
    "authorizationUrl": "https://lenco.io/...",
    "reference": "SAFE-payment_id"
  }
}
```

### Verify Payment Status
```bash
POST /api/payment/lenco/verify
Content-Type: application/json

{
  "lencoTransactionId": "lenco_transaction_id"
}

Response:
{
  "message": "Payment verified successfully",
  "data": {
    "payment": { ... },
    "lencoData": { ... }
  }
}
```

### Webhook Receiver
```
POST /api/payment/webhook/lenco
Lenco sends payment status updates here
Automatically processes collection.completed events
```

## Environment Variables

```bash
# Required for Lenco integration
LENCO_API_KEY=              # Your Lenco API key
LENCO_BUSINESS_ID=          # Your Lenco Business ID

# Already configured
APP_URL=http://localhost:3000    # Used for webhook URLs
```

## Testing Payment Flow

### Manual Test (Development)

1. **Create a payment:**
   - Go to dashboard → Add laptop
   - Select insurance plan → Create payment

2. **Initiate payment:**
   - Payments page → "Pay Now"
   - Select "Mobile Money"
   - Note the transaction ID from console

3. **Verify with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/payment/lenco/verify \
     -H "Content-Type: application/json" \
     -d '{"lencoTransactionId": "your_transaction_id"}' \
     -b "connect.sid=your_session_id"
   ```

4. **Check webhook logs:**
   - Watch server console for webhook events
   - Should see: `📨 Lenco webhook received`

## Debugging

### Enable Verbose Logging

All Lenco API calls log with emojis for easy identification:

```
🔐 Final Validation Check      - Frontend validation
📤 Final Payload               - Data being sent
💳 Initiating Lenco payment    - Payment started
✅ Lenco collection request created
🔍 Verifying Lenco collection  - Status check
✓ Lenco payment verified successfully
📨 Lenco webhook received      - Webhook event
✅ Webhook processed           - Event handled
❌ Errors with appropriate context
```

### Check Database

```javascript
// View payment with Lenco details
db.payments.findOne({
  lencoTransactionId: { $exists: true }
})

// Shows:
{
  _id: "...",
  lencoTransactionId: "lenco_...",
  lencoReference: "SAFE-...",
  paymentMethod: "lenco",
  status: "completed",
  paidDate: "...",
  // ... other fields
}
```

## Common Issues & Solutions

### Issue: "Phone number required for mobile money payment"

**Solution:** User needs to update their phone number in profile first

### Issue: Webhook not received

**Solution:**
1. Check Lenco dashboard webhook logs
2. Verify webhook URL: `https://yourdomain.com/api/payment/webhook/lenco`
3. Ensure `APP_URL` environment variable is correct

### Issue: "Failed to initiate mobile money payment"

**Solution:**
1. Check `.env` has valid `LENCO_API_KEY` and `LENCO_BUSINESS_ID`
2. Test Lenco API credentials directly with curl
3. Check console logs for detailed error message

### Issue: Payment stuck in "pending"

**Solution:**
1. Manually verify with `/api/payment/lenco/verify` endpoint
2. Check Lenco dashboard transaction status
3. Review webhook logs for delivery issues

## Security Notes ✅

- ✅ Webhook signatures verified with HMAC-SHA256
- ✅ All user payments verified to belong to logged-in user
- ✅ Phone numbers validated before API calls
- ✅ Transaction IDs matched before updating payment status
- ✅ All API calls over HTTPS in production
- ✅ Session-based authentication enforced

## Next Steps

1. **Get Lenco Credentials:**
   - Visit https://dashboard.lenco.io
   - Sign up for developer account

2. **Update `.env`:**
   - Add `LENCO_API_KEY`
   - Add `LENCO_BUSINESS_ID`

3. **Test Payment Flow:**
   - Start server: `npm run dev`
   - Navigate to Payments page
   - Click "Pay Now" → "Mobile Money"
   - Follow the flow

4. **Set Up Webhook in Production:**
   - Update webhook URL in Lenco dashboard
   - Monitor webhook logs

## Documentation

- **Full Integration Guide:** See `LENCO_INTEGRATION.md`
- **Lenco API Docs:** https://lenco-api.readme.io/v2.0/reference/get-collections
- **Backend Service:** `src/services/lencoService.js`
- **Controller Implementation:** `src/controllers/paymentController.js`

## Support

- **Lenco Docs:** https://lenco-api.readme.io
- **Lenco Email:** support@lenco.io
- **SafeTech Team:** Check logs for detailed error messages

---

**Status:** ✅ Ready for production use
**Version:** 1.0
**Last Updated:** March 26, 2026
