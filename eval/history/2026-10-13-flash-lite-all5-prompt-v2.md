# Eval results

Model: `gemini-3.1-flash-lite` · cases: 5 · run: 2026-10-13

| Document | Gold | Caught | Missed | False alarms | Rejected by verifier | Score |
|---|---|---|---|---|---|---|
| Dropbox Terms of Service | 13 | 9 | 4 | 0 | 0 | 100 |
| LinkedIn User Agreement | 17 | 8 | 9 | 1 | 1 | 100 |
| Netflix Terms of Use | 10 | 7 | 3 | 0 | 0 | 100 |
| Reddit User Agreement | 12 | 7 | 5 | 3 | 0 | 100 |
| Spotify Terms of Use | 20 | 10 | 10 | 1 | 0 | 100 |
| **Total** | 72 | 41 | 31 | 5 | 1 | |

Recall: 57% · Precision: 89%

"False alarm" means a verified finding that matches no gold label. It may be a real risk the labeller did not mark, so read each one before calling it wrong.

### Dropbox Terms of Service

Source: https://www.dropbox.com/terms (retrieved 2026-10-13)

- caught: [data_sharing] this permission extends to our affiliates and trusted third parties we work with
- caught: [auto_renewal] We'll automatically bill you from the date you convert to a Paid Account and on each perio
- caught: [cancellation_difficulty] Refunds are only issued if required by law.
- caught: [data_retention] you don't have a Paid Account and haven't accessed our Services for 12 consecutive months
- caught: [liability_limit] THE SERVICES ARE PROVIDED "AS IS
- caught: [liability_limit] WE LIMIT OUR LIABILITY TO YOU TO THE GREATER OF $20 USD OR 100% OF ANY AMOUNT YOU'VE PAID
- caught: [arbitration_waiver] final and binding individual arbitration by a single arbitrator
- caught: [arbitration_waiver] You may only resolve disputes with us on an individual basis, and may not bring a claim as
- caught: [unilateral_change] By continuing to use or access the Services after the updates come into effect, you agree 
- MISSED: [unilateral_change] We may change the fees in effect on renewal of your subscription
- MISSED: [unilateral_change] these free features may be withdrawn without further notice
- MISSED: [other] We won't provide notice or an opportunity to export Your Stuff before termination or suspe
- MISSED: [other] Once we suspend or terminate your access to the Services, you will not be able to access o

### LinkedIn User Agreement

Source: https://www.linkedin.com/legal/user-agreement (retrieved 2026-10-13)

- caught: [auto_renewal] We may store and continue billing your payment method (e.g., credit card), even after it h
- caught: [other] If your primary payment method fails, we may automatically charge a secondary payment meth
- caught: [auto_renewal] your payment method automatically will be charged at the start of each subscription period
- caught: [content_license] A worldwide, transferable and sublicensable right to use, copy, modify, distribute, public
- caught: [content_license] LinkedIn can use and share (but does not have to) such feedback for any purpose without co
- caught: [unilateral_change] We may change, suspend or discontinue any of our Services.
- caught: [liability_limit] ON AN "AS IS" AND "AS AVAILABLE" BASIS
- caught: [liability_limit] ANY AMOUNT THAT EXCEEDS (A) THE TOTAL FEES PAID OR PAYABLE BY YOU TO LINKEDIN FOR THE SERV
- MISSED: [tracking] including the offsite collection of data for those Services, such as via our ads
- MISSED: [unilateral_change] we may not always provide prior notice of changes to these terms
- MISSED: [unilateral_change] Your continued use of our Services after we publish or send a notice about our changes to 
- MISSED: [unilateral_change] We may modify our prices effective prospectively upon reasonable notice
- MISSED: [other] we are not obligated to publish any content or other information on our Services and can r
- MISSED: [content_license] we had already sublicensed others prior to your content removal or closing of your account
- MISSED: [data_sharing] ads may be served near your content and other information, and your social actions may be 
- MISSED: [data_retention] We don't promise to store or show (or keep showing) any information (including content) th
- MISSED: [liability_limit] WILL NOT BE LIABLE IN CONNECTION WITH THIS CONTRACT FOR LOST PROFITS OR LOST BUSINESS OPPO
- FALSE ALARM: [other] LinkedIn reserves the right to restrict, suspend, or terminate your account if you breach 
- rejected by verifier (quote_not_found): We may modify this Contract, our Privacy Policy and our Cookie Policy from time to time. .

### Netflix Terms of Use

Source: https://help.netflix.com/legal/termsofuse (retrieved 2026-10-13)

