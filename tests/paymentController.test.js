const request = require('supertest');
const app = require('../src/app');
const Payment = require('../src/models/Payment');
const InsurancePlan = require('../src/models/InsurancePlan');
const User = require('../src/models/User');

describe('POST /payments/monthly', () => {
  let user;
  let token;
  let plan;

  beforeAll(async () => {
    // Create a test user
    user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    // Generate auth token (mock implementation)
    token = 'mocked-auth-token';

    // Create a test insurance plan
    plan = await InsurancePlan.create({
      deviceValue: 1000,
      monthlyPremium: 50,
      coverageAmount: 5000,
    });
  });

  afterAll(async () => {
    await User.deleteMany();
    await Payment.deleteMany();
    await InsurancePlan.deleteMany();
  });

  it('should create a monthly payment if none exists for the current month', async () => {
    const response = await request(app)
      .post('/payments/monthly')
      .set('Authorization', `Bearer ${token}`)
      .send({ planId: plan._id });

    expect(response.status).toBe(201);
    expect(response.body.payment).toHaveProperty('billingCycle');
    expect(response.body.payment.billingCycle.month).toBe(new Date().getMonth() + 1);
    expect(response.body.payment.billingCycle.year).toBe(new Date().getFullYear());
  });

  it('should not create a payment if one already exists for the current month', async () => {
    await Payment.create({
      user: user._id,
      plan: plan._id,
      amount: plan.monthlyPremium,
      billingCycle: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      status: 'pending',
    });

    const response = await request(app)
      .post('/payments/monthly')
      .set('Authorization', `Bearer ${token}`)
      .send({ planId: plan._id });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Payment for this month already exists');
  });
});