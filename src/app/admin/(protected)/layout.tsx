import type { ReactNode } from 'react';
import { AdminMobileDrawer } from '@/components/admin/admin-mobile-drawer';
import { AdminAside } from '@/components/admin/admin-aside';

export default function AdminProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-100 bg-white lg:hidden">
        <AdminMobileDrawer />
      </header>

      {/* Desktop Sidebar */}
      <AdminAside />

      {/* Main Content */}
      <main className="pt-16 lg:ml-64 lg:pt-0">{children}</main>
    </div>
  );
}
