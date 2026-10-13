# Eval results

Model: `gemini-3.1-flash-lite` · cases: 3 · run: 2026-10-13

| Document | Gold | Caught | Missed | False alarms | Rejected by verifier | Score |
|---|---|---|---|---|---|---|
| Dropbox Terms of Service | 13 | 5 | 8 | 1 | 0 | 100 |
| Netflix Terms of Use | 10 | 5 | 5 | 0 | 1 | 74 |
| Spotify Terms of Use | 20 | 3 | 17 | 0 | 2 | 55 |
| **Total** | 43 | 13 | 30 | 1 | 3 | |

Recall: 30% · Precision: 92%

"False alarm" means a verified finding that matches no gold label. It may be a real risk the labeller did not mark, so read each one before calling it wrong.

### Dropbox Terms of Service

Source: https://www.dropbox.com/terms (retrieved 2026-10-13)

- caught: [auto_renewal] We'll automatically bill you from the date you convert to a Paid Account and on each perio
- caught: [unilateral_change] We may change the fees in effect on renewal of your subscription
- caught: [liability_limit] WE LIMIT OUR LIABILITY TO YOU TO THE GREATER OF $20 USD OR 100% OF ANY AMOUNT YOU'VE PAID
- caught: [arbitration_waiver] final and binding individual arbitration by a single arbitrator
- caught: [arbitration_waiver] You may only resolve disputes with us on an individual basis, and may not bring a claim as
- MISSED: [data_sharing] this permission extends to our affiliates and trusted third parties we work with
- MISSED: [cancellation_difficulty] Refunds are only issued if required by law.
- MISSED: [unilateral_change] these free features may be withdrawn without further notice
- MISSED: [data_retention] you don't have a Paid Account and haven't accessed our Services for 12 consecutive months
- MISSED: [other] We won't provide notice or an opportunity to export Your Stuff before termination or suspe
- MISSED: [other] Once we suspend or terminate your access to the Services, you will not be able to access o
- MISSED: [liability_limit] THE SERVICES ARE PROVIDED "AS IS
- MISSED: [unilateral_change] By continuing to use or access the Services after the updates come into effect, you agree 
- FALSE ALARM: [unilateral_change] If an update affects your use of the Services or your legal rights as a user of our Servic

### Netflix Terms of Use

Source: https://help.netflix.com/legal/termsofuse (retrieved 2026-10-13)

- caught: [auto_renewal] Unless you cancel your subscription before your billing date, you authorize us to charge t
- caught: [unilateral_change] We may, from time to time, change these Terms of Use.
- caught: [liability_limit] You waive all special, indirect and consequential damages against us.
- caught: [liability_limit] is provided "as is" and without warranty or condition
- caught: [arbitration_waiver] EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT A
- MISSED: [other] You authorize us to charge any Payment Method associated with your account in case your pr
- MISSED: [cancellation_difficulty] payments are non-refundable and we do not provide refunds or credits for any partial subsc
- MISSED: [unilateral_change] We may change our subscription plans and the price of our service from time to time.
- MISSED: [content_license] worldwide and in perpetuity without further compensation
- MISSED: [other] using a remote access support tool through which we have full access to your computer
- rejected by verifier (quote_not_found): Netflix is free to use any comments, information, ideas, concepts, reviews, or techniques 

### Spotify Terms of Use

Source: https://www.spotify.com/us/legal/end-user-agreement/ (retrieved 2026-10-13)

- caught: [auto_renewal] Paid Subscriptions continue indefinitely until cancelled
- caught: [content_license] non-exclusive, transferable, sublicensable, royalty-free, fully paid, irrevocable, worldwi
- caught: [arbitration_waiver] THESE TERMS CONTAIN A MANDATORY ARBITRATION PROVISION
- MISSED: [unilateral_change] Spotify reserves the right to change our Spotify Service offerings and their availability 
- MISSED: [other] Spotify may reclaim, or require you to change, your username for any reason
- MISSED: [unilateral_change] by continuing to use the Spotify Service after the price change takes effect, you will hav
- MISSED: [cancellation_difficulty] we do not provide refunds or credits for any partial subscription periods
- MISSED: [other] we reserve the right to terminate a Paid Subscription at any time, on no less than 14 days
- MISSED: [other] Spotify reserves the right to remove or disable access to any User Content for any or no r
- MISSED: [content_license] such Feedback is not confidential and may be used by Spotify without restriction and witho
- MISSED: [other] to allow the Spotify Service to use the processor, bandwidth, and storage hardware on your
- MISSED: [cancellation_difficulty] Spotify will not refund any amounts that you have already paid
- MISSED: [liability_limit] YOUR SOLE AND EXCLUSIVE REMEDY FOR ANY PROBLEMS OR DISSATISFACTION WITH THE SPOTIFY SERVIC
- MISSED: [liability_limit] THE GREATER OF (A) THE AMOUNTS PAID BY YOU TO SPOTIFY DURING THE TWELVE MONTHS PRIOR TO TH
- MISSED: [liability_limit] WITHIN ONE (1) YEAR AFTER THE DATE THE PARTY ASSERTING THE CLAIM FIRST KNOWS OR REASONABLY
- MISSED: [other] You agree to indemnify and hold Spotify harmless from and against all damages, losses, and
- MISSED: [arbitration_waiver] the parties agree to waive any right to a jury trial
- MISSED: [arbitration_waiver] YOU AND SPOTIFY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER IN ARBITRATION OR LITIG
- MISSED: [unilateral_change] Your use of the Spotify Service following any changes to these Terms will constitute your 
- MISSED: [liability_limit] THE SPOTIFY SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT ANY WARRANTIES OF ANY 
- rejected by verifier (quote_not_found): We may make changes to these Terms (including any additional Spotify terms and conditions 
- rejected by verifier (quote_not_found): IN NO EVENT WILL SPOTIFY... BE LIABLE FOR (1) ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE,
