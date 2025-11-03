(define-constant ERR_ALREADY_INITIALIZED u400)
(define-constant ERR_UNAUTHORIZED u401)

;; Optional owner that can be set once via `initialize`
(define-data-var owner (optional principal) none)

;; Define the fungible token `layibit`
(define-fungible-token layibit)

(define-read-only (get-owner)
  (ok (var-get owner))
)

(define-read-only (is-owner (who principal))
  (is-eq (var-get owner) (some who))
)

(define-public (initialize (new-owner principal))
  (if (is-none (var-get owner))
      (begin
        (var-set owner (some new-owner))
        (ok true)
      )
      (err ERR_ALREADY_INITIALIZED)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (if (is-eq (var-get owner) (some tx-sender))
      (ft-mint? layibit amount recipient)
      (err ERR_UNAUTHORIZED)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (ft-transfer? layibit amount sender recipient)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance layibit who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply layibit))
)
