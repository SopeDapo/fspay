# FSPay Vendor & P2P API Specification

## 📋 **API Overview**

This document provides detailed specifications for the FSPay Vendor & P2P Trading API endpoints. These APIs connect the frontend components with the backend services and smart contracts.

## 🔐 **Authentication**

All API endpoints require authentication via JWT tokens or wallet signature verification.

```typescript
// Request Headers
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json",
  "X-Wallet-Address": "<user_wallet_address>"
}
```

## 📡 **API Endpoints**

### **User Management**

#### **Set User Type**
```http
POST /api/vendor/user-type
```

**Request Body:**
```typescript
{
  userAddress: string;
  userType: "INDIVIDUAL_TRADER" | "PROFESSIONAL_VENDOR";
  network?: string; // Default: "ethereum"
}
```

**Response:**
```typescript
{
  success: boolean;
  txHash?: string;
  error?: string;
}
```

#### **Get User Information**
```http
GET /api/vendor/user-info/:address
```

**Response:**
```typescript
{
  walletAddress: string;
  userType: "INDIVIDUAL_TRADER" | "PROFESSIONAL_VENDOR";
  dailyLimit: string;
  maxAds: string;
  profile: {
    username?: string;
    firstName?: string;
    isVendor: boolean;
    vendorTier?: string;
    p2pRating: number;
    p2pTradeCount: number;
  };
  stats: {
    totalAdsCreated: number;
    activeAdsCount: number;
    totalTrades: number;
    successRate: number;
    averageRating: number;
  };
}
```

### **Advertisement Management**

#### **Create Advertisement**
```http
POST /api/vendor/advertisements
```

**Request Body:**
```typescript
{
  advertiser: string;
  userType?: "PROFESSIONAL_VENDOR" | "INDIVIDUAL_TRADER";
  adType: "SELL_FNGN" | "BUY_FNGN" | "SELL_STABLECOIN" | "BUY_STABLECOIN";
  sourceCurrency: string; // "NGN", "USD", "GBP", "EUR"
  targetStablecoin: string; // "FNGN", "USDT", "USDC"
  rate: number;
  minAmount: number;
  maxAmount: number;
  totalAmount: number;
  paymentMethods: string[]; // ["Bank Transfer", "Mobile Money"]
  instructions: string;
  durationHours: number;
  network?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  adId?: string;
  txHash?: string;
  error?: string;
}
```

#### **Browse Marketplace**
```http
GET /api/vendor/advertisements
```

**Query Parameters:**
```typescript
{
  adType?: "SELL_FNGN" | "BUY_FNGN" | "SELL_STABLECOIN" | "BUY_STABLECOIN";
  sourceCurrency?: string;
  targetStablecoin?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string;
  limit?: number; // Default: 50
  offset?: number; // Default: 0
}
```

**Response:**
```typescript
{
  advertisements: Array<{
    id: string;
    adId: string;
    advertiserId: string;
    advertiserType: string;
    adType: string;
    sourceCurrency: string;
    targetStablecoin: string;
    rate: string;
    minAmount: string;
    maxAmount: string;
    availableAmount: string;
    totalAmount: string;
    paymentMethods: string[];
    instructions: string;
    isActive: boolean;
    createdAt: Date;
    expiresAt: Date;
    advertiserInfo: {
      name: string;
      rating: number;
      totalTrades: number;
      completionRate: number;
      isOnline: boolean;
    };
  }>;
  total: number;
  hasMore: boolean;
}
```

#### **Get Specific Advertisement**
```http
GET /api/vendor/advertisements/:id
```

**Response:**
```typescript
{
  id: string;
  adId: string;
  advertiserId: string;
  advertiserType: string;
  adType: string;
  sourceCurrency: string;
  targetStablecoin: string;
  rate: string;
  minAmount: string;
  maxAmount: string;
  availableAmount: string;
  totalAmount: string;
  paymentMethods: string[];
  instructions: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  advertiserInfo: {
    name: string;
    rating: number;
    totalTrades: number;
    completionRate: number;
    isOnline: boolean;
  };
}
```

#### **Update Advertisement**
```http
PUT /api/vendor/advertisements/:id
```

**Request Body:**
```typescript
{
  rate?: number;
  minAmount?: number;
  maxAmount?: number;
  totalAmount?: number;
  paymentMethods?: string[];
  instructions?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  error?: string;
}
```

#### **Cancel Advertisement**
```http
DELETE /api/vendor/advertisements/:id
```

**Response:**
```typescript
{
  success: boolean;
  txHash?: string;
  error?: string;
}
```

#### **Get User Advertisements**
```http
GET /api/vendor/advertisements/user/:address
```

**Query Parameters:**
```typescript
{
  includeInactive?: boolean; // Default: false
}
```

**Response:**
```typescript
{
  advertisements: Array<Advertisement>;
  total: number;
}
```

### **Trade Management**

#### **Respond to Advertisement**
```http
POST /api/vendor/trades
```

**Request Body:**
```typescript
{
  adId: string;
  responder: string;
  amount: number;
  paymentMethod: string;
  message?: string;
  network?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  tradeId?: string;
  txHash?: string;
  error?: string;
}
```

#### **Get User Trades**
```http
GET /api/vendor/trades/user/:address
```

**Query Parameters:**
```typescript
{
  role?: "advertiser" | "responder"; // Default: both
  status?: string;
  limit?: number;
  offset?: number;
}
```

**Response:**
```typescript
{
  trades: Array<{
    trade: {
      id: string;
      tradeId: string;
      adId: string;
      advertiserId: string;
      responderId: string;
      amount: string;
      rate: string;
      totalValue: string;
      paymentMethod: string;
      status: string;
      createdAt: Date;
      expiresAt: Date;
      paidAt?: Date;
      completedAt?: Date;
    };
    advertisement: Advertisement;
  }>;
  total: number;
}
```

