# Eval results

Model: `gemini-3.8-flash` · cases: 1 · run: 2026-10-13

| Document | Gold | Caught | Missed | False alarms | Rejected by verifier | Score |
|---|---|---|---|---|---|---|
| Dropbox Terms of Service | 13 | 6 | 7 | 0 | 0 | 100 |
| **Total** | 13 | 6 | 7 | 0 | 0 | |

Recall: 46% · Precision: 100%

"False alarm" means a verified finding that matches no gold label. It may be a real risk the labeller did not mark, so read each one before calling it wrong.

### Dropbox Terms of Service

Source: https://www.dropbox.com/terms (retrieved 2026-10-13)

- caught: [data_sharing] this permission extends to our affiliates and trusted third parties we work with
- caught: [auto_renewal] We'll automatically bill you from the date you convert to a Paid Account and on each perio
- caught: [cancellation_difficulty] Refunds are only issued if required by law.
- caught: [liability_limit] WE LIMIT OUR LIABILITY TO YOU TO THE GREATER OF $20 USD OR 100% OF ANY AMOUNT YOU'VE PAID
- caught: [arbitration_waiver] You may only resolve disputes with us on an individual basis, and may not bring a claim as
- caught: [unilateral_change] By continuing to use or access the Services after the updates come into effect, you agree 
- MISSED: [unilateral_change] We may change the fees in effect on renewal of your subscription
- MISSED: [unilateral_change] these free features may be withdrawn without further notice
- MISSED: [data_retention] you don't have a Paid Account and haven't accessed our Services for 12 consecutive months
- MISSED: [other] We won't provide notice or an opportunity to export Your Stuff before termination or suspe
- MISSED: [other] Once we suspend or terminate your access to the Services, you will not be able to access o
- MISSED: [liability_limit] THE SERVICES ARE PROVIDED "AS IS
- MISSED: [arbitration_waiver] final and binding individual arbitration by a single arbitrator