- caught: [auto_renewal] Unless you cancel your subscription before your billing date, you authorize us to charge t
- caught: [cancellation_difficulty] payments are non-refundable and we do not provide refunds or credits for any partial subsc
- caught: [unilateral_change] We may, from time to time, change these Terms of Use.
- caught: [liability_limit] is provided "as is" and without warranty or condition
- caught: [arbitration_waiver] EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT A
- caught: [content_license] worldwide and in perpetuity without further compensation
- caught: [other] using a remote access support tool through which we have full access to your computer
- MISSED: [other] You authorize us to charge any Payment Method associated with your account in case your pr
- MISSED: [unilateral_change] We may change our subscription plans and the price of our service from time to time.
- MISSED: [liability_limit] You waive all special, indirect and consequential damages against us.

### Reddit User Agreement

Source: https://redditinc.com/policies/user-agreement (retrieved 2026-10-13) (text truncated)

- caught: [unilateral_change] We reserve the right to modify, suspend, or discontinue the Services (in whole or in part)
- caught: [content_license] worldwide, royalty-free, perpetual, irrevocable, non-exclusive, transferable, and sublicen
- caught: [content_license] this license includes the right to use Your Content to train AI and machine learning model
- caught: [other] we may, in our sole discretion, delete, deem your content ineligible for monetization, or 
- caught: [other] you agree to defend, indemnify, and hold Reddit, its affiliates
- caught: [liability_limit] THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT REPRESENTATIONS, WARRANTIES, 
- caught: [liability_limit] IN NO EVENT WILL ANY OF THE REDDIT ENTITIES BE LIABLE TO YOU FOR ANY INDIRECT, CONSEQUENTI
- MISSED: [data_sharing] you consent to the collection and use of this information as set forth in the Privacy Poli
- MISSED: [liability_limit] we will not be liable to you or to any third party for any modification, suspension, or di
- MISSED: [data_sharing] make Your Content available for syndication, broadcast, distribution, or publication by ot
- MISSED: [content_license] Reddit may use such ideas, suggestions, and feedback without compensation or obligation to
- MISSED: [data_sharing] we may place advertisements in connection with the display of any Content or information o
- FALSE ALARM: [content_license] You also agree that we may remove metadata associated with Your Content, and you irrevocab
- FALSE ALARM: [other] We reserve the right to revoke or limit a user’s ability to moderate at any time and for a
- FALSE ALARM: [other] Reddit reserves the right, but has no obligation, to overturn any action or decision of a 

### Spotify Terms of Use

Source: https://www.spotify.com/us/legal/end-user-agreement/ (retrieved 2026-10-13)

- caught: [unilateral_change] Spotify reserves the right to change our Spotify Service offerings and their availability 
- caught: [auto_renewal] Paid Subscriptions continue indefinitely until cancelled
- caught: [cancellation_difficulty] we do not provide refunds or credits for any partial subscription periods
- caught: [content_license] non-exclusive, transferable, sublicensable, royalty-free, fully paid, irrevocable, worldwi
- caught: [liability_limit] YOUR SOLE AND EXCLUSIVE REMEDY FOR ANY PROBLEMS OR DISSATISFACTION WITH THE SPOTIFY SERVIC
- caught: [liability_limit] WITHIN ONE (1) YEAR AFTER THE DATE THE PARTY ASSERTING THE CLAIM FIRST KNOWS OR REASONABLY
- caught: [other] You agree to indemnify and hold Spotify harmless from and against all damages, losses, and
- caught: [arbitration_waiver] YOU AND SPOTIFY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER IN ARBITRATION OR LITIG
- caught: [unilateral_change] Your use of the Spotify Service following any changes to these Terms will constitute your 
- caught: [liability_limit] THE SPOTIFY SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT ANY WARRANTIES OF ANY 
- MISSED: [other] Spotify may reclaim, or require you to change, your username for any reason
- MISSED: [unilateral_change] by continuing to use the Spotify Service after the price change takes effect, you will hav
- MISSED: [other] we reserve the right to terminate a Paid Subscription at any time, on no less than 14 days
- MISSED: [other] Spotify reserves the right to remove or disable access to any User Content for any or no r
- MISSED: [content_license] such Feedback is not confidential and may be used by Spotify without restriction and witho
- MISSED: [other] to allow the Spotify Service to use the processor, bandwidth, and storage hardware on your
- MISSED: [cancellation_difficulty] Spotify will not refund any amounts that you have already paid
- MISSED: [liability_limit] THE GREATER OF (A) THE AMOUNTS PAID BY YOU TO SPOTIFY DURING THE TWELVE MONTHS PRIOR TO TH
- MISSED: [arbitration_waiver] THESE TERMS CONTAIN A MANDATORY ARBITRATION PROVISION
- MISSED: [arbitration_waiver] the parties agree to waive any right to a jury trial
- FALSE ALARM: [content_license] Where applicable and to the extent permitted under applicable law, you also agree to waive
