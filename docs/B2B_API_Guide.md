# FNGN B2B Payment API Documentation

## Overview

The FNGN B2B Payment API enables businesses to integrate Nigerian Naira stablecoin payments without requiring blockchain knowledge. Our API provides traditional REST endpoints for seamless integration.

## Base URL
```
Production: https://fspay.ng/api/v1/b2b
Sandbox: https://fspay.ng/api/v1/b2b/sandbox
```

## Authentication

All API requests require an API key in the header:
```http
X-API-Key: your_api_key_here
```

## Quick Start

### 1. Register Your Business
```bash
curl -X POST https://fspay.ng/api/v1/b2b/register \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Your Business Name",
    "businessEmail": "contact@yourbusiness.com",
    "businessType": "e-commerce",
    "dailyLimit": 1000000,
    "webhookUrl": "https://yourbusiness.com/webhooks/fngn"
  }'
```

### 2. Process a Payment
```bash
curl -X POST https://fspay.ng/api/v1/b2b/payments \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "toBusinessId": "biz_recipient_id",
    "amount": 50000,
    "currency": "FNGN",
    "reference": "ORDER_12345",
    "description": "Payment for order #12345"
  }'
```

## API Endpoints

### Business Management

#### Register Business
```http
POST /register
```

**Request Body:**
```json
{
  "businessName": "string",
  "businessEmail": "string",
  "businessType": "e-commerce|fintech|marketplace|saas|logistics|other",
  "kycLevel": 0,
  "dailyLimit": 1000000,
  "webhookUrl": "https://yourbusiness.com/webhook"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "businessId": "biz_abc123",
    "custodialWallet": "0x1234...5678",
    "apiKey": "fngn_xyz789"
  }
}
```

### Account Management

#### Get Balance
```http
GET /balance
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 150000.50,
    "escrowBalance": 25000.00,
    "dailyLimit": 1000000.00,
    "dailyUsed": 75000.00,
    "remainingDaily": 925000.00
  }
}
```

#### Deposit Funds
```http
POST /deposit
```

**Request Body:**
```json
{
  "amount": 100000
}
```

#### Withdraw Funds
```http
POST /withdraw
```

**Request Body:**
```json
{
  "amount": 50000,
  "recipient": "0x1234567890123456789012345678901234567890"
}
```

### Payments

#### Process Payment
```http
POST /payments
```

**Request Body:**
```json
{
  "toBusinessId": "biz_recipient_id",
  "amount": 50000,
  "currency": "FNGN",
  "reference": "ORDER_12345",
  "description": "Payment for order #12345",
  "metadata": {
    "orderId": "12345",
    "customerId": "cust_789"
  },
  "webhookUrl": "https://yourbusiness.com/webhook"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_abc123",
    "status": "completed",
    "amount": 50000,
    "fee": 500,
    "netAmount": 49500,
    "reference": "ORDER_12345",
    "timestamp": "2025-07-29T06:00:00Z",
    "estimatedSettlement": "2025-07-29T06:05:00Z"
  }
}
```

#### Get Transaction History
```http
GET /transactions?limit=50&offset=0
```

#### Get Transaction Details
```http
GET /transactions/{transactionId}
```

### System Information

#### Get Pricing
```http
GET /pricing
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fngn_ngn_rate": 1.0,
    "ngn_usd_rate": 0.00125,
    "fngn_usd_rate": 0.00125,
    "gateway_fee": 1.0,
    "minimum_payment": 1000,
    "maximum_payment": 10000000,
    "last_updated": "2025-07-29T06:00:00Z"
  }
}
```

#### Get System Status
```http
GET /status
```

## Webhooks

### Webhook Events

Your webhook endpoint will receive POST requests for the following events:

- `payment.completed` - Payment successfully processed
- `payment.failed` - Payment failed
- `payment.refunded` - Payment was refunded
- `deposit.completed` - Funds deposited to account
- `withdrawal.completed` - Funds withdrawn from account

