import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { getPublishedProducts } from "./queries";
import { ProductGrid } from "@/components/storefront/product-grid";

export default async function StorefrontPage() {
  const products = await getPublishedProducts(12);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          {/* Menu Icon */}
          <button className="w-6 h-6 flex items-center justify-center">
            <Menu size={20} strokeWidth={2} />
          </button>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="w-6 h-6 flex items-center justify-center"
          >
            <ShoppingBag size={20} strokeWidth={2} />
          </Link>
        </div>
      </header>

      <section className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
