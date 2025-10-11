'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { SizeSelector } from './size-selector';
import { QuantitySelector } from './quantity-selector';

type Props = {
  productId: string;
  action: (formData: FormData) => void | Promise<void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full border border-black text-sm tracking-wider text-black uppercase disabled:opacity-40"
      aria-disabled={pending}
      title={pending ? 'Adding...' : 'Add to cart'}
    >
      {pending ? 'Adding...' : 'Add to cart'}
    </button>
  );
}

export function AddToCartPlaceholder({ productId, action }: Props) {
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <SizeSelector />
      <QuantitySelector />
      <SubmitButton />
      <p className="text-[10px] text-gray-400 sm:text-xs">
        Minimal demo. Cart/size options will be wired via server actions.
      </p>
    </form>
  );
}
