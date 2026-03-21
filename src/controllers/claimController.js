const Claim = require('../models/Claim');
const Laptop = require('../models/Laptop');
const InsurancePlan = require('../models/InsurancePlan');

// Submit Claim
exports.submitClaim = async (req, res) => {
  try {
    const { laptopId, claimType, incidentDate, description, location, reportedToPolice, policeReportNumber, estimatedCost } =
      req.body;

    const laptop = await Laptop.findById(laptopId);
    if (!laptop || laptop.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    const plan = await InsurancePlan.findById(laptop.currentPlan);
    if (!plan || plan.status !== 'active') {
      return res.status(400).json({ message: 'No active insurance plan for this laptop' });
    }

    const claim = new Claim({
      user: req.userId,
      laptop: laptopId,
      plan: plan._id,
      claimType,
      incidentDate,
      description,
      location,
      reportedToPolice,
      policeReportNumber,
      estimatedCost,
      evidence: req.files ? req.files.map((f) => ({ type: f.path, description: f.originalname })) : [],
    });

    await claim.save();

    // Update laptop status
    laptop.status = 'claimed';
    await laptop.save();

    res.status(201).json({
      message: 'Claim submitted successfully',
      claim,
      claimNumber: claim.claimNumber,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get User Claims
exports.getUserClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.userId })
      .populate('laptop')
      .populate('plan')
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Claim Details
exports.getClaimDetails = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('laptop')
      .populate('plan')
      .populate('user', 'firstName lastName email phone');

    if (!claim || claim.user._id.toString() !== req.userId) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.json(claim);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Claim by Claim Number
exports.getClaimByNumber = async (req, res) => {
  try {
    const claim = await Claim.findOne({ claimNumber: req.params.claimNumber })
      .populate('laptop')
      .populate('plan');

    if (!claim || claim.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.json(claim);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Track Claim Status
exports.trackClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim || claim.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    const timeline = [
      { status: 'submitted', date: claim.createdAt, description: 'Claim submitted' },
      ...(claim.status !== 'submitted'
        ? [{ status: 'under_review', date: claim.reviewDate, description: 'Under review by claims team' }]
        : []),
      ...(claim.status === 'approved' || claim.status === 'paid'
        ? [{ status: 'approved', date: claim.reviewDate, description: `Approved for $${claim.approvedAmount}` }]
        : []),
      ...(claim.status === 'paid'
        ? [{ status: 'paid', date: claim.paymentDate, description: 'Payment processed' }]
        : []),
      ...(claim.status === 'rejected'
        ? [
            {
              status: 'rejected',
              date: claim.reviewDate,
              description: claim.rejectionReason || 'Claim rejected',
            },
          ]
        : []),
    ];

    res.json({
      claim: {
        _id: claim._id,
        claimNumber: claim.claimNumber,
        status: claim.status,
        estimatedCost: claim.estimatedCost,
        approvedAmount: claim.approvedAmount,
      },
      timeline,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add Evidence to Claim
exports.addEvidence = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim || claim.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (claim.status !== 'submitted') {
      return res.status(400).json({ message: 'Cannot add evidence after review has started' });
    }

    if (req.files) {
      const newEvidence = req.files.map((f) => ({
        type: f.path,
        description: req.body.description || f.originalname,
      }));

      claim.evidence = [...claim.evidence, ...newEvidence];
      await claim.save();
    }

    res.json({ message: 'Evidence added successfully', claim });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Claim Statistics
exports.getClaimStats = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.userId });

    const stats = {
      totalClaims: claims.length,
      submitted: claims.filter((c) => c.status === 'submitted').length,
      underReview: claims.filter((c) => c.status === 'under_review').length,
      approved: claims.filter((c) => c.status === 'approved').length,
      rejected: claims.filter((c) => c.status === 'rejected').length,
      paid: claims.filter((c) => c.status === 'paid').length,
      totalApproved: claims
        .filter((c) => c.status === 'approved' || c.status === 'paid')
        .reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
