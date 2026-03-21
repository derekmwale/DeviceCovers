const InsurancePlan = require('../models/InsurancePlan');
const Laptop = require('../models/Laptop');
const Payment = require('../models/Payment');

// Create Insurance Plan
exports.createPlan = async (req, res) => {
  try {
    const { laptopId, planType } = req.body;

    const laptop = await Laptop.findById(laptopId);
    if (!laptop || laptop.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    const plan = new InsurancePlan({
      user: req.userId,
      laptop: laptopId,
      planType,
      deviceValue: laptop.purchaseValue,
    });

    await plan.save();

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
      message: 'Insurance plan created. Awaiting approval.',
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
