'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

export default function Privacy() {
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
            <h1 className="mb-6 text-gray-900">Privacy Policy</h1>
            <p className="mb-10 text-gray-700">Last Updated: JULY 20 2026</p>

            <h2 className="mb-6 text-gray-900">INTRODUCTION</h2>
            <p className="mb-10 text-gray-700">
              At INKOTANYI SINCE 90, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect the information you provide when you visit our website, place an order, or communicate with us.
            </p>
            <p className="mb-10 text-gray-700">
              Our goal is to provide a secure and trustworthy shopping experience. By using our website or purchasing our products, you agree to the practices described in this Privacy Policy.
            </p>
            <p className="mb-10 text-gray-700">
              If you do not agree with any part of this Privacy Policy, please discontinue using our website.
            </p>

            <h2 className="mb-6 text-gray-900">INFORMATION WE COLLECT</h2>
            <p className="mb-10 text-gray-700">
              To provide our products and services, we may collect different types of information from you.
            </p>

            <h3 className="mb-6 text-gray-900">Personal Information</h3>
            <p className="mb-10 text-gray-700">
              When you place an order or contact us, we may collect your full name.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your email address.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your phone number.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your shipping address.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your billing address.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your order information.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your payment confirmation details.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect messages you send to us.
            </p>

            <h3 className="mb-6 text-gray-900">Device Information</h3>
            <p className="mb-10 text-gray-700">
              When you visit our website, we may automatically collect your IP address.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your browser type.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your device type.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect your operating system.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect pages visited.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect time spent on our website.
            </p>
            <p className="mb-10 text-gray-700">
              We may collect website usage information.
            </p>
            <p className="mb-10 text-gray-700">
              This information helps us improve our website and provide a better shopping experience.
            </p>

            <h2 className="mb-6 text-gray-900">HOW WE USE YOUR INFORMATION</h2>
            <p className="mb-10 text-gray-700">
              We use your information to operate and improve our business.
            </p>
            <p className="mb-10 text-gray-700">
              This includes processing and confirming your orders.
            </p>
            <p className="mb-10 text-gray-700">
              This includes delivering purchased products.
            </p>
            <p className="mb-10 text-gray-700">
              This includes responding to customer inquiries.
            </p>
            <p className="mb-10 text-gray-700">
              This includes providing customer support.
            </p>
            <p className="mb-10 text-gray-700">
              This includes sending order updates.
            </p>
            <p className="mb-10 text-gray-700">
              This includes improving our website and services.
            </p>
            <p className="mb-10 text-gray-700">
              This includes preventing fraud and unauthorized activities.
            </p>
            <p className="mb-10 text-gray-700">
              This includes maintaining the security of our website.
            </p>
            <p className="mb-10 text-gray-700">
              This includes complying with applicable legal obligations.
            </p>
            <p className="mb-10 text-gray-700">
              We only collect information that is necessary to provide our services efficiently.
            </p>

            <h3 className="mb-6 text-gray-900">Order Processing</h3>
            <p className="mb-10 text-gray-700">
              When you make a purchase, we use your information to verify your order.
            </p>
            <p className="mb-10 text-gray-700">
              We use your information to process payment.
            </p>
            <p className="mb-10 text-gray-700">
              We use your information to prepare your order.
            </p>
            <p className="mb-10 text-gray-700">
              We use your information to arrange delivery.
            </p>
            <p className="mb-10 text-gray-700">
              We use your information to send shipping updates.
            </p>
            <p className="mb-10 text-gray-700">
              We use your information to provide invoices or receipts.
            </p>
            <p className="mb-10 text-gray-700">
              We use your information to resolve any order-related issues.
            </p>
            <p className="mb-10 text-gray-700">
              Without this information, we may not be able to complete your order.
            </p>

            <h3 className="mb-6 text-gray-900">Customer Support</h3>
            <p className="mb-10 text-gray-700">
              If you contact us by email or through our website, we may keep records of your communication.
            </p>
            <p className="mb-10 text-gray-700">
              This information helps us answer your questions, resolve complaints, improve customer service, and follow up on previous conversations.
            </p>

            <h2 className="mb-6 text-gray-900">COOKIES</h2>
            <p className="mb-10 text-gray-700">
              Our website may use cookies and similar technologies to improve your browsing experience.
            </p>
            <p className="mb-10 text-gray-700">
              Cookies help us remember your preferences.
            </p>
            <p className="mb-10 text-gray-700">
              Cookies help us keep your shopping cart active.
            </p>
            <p className="mb-10 text-gray-700">
              Cookies help us improve website performance.
            </p>
            <p className="mb-10 text-gray-700">
              Cookies help us understand how visitors use our website.
            </p>
            <p className="mb-10 text-gray-700">
              You can disable cookies through your browser settings at any time. However, some parts of our website may not function properly if cookies are disabled.
            </p>

            <h2 className="mb-6 text-gray-900">SHARING YOUR INFORMATION</h2>
            <p className="mb-10 text-gray-700">
              We respect your privacy.
            </p>
            <p className="mb-10 text-gray-700">
              We do not sell your personal information to third parties.
            </p>
            <p className="mb-10 text-gray-700">
              We may share your information only when necessary to process your orders.
            </p>
            <p className="mb-10 text-gray-700">
              We may share your information to deliver products.
            </p>
            <p className="mb-10 text-gray-700">
              We may share your information to process payments.
            </p>
            <p className="mb-10 text-gray-700">
              We may share your information to provide customer support.
            </p>
            <p className="mb-10 text-gray-700">
              We may share your information to protect our business against fraud.
            </p>
            <p className="mb-10 text-gray-700">
              We may share your information to comply with legal requirements.
            </p>
            <p className="mb-10 text-gray-700">
              Any service providers that assist us are expected to protect your information and use it only for providing services on our behalf.
            </p>

            <h2 className="mb-6 text-gray-900">DATA SECURITY</h2>
            <p className="mb-10 text-gray-700">
              We take reasonable steps to protect your personal information from unauthorized access, misuse, loss, alteration, or disclosure.
            </p>
            <p className="mb-10 text-gray-700">
              Our website uses appropriate security measures to help safeguard your information.
            </p>
            <p className="mb-10 text-gray-700">
              Although no online system is completely secure, we continuously work to maintain a safe shopping environment for our customers.
            </p>

            <h2 className="mb-6 text-gray-900">DATA RETENTION</h2>
            <p className="mb-10 text-gray-700">
              We keep your personal information only for as long as necessary to complete your orders.
            </p>
            <p className="mb-10 text-gray-700">
              We keep your information to provide customer support.
            </p>
            <p className="mb-10 text-gray-700">
              We keep your information to maintain business records.
            </p>
            <p className="mb-10 text-gray-700">
              We keep your information to resolve disputes.
            </p>
            <p className="mb-10 text-gray-700">
              We keep your information to meet legal or administrative requirements.
            </p>
            <p className="mb-10 text-gray-700">
              When your information is no longer required, we securely delete or anonymize it whenever reasonably possible.
            </p>

            <h2 className="mb-6 text-gray-900">MARKETING COMMUNICATIONS</h2>
            <p className="mb-10 text-gray-700">
              With your permission, we may send you information about new product releases.
            </p>
            <p className="mb-10 text-gray-700">
              We may send you information about promotions.
            </p>
            <p className="mb-10 text-gray-700">
              We may send you information about special offers.
            </p>
            <p className="mb-10 text-gray-700">
              We may send you information about limited collections.
            </p>
            <p className="mb-10 text-gray-700">
              We may send you information about company news.
            </p>
            <p className="mb-10 text-gray-700">
              You can unsubscribe from marketing emails at any time by following the unsubscribe instructions included in the email or by contacting us directly.
            </p>

            <h2 className="mb-6 text-gray-900">YOUR RIGHTS</h2>
            <p className="mb-10 text-gray-700">
              You have the right to request access to your personal information.
            </p>
            <p className="mb-10 text-gray-700">
              You have the right to request correction of inaccurate information.
            </p>
            <p className="mb-10 text-gray-700">
              You have the right to request deletion of your personal information where appropriate.
            </p>
            <p className="mb-10 text-gray-700">
            You have the right to update your account information.
            </p>
            <p className="mb-10 text-gray-700">
              You have the right to contact us regarding privacy concerns.
            </p>
            <p className="mb-10 text-gray-700">
              We will make reasonable efforts to respond to your request promptly.
            </p>

            <h2 className="mb-6 text-gray-900">THIRD-PARTY SERVICES</h2>
            <p className="mb-10 text-gray-700">
              Our website may use trusted third-party services to help operate our online store, process payments, deliver orders, or improve website performance.
            </p>
            <p className="mb-10 text-gray-700">
              These providers only receive the information necessary to perform their services and are expected to protect your information appropriately.
            </p>
            <p className="mb-10 text-gray-700">
              We encourage you to review the privacy policies of any third-party services you interact with through our website.
            </p>

            <h2 className="mb-6 text-gray-900">CHILDREN'S PRIVACY</h2>
            <p className="mb-10 text-gray-700">
              Our website is intended for a general audience.
            </p>
            <p className="mb-10 text-gray-700">
              We do not knowingly collect personal information from children without the involvement of a parent or guardian.
            </p>
            <p className="mb-10 text-gray-700">
              If you believe that a child has provided us with personal information, please contact us, and we will take appropriate steps to remove that information.
            </p>

            <h2 className="mb-6 text-gray-900">INTERNATIONAL VISITORS</h2>
            <p className="mb-10 text-gray-700">
              If you access our website from outside Rwanda, your information may be processed where our services or service providers operate.
            </p>
            <p className="mb-10 text-gray-700">
              By using our website, you acknowledge that your information may be transferred and processed as necessary to provide our services.
            </p>

            <h2 className="mb-6 text-gray-900">CHANGES TO THIS PRIVACY POLICY</h2>
            <p className="mb-10 text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our business, technology, or legal requirements.
            </p>
            <p className="mb-10 text-gray-700">
              When changes are made, the updated version will be published on this page together with a revised Last Updated date.
            </p>
            <p className="mb-10 text-gray-700">
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
            </p>

            <h2 className="mb-6 text-gray-900">CONTACT US</h2>
            <p className="mb-10 text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy or the way we handle your personal information, please contact us.
            </p>
            <p className="mb-10 text-gray-900 font-semibold">
              INKOTANYI SINCE 90
            </p>
            <p className="mb-10 text-gray-700">
              Email: contact@inkotanyisince90.rw
            </p>
            <p className="text-gray-700">
              We will make every reasonable effort to respond to your inquiry as quickly as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
