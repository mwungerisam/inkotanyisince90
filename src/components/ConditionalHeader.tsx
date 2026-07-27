

'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show header on product pages, contact page, terms page, privacy page, accessibility page, cart page, and checkout page
  const isProductPage = pathname.startsWith('/product/');
  const isContactPage = pathname === '/contact';
  const isTermsPage = pathname === '/terms';
  const isPrivacyPage = pathname === '/privacy';
  const isAccessibilityPage = pathname === '/accessibility';
  const isCartPage = pathname === '/cart';
  const isCheckoutPage = pathname === '/checkout';
  
  if (isProductPage || isContactPage || isTermsPage || isPrivacyPage || isAccessibilityPage || isCartPage || isCheckoutPage) {
    return null;
  }
  
  return <Header />;
}
