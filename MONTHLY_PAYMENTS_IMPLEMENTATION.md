# Monthly Payment System Implementation

## Summary
Implemented a comprehensive monthly payment system that ties insurance rates to the selected plan, tracks payments by month, displays payment history, and alerts users when monthly payments are due.

## Changes Made

### 1. Payment Model & Plan Model (Already Configured)
- **Payment Model**: Includes `billingCycle` (month/year), `amount`, `status`, `paidDate`, `dueDate`
- **InsurancePlan Model**: Each plan has `monthlyPremium` that varies by plan type:
  - **Basic Plan**: ~3% of device value (minimum ZMW 50)
  - **Premium Plan**: ~6% of device value (minimum ZMW 100)
  - **Pro Plan**: ~10% of device value (minimum ZMW 150)

### 2. Backend Controller Updates

#### a) planController.js
- Updated `createPlan()` to:
  - Create payment for current month with proper billing cycle (month + year)
  - Use plan's `monthlyPremium` as payment amount
  - Set `paymentMethod` as 'pending'

#### b) paymentController.js
- **Updated `getUserPayments()`**:
  - Groups payments by month/year for better UI display
  - Returns `paymentsByMonth` object alongside payment array
  
- **Added `checkPaymentDue()`**:
  - Checks if current month's payment exists for active plans
  - Auto-creates payment for current month if missing
  - Returns payment due status with amount due
  - Alerts users when payment is required
  
- **Added `getMonthPaymentStatus()`**:
  - Gets detailed payment status for specific month/year
  - Returns total due, total paid, and overall status
  - Shows all payments for that month with breakdown by plan

- **Added `createMonthlyPayment()`**:
  - Manually creates monthly payment for a plan
  - Prevents duplicate payments for same month

### 3. Payment Routes (paymentRoutes.js)
Added new endpoints:
- `GET /api/payment/check-due` - Check if payment is due for current month
- `GET /api/payment/month-status` - Get payment status for specific month
- `POST /api/payment/monthly` - Create monthly payment manually

### 4. Frontend Updates

#### a) payments.ejs
- **Updated `loadPayments()`**:
  - Displays payment month/year in table (YYYY-MM format)
  - Groups payments by billing cycle
  - Shows payment status (Pending/Paid/Completed)
  
- **Added `checkAndDisplayPaymentDue()`**:
  - Calls `/api/payment/check-due` endpoint
  - Displays prominent alert if payment is due
  - Shows amount due
  - Provides easy access to payment page
  
- **Added `payDuePayment()`**:
  - Quickly initiates payment for due amount

#### b) dashboard.js
- **Updated `loadOverview()`**:
  - Calls `checkAndDisplayPaymentDueAlert()`
  - Shows payment due status prominently on dashboard
  
- **Added `checkAndDisplayPaymentDueAlert()`**:
  - Displays alert card on dashboard when payment is due
  - Shows amount due and link to payments page
  - Runs automatically when dashboard loads

### 5. Payment Processing

#### Lenco Mobile Money
- Payment method automatically set to 'lenco' when Lenco payment initiated
- Webhook updates payment status to 'paid' when collection completes
- Activates plan if it was pending

#### Stripe
- Payment method automatically set when Stripe intent created
- `confirmPayment()` marks payment as 'completed' on success

## User Flow

### 1. Plan Selection
1. User selects a plan (Basic/Premium/Pro)
2. Monthly payment created for current month based on `monthlyPremium`
3. Billing cycle set to current month/year

### 2. Monthly Payment Alerts
1. When user logs in, dashboard checks for payment due
2. If no payment exists for current month, one is auto-created
3. Alert displayed with amount due
4. User redirected to payments page

### 3. Payment History
1. Payments page shows all payments grouped by month
2. Each payment shows:
   - Payment date
   - Amount (based on selected plan's monthlyPremium)
   - Plan type
   - Status (Pending/Paid/Completed)
   - Action (Pay Now or View Receipt)

### 4. New Month Handling
1. System automatically detects new month
2. Creates new payment record if none exists
3. Alerts user to make payment
4. Prevents duplicate payments for same month

## Example Monthly Rates

**Basic Plan (ZMW 50)**:
- Device value: ZMW 1000+
- Monthly payment: ZMW 50

**Premium Plan (ZMW 100)**:
- Device value: ZMW 1500+
- Monthly payment: ZMW 100

**Pro Plan (ZMW 150+)**:
- Device value: ZMW 2000+
- Monthly payment: ZMW 150+

## Database Fields Tracked

For each payment:
- `user`: User ID
- `plan`: Insurance plan ID
- `amount`: Monthly premium amount
- `billingCycle.month`: Month (1-12)
- `billingCycle.year`: Year (2026, 2027, etc.)
- `status`: pending/paid/completed/failed/refunded
- `paidDate`: When payment was completed
- `dueDate`: When payment is due
- `paymentMethod`: lenco/stripe/manual/pending

## Alerts & Notifications

1. **Dashboard Alert**: "⚠️ Payment Due!" with amount
2. **Payments Page Alert**: "Action Required" with pending payments count
3. **Monthly Check**: Automatic at page load
4. **Auto-creation**: New month payment auto-created if missing

## Testing

To test the system:
1. Create an insurance plan
2. Check dashboard - should see payment alert
3. Go to payments page - should show current month's payment
4. Make payment via Lenco or Stripe
5. Verify status updates to 'paid'/'completed'
6. At start of next month, should see new payment alert

