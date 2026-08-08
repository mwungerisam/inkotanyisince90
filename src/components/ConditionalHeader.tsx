

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Don't show header on product pages and dedicated utility flows/pages.
  const isProductPage = pathname.startsWith('/product/');
  const isContactPage = pathname === '/contact';
  const isTermsPage = pathname === '/terms';
  const isPrivacyPage = pathname === '/privacy';
  const isAccessibilityPage = pathname === '/accessibility';
  const isCartPage = pathname === '/cart';
  const isCheckoutPage = pathname === '/checkout';
  const isOrderStatusPage = pathname === '/order-status';
  const isDNSMPIPage = pathname === '/dnsmpi';

  if (isProductPage || isContactPage || isTermsPage || isPrivacyPage || isAccessibilityPage || isCartPage || isCheckoutPage || isOrderStatusPage || isDNSMPIPage) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="h-36 md:h-40" />
    </>
  );
}
