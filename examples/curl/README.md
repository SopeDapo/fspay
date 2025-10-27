# FSPay API Examples - cURL

This directory contains cURL examples for testing FSPay APIs directly from the command line. These examples are perfect for:

- Testing API endpoints
- Debugging integration issues
- Learning API patterns
- Quick API verification

## 🔧 Setup

1. **Install cURL** (if not already installed)
   ```bash
   # Windows
   # Download from: https://curl.se/windows/

   # macOS
   brew install curl

   # Linux
   sudo apt install curl
   ```

2. **Set Environment Variables**
   ```bash
   export FSPAY_API_KEY="your_api_key_here"
   export FSPAY_USER_TOKEN="your_user_token_here"
   export FSPAY_BASE_URL="https://api-sandbox.fspay.ng"
   ```

3. **Use the Examples**
   ```bash
   # Replace $FSPAY_API_KEY with your actual key
   # Replace $FSPAY_USER_TOKEN with your actual token
   # Replace $FSPAY_BASE_URL with the API base URL
   ```

## 📚 Available Examples

### Authentication
```bash
# User Login
curl -X POST $FSPAY_BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "email": "user@example.com",
    "password": "user_password"
  }'

# Google OAuth Login
curl -X GET "$FSPAY_BASE_URL/api/auth/google" \
  -H "Content-Type: application/json"

# Twitter OAuth Login
curl -X GET "$FSPAY_BASE_URL/api/auth/x" \
  -H "Content-Type: application/json"
```

### Wallet Operations
```bash
# Get Wallet Balance
curl -X GET "$FSPAY_BASE_URL/api/wallet/balance" \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json"

# Get Points Balance
curl -X GET "$FSPAY_BASE_URL/api/wallet/points-balance" \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json"

# Get Transaction History
curl -X GET "$FSPAY_BASE_URL/api/wallet/transactions?limit=10&page=1" \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json"
```

### Bill Payments
```bash
# Purchase Airtime
curl -X POST $FSPAY_BASE_URL/api/airtime \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "phoneNumber": "2348012345678",
    "amount": 1000,
    "network": "MTN",
    "description": "Airtime purchase"
  }'

# Purchase Data Bundle
curl -X POST $FSPAY_BASE_URL/api/data \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "phoneNumber": "2348012345678",
    "planId": "MTN_1GB_30DAYS",
    "network": "MTN"
  }'

# Pay Electricity Bill
curl -X POST $FSPAY_BASE_URL/api/electricity \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "meterNumber": "123456789012",
    "amount": 5000,
    "disco": "AEDC",
    "meterType": "prepaid",
    "customerPhone": "2348012345678"
  }'

# Cable TV Subscription
curl -X POST $FSPAY_BASE_URL/api/cable \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "smartCardNumber": "1234567890",
    "provider": "DSTV",
    "packageCode": "DSTV_PREMIUM",
    "customerPhone": "2348012345678"
  }'
```

### Virtual Cards
```bash
# Create Virtual Card
curl -X POST $FSPAY_BASE_URL/api/virtual-cards/create \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "currency": "NGN",
    "initialFunding": 10000,
    "cardName": "My Virtual Card"
  }'

# List Virtual Cards
curl -X GET "$FSPAY_BASE_URL/api/virtual-cards" \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json"

# Fund Virtual Card
curl -X POST $FSPAY_BASE_URL/api/virtual-cards/fund \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "cardId": "card_123456789",
    "amount": 5000
  }'
```

### P2P Trading
```bash
# Get Trading Advertisements
curl -X GET "$FSPAY_BASE_URL/api/p2p/advertisements?type=BUY_FNGN&currency=NGN" \
  -H "Content-Type: application/json"

# Create Advertisement
curl -X POST $FSPAY_BASE_URL/api/p2p/advertisements \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "adType": "SELL_FNGN",
    "sourceCurrency": "NGN",
    "targetStablecoin": "FNGN",
    "rate": 750.50,
    "minAmount": 10000,
    "maxAmount": 100000,
    "totalAmount": 50000,
    "paymentMethods": ["Bank Transfer", "Mobile Money"],
    "instructions": "Payment instructions here",
    "expiresAt": "2025-02-01T00:00:00Z"
  }'
```

### B2B Services
```bash
# Create B2B Transaction
curl -X POST $FSPAY_BASE_URL/api/b2b/transactions \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "amount": 100000,
    "currency": "FNGN",
    "reference": "TXN_123456789",
    "description": "B2B payment for services",
    "webhookUrl": "https://your-app.com/webhooks/fspay"
  }'

# Get B2B Analytics
curl -X GET "$FSPAY_BASE_URL/api/b2b/analytics?period=30d" \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json"
```

### Vendor Services
```bash
# Submit Vendor Application
curl -X POST $FSPAY_BASE_URL/api/vendor/application \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "businessName": "Your Business Name",
    "businessType": "e-commerce",
    "industry": "Technology",
    "yearEstablished": 2020,
    "employeeCount": "10-50",
    "website": "https://yourwebsite.com",
    "businessDescription": "Business description here"
  }'

# Get Vendor Dashboard
curl -X GET "$FSPAY_BASE_URL/api/vendor/dashboard" \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json"
```

### Admin Operations (if applicable)
```bash
# Get System Status
curl -X GET "$FSPAY_BASE_URL/api/admin/system-status" \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: $ADMIN_KEY"

# Get User Management
curl -X GET "$FSPAY_BASE_URL/api/admin/users?limit=10&page=1" \
  -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: $ADMIN_KEY"
```

## 🔧 Testing Commands

### Check API Health
```bash
curl -X GET "$FSPAY_BASE_URL/api/health" \
  -H "Content-Type: application/json"
```

### Test Rate Limiting
```bash
# This will help you understand rate limits
for i in {1..5}; do
  curl -X GET "$FSPAY_BASE_URL/api/wallet/balance" \
    -H "Authorization: Bearer $FSPAY_USER_TOKEN" \
    -w "Status: %{http_code}, Time: %{time_total}s\n"
done
```

### Webhook Testing
```bash
# Test webhook delivery
curl -X POST $FSPAY_BASE_URL/api/webhooks/test \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $FSPAY_API_KEY" \
  -d '{
    "url": "https://your-app.com/webhooks/fspay",
    "event": "payment.completed"
  }'
```

## 📝 Response Format Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "transaction_123456789",
    "reference": "TXN_ABC123",
    "amount": 1000,
    "currency": "NGN",
    "status": "completed"
  },
  "timestamp": "2025-01-27T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient points balance for this transaction"
  },
  "timestamp": "2025-01-27T12:00:00Z"
}
```

## 🚨 Security Reminders

- **Never share real API keys** in public repositories
- **Use environment variables** for all credentials
- **Verify webhook signatures** in production
- **Implement rate limiting** in your applications
- **Log errors** but not sensitive data
- **Use HTTPS** for all API communications

## 📞 Support

For API integration support:
- **Email**: developers@fspay.ng
- **Documentation**: Full API docs available in `/docs` folder
- **Sandbox**: Use sandbox environment for testing
