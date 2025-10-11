import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminMobileDrawer } from "@/components/admin/admin-mobile-drawer";
import { AdminAside } from "@/components/admin/admin-aside";

export const metadata: Metadata = {
  title: "Admin - Sellpiece",
  description: "Minimal admin interface",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <AdminMobileDrawer />
      </header>

      {/* Desktop Sidebar */}
      <AdminAside />

      {/* Main Content */}
      <main className="pt-16 lg:pt-0 lg:ml-64">{children}</main>
    </div>
  );
}
