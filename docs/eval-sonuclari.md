# Eval sonuçları: yakalanan, kaçırılan ve yanlış alarm veren maddeler

Model: `gemini-3.1-flash-lite` · her belge 3 kez çalıştırıldı · tarih: 2026-10-13

- **Yakalanan:** elle etiketlediğim riskli maddelerden, modelin bulduğu ve alıntısı sayfada doğrulanan.
- **Kaçırılan:** etiketlediğim ama modelin bulamadığı.
- **Yanlış alarm:** modelin bulduğu, alıntısı sayfada doğrulanan ama benim etiketlerimde olmayan madde. Çoğu belgede gerçekten var olan, sınırda maddelerdir; ayrıntı için ana README'ye bakın.
- Üç koşunun sonucu bu belgelerde aynı çıktığı için tek liste veriyorum.

**Toplam:** 77 etiketli madde, 37 yakalandı (%48), 40 kaçırıldı, 6 yanlış alarm.

## Spotify Terms of Use

Kaynak: https://www.spotify.com/us/legal/end-user-agreement/ (retrieved 2026-10-13)

Etiketlenen 20 madde: **8 yakalandı**, **12 kaçırıldı**; **1 yanlış alarm**.

### Yakalanan
- `auto_renewal`: Paid Subscriptions continue indefinitely until cancelled
- `cancellation_difficulty`: we do not provide refunds or credits for any partial subscription periods
- `content_license`: non-exclusive, transferable, sublicensable, royalty-free, fully paid, irrevocable, worldwide license
- `liability_limit`: WITHIN ONE (1) YEAR AFTER THE DATE THE PARTY ASSERTING THE CLAIM FIRST KNOWS OR REASONABLY SHOULD KNOW
- `other`: You agree to indemnify and hold Spotify harmless from and against all damages, losses, and expenses of any kind
- `arbitration_waiver`: YOU AND SPOTIFY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER IN ARBITRATION OR LITIGATION ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY
- `unilateral_change`: Your use of the Spotify Service following any changes to these Terms will constitute your acceptance of such changes
- `liability_limit`: THE SPOTIFY SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT ANY WARRANTIES OF ANY KIND

### Kaçırılan
- `unilateral_change`: Spotify reserves the right to change our Spotify Service offerings and their availability from time to time, without notice or liability to you
- `other`: Spotify may reclaim, or require you to change, your username for any reason
- `unilateral_change`: by continuing to use the Spotify Service after the price change takes effect, you will have accepted the new price
- `other`: we reserve the right to terminate a Paid Subscription at any time, on no less than 14 days' notice
- `other`: Spotify reserves the right to remove or disable access to any User Content for any or no reason
- `content_license`: such Feedback is not confidential and may be used by Spotify without restriction and without payment to you
- `other`: to allow the Spotify Service to use the processor, bandwidth, and storage hardware on your Device
- `cancellation_difficulty`: Spotify will not refund any amounts that you have already paid
- `liability_limit`: YOUR SOLE AND EXCLUSIVE REMEDY FOR ANY PROBLEMS OR DISSATISFACTION WITH THE SPOTIFY SERVICE IS TO UNINSTALL ANY SPOTIFY SOFTWARE AND TO STOP USING THE SPOTIFY SERVICE
- `liability_limit`: THE GREATER OF (A) THE AMOUNTS PAID BY YOU TO SPOTIFY DURING THE TWELVE MONTHS PRIOR TO THE FIRST CLAIM
- `arbitration_waiver`: THESE TERMS CONTAIN A MANDATORY ARBITRATION PROVISION
- `arbitration_waiver`: the parties agree to waive any right to a jury trial

### Yanlış alarm
- `content_license`: Where applicable and to the extent permitted under applicable law, you also agree to waive, and not to enforce, any "moral rights" or equivalent rights, such as your right to be identified as the author of any User Content, including Feedback, and your right to object to derogatory treatment of such User Content.

## Netflix Terms of Use

Kaynak: https://help.netflix.com/legal/termsofuse (retrieved 2026-10-13)

