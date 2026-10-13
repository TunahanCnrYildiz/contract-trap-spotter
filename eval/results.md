# Eval results

Model: `gemini-3.1-flash-lite` · documents: 5 · gold items: 77 · runs per document: 3 · date: 2026-10-13

| Document | Gold | Caught per run, mean (range) | Caught every run | Caught some runs | Never caught | False alarms per run | Rejected by verifier per run | Score (mean) |
|---|---|---|---|---|---|---|---|---|
| Dropbox Terms of Service | 13 | 9.0 (9) | 9 | 0 | 4 | 0.0 | 0.0 | 77 |
| LinkedIn User Agreement | 17 | 6.0 (6) | 6 | 0 | 11 | 3.0 | 0.0 | 67 |
| Netflix Terms of Use | 10 | 7.0 (7) | 7 | 0 | 3 | 1.0 | 0.0 | 67 |
| Reddit User Agreement | 17 | 7.0 (7) | 7 | 0 | 10 | 1.0 | 0.0 | 72 |
| Spotify Terms of Use | 20 | 8.0 (8) | 8 | 0 | 12 | 1.0 | 0.0 | 77 |

Recall per run: 48%, 48%, 48% · mean 48%
Precision per run: 86%, 86%, 86% · mean 86%

"False alarm" means a verified finding that matches no gold label. It may be a real risk the labeller did not mark, so read each one before calling it wrong. "Some runs" means the item is caught in at least one but not all runs (flaky).

### Dropbox Terms of Service

Source: https://www.dropbox.com/terms (retrieved 2026-10-13)

- caught 3/3: [data_sharing] this permission extends to our affiliates and trusted third parties we work with
- caught 3/3: [auto_renewal] We'll automatically bill you from the date you convert to a Paid Account and on each perio
- caught 3/3: [cancellation_difficulty] Refunds are only issued if required by law.
- MISSED 0/3: [unilateral_change] We may change the fees in effect on renewal of your subscription
- MISSED 0/3: [unilateral_change] these free features may be withdrawn without further notice
- caught 3/3: [data_retention] you don't have a Paid Account and haven't accessed our Services for 12 consecutive months
- MISSED 0/3: [other] We won't provide notice or an opportunity to export Your Stuff before termination or suspe
- MISSED 0/3: [other] Once we suspend or terminate your access to the Services, you will not be able to access o
- caught 3/3: [liability_limit] THE SERVICES ARE PROVIDED "AS IS
- caught 3/3: [liability_limit] WE LIMIT OUR LIABILITY TO YOU TO THE GREATER OF $20 USD OR 100% OF ANY AMOUNT YOU'VE PAID
- caught 3/3: [arbitration_waiver] final and binding individual arbitration by a single arbitrator
- caught 3/3: [arbitration_waiver] You may only resolve disputes with us on an individual basis, and may not bring a claim as
- caught 3/3: [unilateral_change] By continuing to use or access the Services after the updates come into effect, you agree 

### LinkedIn User Agreement

Source: https://www.linkedin.com/legal/user-agreement (retrieved 2026-10-13)