#### **Get Specific Trade**
```http
GET /api/vendor/trades/:id
```

**Response:**
```typescript
{
  trade: {
    id: string;
    tradeId: string;
    adId: string;
    advertiserId: string;
    responderId: string;
    amount: string;
    rate: string;
    totalValue: string;
    paymentMethod: string;
    paymentInstructions: string;
    status: string;
    createdAt: Date;
    expiresAt: Date;
    paidAt?: Date;
    completedAt?: Date;
  };
  advertisement: Advertisement;
  advertiserInfo: {
    name: string;
    rating: number;
  };
  responderInfo: {
    name: string;
    rating: number;
  };
}
```

#### **Update Trade Status**
```http
PUT /api/vendor/trades/:id/status
```

**Request Body:**
```typescript
{
  status: "PAYMENT_SENT" | "PAYMENT_CONFIRMED" | "COMPLETED" | "DISPUTED" | "CANCELLED";
  paymentProof?: string; // For PAYMENT_SENT status
  disputeReason?: string; // For DISPUTED status
}
```

**Response:**
```typescript
{
  success: boolean;
  txHash?: string;
  error?: string;
}
```

### **Vendor Operations**

#### **Register as Vendor**
```http
POST /api/vendor/register
```

**Request Body:**
```typescript
{
  userAddress: string;
  businessData: {
    businessName: string;
    businessType: string;
    registrationNumber?: string;
    address: string;
    contactEmail: string;
    contactPhone: string;
    databaseId?: string;
  };
  network?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  txHash?: string;
  error?: string;
}
```

### **Analytics & Statistics**

#### **Get User Statistics**
```http
GET /api/vendor/statistics/:address
```

**Response:**
```typescript
{
  userStats: {
    totalAdsCreated: number;
    activeAdsCount: number;
    completedAdsCount: number;
    totalTradesAsAdvertiser: number;
    totalTradesAsResponder: number;
    successfulTrades: number;
    averageRating: number;
    successRate: number;
    totalVolumeUsd: string;
  };
  recentActivity: {
    tradesLast30Days: number;
    activeAdvertisements: number;
  };
}
```

#### **Get Marketplace Statistics**
```http
GET /api/vendor/marketplace/stats
```

**Response:**
```typescript
{
  totalActiveAdvertisements: number;
  tradesLast24Hours: number;
  volumeLast24Hours: string;
  averageTradeSize: string;
  topCurrencies: Array<{
    currency: string;
    volume: string;
    count: number;
  }>;
  marketTrends: {
    dailyVolume: Array<{
      date: string;
      volume: string;
    }>;
  };
}
```

## 🔄 **Real-time Events (WebSocket)**

### **Connection**
```javascript
const ws = new WebSocket('wss://api.fspay.com/vendor/ws');
```

### **Event Types**
```typescript
// Marketplace Updates
{
  type: "ADVERTISEMENT_CREATED";
  data: Advertisement;
}

{
  type: "ADVERTISEMENT_UPDATED";
  data: { adId: string; changes: Partial<Advertisement> };
}

{
  type: "ADVERTISEMENT_CANCELLED";
  data: { adId: string };
}

// Trade Updates
{
  type: "TRADE_INITIATED";
  data: Trade;
}

{
  type: "TRADE_STATUS_UPDATED";
  data: { tradeId: string; status: string; timestamp: Date };
}

// User Notifications
{
  type: "NEW_TRADE_RESPONSE";
  data: { adId: string; tradeId: string; responder: string };
}

{
  type: "PAYMENT_RECEIVED";
  data: { tradeId: string; amount: string };
}
```

## ⚠️ **Error Handling**

### **Standard Error Response**
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
  };
}
```

### **Error Codes**
```typescript
// Authentication Errors
"AUTH_REQUIRED" - Authentication required
"INVALID_TOKEN" - Invalid or expired token
"INSUFFICIENT_PERMISSIONS" - User lacks required permissions

// Validation Errors
"INVALID_INPUT" - Invalid request data
"MISSING_REQUIRED_FIELD" - Required field missing
"INVALID_AMOUNT" - Invalid amount specified
"INVALID_CURRENCY" - Unsupported currency

// Business Logic Errors
"ADVERTISEMENT_NOT_FOUND" - Advertisement not found
"TRADE_NOT_FOUND" - Trade not found
"INSUFFICIENT_BALANCE" - Insufficient balance for operation
"ADVERTISEMENT_EXPIRED" - Advertisement has expired
"TRADE_ALREADY_COMPLETED" - Trade is already completed

// Blockchain Errors
"TRANSACTION_FAILED" - Blockchain transaction failed
"NETWORK_ERROR" - Blockchain network error
"CONTRACT_ERROR" - Smart contract execution error

// Rate Limiting
"RATE_LIMIT_EXCEEDED" - Too many requests
```

## 🔒 **Security Considerations**

### **Input Validation**
- All inputs validated using Zod schemas
- SQL injection prevention
- XSS protection
- CSRF protection

### **Rate Limiting**
```typescript
// Per endpoint limits
POST /api/vendor/advertisements - 10 requests/hour
POST /api/vendor/trades - 20 requests/hour
GET endpoints - 100 requests/minute
```

### **Authentication**
- JWT token validation
- Wallet signature verification
- Session management
- Multi-factor authentication for vendors

---

**Last Updated**: January 30, 2025  
**API Version**: v1.0  
**Base URL**: `https://api.fspay.com/v1`
