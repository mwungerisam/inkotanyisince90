'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

export default function Terms() {
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top navigation with back and cart buttons */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="text-gray-900 text-3xl hover:text-gray-600 transition-colors"
              aria-label="Go back"
              style={{ fontFamily: '"Helvetica Neue", "Arial", sans-serif', fontWeight: 300 }}
            >
              &lt;
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="cart"
              aria-label="Open cart"
            >
              <CartIcon count={itemCount} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-8 md:px-16 lg:px-20">
          <div 
            style={{ 
              fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 1.8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <h1 className="mb-6 text-gray-900">Terms of Service</h1>
            <p className="mb-10 text-gray-600">Last Updated: JULY 20 2026</p>

            <h2 className="mb-6 text-gray-900">INTRODUCTION</h2>
            <p className="mb-10 text-gray-700">
              This website, located at www.inkotanyisince90.rw, is operated by INKOTANYI SINCE 90, ("INKOTANYI SINCE 90," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of the website and any related online, digital, or mobile services, content, and features provided by INKOTANYI SINCE 90 (collectively, the "Service").
            </p>
            <p className="mb-10 text-gray-700">
              PLEASE READ THESE TERMS CAREFULLY. THESE TERMS CONTAIN IMPORTANT INFORMATION REGARDING YOUR LEGAL RIGHTS, AND OBLIGATIONS, AS WELL AS CONDITIONS, LIMITATIONS, AND EXCLUSIONS THAT MIGHT APPLY TO YOU.
            </p>
            <p className="mb-10 text-gray-700">
              THESE TERMS REQUIRE THE USE OF ARBITRATION TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR CLASS ACTIONS, SUBJECT TO YOUR RIGHT TO OPT-OUT AS DESCRIBED BELOW. BY ACCESSING OUR WEBSITE, YOU AGREE THAT ANY DISPUTE OR CLAIM RELATING IN ANY WAY TO YOUR USE OF OUR SERVICE, OR TO ANY PRODUCTS SOLD OR DISTRIBUTED BY INKOTANYI SINCE 90 WILL BE RESOLVED THROUGH BINDING ARBITRATION, RATHER THAN IN COURT, UNLESS YOU EXERCISE YOUR OPT-OUT RIGHT WITHIN THIRTY (30) DAYS.
            </p>
            <p className="mb-10 text-gray-700">
              By accessing or using the Service, including by browsing the Website or placing an order, you ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTAND, AND AGREE TO BE BOUND BY THESE TERMS AND OUR PRIVACY POLICY, WHICH IS INCORPORATED BY REFERENCE. IF YOU DO NOT AGREE, DO NOT USE THE SERVICE.
            </p>

            <h2 className="mb-6 text-gray-900">ELIGIBILITY AND USE OF THE SERVICE</h2>
            <p className="mb-10 text-gray-700">
              You may not use the Service or place an order if you (a) do not agree to these Terms, (b) are under 18 years of age, or (c) are prohibited from accessing or using the Service under applicable law.
            </p>
            <p className="mb-10 text-gray-700">
              By using the Service, you represent and warrant that you are purchasing products for personal use only, and not for resale, redistribution, or export.
            </p>
            <p className="mb-10 text-gray-700">
              If you access or place an order on behalf of an entity, you represent that you have authority to bind that entity to these Terms.
            </p>

            <h2 className="mb-6 text-gray-900">CHANGES TO TERMS</h2>
            <p className="mb-10 text-gray-700">
              We reserve the right to modify these Terms at any time. Material changes will be effective fifteen (15) days after posting notice of such changes to the Website or sending notice to your email address on file. Changes to the arbitration provisions will require your affirmative consent. Your continued use of the Service after the notice period constitutes acceptance of the revised Terms. It is your responsibility to review these Terms regularly.
            </p>

            <h2 className="mb-6 text-gray-900">DESCRIPTION OF THE SERVICE</h2>
            <p className="mb-10 text-gray-700">
              The Service provides an online platform through which users may browse, purchase, and receive INKOTANYI SINCE 90 branded products, access customer support, and receive communications related to orders, promotions, and updates.
            </p>
            <p className="mb-10 text-gray-700">
              We reserve the right to modify, suspend, or discontinue any aspect of the Service, including product offerings, pricing, availability, or features, at any time and without notice.
            </p>

            <h2 className="mb-6 text-gray-900">PRODUCTS, AVAILABILITY, AND ACCURACY</h2>
            <p className="mb-10 text-gray-700">
              Certain products may be available in limited quantities. All product descriptions, images, and pricing are subject to change at any time without notice. We do not guarantee that product images or colors displayed on your device are accurate.
            </p>
            <p className="mb-10 text-gray-700">
              We reserve the right to limit the sale of products to any person, geographic region, or jurisdiction, and to discontinue any product at any time.
            </p>

            <h2 className="mb-6 text-gray-900">ORDER ACCEPTANCE, PRICING, AND PAYMENT</h2>
            <p className="mb-10 text-gray-700">
              Your order constitutes an offer to purchase products under these Terms. All orders are subject to our acceptance, and we may refuse or cancel any order at our discretion, including due to suspected fraud, unauthorized activity, pricing errors, or product availability.
            </p>
            <p className="mb-10 text-gray-700">
              Prices are subject to change without notice. In the event of pricing errors, we reserve the right to cancel affected orders.
            </p>
            <p className="mb-10 text-gray-700">
              By submitting payment information, you authorize us and our third-party payment processors to charge the full amount of your order, including all applicable taxes and shipping. You represent that all payment information is accurate and that you are authorized to use the payment method provided.
            </p>

            <h2 className="mb-6 text-gray-900">SHIPPING, RISK OF LOSS, FINAL SALE, AND RETURNS</h2>
            <p className="mb-10 text-gray-700">
              We will arrange shipment of products to the address provided at checkout. Shipping and delivery dates are estimates only and are not guaranteed.
            </p>
            <p className="mb-10 text-gray-700">
              Title and risk of loss pass to you upon your receipt of the products. We are not responsible for delays caused by shipping carriers. However, if products are lost or damaged in transit before delivery to you, we will work with you to resolve the issue, which may include replacement or refund at our discretion.
            </p>
            <p className="mb-10 text-gray-700">
              All sales are final except where required by applicable law. Kigali consumers have the right to cancel orders within forty-eight (48) hours of placing the order, provided the order has not shipped. We do not accept returns or exchanges for products that have been shipped, except for defective products or as otherwise required by law.
            </p>
            <p className="mb-10 text-gray-700">
              If you receive a defective product, you must notify us within seven (7) days from delivery confirmation to be eligible for a replacement or refund. Misuse, improper care, alterations, or damage occurring after delivery are not considered defects.
            </p>

            <h2 className="mb-6 text-gray-900">CHARGEBACKS AND FRAUD PREVENTION</h2>
            <p className="mb-10 text-gray-700">
              We reserve the right to investigate and dispute any chargebacks or claims of unauthorized transactions.
            </p>
            <p className="mb-10 text-gray-700">
              Fraudulent, abusive, or bad-faith chargebacks constitute a material breach of these Terms and may result in permanent restriction from the Service, order refusal, and legal action to recover losses, costs of goods, collection costs, arbitration costs, and attorneys' fees.
            </p>

            <h2 className="mb-6 text-gray-900">COMMUNICATIONS (EMAIL AND SMS)</h2>
            <p className="mb-10 text-gray-700">
              By providing your email address or phone number, you consent to receive transactional communications related to your orders. You may separately opt-in to receive marketing communications, including via SMS, by providing your express written consent through our opt-in mechanism. Message and data rates may apply. Consent to receive marketing messages is not a condition of purchase. You may revoke consent and opt-out of marketing communications at any time by replying STOP to any message, following in-message unsubscribe links, or by contacting us at contact@inkotanyisince90.rw. Additional details are provided in our Privacy Policy.
            </p>

            <h2 className="mb-6 text-gray-900">INTELLECTUAL PROPERTY</h2>
            <p className="mb-10 text-gray-700">
              All content, designs, logos, trademarks, text, graphics, images, and other materials on the Service are owned by or licensed to INKOTANYI SINCE 90 and are protected by intellectual property laws.
            </p>
            <p className="mb-10 text-gray-700">
              You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service for personal, non-commercial purposes only. Any unauthorized use is strictly prohibited and may result in legal action.
            </p>

            <h2 className="mb-6 text-gray-900">PERSONAL INFORMATION</h2>
            <p className="mb-10 text-gray-700">
              Your submission of personal information through the Service is governed by our Privacy Policy.
            </p>

            <h2 className="mb-6 text-gray-900">PROHIBITED USES</h2>
            <p className="mb-10 text-gray-700">
              You agree not to use the Service to: (a) violate any law or regulation; (b) infringe intellectual property rights or privacy rights; (c) scrape, crawl, or use automated tools to access the Service; (d) introduce malware or interfere with security features; or (e) engage in abusive, fraudulent, or deceptive conduct. We reserve the right to suspend or terminate access for violations, provided that we will give you notice and an opportunity to cure where reasonable and legally required.
            </p>

            <h2 className="mb-6 text-gray-900">THIRD-PARTY SERVICES AND LINKS</h2>
            <p className="mb-10 text-gray-700">
              The service may rely on or include links to third-party services (including payment processors, carriers, analytics, and advertising tools). WE DISCLAIM ALL LIABILITY ARISING FROM THIRD-PARTY SERVICES, INCLUDING OUTAGES, ERRORS, OR DATA ISSUES TO THE EXTENT PERMITTED BY LAW. More information related to our third-party services is described in our Privacy Policy.
            </p>

            <h2 className="mb-6 text-gray-900">DISCLAIMERS</h2>
            <p className="mb-10 text-gray-700">
              THE SERVICE AND ALL PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE," TO THE MAXIMUM EXTENT PERMITTED BY LAW. EXCEPT AS EXPRESSLY PROVIDED IN THESE TERMS OR REQUIRED BY APPLICABLE LAW, INKOTANYI SINCE 90 DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="mb-10 text-gray-700">
              WE DO NOT GUARANTEE UNINTERRUPTED, ERROR-FREE, OR SECURE OPERATION.
            </p>
            <p className="mb-10 text-gray-700">
              Some jurisdictions do not allow certain disclaimers, so portions of this section may not apply to you.
            </p>

            <h2 className="mb-6 text-gray-900">LIMITATION OF LIABILITY</h2>
            <p className="mb-10 text-gray-700">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, INKOTANYI SINCE 90 SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATING TO THE SERVICE OR PRODUCTS.
            </p>
            <p className="mb-10 text-gray-700">
              THIS LIMITATION DOES NOT APPLY TO (A) REMEDIES EXPRESSLY PROVIDED FOR DEFECTIVE PRODUCTS UNDER THESE TERMS, (B) PERSONAL INJURY CAUSED BY INKOTANYI SINCE 90'S GROSS NEGLIGENCE, FRAUD, OR WILLFUL MISCONDUCT, OR (C) LIABILITY THAT CAN NOT BE LIMITED UNDER APPLICABLE LAW.
            </p>
            <p className="mb-10 text-gray-700">
              EXCEPT AS PROHIBITED BY LAW, INKOTANYI SINCE 90'S TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO A PRODUCT SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SPECIFIC ORDER GIVING RISE TO THE CLAIM.
            </p>

            <h2 className="mb-6 text-gray-900">INDEMNIFICATION</h2>
            <p className="mb-10 text-gray-700">
              You agree to indemnify, defend, and hold harmless INKOTANYI SINCE 90 and its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising out of your violation of these Terms, misuse of the Service, or violation of law.
            </p>

            <h2 className="mb-6 text-gray-900">DISPUTE RESOLUTION, BINDING ARBITRATION, AND CLASS ACTION WAIVER</h2>
            <p className="mb-10 text-gray-700">
              PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS AND REQUIRES MOST DISPUTES TO BE RESOLVED THROUGH INDIVIDUAL ARBITRATION AND NOT IN COURT.
            </p>

            <h3 className="mb-6 text-gray-900">Informal Resolution Requirement</h3>
            <p className="mb-10 text-gray-700">
              Before initiating arbitration, you agree to first attempt to resolve any dispute, claim, or controversy arising out of or relating to these Terms, the Service, or any products sold by INKOTANYI SINCE 90 (each, a "Dispute") by contacting us at contact@inkotanyisince90.rw with a written description of the Dispute and your contact information.
            </p>
            <p className="mb-10 text-gray-700">
              If the Dispute is not resolved within thirty (30) days after receipt of your notice, either party may initiate arbitration as set forth below.
            </p>

            <h3 className="mb-6 text-gray-900">Agreement to Arbitrate</h3>
            <p className="mb-10 text-gray-700">
              Except for disputes that qualify for small-claims court (as set forth below), any Dispute shall be resolved exclusively by final and binding arbitration, rather than in court, and you waive any right to a jury trial.
            </p>

            <h3 className="mb-6 text-gray-900">Location and Procedure</h3>
            <p className="mb-10 text-gray-700">
              Unless otherwise required by applicable law, arbitration shall take place in Rwanda, Kigali. The arbitration may be conducted in person, by telephone, by video conference, or based solely on written submissions, as determined by the arbitrator.
            </p>

            <h3 className="mb-6 text-gray-900">Class Action and Representative Waiver</h3>
            <p className="mb-10 text-gray-700">
              YOU AND INKOTANYI SINCE 90 AGREE THAT ALL DISPUTES MUST BE BROUGHT IN AN INDIVIDUAL CAPACITY ONLY.
            </p>
            <p className="mb-10 text-gray-700">
              YOU EXPRESSLY WAIVE THE RIGHT TO PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS, COLLECTIVE, PRIVATE ATTORNEY GENERAL, OR REPRESENTATIVE ACTION OR PROCEEDING.
            </p>
            <p className="mb-10 text-gray-700">
              The arbitrator may not consolidate claims, preside over any form of class or representative proceeding, or award relief to anyone other than the individual party seeking relief.
            </p>
            <p className="mb-10 text-gray-700">
              If this class action waiver is found unenforceable, the entire arbitration agreement shall be null and void.
            </p>

            <h3 className="mb-6 text-gray-900">Delegation Clause</h3>
            <p className="mb-10 text-gray-700">
              The arbitrator shall have exclusive authority to resolve any dispute relating to the interpretation, applicability, enforceability, or formation of this arbitration agreement, including any claim that all or part of this agreement is void or voidable.
            </p>

            <h3 className="mb-6 text-gray-900">Opt-Out Right</h3>
            <p className="mb-10 text-gray-700">
              You have the right to opt-out of this arbitration agreement by sending written notice to contact@inkotanyisince90.rw within thirty (30) days of first accepting these Terms. Your notice must include your full name, mailing address, and a clear statement that you wish to opt-out of arbitration.
            </p>
            <p className="mb-10 text-gray-700">
              Opting out of arbitration will not affect any other provision of these Terms.
            </p>

            <h3 className="mb-6 text-gray-900">Survival</h3>
            <p className="mb-10 text-gray-700">
              This arbitration agreement shall survive termination of these Terms and your use of the Service.
            </p>

            <h2 className="mb-6 text-gray-900">FORCE MAJEURE</h2>
            <p className="mb-10 text-gray-700">
              We shall not be liable for failure or delay due to events beyond our reasonable control, including acts of God, war, terrorism, pandemics, labor disputes, carrier failures, or governmental actions.
            </p>

            <h2 className="mb-6 text-gray-900">SEVERABILITY</h2>
            <p className="mb-10 text-gray-700">
              If any provision of these Terms is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms, such determination shall not affect the validity and enforceability of any other remaining provisions.
            </p>

            <h2 className="mb-6 text-gray-900">TERMINATION</h2>
            <p className="mb-10 text-gray-700">
              The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of these Terms for all purposes. These Terms are effective unless and until terminated by us. If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms, we may terminate these Terms at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Service (or any part thereof).
            </p>

            <h2 className="mb-6 text-gray-900">WAIVER AND ENTIRE AGREEMENT</h2>
            <p className="mb-10 text-gray-700">
              The failure of us to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. These Terms and any policies or operating rules posted by us on the Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms). Any ambiguities in the interpretation of these Terms shall not be construed in favor of the drafting party.
            </p>

            <h2 className="mb-6 text-gray-900">CONTACT INFORMATION</h2>
            <p className="mb-10 text-gray-700">
              To ask questions or comment about this Service or these Terms, contact us by email at contact@inkotanyisince90.rw, phone at +250 789 357 091, or by mail using the details provided below:
            </p>
            <p className="text-gray-900 font-semibold">
              INKOTANYI SINCE 90
            </p>
            <p className="text-gray-700">
              INKOTANYI SINCE 90 - Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
