const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
    },
    purchaseValue: {
      type: Number,
      required: [true, 'Purchase value is required'],
      min: [50, 'Value must be at least $50'],
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required'],
    },
    receiptImage: String,
    specs: {
      processor: String,
      ram: String,
      storage: String,
      screen: String,
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair'],
      default: 'good',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'claimed', 'damaged'],
      default: 'active',
    },
    insuranceStartDate: Date,
    insuranceEndDate: Date,
    currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsurancePlan',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Laptop', laptopSchema);
