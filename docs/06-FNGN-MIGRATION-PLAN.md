# FSPay to FNGN Stablecoin Migration Plan

## 🎯 **OVERVIEW**
Comprehensive migration plan for transitioning FSPay from internal FSP utility points to a fully-backed, Naira-pegged stablecoin (FNGN) on Ethereum and Binance Smart Chain.

## 📊 **MIGRATION SUMMARY**

### **Current State**
- **System**: Internal Points utility system (1 Point = ₦1)
- **Storage**: Database-based balance tracking
- **Transactions**: Internal accounting system
- **Users**: ~1,000+ active users with FSP balances
- **Infrastructure**: 80% blockchain-ready (existing wallet/blockchain services)

### **Target State**
- **System**: FNGN stablecoin (1 FNGN = ₦1)
- **Storage**: Blockchain-based token balances with database sync
- **Transactions**: Smart contract interactions with proof-of-reserve
- **Users**: Seamless transition with 1:1 FSP-to-Naira conversion
- **Infrastructure**: Full stablecoin ecosystem with regulatory compliance

## 🗓️ **MIGRATION TIMELINE**

### **Phase 1: Infrastructure Setup (Weeks 1-4)**
**Duration**: 4 weeks  
**Status**: Foundation Development  
**Risk Level**: Medium

#### **Week 1-2: Database & Smart Contract Foundation**
- [ ] **Database Schema Updates**
  - Add `fngn_balance DECIMAL(18,8)` to users table
  - Create `stablecoin_transactions` table
  - Create `reserve_snapshots` table
  - Create `migration_records` table for tracking conversions
  
- [ ] **Smart Contract Development**
  - Deploy FNGN ERC-20 contract on Ethereum testnet
  - Deploy FNGN BEP-20 contract on BSC testnet
  - Implement mint/burn functions with access controls
  - Add pause/unpause functionality for emergency stops
  - Implement compliance functions (blacklist, whitelist)

#### **Week 3-4: Backend Services Development**
- [ ] **StablecoinService Implementation**
  ```typescript
  class StablecoinService {
    async mintFNGN(userId: string, nairaAmount: number): Promise<string>
    async burnFNGN(userId: string, fngnAmount: number): Promise<string>
    async transferFNGN(from: string, to: string, amount: number): Promise<string>
    async getFNGNBalance(userId: string): Promise<string>
  }
  ```

- [ ] **ReserveService Implementation**
  ```typescript
  class ReserveService {
    async getProofOfReserve(): Promise<ReserveData>
    async verifyReserveBacking(): Promise<boolean>
    async createReserveSnapshot(): Promise<void>
    async getReserveRatio(): Promise<number>
  }
  ```

- [ ] **ComplianceService Implementation**
  ```typescript
  class ComplianceService {
    async performKYC(userId: string, documents: KYCData): Promise<boolean>
    async checkAMLCompliance(transaction: Transaction): Promise<boolean>
    async reportSuspiciousActivity(userId: string, reason: string): Promise<void>
  }
  ```

### **Phase 2: Testing & Integration (Weeks 5-8)**
**Duration**: 4 weeks  
**Status**: Integration & Testing  
**Risk Level**: High

#### **Week 5-6: Smart Contract Testing**
- [ ] **Testnet Deployment & Testing**
  - Deploy contracts on Ethereum Goerli testnet
  - Deploy contracts on BSC testnet
  - Comprehensive smart contract testing
  - Security audit preparation
  - Gas optimization testing

- [ ] **Backend Integration Testing**
  - StablecoinService integration with smart contracts
  - ReserveService proof-of-reserve testing
  - Database transaction consistency testing
  - Error handling and rollback mechanisms

#### **Week 7-8: Frontend Development**
- [ ] **Stablecoin UI Components**
  - FNGN balance display component
  - Mint/burn interface with gas fee estimation
  - Transaction history for stablecoin operations
  - Proof-of-reserve dashboard

- [ ] **Migration Interface**
  - FSP-to-FNGN conversion calculator
  - Migration progress tracking
  - User education and guidance
  - Migration confirmation flows

