require('dotenv').config();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const API_USER = process.env.MTN_API_USER || process.env.MERCHANT_ID;
const API_KEY = process.env.MTN_API_KEY;
const SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY;
const API_BASE = process.env.MTN_API_BASE || 'https://sandbox.momodeveloper.mtn.com';
const TARGET_ENVIRONMENT = process.env.MTN_TARGET_ENVIRONMENT || 'sandbox';
const CALLBACK_URL = process.env.CALLBACK_URL || process.env.NEXT_PUBLIC_BASE_URL;
const CURRENCY = process.env.MTN_CURRENCY || 'EUR';

console.log('--- Checking Credentials ---');
console.log('API_USER:', API_USER ? 'Loaded ✅' : 'Missing ❌');
console.log('API_KEY:', API_KEY ? 'Loaded ✅' : 'Missing ❌');
console.log('SUBSCRIPTION_KEY:', SUBSCRIPTION_KEY ? 'Loaded ✅' : 'Missing ❌');
console.log('CALLBACK_URL:', CALLBACK_URL ? 'Loaded ✅' : 'Missing ❌');
console.log('----------------------------\n');

if (!SUBSCRIPTION_KEY || !API_USER || !API_KEY) {
  console.error('Error: One or more environment variables are missing in .env!');
  process.exit(1);
}

// 1. Get Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${API_USER}:${API_KEY}`).toString('base64');

  const res = await axios.post(
    `${API_BASE}/collection/token/`,
    {},
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
    }
  );

  return res.data.access_token;
}

// 2. Request Payment
async function testPayment() {
  try {
    const token = await getAccessToken();
    const referenceId = uuidv4();

    console.log('Access token retrieved successfully!');

    const res = await axios.post(
      `${API_BASE}/collection/v1_0/requesttopay`,
      {
        amount: '36000',
        currency: CURRENCY,
        externalId: 'ORDER_90_001',
        payer: {
          partyIdType: 'MSISDN',
          partyId: '250780000000',
        },
        payerMessage: 'Payment for order INKOTANYI',
        payeeNote: 'T-Shirt Checkout',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': TARGET_ENVIRONMENT,
          'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
          ...(CALLBACK_URL
            ? { 'X-Callback-Url': CALLBACK_URL.includes('/api/payment/callback') ? CALLBACK_URL : `${CALLBACK_URL}/api/payment/callback` }
            : {}),
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.status === 202) {
      console.log('\n--- PAYMENT REQUEST SUCCESSFUL! ---');
      console.log(`Transaction Reference ID: ${referenceId}`);
      console.log('Status: 202 Accepted (Payment initiated in Sandbox)');
    }
  } catch (err) {
    console.error('Payment Error:', err.response?.data || err.message);
  }
}

testPayment();
