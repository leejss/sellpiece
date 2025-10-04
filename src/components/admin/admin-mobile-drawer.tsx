"use client";

import Link from "next/link";
import { useState } from "react";
import { adminNavItems } from "@/config/admin/nav-items";

export function AdminMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleDrawer}
        className="p-2 hover:bg-gray-50 transition rounded"
        aria-label="메뉴 열기"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/admin"
              className="text-xl font-bold tracking-tight"
              onClick={closeDrawer}
            >
              ADMIN
            </Link>
            <button
              onClick={closeDrawer}
              className="p-2 hover:bg-gray-50 transition rounded"
              aria-label="메뉴 닫기"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
                href={item.disabled ? "#" : item.href}
                className={`block py-3 px-4 text-sm hover:bg-gray-50 transition rounded ${
                  item.disabled ? "text-gray-400 cursor-not-allowed" : ""
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
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <Link
            href="/"
            className="block text-sm text-gray-500 hover:text-black transition"
            onClick={closeDrawer}
          >
            ← Storefront
          </Link>
        </div>
      </div>
    </>
  );
}
