# Eval results

Model: `gemini-3.1-flash-lite` · cases: 1 · run: 2026-10-13

| Document | Gold | Caught | Missed | False alarms | Rejected by verifier | Score |
|---|---|---|---|---|---|---|
| LinkedIn User Agreement | 17 | 4 | 13 | 0 | 1 | 95 |
| **Total** | 17 | 4 | 13 | 0 | 1 | |

Recall: 24% · Precision: 100%

"False alarm" means a verified finding that matches no gold label. It may be a real risk the labeller did not mark, so read each one before calling it wrong.

### LinkedIn User Agreement

Source: https://www.linkedin.com/legal/user-agreement (retrieved 2026-10-13)

- caught: [unilateral_change] we may not always provide prior notice of changes to these terms
- caught: [auto_renewal] your payment method automatically will be charged at the start of each subscription period
- caught: [content_license] A worldwide, transferable and sublicensable right to use, copy, modify, distribute, public
- caught: [liability_limit] ANY AMOUNT THAT EXCEEDS (A) THE TOTAL FEES PAID OR PAYABLE BY YOU TO LINKEDIN FOR THE SERV
- MISSED: [tracking] including the offsite collection of data for those Services, such as via our ads
- MISSED: [unilateral_change] Your continued use of our Services after we publish or send a notice about our changes to 
- MISSED: [auto_renewal] We may store and continue billing your payment method (e.g., credit card), even after it h
- MISSED: [other] If your primary payment method fails, we may automatically charge a secondary payment meth
- MISSED: [unilateral_change] We may modify our prices effective prospectively upon reasonable notice
- MISSED: [other] we are not obligated to publish any content or other information on our Services and can r
- MISSED: [content_license] we had already sublicensed others prior to your content removal or closing of your account
- MISSED: [data_sharing] ads may be served near your content and other information, and your social actions may be 
- MISSED: [content_license] LinkedIn can use and share (but does not have to) such feedback for any purpose without co
- MISSED: [unilateral_change] We may change, suspend or discontinue any of our Services.
- MISSED: [data_retention] We don't promise to store or show (or keep showing) any information (including content) th
- MISSED: [liability_limit] ON AN "AS IS" AND "AS AVAILABLE" BASIS
- MISSED: [liability_limit] WILL NOT BE LIABLE IN CONNECTION WITH THIS CONTRACT FOR LOST PROFITS OR LOST BUSINESS OPPO
- rejected by verifier (quote_not_found): If the Services were purchased by another party for you to use in connection with your wor