### **Phase 3: Security & Compliance (Weeks 9-12)**
**Duration**: 4 weeks  
**Status**: Security & Regulatory Preparation  
**Risk Level**: High

#### **Week 9-10: Security Implementation**
- [ ] **Smart Contract Security**
  - Professional security audit
  - Multi-signature wallet setup for contract ownership
  - Emergency pause mechanisms
  - Access control implementation

- [ ] **Reserve Management Setup**
  - Segregated Naira reserve accounts
  - Multi-signature controls for reserve access
  - Real-time reserve monitoring system
  - Insurance coverage for reserves

#### **Week 11-12: Regulatory Compliance**
- [ ] **CBN Sandbox Application**
  - Complete regulatory documentation
  - Submit CBN sandbox application
  - Implement required compliance measures
  - Prepare for regulatory review

- [ ] **KYC/AML Integration**
  - Integrate KYC verification system
  - Implement AML transaction monitoring
  - Set up suspicious activity reporting
  - User verification workflows

### **Phase 4: User Migration (Weeks 13-16)**
**Duration**: 4 weeks  
**Status**: User Transition  
**Risk Level**: Medium

#### **Week 13-14: Migration Preparation**
- [ ] **User Communication**
  - Migration announcement and education
  - User guides and tutorials
  - FAQ and support documentation
  - Migration timeline communication

- [ ] **Migration System Setup**
  - FSP balance snapshot and verification
  - Migration rate calculation (FSP to Naira to FNGN)
  - Batch migration processing system
  - Rollback mechanisms for failed migrations

#### **Week 15-16: Phased User Migration**
- [ ] **Beta User Migration (Week 15)**
  - Migrate 10% of users (beta group)
  - Monitor system performance
  - Gather user feedback
  - Address any issues

- [ ] **Full User Migration (Week 16)**
  - Migrate remaining 90% of users
  - Real-time monitoring and support
  - Issue resolution and user assistance
  - Migration completion verification

### **Phase 5: Launch & Optimization (Weeks 17-20)**
**Duration**: 4 weeks  
**Status**: Production Launch  
**Risk Level**: Low

#### **Week 17-18: Mainnet Launch**
- [ ] **Mainnet Deployment**
  - Deploy FNGN contracts on Ethereum mainnet
  - Deploy FNGN contracts on BSC mainnet
  - Initialize reserve backing system
  - Launch proof-of-reserve dashboard

- [ ] **System Monitoring**
  - 24/7 system monitoring setup
  - Alert systems for critical issues
  - Performance optimization
  - User support scaling

#### **Week 19-20: Post-Launch Optimization**
- [ ] **Performance Optimization**
  - Gas fee optimization
  - Transaction throughput improvements
  - UI/UX refinements based on user feedback
  - System stability enhancements

- [ ] **Feature Expansion**
  - Advanced stablecoin features
  - Cross-chain bridge implementation
  - DeFi integration preparation
  - Institutional features development

## 📋 **DETAILED IMPLEMENTATION TASKS**

### **1. Database Schema Migrations**

#### **New Tables Creation**
```sql
-- Stablecoin transactions tracking
CREATE TABLE stablecoin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  transaction_hash VARCHAR(66) UNIQUE,
  transaction_type VARCHAR(20) CHECK (transaction_type IN ('mint', 'burn', 'transfer')),
  amount DECIMAL(18,8) NOT NULL,
  gas_fee DECIMAL(18,8),
  blockchain_network VARCHAR(10) CHECK (blockchain_network IN ('ethereum', 'bsc')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number BIGINT,
  created_at TIMESTAMP DEFAULT NOW(),
  confirmed_at TIMESTAMP,
  INDEX idx_user_transactions (user_id, created_at),
  INDEX idx_transaction_hash (transaction_hash),
  INDEX idx_status (status)
);

-- Reserve backing snapshots
CREATE TABLE reserve_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_fngn_supply DECIMAL(18,8) NOT NULL,
  naira_reserves DECIMAL(18,2) NOT NULL,
  reserve_ratio DECIMAL(5,2) NOT NULL,
  proof_hash VARCHAR(66),
  audit_timestamp TIMESTAMP DEFAULT NOW(),
  auditor_signature TEXT,
  INDEX idx_audit_timestamp (audit_timestamp)
);

-- Migration tracking
CREATE TABLE migration_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  fsp_balance_before DECIMAL(10,2) NOT NULL,
  naira_equivalent DECIMAL(18,2) NOT NULL,
  fngn_minted DECIMAL(18,8) NOT NULL,
  migration_transaction_hash VARCHAR(66),
  migration_status VARCHAR(20) DEFAULT 'pending',
  migrated_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_user_migration (user_id),
  INDEX idx_migration_status (migration_status)
);

-- Gas fee tracking
CREATE TABLE gas_fee_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network VARCHAR(10) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  gas_price_gwei DECIMAL(18,8) NOT NULL,
  gas_used BIGINT NOT NULL,
  total_fee_eth DECIMAL(18,8) NOT NULL,
  total_fee_usd DECIMAL(18,2),
  recorded_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_network_type (network, transaction_type),
  INDEX idx_recorded_at (recorded_at)
);
```

