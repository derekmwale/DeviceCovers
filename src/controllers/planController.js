const InsurancePlan = require('../models/InsurancePlan');
const Laptop = require('../models/Laptop');
const Payment = require('../models/Payment');

// Create Insurance Plan
exports.createPlan = async (req, res) => {
  try {
    const { laptopId, planType } = req.body || {};

    // Validate input with specific error messages
    if (!laptopId || !planType) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          laptopId: !laptopId ? 'required' : '✓',
          planType: !planType ? 'required' : '✓'
        }
      });
    }

    const laptop = await Laptop.findById(laptopId);
    
    if (!laptop) {
      return res.status(404).json({ 
        message: 'Laptop not found. Please select a valid laptop.' 
      });
    }
    
    // Check ownership
    const laptopUserId = laptop.user.toString();
    const reqUserId = req.userId.toString();
    
    if (laptopUserId !== reqUserId) {
      return res.status(403).json({ 
        message: 'You are not authorized to create a plan for this laptop.' 
      });
    }

    // Set plan details based on plan type
    const planDetails = {
      basic: {
        monthlyPremium: 15,
        coverageAmount: laptop.purchaseValue * 0.8,
        deductible: 50,
        coverageDetails: {
          accidentalDamage: true,
          theft: true,
          loss: false,
          waterDamage: false,
          extendedWarranty: false,
        }
      },
      standard: {
        monthlyPremium: 25,
        coverageAmount: laptop.purchaseValue * 0.9,
        deductible: 25,
        coverageDetails: {
          accidentalDamage: true,
          theft: true,
          loss: false,
          waterDamage: true,
          extendedWarranty: false,
        }
      },
      premium: {
        monthlyPremium: 40,
        coverageAmount: laptop.purchaseValue,
        deductible: 0,
        coverageDetails: {
          accidentalDamage: true,
          theft: true,
          loss: true,
          waterDamage: true,
          extendedWarranty: true,
        }
      }
    };

    const details = planDetails[planType] || planDetails.basic;

    const plan = new InsurancePlan({
      user: req.userId,
      laptop: laptopId,
      planType,
      deviceValue: laptop.purchaseValue,
      monthlyPremium: details.monthlyPremium,
      coverageAmount: details.coverageAmount,
      deductible: details.deductible,
      coverageDetails: details.coverageDetails,
      status: 'active', // Set to active immediately
      approvalDate: new Date(),
    });

    await plan.save();

    // Update laptop with current plan
    laptop.currentPlan = plan._id;
    await laptop.save();

    // Create first payment record
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const payment = new Payment({
      user: req.userId,
      plan: plan._id,
      amount: plan.monthlyPremium,
      paymentMethod: 'pending',
      status: 'pending',
      dueDate: nextMonth,
    });

    await payment.save();

    res.status(201).json({
      message: 'Insurance plan activated successfully!',
      plan,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get User Plans
exports.getUserPlans = async (req, res) => {
  try {
    const plans = await InsurancePlan.find({ user: req.userId })
      .populate('laptop')
      .populate('user', 'firstName lastName email');

    res.json(plans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Single Plan
exports.getPlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.findById(req.params.id)
      .populate('laptop')
      .populate('user', 'firstName lastName email');

    if (!plan || plan.user._id.toString() !== req.userId) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel Plan
exports.cancelPlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.findById(req.params.id);

    if (!plan || plan.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    if (plan.status !== 'active' && plan.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel this plan' });
    }

    plan.status = 'cancelled';
    plan.updatedAt = Date.now();
    await plan.save();

    res.json({ message: 'Plan cancelled successfully', plan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Plan Details with Payment History
exports.getPlanDetails = async (req, res) => {
  try {
    const plan = await InsurancePlan.findById(req.params.id).populate('laptop');

    if (!plan || plan.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const payments = await Payment.find({ plan: req.params.id }).sort({ createdAt: -1 });

    res.json({
      plan,
      payments,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
