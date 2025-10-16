# Layicoin (LAYI) - SIP-010 Token Contract

Layicoin is a cryptocurrency token built on the Stacks blockchain, implementing the SIP-010 fungible token standard. This repository contains the smart contract and related development tools.

## 🚀 Features

- **SIP-010 Compliant**: Full implementation of the SIP-010 fungible token standard
- **Mintable**: Contract owner can mint new tokens
- **Burnable**: Token holders can burn their tokens
- **Transfer**: Standard transfer functionality with memo support
- **Metadata**: Configurable token URI for metadata
- **Initial Supply**: 1,000,000 LAYI tokens (with 6 decimals)

## 📋 Token Details

- **Name**: Layicoin
- **Symbol**: LAYI
- **Decimals**: 6
- **Initial Supply**: 1,000,000 LAYI (1,000,000,000,000 micro-units)
- **Standard**: SIP-010

## 🏗️ Project Structure

```
layicoin/
├── contracts/
│   └── layicoin.clar          # Main token contract
├── tests/
│   └── layicoin_test.ts       # Contract tests
├── settings/
│   ├── Devnet.toml           # Development network settings
│   ├── Testnet.toml          # Testnet settings
│   └── Mainnet.toml          # Mainnet settings
├── Clarinet.toml             # Clarinet configuration
└── README.md                 # This file
```

## 🔧 Prerequisites

- [Clarinet](https://docs.hiro.so/clarinet) - Stacks development tool
- [Node.js](https://nodejs.org/) (for tests)
- [Stacks CLI](https://docs.hiro.so/stacks-cli) (optional, for deployment)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd layicoin
npm install  # Install test dependencies
```

### 2. Check Contract Syntax

```bash
clarinet check
```

### 3. Run Tests

```bash
clarinet test
```

### 4. Start Local Development Console

```bash
clarinet console
```

## 📝 Contract Functions

### Read-Only Functions

#### `get-name()`
Returns the token name "Layicoin".

#### `get-symbol()` 
Returns the token symbol "LAYI".

#### `get-decimals()`
Returns the number of decimals (6).

#### `get-balance(who: principal)`
Returns the token balance of the specified principal.

#### `get-total-supply()`
Returns the total supply of tokens.

#### `get-token-uri()`
Returns the optional token metadata URI.

### Public Functions

#### `transfer(amount: uint, from: principal, to: principal, memo: optional buff)`
Transfers tokens between principals. Can only be called by the token owner or contract caller.

#### `mint(amount: uint, to: principal)`
**Owner only**: Mints new tokens to the specified principal.

#### `burn(amount: uint, from: principal)`
Burns tokens from the specified principal. Can only be called by the token owner.

#### `set-token-uri(new-uri: optional string)`
**Owner only**: Sets the token metadata URI.

## 🧪 Testing

The contract includes comprehensive tests covering:

- Token metadata retrieval
- Balance checking
- Transfer functionality
- Minting (owner only)
- Burning
- Access control
- Error handling

Run tests with:
```bash
clarinet test
```

## 🌐 Deployment

### Testnet Deployment

1. Configure your testnet settings in `settings/Testnet.toml`
2. Deploy using Clarinet:

```bash
clarinet deployments generate --testnet
clarinet deployments apply --testnet
```

### Mainnet Deployment

1. Configure your mainnet settings in `settings/Mainnet.toml`
2. Deploy using Clarinet:

```bash
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```

## 💡 Usage Examples

### Using Clarinet Console

```clarity
;; Check token balance
(contract-call? .layicoin get-balance 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; Transfer tokens
(contract-call? .layicoin transfer u1000000 tx-sender 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG none)

;; Mint tokens (owner only)
(contract-call? .layicoin mint u5000000 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)
```

## 🔐 Security Features

- **Owner-only functions**: Minting and URI updates require contract owner
- **Access control**: Transfer and burn functions validate caller permissions
- **Input validation**: All functions validate input parameters
- **Standard compliance**: Follows SIP-010 security best practices

## 📄 Error Codes

- `u100`: `ERR_OWNER_ONLY` - Function requires contract owner
- `u101`: `ERR_NOT_TOKEN_OWNER` - Caller is not the token owner
- `u102`: `ERR_INSUFFICIENT_BALANCE` - Insufficient token balance
- `u103`: `ERR_INVALID_AMOUNT` - Invalid amount (must be > 0)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [SIP-010 Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
- [Stacks Explorer](https://explorer.stacks.co/)

## ⚠️ Disclaimer

This is experimental software. Use at your own risk. Always audit smart contracts before deploying to mainnet.
 
