'use client';
import Link from 'next/link';
import { adminNavItems } from '@/config/admin/nav-items';
import { cn } from '@/lib/utils';

export function AdminAside() {
  return (
    <aside className="fixed hidden h-screen w-64 border-r border-gray-100 lg:block">
      <div className="p-8">
        <Link href="/admin" className="mb-12 block text-2xl font-bold tracking-tight">
          ADMIN
        </Link>
        <nav className="space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              aria-disabled={item.disabled}
              className={cn(
                'block rounded px-4 py-3 text-sm transition hover:bg-gray-50',
                item.disabled && 'cursor-not-allowed text-gray-400',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="absolute right-0 bottom-0 left-0 border-t border-gray-100 p-8">
        <Link href="/" className="block text-sm text-gray-500 transition hover:text-black">
          ← Storefront
        </Link>
      </div>
    </aside>
  );
}
