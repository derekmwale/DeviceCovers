/**
 * Lenco Mobile Money Payment Service
 * Handles integration with Lenco API for mobile money (MTN, Airtel, Vodafone) payments
 * Documentation: https://lenco-api.readme.io/v2.0/reference/get-collections
 */

const axios = require('axios');

// Lenco API configuration
const LENCO_API_BASE_URL = 'https://api.lenco.io/v1';
const LENCO_API_KEY = process.env.LENCO_API_KEY;
const LENCO_BUSINESS_ID = process.env.LENCO_BUSINESS_ID;

// Validate configuration
if (!LENCO_API_KEY || !LENCO_BUSINESS_ID) {
  console.warn('⚠️ Lenco credentials not configured. Mobile money payments will not work.');
}

// Lenco API client
const lencoClient = axios.create({
  baseURL: LENCO_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${LENCO_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Create a collection request (payment collection from user)
 * This initiates a mobile money payment request
 */
exports.createCollectionRequest = async (paymentData) => {
  try {
    const {
      amount,
      currency = 'ZMW',
      customerName,
      customerEmail,
      customerPhone,
      paymentId,
      description,
    } = paymentData;

    // Validate required fields
    if (!amount || !customerPhone) {
      throw new Error('Amount and customer phone are required');
    }

    // Create collection request payload
    const payload = {
      business_id: LENCO_BUSINESS_ID,
      amount: Math.round(amount * 100), // Convert to smallest currency unit (cents)
      currency: currency.toUpperCase(),
      customer: {
        name: customerName || 'SafeTech Customer',
        email: customerEmail,
        phone: customerPhone.replace(/\D/g, ''), // Remove non-numeric characters
      },
      reference: `SAFE-${paymentId}`,
      description: description || 'SafeTech Insurance Premium Payment',
      redirect_url: `${process.env.APP_URL}/payments?status=success&reference=`,
      webhook_url: `${process.env.APP_URL}/api/payment/webhook/lenco`,
      metadata: {
        payment_id: paymentId,
        service: 'safetech_insurance',
      },
    };

    console.log('📤 Creating Lenco collection request:', {
      amount: payload.amount,
      currency: payload.currency,
      reference: payload.reference,
    });

    const response = await lencoClient.post('/collections', payload);

    console.log('✅ Lenco collection request created:', {
      id: response.data.data.id,
      status: response.data.data.status,
      authorization_url: response.data.data.authorization_url,
    });

    return {
      success: true,
      data: {
        transactionId: response.data.data.id,
        reference: response.data.data.reference,
        authorizationUrl: response.data.data.authorization_url,
        status: response.data.data.status,
        createdAt: response.data.data.created_at,
      },
    };
  } catch (error) {
    console.error('❌ Lenco API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Verify a collection (get status of a payment)
 */
exports.verifyCollection = async (collectionId) => {
  try {
    console.log('🔍 Verifying Lenco collection:', collectionId);

    const response = await lencoClient.get(`/collections/${collectionId}`);

    const data = response.data.data;

    console.log('✅ Collection verified:', {
      id: data.id,
      status: data.status,
      amount: data.amount,
    });

    return {
      success: true,
      data: {
        id: data.id,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        reference: data.reference,
        paymentMethod: data.payment_method,
        metadata: data.metadata,
      },
    };
  } catch (error) {
    console.error('❌ Lenco Verification Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Get list of collections (paginated)
 */
exports.listCollections = async (options = {}) => {
  try {
    const { limit = 50, offset = 0, status } = options;

    const params = {
      business_id: LENCO_BUSINESS_ID,
      limit,
      offset,
    };

    if (status) {
      params.status = status;
    }

    const response = await lencoClient.get('/collections', { params });

    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error('❌ Lenco List Collections Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Process webhook from Lenco (payment confirmation)
 * Verify the webhook signature for security
 */
exports.verifyWebhookSignature = (payload, signature) => {
  try {
    const crypto = require('crypto');

    // Create HMAC signature using Lenco secret
    const hmac = crypto
      .createHmac('sha256', LENCO_API_KEY)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hmac === signature;
  } catch (error) {
    console.error('❌ Webhook signature verification error:', error.message);
    return false;
  }
};

/**
 * Get supported payment methods for a currency
 */
exports.getPaymentMethods = async (currency = 'ZMW') => {
  try {
    const response = await lencoClient.get('/payment-methods', {
      params: {
        currency: currency.toUpperCase(),
        business_id: LENCO_BUSINESS_ID,
      },
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('❌ Payment Methods Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

/**
 * Initiate a refund
 */
exports.createRefund = async (collectionId, refundData) => {
  try {
    const { amount, reason } = refundData;

    const payload = {
      amount: Math.round(amount * 100),
      reason: reason || 'Customer request',
    };

    const response = await lencoClient.post(
      `/collections/${collectionId}/refunds`,
      payload
    );

    console.log('✅ Refund initiated:', response.data.data);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('❌ Refund Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

module.exports = exports;