Etiketlenen 10 madde: **7 yakalandı**, **3 kaçırıldı**; **1 yanlış alarm**.

### Yakalanan
- `auto_renewal`: Unless you cancel your subscription before your billing date, you authorize us to charge the subscription fee for the next billing cycle
- `cancellation_difficulty`: payments are non-refundable and we do not provide refunds or credits for any partial subscription periods or unused Netflix content
- `unilateral_change`: We may change our subscription plans and the price of our service from time to time.
- `liability_limit`: is provided "as is" and without warranty or condition
- `arbitration_waiver`: EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER
- `content_license`: worldwide and in perpetuity without further compensation
- `other`: using a remote access support tool through which we have full access to your computer

### Kaçırılan
- `other`: You authorize us to charge any Payment Method associated with your account in case your primary Payment Method is declined
- `unilateral_change`: We may, from time to time, change these Terms of Use.
- `liability_limit`: You waive all special, indirect and consequential damages against us.

### Yanlış alarm
- `unilateral_change`: We may assign or transfer our agreement with you including our associated rights and obligations at any time and you agree to cooperate with us in connection with such an assignment or transfer.

## Dropbox Terms of Service

Kaynak: https://www.dropbox.com/terms (retrieved 2026-10-13)

Etiketlenen 13 madde: **9 yakalandı**, **4 kaçırıldı**; **0 yanlış alarm**.

### Yakalanan
- `data_sharing`: this permission extends to our affiliates and trusted third parties we work with
- `auto_renewal`: We'll automatically bill you from the date you convert to a Paid Account and on each periodic renewal until cancellation
- `cancellation_difficulty`: Refunds are only issued if required by law.
- `data_retention`: you don't have a Paid Account and haven't accessed our Services for 12 consecutive months
- `liability_limit`: THE SERVICES ARE PROVIDED "AS IS
- `liability_limit`: WE LIMIT OUR LIABILITY TO YOU TO THE GREATER OF $20 USD OR 100% OF ANY AMOUNT YOU'VE PAID
- `arbitration_waiver`: final and binding individual arbitration by a single arbitrator
- `arbitration_waiver`: You may only resolve disputes with us on an individual basis, and may not bring a claim as a plaintiff or a class member
- `unilateral_change`: By continuing to use or access the Services after the updates come into effect, you agree to be bound by the revised Terms.

### Kaçırılan
- `unilateral_change`: We may change the fees in effect on renewal of your subscription
- `unilateral_change`: these free features may be withdrawn without further notice
- `other`: We won't provide notice or an opportunity to export Your Stuff before termination or suspension of access to the Services
- `other`: Once we suspend or terminate your access to the Services, you will not be able to access or export Your Stuff

### Yanlış alarm
- yok

## Reddit User Agreement

Kaynak: https://redditinc.com/policies/user-agreement (retrieved 2026-10-13)

Etiketlenen 17 madde: **7 yakalandı**, **10 kaçırıldı**; **1 yanlış alarm**.

### Yakalanan
- `unilateral_change`: We reserve the right to modify, suspend, or discontinue the Services (in whole or in part) at any time, with or without notice to you
- `content_license`: worldwide, royalty-free, perpetual, irrevocable, non-exclusive, transferable, and sublicensable license
- `content_license`: this license includes the right to use Your Content to train AI and machine learning models
- `liability_limit`: THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT REPRESENTATIONS, WARRANTIES, OR CONDITIONS OF ANY KIND
- `liability_limit`: IN NO EVENT WILL THE AGGREGATE LIABILITY OF THE REDDIT ENTITIES EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS ($100)
- `unilateral_change`: By continuing to access or use the Services on or after the Effective Date of the revised Terms, you agree to be bound by the revised Terms
- `other`: we may suspend or terminate your Account, moderator status, or ability to access or use the Services at any time for any or no reason

