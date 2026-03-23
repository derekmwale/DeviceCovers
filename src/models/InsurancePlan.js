const mongoose = require('mongoose');

const insurancePlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    laptop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Laptop',
      required: true,
    },
    planType: {
      type: String,
      enum: ['basic', 'premium', 'pro'],
      required: true,
    },
    deviceValue: Number,
    monthlyPremium: {
      type: Number,
      required: true,
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    deductible: {
      type: Number,
      default: 0,
    },
    coverageDetails: {
      accidentalDamage: Boolean,
      theft: Boolean,
      loss: Boolean,
      waterDamage: Boolean,
      extendedWarranty: Boolean,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    status: {
      type: String,
      enum: ['pending', 'active', 'expired', 'cancelled'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: Date,
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

// Calculate coverage details based on plan type
insurancePlanSchema.pre('save', function (next) {
  const value = this.deviceValue;

  if (this.planType === 'basic') {
    this.coverageAmount = Math.min(value, 5000); // Max ZMW 5000
    this.monthlyPremium = Math.max(5, value * 0.03);
    this.coverageDetails = {
      accidentalDamage: false,
      theft: false,
      loss: false,
      waterDamage: true,
      extendedWarranty: false,
    };
  } else if (this.planType === 'premium') {
    this.coverageAmount = Math.min(value, 1500);
    this.monthlyPremium = Math.max(10, value * 0.06);
    this.coverageDetails = {
      accidentalDamage: true,
      theft: true,
      loss: false,
      waterDamage: true,
      extendedWarranty: false,
    };
  } else if (this.planType === 'pro') {
    this.coverageAmount = value * 0.9;
    this.monthlyPremium = Math.max(15, value * 0.1);
    this.coverageDetails = {
      accidentalDamage: true,
      theft: true,
      loss: true,
      waterDamage: true,
      extendedWarranty: true,
    };
  }

  this.deductible = this.planType === 'basic' ? 100 : this.planType === 'premium' ? 50 : 25;

  next();
});

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);