#### **Existing Table Updates**
```sql
-- Add FNGN balance to users table
ALTER TABLE users ADD COLUMN fngn_balance DECIMAL(18,8) DEFAULT 0;
ALTER TABLE users ADD COLUMN kyc_level INTEGER DEFAULT 0 CHECK (kyc_level IN (0, 1, 2, 3));
ALTER TABLE users ADD COLUMN kyc_verified_at TIMESTAMP;
ALTER TABLE users ADD COLUMN migration_completed BOOLEAN DEFAULT FALSE;

-- Add FNGN token type to wallets table
INSERT INTO wallets (user_id, token_type, balance) 
SELECT id, 'FNGN', '0' FROM users WHERE NOT EXISTS (
  SELECT 1 FROM wallets WHERE wallets.user_id = users.id AND wallets.token_type = 'FNGN'
);

-- Update transactions table for stablecoin support
ALTER TABLE transactions ADD COLUMN blockchain_network VARCHAR(10);
ALTER TABLE transactions ADD COLUMN gas_fee DECIMAL(18,8);
ALTER TABLE transactions ADD COLUMN block_number BIGINT;
```

### **2. Smart Contract Specifications**

#### **FNGN ERC-20/BEP-20 Contract**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract FNGN is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    mapping(address => bool) public blacklisted;
    
    event Mint(address indexed to, uint256 amount, bytes32 indexed reserveProof);
    event Burn(address indexed from, uint256 amount, bytes32 indexed reserveProof);
    event Blacklisted(address indexed account);
    event Unblacklisted(address indexed account);
    
    constructor() ERC20("FSPay Nigerian Naira", "FNGN") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount, bytes32 reserveProof) 
        public onlyRole(MINTER_ROLE) whenNotPaused {
        require(!blacklisted[to], "Address is blacklisted");
        _mint(to, amount);
        emit Mint(to, amount, reserveProof);
    }
    
    function burn(address from, uint256 amount, bytes32 reserveProof) 
        public onlyRole(BURNER_ROLE) whenNotPaused {
        require(!blacklisted[from], "Address is blacklisted");
        _burn(from, amount);
        emit Burn(from, amount, reserveProof);
    }
    
    function blacklist(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        blacklisted[account] = true;
        emit Blacklisted(account);
    }
    
    function unblacklist(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        blacklisted[account] = false;
        emit Unblacklisted(account);
    }
    
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal whenNotPaused override {
        require(!blacklisted[from], "Sender is blacklisted");
        require(!blacklisted[to], "Recipient is blacklisted");
        super._beforeTokenTransfer(from, to, amount);
    }
}
```

### **3. Backend Service Implementation**

#### **StablecoinService**
```typescript
import { ethers } from 'ethers';
import { blockchainService } from './blockchainService';
import { db } from '../db';
import { stablecoinTransactions, users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export class StablecoinService {
  private fngnContractAddress: string;
  private fngnABI: any[];

  constructor() {
    this.fngnContractAddress = process.env.FNGN_CONTRACT_ADDRESS!;
    this.fngnABI = []; // Load from ABI file
  }

  async mintFNGN(userId: string, nairaAmount: number): Promise<string> {
    try {
      // 1. Verify user KYC status
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });
      
      if (!user || user.kycLevel < 1) {
        throw new Error('KYC verification required for minting');
      }

      // 2. Calculate FNGN amount (1:1 with Naira)
      const fngnAmount = ethers.parseUnits(nairaAmount.toString(), 18);

      // 3. Prepare mint transaction
      const provider = blockchainService.getProvider('ethereum');
      const contract = new ethers.Contract(this.fngnContractAddress, this.fngnABI, provider);
      
      // 4. Generate reserve proof
      const reserveProof = await this.generateReserveProof(nairaAmount);

      // 5. Execute mint transaction
      const txData = contract.interface.encodeFunctionData('mint', [
        user.walletAddress,
        fngnAmount,
        reserveProof
      ]);

      const txRequest = {
        to: this.fngnContractAddress,
        data: txData,
        value: '0'
      };

      const txHash = await blockchainService.broadcastTransaction(userId, txRequest);

      // 6. Record transaction in database
      await db.insert(stablecoinTransactions).values({
        userId,
        transactionHash: txHash,
        transactionType: 'mint',
        amount: nairaAmount.toString(),
        blockchainNetwork: 'ethereum',
        status: 'pending'
      });

      return txHash;
    } catch (error) {
      console.error('Error minting FNGN:', error);
      throw error;
    }
  }

  async burnFNGN(userId: string, fngnAmount: number): Promise<string> {
    try {
      // 1. Verify user has sufficient FNGN balance
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });

      if (!user || parseFloat(user.fngnBalance || '0') < fngnAmount) {
        throw new Error('Insufficient FNGN balance');
      }

      // 2. Calculate burn amount in wei
      const burnAmountWei = ethers.parseUnits(fngnAmount.toString(), 18);

      // 3. Prepare burn transaction
      const provider = blockchainService.getProvider('ethereum');
      const contract = new ethers.Contract(this.fngnContractAddress, this.fngnABI, provider);
      
      // 4. Generate reserve proof
      const reserveProof = await this.generateReserveProof(fngnAmount);

      // 5. Execute burn transaction
      const txData = contract.interface.encodeFunctionData('burn', [
        user.walletAddress,
        burnAmountWei,
        reserveProof
      ]);

      const txRequest = {
        to: this.fngnContractAddress,
        data: txData,
        value: '0'
      };

      const txHash = await blockchainService.broadcastTransaction(userId, txRequest);

      // 6. Record transaction in database
      await db.insert(stablecoinTransactions).values({
        userId,
        transactionHash: txHash,
        transactionType: 'burn',
        amount: fngnAmount.toString(),
        blockchainNetwork: 'ethereum',
        status: 'pending'
      });

      return txHash;
    } catch (error) {
      console.error('Error burning FNGN:', error);
      throw error;
    }
  }

  private async generateReserveProof(amount: number): Promise<string> {
    // Generate cryptographic proof of reserve backing
    // This would integrate with the reserve management system
    return ethers.keccak256(ethers.toUtf8Bytes(`reserve_${amount}_${Date.now()}`));
  }
}
```

### **4. Migration Process Implementation**

#### **Migration Service**
```typescript
export class MigrationService {
  async migrateUser(userId: string): Promise<void> {
    const transaction = await db.transaction(async (tx) => {
      try {
        // 1. Get user's current FSP balance
        const user = await tx.query.users.findFirst({
          where: eq(users.id, userId)
        });

        if (!user || user.migrationCompleted) {
          throw new Error('User not found or already migrated');
        }

        const fspBalance = parseFloat(user.fspBalance || '0');
        if (fspBalance <= 0) {
          throw new Error('No FSP balance to migrate');
        }

        // 2. Calculate Naira equivalent (1 Point = ₦1)
        const nairaEquivalent = pointsBalance * 1;

        // 3. Mint equivalent FNGN (1 FNGN = ₦1)
        const fngnAmount = nairaEquivalent;

        // 4. Execute FNGN mint
        const stablecoinService = new StablecoinService();
        const txHash = await stablecoinService.mintFNGN(userId, fngnAmount);

        // 5. Update user balances
        await tx.update(users)
          .set({
            fspBalance: '0', // Clear FSP balance
            fngnBalance: fngnAmount.toString(),
            migrationCompleted: true
          })
          .where(eq(users.id, userId));

        // 6. Record migration
        await tx.insert(migrationRecords).values({
          userId,
          fspBalanceBefore: fspBalance,
          nairaEquivalent,
          fngnMinted: fngnAmount,
          migrationTransactionHash: txHash,
          migrationStatus: 'completed'
        });

        return txHash;
      } catch (error) {
        console.error('Migration failed for user:', userId, error);
        throw error;
      }
    });
  }