- MISSED 0/3: [tracking] including the offsite collection of data for those Services, such as via our ads
- MISSED 0/3: [unilateral_change] we may not always provide prior notice of changes to these terms
- MISSED 0/3: [unilateral_change] Your continued use of our Services after we publish or send a notice about our changes to 
- caught 3/3: [auto_renewal] We may store and continue billing your payment method (e.g., credit card), even after it h
- caught 3/3: [other] If your primary payment method fails, we may automatically charge a secondary payment meth
- caught 3/3: [auto_renewal] your payment method automatically will be charged at the start of each subscription period
- MISSED 0/3: [unilateral_change] We may modify our prices effective prospectively upon reasonable notice
- MISSED 0/3: [other] we are not obligated to publish any content or other information on our Services and can r
- caught 3/3: [content_license] A worldwide, transferable and sublicensable right to use, copy, modify, distribute, public
- MISSED 0/3: [content_license] we had already sublicensed others prior to your content removal or closing of your account
- MISSED 0/3: [data_sharing] ads may be served near your content and other information, and your social actions may be 
- MISSED 0/3: [content_license] LinkedIn can use and share (but does not have to) such feedback for any purpose without co
- MISSED 0/3: [unilateral_change] We may change, suspend or discontinue any of our Services.
- MISSED 0/3: [data_retention] We don't promise to store or show (or keep showing) any information (including content) th
- caught 3/3: [liability_limit] ON AN "AS IS" AND "AS AVAILABLE" BASIS
- MISSED 0/3: [liability_limit] WILL NOT BE LIABLE IN CONNECTION WITH THIS CONTRACT FOR LOST PROFITS OR LOST BUSINESS OPPO
- caught 3/3: [liability_limit] ANY AMOUNT THAT EXCEEDS (A) THE TOTAL FEES PAID OR PAYABLE BY YOU TO LINKEDIN FOR THE SERV
- FALSE ALARM 3/3: [unilateral_change] We may modify this Contract, our Privacy Policy and our Cookie Policy from time 
- FALSE ALARM 3/3: [other] You agree that LinkedIn may assign this Contract to its affiliates or a party that buys it w
- FALSE ALARM 3/3: [data_retention] You agree that we have no obligation to store, maintain or provide you a copy of an

### Netflix Terms of Use

Source: https://help.netflix.com/legal/termsofuse (retrieved 2026-10-13)

- caught 3/3: [auto_renewal] Unless you cancel your subscription before your billing date, you authorize us to charge t
- MISSED 0/3: [other] You authorize us to charge any Payment Method associated with your account in case your pr
- caught 3/3: [cancellation_difficulty] payments are non-refundable and we do not provide refunds or credits for any partial subsc
- caught 3/3: [unilateral_change] We may change our subscription plans and the price of our service from time to time.
- MISSED 0/3: [unilateral_change] We may, from time to time, change these Terms of Use.
- MISSED 0/3: [liability_limit] You waive all special, indirect and consequential damages against us.
- caught 3/3: [liability_limit] is provided "as is" and without warranty or condition
- caught 3/3: [arbitration_waiver] EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT A
- caught 3/3: [content_license] worldwide and in perpetuity without further compensation
- caught 3/3: [other] using a remote access support tool through which we have full access to your computer
- FALSE ALARM 3/3: [unilateral_change] We may assign or transfer our agreement with you including our associated rights

### Reddit User Agreement

Source: https://redditinc.com/policies/user-agreement (retrieved 2026-10-13)

- MISSED 0/3: [data_sharing] you consent to the collection and use of this information as set forth in the Privacy Poli
- caught 3/3: [unilateral_change] We reserve the right to modify, suspend, or discontinue the Services (in whole or in part)
- MISSED 0/3: [liability_limit] we will not be liable to you or to any third party for any modification, suspension, or di
- caught 3/3: [content_license] worldwide, royalty-free, perpetual, irrevocable, non-exclusive, transferable, and sublicen
- caught 3/3: [content_license] this license includes the right to use Your Content to train AI and machine learning model
- MISSED 0/3: [data_sharing] make Your Content available for syndication, broadcast, distribution, or publication by ot
- MISSED 0/3: [content_license] Reddit may use such ideas, suggestions, and feedback without compensation or obligation to
- MISSED 0/3: [other] we may, in our sole discretion, delete, deem your content ineligible for monetization, or 
- MISSED 0/3: [data_sharing] we may place advertisements in connection with the display of any Content or information o
- MISSED 0/3: [other] you agree to defend, indemnify, and hold Reddit, its affiliates
- caught 3/3: [liability_limit] THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT REPRESENTATIONS, WARRANTIES, 
- MISSED 0/3: [liability_limit] IN NO EVENT WILL ANY OF THE REDDIT ENTITIES BE LIABLE TO YOU FOR ANY INDIRECT, CONSEQUENTI
- caught 3/3: [liability_limit] IN NO EVENT WILL THE AGGREGATE LIABILITY OF THE REDDIT ENTITIES EXCEED THE GREATER OF ONE 
- MISSED 0/3: [liability_limit] YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR DEVICE OR COMPUTER SYSTEM, OR RESULT
- caught 3/3: [unilateral_change] By continuing to access or use the Services on or after the Effective Date of the revised 
- caught 3/3: [other] we may suspend or terminate your Account, moderator status, or ability to access or use th
- MISSED 0/3: [data_retention] your Account may be deactivated due to prolonged inactivity
- FALSE ALARM 3/3: [content_license] You also agree that we may remove metadata associated with Your Content, and you i

