const Laptop = require('../models/Laptop');
const InsurancePlan = require('../models/InsurancePlan');

// Add Laptop
exports.addLaptop = async (req, res) => {
  try {
    const { brand, model, serialNumber, purchaseValue, purchaseDate, specs, condition } =
      req.body;

    const laptop = new Laptop({
      user: req.userId,
      brand,
      model,
      serialNumber,
      purchaseValue,
      purchaseDate,
      specs,
      condition,
      receiptImage: req.file ? req.file.path : null,
    });

    await laptop.save();

    res.status(201).json({
      message: 'Laptop added successfully',
      laptop,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Laptops for User
exports.getUserLaptops = async (req, res) => {
  try {
    const laptops = await Laptop.find({ user: req.userId }).populate('currentPlan');
    res.json(laptops);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Single Laptop
exports.getLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id).populate('currentPlan');

    if (!laptop || laptop.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    res.json(laptop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Laptop
exports.updateLaptop = async (req, res) => {
  try {
    let laptop = await Laptop.findById(req.params.id);

    if (!laptop || laptop.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    const updates = { ...req.body, updatedAt: Date.now() };
    if (req.file) {
      updates.receiptImage = req.file.path;
    }

    laptop = await Laptop.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ message: 'Laptop updated successfully', laptop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Laptop
exports.deleteLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop || laptop.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    await Laptop.findByIdAndDelete(req.params.id);

    res.json({ message: 'Laptop deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Suggested Plans for Laptop
exports.getSuggestedPlans = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop || laptop.user.toString() !== req.userId) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    // Calculate suggested plans based on device value
    const value = laptop.purchaseValue;

    const plans = [
      {
        type: 'basic',
        name: 'Basic Coverage',
        monthly: Math.max(5, value * 0.03),
        coverage: Math.min(value, 500),
        description: 'Water damage & basic protection',
      },
      {
        type: 'premium',
        name: 'Premium Protection',
        monthly: Math.max(10, value * 0.06),
        coverage: Math.min(value, 1500),
        description: 'Theft, accidental damage & water protection',
      },
      {
        type: 'pro',
        name: 'Pro Full Coverage',
        monthly: Math.max(15, value * 0.1),
        coverage: value * 0.9,
        description: 'Complete coverage including theft, damage, loss & warranty',
      },
    ];

    res.json(plans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
