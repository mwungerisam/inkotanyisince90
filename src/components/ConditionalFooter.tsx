'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Don't show the shared footer on focused checkout and utility pages.
  const isProductPage = pathname.startsWith('/product/');
  const isContactPage = pathname === '/contact';
  const isTermsPage = pathname === '/terms';
  const isPrivacyPage = pathname === '/privacy';
  const isAccessibilityPage = pathname === '/accessibility';
  const isOrderStatusPage = pathname === '/order-status';
  const isCartPage = pathname === '/cart';
  const isOrderConfirmationPage = pathname === '/order-confirmation';
  const isDNSMPIPage = pathname === '/dnsmpi';

  if (isProductPage || isContactPage || isTermsPage || isPrivacyPage || isAccessibilityPage || isOrderStatusPage || isCartPage || isOrderConfirmationPage || isDNSMPIPage) {
    return null;
  }

  return <Footer />;
}
