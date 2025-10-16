;; Layicoin - SIP-010 Fungible Token Contract
;; A cryptocurrency token built on the Stacks blockchain

;; Define the token
(define-fungible-token layicoin)

;; Define constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_INSUFFICIENT_BALANCE (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))

;; Define data variables
(define-data-var token-name (string-ascii 32) "Layicoin")
(define-data-var token-symbol (string-ascii 10) "LAYI")
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var token-decimals uint u6)

;; SIP-010 trait implementation
(define-trait sip-010-trait
  (
    ;; Transfer from the caller to a new principal
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))

    ;; The human readable name of the token
    (get-name () (response (string-ascii 32) uint))

    ;; The ticker symbol, or empty if none
    (get-symbol () (response (string-ascii 32) uint))

    ;; The number of decimals used, e.g. 6 would mean 1_000_000 represents 1 token
    (get-decimals () (response uint uint))

    ;; The balance of the passed principal
    (get-balance (principal) (response uint uint))

    ;; The current total supply (which does not need to be a constant)
    (get-total-supply () (response uint uint))

    ;; An optional URI that represents metadata of this token
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

;; SIP-010 function implementations

;; Get token name
(define-read-only (get-name)
  (ok (var-get token-name))
)

;; Get token symbol
(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

;; Get token decimals
(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Get balance of a principal
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance layicoin who))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply layicoin))
)

;; Transfer function
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq from tx-sender) (is-eq from contract-caller)) ERR_NOT_TOKEN_OWNER)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (ft-transfer? layicoin amount from to)
  )
)

;; Mint function (only contract owner)
(define-public (mint (amount uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (ft-mint? layicoin amount to)
  )
)

;; Burn function
(define-public (burn (amount uint) (from principal))
  (begin
    (asserts! (or (is-eq from tx-sender) (is-eq from contract-caller)) ERR_NOT_TOKEN_OWNER)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (ft-burn? layicoin amount from)
  )
)

;; Set token URI (only contract owner)
(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set token-uri new-uri)
    (ok true)
  )
)

;; Initialize the contract with initial supply
(begin
  ;; Mint initial supply of 1,000,000 LAYI tokens (with 6 decimals)
  (try! (ft-mint? layicoin u1000000000000 CONTRACT_OWNER))
  (ok true)
)