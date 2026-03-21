// Calculate insurance premium based on device value
const calculatePremium = (deviceValue, planType) => {
  const baseRate = parseFloat(process.env.BASE_MONTHLY_PREMIUM) || 5;
  const percentageRate = parseFloat(process.env.INSURANCE_PERCENTAGE) || 0.05;

  let multiplier = 1;

  if (planType === 'basic') {
    multiplier = 0.6;
  } else if (planType === 'premium') {
    multiplier = 1.2;
  } else if (planType === 'pro') {
    multiplier = 2.0;
  }

  return Math.max(baseRate, deviceValue * percentageRate * multiplier);
};

// Calculate coverage amount based on plan and device value
const calculateCoverage = (deviceValue, planType) => {
  const maxCoveragePercent = planType === 'basic' ? 0.5 : planType === 'premium' ? 1.0 : 0.9;

  return Math.min(deviceValue * maxCoveragePercent, deviceValue);
};

// Validate claim amount against coverage
const validateClaimAmount = (claimAmount, coverageAmount, deductible) => {
  const maxPayable = Math.max(0, coverageAmount - deductible);
  return Math.min(claimAmount, maxPayable);
};

module.exports = {
  calculatePremium,
  calculateCoverage,
  validateClaimAmount,
};
