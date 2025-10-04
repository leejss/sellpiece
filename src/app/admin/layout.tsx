import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { MobileDrawer } from "./components/MobileDrawer";
import { Sidebar } from "./components/Sidebar";

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
            <MobileDrawer />
          </header>

          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="pt-16 lg:pt-0 lg:ml-64">{children}</main>
        </div>
      </body>
    </html>
  );
}
