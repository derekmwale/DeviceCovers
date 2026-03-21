const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const InsurancePlan = require('../models/InsurancePlan');
const Claim = require('../models/Claim');
const Payment = require('../models/Payment');

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

router.use(isAdmin);

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlans = await InsurancePlan.countDocuments();
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'submitted' });
    const totalPayments = await Payment.countDocuments({ status: 'completed' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      totalUsers,
      totalPlans,
      totalClaims,
      pendingClaims,
      totalPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Pending Plans for Approval
router.get('/plans/pending', async (req, res) => {
  try {
    const plans = await InsurancePlan.find({ status: 'pending' })
      .populate('user', 'firstName lastName email')
      .populate('laptop')
      .sort({ createdAt: -1 });

    res.json(plans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Approve Insurance Plan
router.put('/plans/:id/approve', async (req, res) => {
  try {
    const { notes } = req.body;
    const plan = await InsurancePlan.findByIdAndUpdate(
      req.params.id,
      {
        status: 'active',
        approvedBy: req.session.user.id,
        approvalDate: new Date(),
        notes,
      },
      { new: true }
    );

    res.json({ message: 'Plan approved successfully', plan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Reject Insurance Plan
router.put('/plans/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const plan = await InsurancePlan.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        notes: reason,
      },
      { new: true }
    );

    res.json({ message: 'Plan rejected successfully', plan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Claims for Review
router.get('/claims/review', async (req, res) => {
  try {
    const claims = await Claim.find({ status: { $in: ['submitted', 'under_review'] } })
      .populate('user', 'firstName lastName email phone')
      .populate('laptop')
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Approve Claim
router.put('/claims/:id/approve', async (req, res) => {
  try {
    const { approvedAmount, notes } = req.body;
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedAmount,
        reviewedBy: req.session.user.id,
        reviewDate: new Date(),
        notes,
      },
      { new: true }
    );

    res.json({ message: 'Claim approved successfully', claim });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Reject Claim
router.put('/claims/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: reason,
        reviewedBy: req.session.user.id,
        reviewDate: new Date(),
      },
      { new: true }
    );

    res.json({ message: 'Claim rejected successfully', claim });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark Claim as Paid
router.put('/claims/:id/paid', async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        status: 'paid',
        paymentDate: new Date(),
        paymentMethod: req.body.paymentMethod || 'bank_transfer',
      },
      { new: true }
    );

    res.json({ message: 'Claim marked as paid', claim });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Payment Reports
router.get('/reports/payments', async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'completed' })
      .populate('user', 'firstName lastName email')
      .populate('plan')
      .sort({ paidDate: -1 });

    res.json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Claims Report
router.get('/reports/claims', async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('user', 'firstName lastName email')
      .populate('laptop')
      .sort({ createdAt: -1 });

    const report = {
      total: claims.length,
      byStatus: {
        submitted: claims.filter((c) => c.status === 'submitted').length,
        underReview: claims.filter((c) => c.status === 'under_review').length,
        approved: claims.filter((c) => c.status === 'approved').length,
        rejected: claims.filter((c) => c.status === 'rejected').length,
        paid: claims.filter((c) => c.status === 'paid').length,
      },
      byType: {
        damage: claims.filter((c) => c.claimType === 'damage').length,
        theft: claims.filter((c) => c.claimType === 'theft').length,
        loss: claims.filter((c) => c.claimType === 'loss').length,
        other: claims.filter((c) => c.claimType === 'other').length,
      },
      totalApproved: claims
        .filter((c) => c.status === 'approved' || c.status === 'paid')
        .reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
    };

    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
