import ProductsServer from '@/components/storefront/product-grid';
import Link from 'next/link';

export default function StorefrontPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 right-0 left-0 z-50 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link href="/cart" className="typ-link">
            {/* TODO: cart count */}
            cart
          </Link>
        </div>
      </header>

      <section className="px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <ProductsServer />
        </div>
      </section>
    </div>
  );
}
