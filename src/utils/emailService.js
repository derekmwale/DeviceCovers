// Email service utility
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email error:', error);
  }
};

// Claim email templates
const claimSubmittedEmail = (user, claim) => `
  <h2>Claim Submitted Successfully</h2>
  <p>Hi ${user.firstName},</p>
  <p>Your claim has been submitted successfully.</p>
  <p><strong>Claim Number:</strong> ${claim.claimNumber}</p>
  <p><strong>Type:</strong> ${claim.claimType}</p>
  <p><strong>Estimated Cost:</strong> $${claim.estimatedCost}</p>
  <p>Our team will review your claim and get back to you soon.</p>
`;

const planApprovedEmail = (user, plan) => `
  <h2>Insurance Plan Approved!</h2>
  <p>Hi ${user.firstName},</p>
  <p>Your ${plan.planType} insurance plan has been approved!</p>
  <p><strong>Monthly Premium:</strong> $${plan.monthlyPremium}</p>
  <p><strong>Coverage Amount:</strong> $${plan.coverageAmount}</p>
  <p>Your coverage is now active.</p>
`;

module.exports = {
  sendEmail,
  claimSubmittedEmail,
  planApprovedEmail,
};
