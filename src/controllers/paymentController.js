const Payment = require('../models/Payment');
const InsurancePlan = require('../models/InsurancePlan');
const User = require('../models/User');
const lencoService = require('../services/lencoService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Get All Payments for User
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId }).populate('plan').sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Payment by ID
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('plan');

    if (!payment || payment.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Initiate Stripe Payment
exports.createPaymentIntent = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);

    if (!payment || payment.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payment.amount * 100), // Convert to cents
      currency: payment.currency.toLowerCase(),
      metadata: {
        paymentId: payment._id.toString(),
        userId: req.userId,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Confirm Payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body;
    const payment = await Payment.findById(paymentId);

    if (!payment || payment.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      payment.status = 'completed';
      payment.paidDate = new Date();
      payment.stripeTransactionId = paymentIntentId;
      payment.receiptNumber = `REC-${Date.now()}`;
      await payment.save();

      // Activate plan if all payments for current month are completed
      const plan = await InsurancePlan.findById(payment.plan);
      if (plan.status === 'pending') {
        plan.status = 'active';
        plan.approvalDate = new Date();
        await plan.save();
      }

      res.json({
        message: 'Payment successful',
        payment,
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Payment Stats
exports.getPaymentStats = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId });

    const stats = {
      totalPaid: payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
      totalPending: payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
      totalFailed: payments.filter((p) => p.status === 'failed').length,
      completedCount: payments.filter((p) => p.status === 'completed').length,
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Initiate Lenco Mobile Money Payment
exports.initiateLencoPayment = async (req, res) => {
  try {
    const { paymentId, phoneNumber, provider } = req.body;

    // Validate payment exists and belongs to user
    const payment = await Payment.findById(paymentId).populate('plan');
    if (!payment || payment.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    // Get user details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate phone number is provided (either from request or user profile)
    const finalPhoneNumber = phoneNumber || user.phoneNumber;
    if (!finalPhoneNumber) {
      return res.status(400).json({
        message: 'Phone number required for mobile money payment',
        requiresPhoneUpdate: true,
      });
    }

    // Create Lenco collection request
    const lencoResult = await lencoService.createCollectionRequest({
      amount: payment.amount,
      currency: payment.currency,
      customerName: user.name || user.email,
      customerEmail: user.email,
      customerPhone: finalPhoneNumber,
      paymentId: payment._id.toString(),
      description: `Insurance Premium - ${payment.plan?.planType?.toUpperCase()} Plan`,
      provider: provider,
    });

    if (!lencoResult.success) {
      console.error('❌ Lenco payment initiation failed:', lencoResult.error);
      return res.status(400).json({
        message: 'Failed to initiate mobile money payment',
        error: lencoResult.error,
      });
    }

    // Update payment with Lenco transaction details
    payment.lencoTransactionId = lencoResult.data.transactionId;
    payment.lencoReference = lencoResult.data.reference;
    payment.paymentMethod = 'lenco';
    await payment.save();

    console.log('✅ Lenco payment initiated for payment:', paymentId);

    res.json({
      message: 'Mobile money payment initiated',
      data: {
        paymentId: payment._id,
        transactionId: lencoResult.data.transactionId,
        reference: lencoResult.data.reference,
        authorizationUrl: lencoResult.data.authorizationUrl,
        amount: payment.amount,
        currency: payment.currency,
      },
    });
  } catch (error) {
    console.error('❌ Error initiating Lenco payment:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Verify Lenco Payment Status
exports.verifyLencoPayment = async (req, res) => {
  try {
    const { lencoTransactionId } = req.body;

    if (!lencoTransactionId) {
      return res.status(400).json({ message: 'Transaction ID required' });
    }

    // Verify with Lenco
    const verifyResult = await lencoService.verifyCollection(lencoTransactionId);

    if (!verifyResult.success) {
      return res.status(400).json({
        message: 'Failed to verify payment',
        error: verifyResult.error,
      });
    }

    const lencoData = verifyResult.data;

    // Find payment by Lenco transaction ID
    const payment = await Payment.findOne({
      lencoTransactionId: lencoTransactionId,
      user: req.userId,
    }).populate('plan');

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    // Update payment status based on Lenco response
    if (lencoData.status === 'completed' || lencoData.status === 'success') {
      payment.status = 'completed';
      payment.paidDate = new Date();
      payment.receiptNumber = `REC-${Date.now()}`;
      await payment.save();

      // Activate plan if pending
      const plan = await InsurancePlan.findById(payment.plan);
      if (plan && plan.status === 'pending') {
        plan.status = 'active';
        plan.approvalDate = new Date();
        await plan.save();
      }

      console.log('✅ Lenco payment verified and completed:', lencoTransactionId);

      return res.json({
        message: 'Payment verified successfully',
        data: {
          payment,
          lencoData,
        },
      });
    } else if (lencoData.status === 'pending') {
      return res.json({
        message: 'Payment is still pending',
        status: 'pending',
        data: lencoData,
      });
    } else if (
      lencoData.status === 'failed' ||
      lencoData.status === 'cancelled'
    ) {
      payment.status = 'failed';
      await payment.save();

      return res.status(400).json({
        message: 'Payment failed or was cancelled',
        status: lencoData.status,
      });
    }

    res.json({
      message: 'Payment status retrieved',
      status: lencoData.status,
      data: lencoData,
    });
  } catch (error) {
    console.error('❌ Error verifying Lenco payment:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Handle Lenco Webhook
exports.handleLencoWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-lenco-signature'];
    const payload = req.body;

    // Verify webhook signature
    const isValid = lencoService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      console.warn('⚠️ Invalid Lenco webhook signature');
      return res.status(401).json({ message: 'Invalid signature' });
    }

    console.log('📨 Lenco webhook received:', {
      eventType: payload.event,
      collectionId: payload.data?.id,
      status: payload.data?.status,
    });

    // Handle collection completion
    if (
      payload.event === 'collection.completed' ||
      payload.event === 'collection.success'
    ) {
      const transactionId = payload.data.id;
      const payment = await Payment.findOne({
        lencoTransactionId: transactionId,
      }).populate('plan');

      if (!payment) {
        console.warn('⚠️ Payment not found for webhook:', transactionId);
        return res.status(404).json({ message: 'Payment not found' });
      }

      // Update payment status to paid
      payment.status = 'paid';
      payment.paidDate = new Date();
      payment.receiptNumber = `REC-${Date.now()}`;
      await payment.save();

      // Activate plan
      const plan = await InsurancePlan.findById(payment.plan);
      if (plan && plan.status === 'pending') {
        plan.status = 'active';
        plan.approvalDate = new Date();
        await plan.save();
      }

      console.log('✅ Webhook processed: Payment marked as paid', transactionId);
    } else if (payload.event === 'collection.failed') {
      const transactionId = payload.data.id;
      const payment = await Payment.findOne({
        lencoTransactionId: transactionId,
      });

      if (payment) {
        payment.status = 'failed';
        await payment.save();
        console.log('❌ Webhook processed: Payment failed', transactionId);
      }
    }

    // Always return 200 to acknowledge receipt
    res.json({ message: 'Webhook processed', success: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error.message);
    // Still return 200 to prevent Lenco retries
    res.json({ message: 'Webhook received', success: true });
  }
};

// Get Lenco Payment Methods Available
exports.getLencoPaymentMethods = async (req, res) => {
  try {
    const { currency = 'ZMW' } = req.query;

    const result = await lencoService.getPaymentMethods(currency);

    if (!result.success) {
      return res.status(400).json({
        message: 'Failed to fetch payment methods',
        error: result.error,
      });
    }

    res.json({
      message: 'Payment methods retrieved',
      data: result.data,
    });
  } catch (error) {
    console.error('❌ Error fetching payment methods:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Handle Lenco Payment Success Redirect
exports.handleLencoPaymentSuccess = async (req, res) => {
  try {
    // This is called when user is redirected back from Lenco after successful payment
    // Update payment status to paid
    const { status } = req.query;

    if (status === 'success') {
      console.log('✅ Payment redirect received with success status');
    }

    // Redirect to payments page - the webhook will update the status
    // We just need to show the payments page
    res.redirect('/user/payments?paymentStatus=success');
  } catch (error) {
    console.error('❌ Error handling payment success:', error.message);
    res.redirect('/user/payments?paymentStatus=error');
  }
};

// Add Monthly Payment Logic
exports.createMonthlyPayment = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;

    // Fetch the user's insurance plan
    const plan = await InsurancePlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Insurance plan not found' });
    }

    // Get current month and year
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
    const currentYear = new Date().getFullYear();

    // Check if payment already exists for this month
    const existingPayment = await Payment.findOne({
      user: userId,
      billingCycle: { month: currentMonth, year: currentYear },
    });

    if (existingPayment) {
      return res.status(400).json({ message: 'Payment for this month already exists' });
    }

    // Create a new payment
    const newPayment = new Payment({
      user: userId,
      plan: planId,
      amount: plan.monthlyPremium,
      billingCycle: { month: currentMonth, year: currentYear },
      status: 'pending',
    });

    await newPayment.save();

    res.status(201).json({ message: 'Monthly payment created', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
