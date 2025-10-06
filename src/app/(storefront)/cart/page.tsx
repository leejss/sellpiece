import { CartItem } from "@/components/storefront/cart-item";
import { UserProfileSection } from "@/components/storefront/user-profile-section";
import { requireUserId } from "@/lib/auth/session";
import { getOrCreateUserCart } from "@/lib/services/storefront/cart.service";
import { Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function CartPage() {
  const userId = await requireUserId();
  const { items } = await getOrCreateUserCart(userId);

  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 10.0 : 0; // 배송비
  const tax = subtotal * 0.1; // 세금 10%
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link href="/" className="w-6 h-6 flex items-center justify-center">
            <Menu size={20} strokeWidth={2} />
          </Link>

          <h1 className="text-xs sm:text-sm uppercase tracking-wider font-medium">
            Shopping Bag
          </h1>

          <div className="w-6 h-6 flex items-center justify-center">
            <ShoppingBag size={20} strokeWidth={2} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 sm:pt-24 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm uppercase tracking-wider text-gray-400 mb-6">
                Your bag is empty
              </p>
              <Link
                href="/"
                className="inline-block text-xs uppercase tracking-wider underline hover:no-underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Left Column - User Profile (Desktop) / Top Section (Mobile) */}
              <div className="lg:w-1/3 order-2 lg:order-1">
                <div className="lg:sticky lg:top-24">
                  <UserProfileSection />
                </div>
              </div>

              {/* Right Column - Cart Items */}
              <div className="lg:w-2/3 order-1 lg:order-2">
                {/* Cart Items */}
                <div className="mb-8">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full mt-8 bg-black text-white py-4 text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors">
                  Proceed to Checkout
                </button>

                {/* Continue Shopping Link */}
                <div className="text-center mt-6">
                  <Link
                    href="/"
                    className="text-xs uppercase tracking-wider underline hover:no-underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
