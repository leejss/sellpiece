import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin - Sellpiece",
  description: "Minimal admin interface",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <div className="min-h-screen">
          {/* Mobile Header */}
          <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
            <div className="px-4 py-4 flex items-center justify-between">
              <Link href="/admin" className="text-xl font-bold tracking-tight">
                ADMIN
              </Link>
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-black transition"
              >
                STOREFRONT →
              </Link>
            </div>
          </header>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 border-r border-gray-100 fixed h-screen">
            <div className="p-8">
              <Link href="/admin" className="text-2xl font-bold tracking-tight block mb-12">
                ADMIN
              </Link>
              <nav className="space-y-1">
                <Link
                  href="/admin/products"
                  className="block py-3 px-4 text-sm hover:bg-gray-50 transition rounded"
                >
                  Products
                </Link>
                <Link
                  href="/admin/products/categories"
                  className="block py-3 px-4 text-sm hover:bg-gray-50 transition rounded"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/orders"
                  className="block py-3 px-4 text-sm hover:bg-gray-50 transition rounded text-gray-400"
                >
                  Orders
                </Link>
                <Link
                  href="/admin/settings"
                  className="block py-3 px-4 text-sm hover:bg-gray-50 transition rounded text-gray-400"
                >
                  Settings
                </Link>
              </nav>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-gray-100">
              <Link
                href="/"
                className="block text-sm text-gray-500 hover:text-black transition"
              >
                ← Storefront
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="pt-16 lg:pt-0 lg:ml-64">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
            <div className="grid grid-cols-4 gap-1">
              <Link
                href="/admin/products"
                className="py-4 text-center text-xs hover:bg-gray-50 transition"
              >
                Products
              </Link>
              <Link
                href="/admin/products/categories"
                className="py-4 text-center text-xs hover:bg-gray-50 transition"
              >
                Categories
              </Link>
              <Link
                href="/admin/orders"
                className="py-4 text-center text-xs hover:bg-gray-50 transition text-gray-400"
              >
                Orders
              </Link>
              <Link
                href="/admin/settings"
                className="py-4 text-center text-xs hover:bg-gray-50 transition text-gray-400"
              >
                Settings
              </Link>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
