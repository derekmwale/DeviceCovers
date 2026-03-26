const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsurancePlan',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'ZMW',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'manual', 'pending', 'lenco'],
      required: true,
    },
    stripeTransactionId: String,
    paypalTransactionId: String,
    lencoTransactionId: String,
    lencoReference: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    billingCycle: {
      month: Number,
      year: Number,
    },
    dueDate: Date,
    paidDate: Date,
    receiptNumber: String,
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
