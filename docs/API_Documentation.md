# FSPay API Documentation

This document provides comprehensive information about the FSPay API endpoints, authentication, and integration examples. This documentation is safe for public consumption and does not contain sensitive implementation details.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Wallet Services](#wallet-services)
- [Payment Services](#payment-services)
- [P2P Trading](#p2p-trading)
- [B2B Services](#b2b-services)
- [Vendor Services](#vendor-services)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🔐 Authentication

FSPay uses JWT-based authentication with API key validation.

### Login
```http
POST /api/auth/login
Content-Type: application/json
X-API-Key: your_api_key

{
  "email": "user@example.com",
  "password": "user_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "accountType": "INDIVIDUAL"
  }
}
```

### OAuth Authentication
```http
GET /api/auth/google
GET /api/auth/x
```

## 💰 Wallet Services

### Get Balance
```http
GET /api/wallet/balance
Authorization: Bearer your_jwt_token
```

### Points Balance
```http
GET /api/wallet/points-balance
Authorization: Bearer your_jwt_token
```

### Transaction History
```http
GET /api/wallet/transactions?limit=10&page=1
Authorization: Bearer your_jwt_token
```

## 💳 Payment Services

### Airtime Purchase
```http
POST /api/airtime
Authorization: Bearer your_jwt_token
Content-Type: application/json
X-API-Key: your_api_key

{
  "phoneNumber": "2348012345678",
  "amount": 1000,
  "network": "MTN",
  "description": "Airtime purchase"
}
```

**Supported Networks:** MTN, Airtel, Glo, 9Mobile

### Data Bundle Purchase
```http
POST /api/data
Authorization: Bearer your_jwt_token
Content-Type: application/json
X-API-Key: your_api_key

{
  "phoneNumber": "2348012345678",
  "planId": "MTN_1GB_30DAYS",
  "network": "MTN"
}
```

### Electricity Payment
```http
POST /api/electricity
Authorization: Bearer your_jwt_token
Content-Type: application/json
X-API-Key: your_api_key

{
  "meterNumber": "123456789012",
  "amount": 5000,
  "disco": "AEDC",
  "meterType": "prepaid"
}
```

**Supported DISCOs:** AEDC, EKEDC, IBEDC, IKEDC, JEDC, KAEDC, KEDC, PHEDC

### Cable TV Subscription
```http
POST /api/cable
Authorization: Bearer your_jwt_token
Content-Type: application/json
X-API-Key: your_api_key

{
  "smartCardNumber": "1234567890",
  "provider": "DSTV",
  "packageCode": "DSTV_PREMIUM"
}
```

**Supported Providers:** DSTV, GOTV, StarTimes

## 🔄 P2P Trading

### Get Advertisements
```http
GET /api/p2p/advertisements?type=BUY_FNGN&currency=NGN&limit=10
```

### Create Advertisement
```http
POST /api/p2p/advertisements
Authorization: Bearer your_jwt_token
Content-Type: application/json
X-API-Key: your_api_key

{
  "adType": "SELL_FNGN",
  "sourceCurrency": "NGN",
  "targetStablecoin": "FNGN",
  "rate": 750.50,
  "minAmount": 10000,
  "maxAmount": 100000,
  "paymentMethods": ["Bank Transfer"],
  "instructions": "Payment instructions"
}
```

### Trade Response
```http
POST /api/p2p/trade-responses
Authorization: Bearer your_jwt_token
Content-Type: application/json
X-API-Key: your_api_key

{
  "adId": "advertisement_id",
  "amount": 25000,
  "paymentMethod": "Bank Transfer"
}
```

## 🏢 B2B Services

### Create Transaction
```http
POST /api/b2b/transactions
Authorization: Bearer your_jwt_token
Content-Type: application/json
X-API-Key: your_api_key

{
  "amount": 100000,
  "currency": "FNGN",
  "reference": "TXN_123456789",
  "webhookUrl": "https://your-app.com/webhooks/fspay"
}
```

### Get Analytics
```http
GET /api/b2b/analytics?period=30d
Authorization: Bearer your_jwt_token
```

## 🏪 Vendor Services

### Vendor Application
```http
POST /api/vendor/application
Content-Type: application/json
X-API-Key: your_api_key

{
  "businessName": "Your Business Name",
  "businessType": "e-commerce",
  "industry": "Technology",
  "website": "https://yourwebsite.com"
}
```

## 🎣 Webhooks

### Webhook Configuration
```http
POST /api/webhooks/create
Authorization: Bearer your_jwt_token
Content-Type: application/json
X-API-Key: your_api_key

{
  "url": "https://your-app.com/webhooks/fspay",
  "events": ["payment.completed", "payment.failed", "kyc.approved"]
}
```

### Webhook Signature Verification
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expectedSignature;
}
```

## ❌ Error Handling

### Standard Error Response
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

### Common Error Codes
- `INVALID_CREDENTIALS` - Authentication failed
- `INSUFFICIENT_BALANCE` - Not enough funds
- `INVALID_AMOUNT` - Invalid transaction amount
- `NETWORK_ERROR` - Provider service unavailable
- `RATE_LIMITED` - Too many requests
- `INVALID_API_KEY` - API key not valid

## 🚦 Rate Limiting

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Limits
- **Per Minute**: 100 requests
- **Per Hour**: 1,000 requests
- **Per Day**: 10,000 requests

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "transaction_123456789",
    "reference": "TXN_ABC123",
    "amount": 1000,
    "status": "completed"
  },
  "timestamp": "2025-01-27T12:00:00Z"
}
```

### Pagination
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🔧 SDKs and Libraries

### Official SDKs
- **JavaScript/Node.js**: Available via npm
- **Python**: PyPI package available
- **PHP**: Composer package available

### Community SDKs
- **Java**: Community-maintained library
- **C#**: .NET integration library
- **Ruby**: RubyGems package

## 📞 Support

### Getting Help
- **Email**: developers@fspay.ng
- **Documentation**: This document and `/docs` folder
- **Sandbox**: Test environment for development
- **Community**: Developer forums and Discord

### Integration Support
- Free integration support for approved applications
- Priority support for enterprise customers
- Comprehensive documentation and examples
- Webhook testing tools

## 📋 Changelog

### Version 1.0.0
- Initial API release
- Core payment services
- P2P trading platform
- B2B services
- Vendor marketplace
- Multi-blockchain support

## 🔄 Migration Guide

For developers migrating from other payment platforms:

1. **Authentication**: Use JWT tokens instead of API keys only
2. **Webhook Format**: Follow our standardized webhook structure
3. **Error Handling**: Implement comprehensive error handling
4. **Rate Limiting**: Respect rate limits and implement retry logic
5. **Security**: Verify webhook signatures in production

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Environment**: Sandbox API
