import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Layicoin token has correct metadata",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        
        let block = chain.mineBlock([
            Tx.contractCall("layicoin", "get-name", [], deployer.address),
            Tx.contractCall("layicoin", "get-symbol", [], deployer.address),
            Tx.contractCall("layicoin", "get-decimals", [], deployer.address),
        ]);
        
        assertEquals(block.receipts.length, 3);
        assertEquals(block.receipts[0].result, `(ok "Layicoin")`);
        assertEquals(block.receipts[1].result, `(ok "LAYI")`);
        assertEquals(block.receipts[2].result, `(ok u6)`);
    },
});

Clarinet.test({
    name: "Deployer has initial token supply",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        
        let block = chain.mineBlock([
            Tx.contractCall("layicoin", "get-balance", [types.principal(deployer.address)], deployer.address),
            Tx.contractCall("layicoin", "get-total-supply", [], deployer.address),
        ]);
        
        assertEquals(block.receipts.length, 2);
        assertEquals(block.receipts[0].result, `(ok u1000000000000)`);
        assertEquals(block.receipts[1].result, `(ok u1000000000000)`);
    },
});

Clarinet.test({
    name: "Can transfer tokens between accounts",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;
        
        let block = chain.mineBlock([
            Tx.contractCall("layicoin", "transfer", [
                types.uint(1000000), // 1 LAYI
                types.principal(deployer.address),
                types.principal(wallet1.address),
                types.none()
            ], deployer.address),
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result, `(ok true)`);
        
        // Check balances after transfer
        let balanceBlock = chain.mineBlock([
            Tx.contractCall("layicoin", "get-balance", [types.principal(deployer.address)], deployer.address),
            Tx.contractCall("layicoin", "get-balance", [types.principal(wallet1.address)], deployer.address),
        ]);
        
        assertEquals(balanceBlock.receipts[0].result, `(ok u999999000000)`);
        assertEquals(balanceBlock.receipts[1].result, `(ok u1000000)`);
    },
});

Clarinet.test({
    name: "Only owner can mint tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;
        
        // Deployer (owner) can mint
        let block = chain.mineBlock([
            Tx.contractCall("layicoin", "mint", [
                types.uint(5000000), // 5 LAYI
                types.principal(wallet1.address)
            ], deployer.address),
        ]);
        
        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result, `(ok true)`);
        
        // Non-owner cannot mint
        let failBlock = chain.mineBlock([
            Tx.contractCall("layicoin", "mint", [
                types.uint(1000000),
                types.principal(wallet1.address)
            ], wallet1.address),
        ]);
        
        assertEquals(failBlock.receipts.length, 1);
        assertEquals(failBlock.receipts[0].result, `(err u100)`); // ERR_OWNER_ONLY
    },
});

Clarinet.test({
    name: "Can burn tokens",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        
        // Get initial balance
        let initialBlock = chain.mineBlock([
            Tx.contractCall("layicoin", "get-balance", [types.principal(deployer.address)], deployer.address),
        ]);
        
        // Burn some tokens
        let burnBlock = chain.mineBlock([
            Tx.contractCall("layicoin", "burn", [
                types.uint(1000000), // 1 LAYI
                types.principal(deployer.address)
            ], deployer.address),
        ]);
        
        assertEquals(burnBlock.receipts.length, 1);
        assertEquals(burnBlock.receipts[0].result, `(ok true)`);
        
        // Check balance decreased
        let finalBlock = chain.mineBlock([
            Tx.contractCall("layicoin", "get-balance", [types.principal(deployer.address)], deployer.address),
        ]);
        
        assertEquals(finalBlock.receipts[0].result, `(ok u999999000000)`);
    },
});

Clarinet.test({
    name: "Transfer validation works correctly",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;
        
        // Cannot transfer 0 amount
        let block1 = chain.mineBlock([
            Tx.contractCall("layicoin", "transfer", [
                types.uint(0),
                types.principal(deployer.address),
                types.principal(wallet1.address),
                types.none()
            ], deployer.address),
        ]);
        
        assertEquals(block1.receipts[0].result, `(err u103)`); // ERR_INVALID_AMOUNT
        
        // Cannot transfer from another account without permission
        let block2 = chain.mineBlock([
            Tx.contractCall("layicoin", "transfer", [
                types.uint(1000000),
                types.principal(deployer.address),
                types.principal(wallet2.address),
                types.none()
            ], wallet1.address),
        ]);
        
        assertEquals(block2.receipts[0].result, `(err u101)`); // ERR_NOT_TOKEN_OWNER
    },
});