/**
 * FSPay API Integration Examples - JavaScript/Node.js
 *
 * These examples demonstrate how to integrate with FSPay APIs
 * using JavaScript. All examples use the sandbox environment.
 *
 * ⚠️  SECURITY NOTICE:
 * - Never commit real API keys to version control
 * - Use environment variables for API credentials
 * - These examples are for educational purposes only
 */

const API_BASE_URL = 'https://api-sandbox.fspay.ng';
const API_KEY = process.env.FSPAY_API_KEY;
const API_SECRET = process.env.FSPAY_API_SECRET;

/**
 * Example 1: Basic API Authentication
 * Demonstrates how to authenticate with FSPay API
 */
async function authenticateUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Authentication successful:', result.user);
      return result.token;
    } else {
      console.error('Authentication failed:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Example 2: Check Points Balance
 * Shows how to retrieve user's points balance
 */
async function getPointsBalance(userToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet/points-balance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.success) {
      console.log('Points balance:', result.balance);
      return result.balance;
    } else {
      console.error('Failed to get balance:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Balance check error:', error);
    return null;
  }
}

/**
 * Example 3: Purchase Airtime
 * Demonstrates airtime purchase integration
 */
async function purchaseAirtime(userToken, phoneNumber, amount, network) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/airtime`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        amount: amount,
        network: network, // MTN, AIRTEL, GLO, 9MOBILE
        description: 'Airtime purchase via API'
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Airtime purchase successful:', result.reference);
      return result;
    } else {
      console.error('Airtime purchase failed:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Airtime purchase error:', error);
    return null;
  }
}

/**
 * Example 4: Pay Electricity Bill
 * Shows electricity bill payment integration
 */
async function payElectricityBill(userToken, meterNumber, amount, disco) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/electricity`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        meterNumber: meterNumber,
        amount: amount,
        disco: disco, // AEDC, EKEDC, IBEDC, etc.
        meterType: 'prepaid',
        customerPhone: '+234XXXXXXXXXX'
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('Electricity payment successful:', result.token);
      return result;
    } else {
      console.error('Electricity payment failed:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Electricity payment error:', error);
    return null;
  }
}

/**
 * Example 5: Webhook Handler
 * Shows how to handle FSPay webhooks securely
 */
function handleWebhook(payload, signature) {
  // Verify webhook signature (implementation depends on your framework)
  const expectedSignature = createHmacSignature(payload, API_SECRET);

  if (signature !== expectedSignature) {
    console.error('Invalid webhook signature');
    return { error: 'Invalid signature' };
  }

  const { event, data } = payload;

  switch (event) {
    case 'payment.completed':
      console.log('Payment completed:', data.reference);
      // Process successful payment
      break;

    case 'payment.failed':
      console.log('Payment failed:', data.reference);
      // Handle failed payment
      break;

    case 'kyc.approved':
      console.log('KYC approved for user:', data.userId);
      // Handle KYC approval
      break;

    default:
      console.log('Unhandled webhook event:', event);
  }

  return { success: true };
}

/**
 * Example 6: Error Handling Best Practices
 */
class FSPayAPI {
  constructor(apiKey, apiSecret, sandbox = true) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = sandbox ? 'https://api-sandbox.fspay.ng' : 'https://api.fspay.ng';
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`API Error: ${result.message || response.statusText}`);
      }

      return result;
    } catch (error) {
      console.error(`FSPay API Error: ${error.message}`);
      throw error;
    }
  }
}

// Usage example
const fspay = new FSPayAPI(API_KEY, API_SECRET);

// Example API call
async function exampleUsage() {
  try {
    const token = await authenticateUser('user@example.com', 'password');
    if (token) {
      const balance = await getPointsBalance(token);
      console.log('User balance:', balance);
    }
  } catch (error) {
    console.error('Example failed:', error);
  }
}

/**
 * Example 7: Rate Limiting Handling
 */
async function makeRateLimitedRequest(endpoint, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'X-API-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        const retryAfter = response.headers.get('Retry-After') || 60;
        console.log(`Rate limited. Waiting ${retryAfter} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying...`);
    }
  }
}

module.exports = {
  authenticateUser,
  getPointsBalance,
  purchaseAirtime,
  payElectricityBill,
  handleWebhook,
  FSPayAPI,
  makeRateLimitedRequest
};
