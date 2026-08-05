import Link from 'next/link';

export default function Footer() {
  const footerLinks = [
    { name: 'CONTACT', href: '/contact' },
    { name: 'TERMS', href: '/terms' },
    { name: 'PRIVACY', href: '/privacy' },
    { name: 'ACCESSIBILITY', href: '/accessibility' },
    { name: 'DNSMPI', href: '/dnsmpi' },
    { name: 'COOKIES', href: '/cookies' },
    { name: 'ORDER STATUS', href: '/order-status' },
  ];

  return (
    <footer className="bg-white py-32 mt-16">
      <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-[9px] tracking-[0.15em] uppercase text-gray-500 hover:text-gray-700 transition-colors"
                  style={{ 
                    fontFamily: '"Helvetica Neue", "Arial", sans-serif',
                    fontWeight: 400
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
