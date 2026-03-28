/**
 * Lenco Mobile Money Payment Service
 * Handles integration with Lenco API for mobile money (MTN, Airtel, Vodafone) payments
 * Documentation: https://lenco-api.readme.io/v2.0/reference/get-collections
 */

const axios = require('axios');

// Lenco API configuration
// Using the correct Lenco API v2 endpoint with proper authentication
const LENCO_API_BASE_URL = 'https://sandbox.lenco.co/access/v2/'

const LENCO_API_KEY = process.env.LENCO_API_KEY;
const LENCO_BUSINESS_ID = process.env.LENCO_BUSINESS_ID;

// Validate configuration
if (!LENCO_API_KEY || !LENCO_BUSINESS_ID) {
  console.warn('⚠️ Lenco credentials not configured. Mobile money payments will not work.');
} else {
  console.log('✅ Lenco credentials loaded:', {
    businessId: LENCO_BUSINESS_ID,
    apiKeyLength: LENCO_API_KEY?.length,
  });
}

// Lenco API client with proper headers
const lencoClient = axios.create({
  baseURL: LENCO_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${LENCO_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
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
      provider,
    } = paymentData;

    // Validate required fields
    if (!amount || !customerPhone) {
      throw new Error('Amount and customer phone are required');
    }

    // Normalize phone number - remove all non-numeric characters
    const normalizedPhone = customerPhone.replace(/\D/g, '');
    
    // If phone doesn't start with 260 (Zambia code), add it
    let formattedPhone = normalizedPhone;
    if (!normalizedPhone.startsWith('260')) {
      formattedPhone = '260' + normalizedPhone.slice(-9); // Take last 9 digits and add 260
    }

    // Create collection request payload - simplified for mobile money endpoint
    const payload = {
      operator: provider === 'airtel' ? 'airtel' : 'mtn',
      bearer: 'customer',
      phone: formattedPhone,
      amount: String(Math.round(amount)),
      currency: currency.toUpperCase(),
      reference: `SAFE-${paymentId}-${Date.now()}`,
    };

    console.log('📤 Creating Lenco collection request:', {
      amount: payload.amount,
      currency: payload.currency,
      phone: formattedPhone,
      reference: payload.reference,
      business_id: LENCO_BUSINESS_ID,
      endpoint: 'POST /collections',
    });

    const response = await lencoClient.post('/collections/mobile-money', payload);

    console.log('📥 Lenco API Response:', {
      fullResponse: JSON.stringify(response.data, null, 2),
    });

    const transactionId = response.data.data?.id || response.data.id;
    const status = response.data.data?.status || response.data.status;

    console.log('✅ Lenco collection request created:', {
      id: transactionId,
      status: status,
      fullData: response.data.data || response.data,
    });

    // For mobile money, the authorization URL might be returned directly or we need to construct it
    const authUrl = response.data.data?.authorization_url || 
                    response.data.authorization_url || 
                    response.data.data?.authorizationUrl ||
                    response.data.authorizationUrl ||
                    response.data.link ||
                    response.data.data?.link;

    // If no authorization URL is returned, construct one from the transaction ID
    const finalAuthUrl = authUrl || `${LENCO_API_BASE_URL}collections/${transactionId}/authorize`;

    return {
      success: true,
      data: {
        transactionId: transactionId,
        reference: response.data.data?.reference || response.data.reference,
        authorizationUrl: finalAuthUrl,
        status: status,
        createdAt: response.data.data?.created_at || response.data.created_at,
      },
    };
  } catch (error) {
    console.error('❌ Lenco API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
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