  async batchMigrateUsers(userIds: string[]): Promise<void> {
    const results = [];
    
    for (const userId of userIds) {
      try {
        await this.migrateUser(userId);
        results.push({ userId, status: 'success' });
      } catch (error) {
        results.push({ userId, status: 'failed', error: error.message });
      }
    }

    console.log('Batch migration results:', results);
  }
}
```

## 🚨 **RISK MANAGEMENT**

### **Technical Risks**
1. **Smart Contract Vulnerabilities**
   - **Mitigation**: Professional security audit, extensive testing
   - **Contingency**: Emergency pause mechanism, upgrade capability

2. **Migration Data Loss**
   - **Mitigation**: Complete database backups, rollback procedures
   - **Contingency**: Manual recovery processes, user support

3. **Blockchain Network Issues**
   - **Mitigation**: Multi-network deployment, fallback mechanisms
   - **Contingency**: Alternative network activation

### **Regulatory Risks**
1. **CBN Approval Delays**
   - **Mitigation**: Early application, proactive compliance
   - **Contingency**: Testnet operation until approval

2. **Compliance Requirements Changes**
   - **Mitigation**: Flexible architecture, regular updates
   - **Contingency**: Rapid compliance implementation

### **Business Risks**
1. **User Adoption Resistance**
   - **Mitigation**: Education, gradual migration, incentives
   - **Contingency**: Extended migration period, support

2. **Reserve Management Issues**
   - **Mitigation**: Professional reserve management, insurance
   - **Contingency**: Emergency reserve fund, backing guarantee

## 📊 **SUCCESS METRICS**

### **Technical Metrics**
- [ ] 100% successful user migrations
- [ ] <2% transaction failure rate
- [ ] <5 second average transaction confirmation
- [ ] 99.9% system uptime during migration

### **Business Metrics**
- [ ] 95%+ user adoption rate
- [ ] 1:1 reserve ratio maintained
- [ ] Zero security incidents
- [ ] CBN sandbox approval achieved

### **User Experience Metrics**
- [ ] <3 support tickets per 100 migrations
- [ ] 4.5+ user satisfaction rating
- [ ] <1 minute average migration time
- [ ] 90%+ user education completion

## 🎯 **POST-MIGRATION ROADMAP**

### **Immediate (Months 1-2)**
- [ ] System monitoring and optimization
- [ ] User support and issue resolution
- [ ] Performance improvements
- [ ] Bug fixes and stability enhancements

### **Short-term (Months 3-6)**
- [ ] Cross-chain bridge implementation
- [ ] Advanced stablecoin features
- [ ] DeFi integration preparation
- [ ] Institutional features development

### **Medium-term (Months 7-12)**
- [ ] Regional expansion (ECOWAS)
- [ ] Advanced compliance features
- [ ] API monetization
- [ ] Partnership integrations

### **Long-term (Year 2+)**
- [ ] Global expansion
- [ ] RWA tokenization platform
- [ ] Advanced financial products
- [ ] Ecosystem development

---

## 📞 **MIGRATION SUPPORT**

**Migration Team**: migration@fspay.ng  
**Technical Support**: tech@fspay.ng  
**Emergency Hotline**: +234-805-441-8864  
**Documentation**: https://docs.fspay.ng/migration

---

*This migration plan is a living document and will be updated as implementation progresses and requirements evolve.*
