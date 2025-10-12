import { requireUserId } from '@/lib/auth/session';
import { countCartItemsByUserId } from '@/lib/db/queries/storefront/cart';
import Link from 'next/link';

export default async function StorefrontHeader() {
  // const cartCount = await getCartCount()
  const userId = await requireUserId();
  const count = await countCartItemsByUserId(userId);
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-4 sm:py-5">
        <Link href="/cart" className="typ-link">
          cart <span className="typ-caption">{`(${count})`}</span>
        </Link>
      </div>
    </header>
  );
}
