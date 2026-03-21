const Payment = require('../models/Payment');
const InsurancePlan = require('../models/InsurancePlan');
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
