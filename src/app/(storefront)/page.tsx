import { Menu, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPublishedProducts } from "./queries";

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
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm uppercase tracking-wider text-gray-400">
                No products
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() =>
                    (window.location.href = `/products/${product.id}`)
                  }
                  className="group text-left"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-50 mb-3 overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image.url}
                        alt={product.image.altText || product.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white">
                        <div className="text-[10px] sm:text-xs text-gray-300">
                          NO IMAGE
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Code - Yeezy Style */}
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-center">
                    {product.sku || product.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer - Mobile First */}
      {/* <footer className="border-t border-gray-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
            © 2025 SELLPIECE. All rights reserved.
          </p>
          <div className="flex gap-6 sm:gap-8 text-xs sm:text-sm text-gray-500">
            <Link href="/about" className="hover:text-black transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-black transition">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-black transition">
              Terms
            </Link>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
