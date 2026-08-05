const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const PRIMARY_KEY = 'a556f90f6a4a4f6aab9c05279ed42cef';

const apiUserId = uuidv4();

async function setupSandboxCredentials() {
  try {
    // Register API User
    await axios.post(
      'https://sandbox.momodeveloper.mtn.com/v1_0/apiuser',
      { providerCallbackHost: 'localhost' },
      {
        headers: {
          'X-Reference-Id': apiUserId,
          'Ocp-Apim-Subscription-Key': PRIMARY_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // Generate API Key
    const res = await axios.post(
      `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${apiUserId}/apikey`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': PRIMARY_KEY,
        },
      }
    );

    console.log('\n--- SUCCESS! COPY THESE VALUES TO YOUR .env FILE ---\n');
    console.log(`MERCHANT_ID=${apiUserId}`);
    console.log(`MTN_API_KEY=${res.data.apiKey}`);
    console.log('MTN_SUBSCRIPTION_KEY=<YOUR_COLLECTIONS_PRIMARY_KEY>');
    console.log('MTN_TARGET_ENVIRONMENT=sandbox');
    console.log('MTN_CURRENCY=EUR');
    console.log('\n----------------------------------------------------\n');
  } catch (err) {
    console.error('Error generating keys:', err.response?.data || err.message);
  }
}

setupSandboxCredentials();
