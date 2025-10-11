'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { removeCartItem, updateCartItemQuantity } from '@/actions/storefront/cart';
import { useState, useTransition } from 'react';

type CartItemProps = {
  item: {
    id: string;
    quantity: number;
    size: string | null;
    product: {
      id: string;
      name: string;
      price: string;
      sku: string | null;
      images: Array<{
        url: string;
        altText: string | null;
      }>;
    };
  };
};

export function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);
    startTransition(async () => {
      await updateCartItemQuantity(item.id, newQuantity);
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeCartItem(item.id);
    });
  };

  const image = item.product.images[0];
  const totalPrice = (parseFloat(item.product.price) * quantity).toFixed(2);

  return (
    <div className="flex gap-4 border-b border-gray-200 py-6">
      {/* Product Image */}
      <div className="h-24 w-24 flex-shrink-0 bg-gray-50 sm:h-32 sm:w-32">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || item.product.name}
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-gray-300">NO IMAGE</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="mb-1 text-xs tracking-wider uppercase sm:text-sm">
            {item.product.sku || item.product.name}
          </p>
          {item.size && <p className="mb-2 text-xs text-gray-500">Size: {item.size}</p>}
          <p className="text-sm font-medium">${item.product.price}</p>
        </div>

        {/* Quantity Controls */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center border border-gray-200">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isPending || quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              disabled={isPending}
              className="h-8 w-12 border-x border-gray-200 text-center text-sm"
              min={1}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isPending}
              className="flex h-8 w-8 items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              +
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isPending}
            className="p-2 hover:bg-gray-50 disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-sm font-medium">${totalPrice}</p>
      </div>
    </div>
  );
}
