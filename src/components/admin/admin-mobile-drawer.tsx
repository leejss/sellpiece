'use client';

import Link from 'next/link';
import { useState } from 'react';
import { adminNavItems } from '@/config/admin/nav-items';

export function AdminMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleDrawer}
        className="rounded p-2 transition hover:bg-gray-50"
        aria-label="메뉴 열기"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={closeDrawer} />}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold tracking-tight" onClick={closeDrawer}>
              ADMIN
            </Link>
            <button
              onClick={closeDrawer}
              className="rounded p-2 transition hover:bg-gray-50"
              aria-label="메뉴 닫기"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.disabled ? '#' : item.href}
                className={`block rounded px-4 py-3 text-sm transition hover:bg-gray-50 ${
                  item.disabled ? 'cursor-not-allowed text-gray-400' : ''
                }`}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  closeDrawer();
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute right-0 bottom-0 left-0 border-t border-gray-100 p-6">
          <Link
            href="/"
            className="block text-sm text-gray-500 transition hover:text-black"
            onClick={closeDrawer}
          >
            ← Storefront
          </Link>
        </div>
      </div>
    </>
  );
}
