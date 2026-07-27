'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't show footer on product pages, contact page, terms page, privacy page, and accessibility page
  const isProductPage = pathname.startsWith('/product/');
  const isContactPage = pathname === '/contact';
  const isTermsPage = pathname === '/terms';
  const isPrivacyPage = pathname === '/privacy';
  const isAccessibilityPage = pathname === '/accessibility';
  
  if (isProductPage || isContactPage || isTermsPage || isPrivacyPage || isAccessibilityPage) {
    return null;
  }
  
  return <Footer />;
}
