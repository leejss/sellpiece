import Link from 'next/link';

export default function StorefrontHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <Link href="/cart" className="typ-link">
          cart
        </Link>
      </div>
    </header>
  );
}
