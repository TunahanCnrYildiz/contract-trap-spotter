# Eval results

Model: `gemini-3.8-flash` · cases: 1 · run: 2026-10-13

| Document | Gold | Caught | Missed | False alarms | Rejected by verifier | Score |
|---|---|---|---|---|---|---|
| Netflix Terms of Use | 10 | 6 | 4 | 1 | 0 | 100 |
| **Total** | 10 | 6 | 4 | 1 | 0 | |

Recall: 60% · Precision: 83%

"False alarm" means a verified finding that matches no gold label. It may be a real risk the labeller did not mark, so read each one before calling it wrong.

### Netflix Terms of Use

Source: https://help.netflix.com/legal/termsofuse (retrieved 2026-10-13)

- caught: [auto_renewal] Unless you cancel your subscription before your billing date, you authorize us to charge t
- caught: [other] You authorize us to charge any Payment Method associated with your account in case your pr
- caught: [cancellation_difficulty] payments are non-refundable and we do not provide refunds or credits for any partial subsc
- caught: [liability_limit] You waive all special, indirect and consequential damages against us.
- caught: [liability_limit] is provided "as is" and without warranty or condition
- caught: [arbitration_waiver] EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT A
- MISSED: [unilateral_change] We may change our subscription plans and the price of our service from time to time.
- MISSED: [unilateral_change] We may, from time to time, change these Terms of Use.
- MISSED: [content_license] worldwide and in perpetuity without further compensation
- MISSED: [other] using a remote access support tool through which we have full access to your computer
- FALSE ALARM: [unilateral_change] We may assign or transfer our agreement with you including our associated rights and oblig
