import ProductsServer from "@/components/storefront/product-grid";
import Link from "next/link";

export default function StorefrontPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link href="/cart" className="hover:underline">
            {/* TODO: cart count */}
            cart
          </Link>
        </div>
      </header>

      <section className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <ProductsServer />
        </div>
      </section>
    </div>
  );
}
