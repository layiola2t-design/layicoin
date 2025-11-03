# Layibit - Simple Fungible Token (Clarity)

This contract defines a minimal fungible token named `layibit` suitable for development and testing with Clarinet.

## Functions

- `initialize(new-owner: principal)` — One-time initializer that sets the contract owner.
- `mint(amount: uint, recipient: principal)` — Owner-only minting function.
- `transfer(amount: uint, sender: principal, recipient: principal)` — Transfers tokens.
- `get-balance(who: principal)` — Read-only balance query.
- `get-total-supply()` — Read-only total supply query.

## Usage

1) Start a console
```bash
clarinet console
```

2) Initialize the owner (run once)
```clarity
(contract-call? .layibit initialize tx-sender)
```

3) Mint tokens (owner only)
```clarity
(contract-call? .layibit mint u1000000 tx-sender)
```

4) Check balance
```clarity
(contract-call? .layibit get-balance tx-sender)
```

## Build/Check

```bash
clarinet check
```