### Webhook Payload
```json
{
  "event": "payment.completed",
  "transactionId": "txn_abc123",
  "data": {
    "transactionId": "txn_abc123",
    "fromBusinessId": "biz_sender",
    "toBusinessId": "biz_recipient",
    "amount": 50000,
    "fee": 500,
    "netAmount": 49500,
    "status": "completed",
    "reference": "ORDER_12345",
    "timestamp": "2025-07-29T06:00:00Z"
  },
  "timestamp": "2025-07-29T06:00:00Z"
}
```

### Webhook Security

Verify webhook signatures using HMAC SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/payments` | 100 requests | 1 hour |
| `/balance` | 1000 requests | 1 hour |
| `/transactions` | 500 requests | 1 hour |
| `/deposit` | 50 requests | 1 hour |
| `/withdraw` | 20 requests | 1 hour |

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

- `INVALID_API_KEY` - API key is invalid or missing
- `INSUFFICIENT_BALANCE` - Not enough funds for transaction
- `DAILY_LIMIT_EXCEEDED` - Daily transaction limit reached
- `INVALID_BUSINESS_ID` - Business ID not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `VALIDATION_ERROR` - Request data validation failed

## SDKs and Libraries

### Node.js SDK
```bash
npm install @fspay/fngn-b2b-sdk
```

```javascript
const { FNGNClient } = require('@fspay/fngn-b2b-sdk');

const client = new FNGNClient({
  apiKey: 'your_api_key',
  environment: 'production' // or 'sandbox'
});

// Process payment
const payment = await client.payments.create({
  toBusinessId: 'biz_recipient',
  amount: 50000,
  reference: 'ORDER_12345'
});
```

### PHP SDK
```bash
composer require fspay/fngn-b2b-php
```

```php
use FSPay\FNGN\Client;

$client = new Client([
    'api_key' => 'your_api_key',
    'environment' => 'production'
]);

$payment = $client->payments->create([
    'toBusinessId' => 'biz_recipient',
    'amount' => 50000,
    'reference' => 'ORDER_12345'
]);
```

### Python SDK
```bash
pip install fspay-fngn-python
```

```python
from fspay import FNGNClient

client = FNGNClient(
    api_key='your_api_key',
    environment='production'
)

payment = client.payments.create(
    to_business_id='biz_recipient',
    amount=50000,
    reference='ORDER_12345'
)
```

## Use Cases

### E-commerce Integration
```javascript
// Process order payment
const payment = await client.payments.create({
  toBusinessId: 'merchant_id',
  amount: orderTotal,
  reference: `ORDER_${orderId}`,
  description: `Payment for order ${orderId}`,
  metadata: {
    orderId: orderId,
    customerId: customerId,
    items: orderItems
  }
});
```

### Marketplace Splits
```javascript
// Split payment between marketplace and vendor
const marketplaceFee = orderTotal * 0.05; // 5% marketplace fee
const vendorAmount = orderTotal - marketplaceFee;

// Pay vendor
await client.payments.create({
  toBusinessId: vendorId,
  amount: vendorAmount,
  reference: `VENDOR_${orderId}`
});

// Keep marketplace fee in account
```

### Subscription Billing
```javascript
// Recurring subscription payment
const subscription = await client.payments.create({
  toBusinessId: 'service_provider',
  amount: subscriptionAmount,
  reference: `SUB_${subscriptionId}_${month}`,
  description: `Monthly subscription - ${month}`
});
```

## Support

- **Documentation**: https://fspay.ng/docs/b2b
- **Support Email**: b2b-support@fspay.ng
- **Developer Portal**: https://fspay.ng/developer
- **Status Page**: https://fspay.ng/status

## Changelog

### v1.0.0 (2025-07-29)
- Initial B2B API release
- Core payment processing
- Custodial wallet management
- Webhook notifications
- Rate limiting and security