### Spotify Terms of Use

Source: https://www.spotify.com/us/legal/end-user-agreement/ (retrieved 2026-10-13)

- MISSED 0/3: [unilateral_change] Spotify reserves the right to change our Spotify Service offerings and their availability 
- MISSED 0/3: [other] Spotify may reclaim, or require you to change, your username for any reason
- MISSED 0/3: [unilateral_change] by continuing to use the Spotify Service after the price change takes effect, you will hav
- caught 3/3: [auto_renewal] Paid Subscriptions continue indefinitely until cancelled
- caught 3/3: [cancellation_difficulty] we do not provide refunds or credits for any partial subscription periods
- MISSED 0/3: [other] we reserve the right to terminate a Paid Subscription at any time, on no less than 14 days
- MISSED 0/3: [other] Spotify reserves the right to remove or disable access to any User Content for any or no r
- caught 3/3: [content_license] non-exclusive, transferable, sublicensable, royalty-free, fully paid, irrevocable, worldwi
- MISSED 0/3: [content_license] such Feedback is not confidential and may be used by Spotify without restriction and witho
- MISSED 0/3: [other] to allow the Spotify Service to use the processor, bandwidth, and storage hardware on your
- MISSED 0/3: [cancellation_difficulty] Spotify will not refund any amounts that you have already paid
- MISSED 0/3: [liability_limit] YOUR SOLE AND EXCLUSIVE REMEDY FOR ANY PROBLEMS OR DISSATISFACTION WITH THE SPOTIFY SERVIC
- MISSED 0/3: [liability_limit] THE GREATER OF (A) THE AMOUNTS PAID BY YOU TO SPOTIFY DURING THE TWELVE MONTHS PRIOR TO TH
- caught 3/3: [liability_limit] WITHIN ONE (1) YEAR AFTER THE DATE THE PARTY ASSERTING THE CLAIM FIRST KNOWS OR REASONABLY
- caught 3/3: [other] You agree to indemnify and hold Spotify harmless from and against all damages, losses, and
- MISSED 0/3: [arbitration_waiver] THESE TERMS CONTAIN A MANDATORY ARBITRATION PROVISION
- MISSED 0/3: [arbitration_waiver] the parties agree to waive any right to a jury trial
- caught 3/3: [arbitration_waiver] YOU AND SPOTIFY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER IN ARBITRATION OR LITIG
- caught 3/3: [unilateral_change] Your use of the Spotify Service following any changes to these Terms will constitute your 
- caught 3/3: [liability_limit] THE SPOTIFY SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT ANY WARRANTIES OF ANY 
- FALSE ALARM 3/3: [content_license] Where applicable and to the extent permitted under applicable law, you also agree 

### Control: Plainfield Notes Terms (synthetic control)

Criterion (fixed before the first run): score at most 24.

| Run | Verified findings | Score | Level | Result |
|---|---|---|---|---|
| 1 | 1 | 12 | low | pass |
| 2 | 1 | 12 | low | pass |
| 3 | 1 | 12 | low | pass |

- flagged 3/3: [liability_limit, medium] For other claims, our liability is limited to the greater of 12 months of fees you paid us or 100 euros.
