import { CartItem } from '@/components/storefront/cart-item';
import { requireUserId } from '@/lib/auth/session';
import { getOrCreateUserCart } from '@/lib/services/storefront/cart.service';
import Link from 'next/link';

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
      <header className="fixed top-0 right-0 left-0 z-50 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <Link href="/" className="hover:underline">
            back
          </Link>
        </div>
      </header>
      {/* Main Content */}
      <main className="pt-20 pb-16 sm:pt-24 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="typ-caption mb-6 text-gray-400">empty</p>
              <Link href="/" className="typ-body inline-block text-black hover:underline">
                continue shopping
              </Link>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              {/* Cart Items */}
              <div className="mb-8">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="typ-caption flex justify-between">
                  <span className="text-gray-600">subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="typ-caption flex justify-between">
                  <span className="text-gray-600">shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="typ-caption flex justify-between">
                  <span className="text-gray-600">tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="typ-subtitle flex justify-between border-t border-gray-200 pt-3 font-medium">
                  <span>total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="typ-cta mt-8 w-full bg-black py-4 text-white transition-colors hover:bg-gray-800">
                proceed to checkout
              </button>

              {/* Continue Shopping Link */}
              <div className="mt-6 text-center">
                <Link href="/" className="typ-link tracking-wider">
                  continue shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
