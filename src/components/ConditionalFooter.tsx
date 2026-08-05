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

  // Don't show footer on product pages, contact page, terms page, privacy page, accessibility page, or DNSMPI.
  const isProductPage = pathname.startsWith('/product/');
  const isContactPage = pathname === '/contact';
  const isTermsPage = pathname === '/terms';
  const isPrivacyPage = pathname === '/privacy';
  const isAccessibilityPage = pathname === '/accessibility';
  const isOrderStatusPage = pathname === '/order-status';
  const isDNSMPIPage = pathname === '/dnsmpi';

  if (isProductPage || isContactPage || isTermsPage || isPrivacyPage || isAccessibilityPage || isOrderStatusPage || isDNSMPIPage) {
    return null;
  }

  return <Footer />;
}
