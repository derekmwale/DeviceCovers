const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    claimNumber: {
      type: String,
      unique: true,
    },
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
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsurancePlan',
      required: true,
    },
    claimType: {
      type: String,
      enum: ['damage', 'theft', 'loss', 'other'],
      required: true,
    },
    incidentDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    location: String,
    reportedToPolice: {
      type: Boolean,
      default: false,
    },
    policeReportNumber: String,
    estimatedCost: {
      type: Number,
      required: true,
    },
    evidence: [
      {
        type: String, // File path
        description: String,
      },
    ],
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected', 'paid'],
      default: 'submitted',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: Date,
    approvedAmount: Number,
    rejectionReason: String,
    paymentDate: Date,
    paymentMethod: String,
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

// Auto-generate claim number before saving
claimSchema.pre('save', async function (next) {
  if (this.isNew && !this.claimNumber) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear().toString().slice(-2);
    this.claimNumber = `CLM-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Claim', claimSchema);
