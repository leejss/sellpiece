import StorefrontHeader from '@/components/storefront/storefront-header';
import type { ReactNode } from 'react';

export default function StorefrontWithHeaderLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <StorefrontHeader />
      {children}
    </>
  );
}