### Kaçırılan
- `data_sharing`: you consent to the collection and use of this information as set forth in the Privacy Policy
- `liability_limit`: we will not be liable to you or to any third party for any modification, suspension, or discontinuation of the Services
- `data_sharing`: make Your Content available for syndication, broadcast, distribution, or publication by other companies, organizations, or individuals who partner with Reddit
- `content_license`: Reddit may use such ideas, suggestions, and feedback without compensation or obligation to you
- `other`: we may, in our sole discretion, delete, deem your content ineligible for monetization, or remove Your Content, at any time and for any reason
- `data_sharing`: we may place advertisements in connection with the display of any Content or information on the Services, including Your Content
- `other`: you agree to defend, indemnify, and hold Reddit, its affiliates
- `liability_limit`: IN NO EVENT WILL ANY OF THE REDDIT ENTITIES BE LIABLE TO YOU FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES
- `liability_limit`: YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR DEVICE OR COMPUTER SYSTEM, OR RESULTING LOSS OF DATA
- `data_retention`: your Account may be deactivated due to prolonged inactivity

### Yanlış alarm
- `content_license`: You also agree that we may remove metadata associated with Your Content, and you irrevocably waive any claims and assertions of moral rights or attribution with respect to Your Content.

## LinkedIn User Agreement

Kaynak: https://www.linkedin.com/legal/user-agreement (retrieved 2026-10-13)

Etiketlenen 17 madde: **6 yakalandı**, **11 kaçırıldı**; **3 yanlış alarm**.

### Yakalanan
- `auto_renewal`: We may store and continue billing your payment method (e.g., credit card), even after it has expired
- `other`: If your primary payment method fails, we may automatically charge a secondary payment method
- `auto_renewal`: your payment method automatically will be charged at the start of each subscription period
- `content_license`: A worldwide, transferable and sublicensable right to use, copy, modify, distribute, publicly perform and display, host, and process your content and other information without any further consent, notice and/or compensation to you or others
- `liability_limit`: ON AN "AS IS" AND "AS AVAILABLE" BASIS
- `liability_limit`: ANY AMOUNT THAT EXCEEDS (A) THE TOTAL FEES PAID OR PAYABLE BY YOU TO LINKEDIN FOR THE SERVICES DURING THE TERM OF THIS CONTRACT, IF ANY, OR (B) US $1000

### Kaçırılan
- `tracking`: including the offsite collection of data for those Services, such as via our ads
- `unilateral_change`: we may not always provide prior notice of changes to these terms
- `unilateral_change`: Your continued use of our Services after we publish or send a notice about our changes to these terms means that you are consenting to the updated terms
- `unilateral_change`: We may modify our prices effective prospectively upon reasonable notice
- `other`: we are not obligated to publish any content or other information on our Services and can remove it with or without notice
- `content_license`: we had already sublicensed others prior to your content removal or closing of your account
- `data_sharing`: ads may be served near your content and other information, and your social actions may be visible and included with ads
- `content_license`: LinkedIn can use and share (but does not have to) such feedback for any purpose without compensation to you
- `unilateral_change`: We may change, suspend or discontinue any of our Services.
- `data_retention`: We don't promise to store or show (or keep showing) any information (including content) that you've shared
- `liability_limit`: WILL NOT BE LIABLE IN CONNECTION WITH THIS CONTRACT FOR LOST PROFITS OR LOST BUSINESS OPPORTUNITIES

### Yanlış alarm
- `unilateral_change`: We may modify this Contract, our Privacy Policy and our Cookie Policy from time to time. If we materially change these terms or if we are legally required to provide notice, we will provide you notice through our Services, or by other means, to provide you the opportunity to review the changes before they become effective.
- `other`: You agree that LinkedIn may assign this Contract to its affiliates or a party that buys it without your consent.
- `data_retention`: You agree that we have no obligation to store, maintain or provide you a copy of any content or other information that you or others provide, except to the extent required by applicable law and as noted in our Privacy Policy.

## Kontrol belgesi: Plainfield Notes Terms (synthetic control)

Bilerek adil yazılmış sentetik bir belge (kurgusal şirket). Başarı ölçütü ilk koşudan önce belirlendi: skor en fazla 24.

Skorlar: 12, 12, 12. Modelin işaretlediği maddeler:

- `liability_limit` (medium): For other claims, our liability is limited to the greater of 12 months of fees you paid us or 100 euros.
