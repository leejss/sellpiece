"use client";
import Link from "next/link";
import { adminNavItems } from "@/config/admin/nav-items";
import { cn } from "@/lib/utils";

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 border-r border-gray-100 fixed h-screen">
      <div className="p-8">
        <Link
          href="/admin"
          className="text-2xl font-bold tracking-tight block mb-12"
        >
          ADMIN
        </Link>
        <nav className="space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              aria-disabled={item.disabled}
              className={cn(
                "block py-3 px-4 text-sm hover:bg-gray-50 transition rounded",
                item.disabled && "text-gray-400 cursor-not-allowed"
              )}
            >
              {item.label}
            </Link>
          ))}
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
  );
}
