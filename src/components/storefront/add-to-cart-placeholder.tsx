'use client';

import { useActionState } from 'react';

const SIZES = ['S', 'M', 'L'] as const;

type Props = {
  productId: string;
  action: (formData: FormData) => void | Promise<void>;
};

type SubmitButtonProps = {
  pending: boolean;
};

function SubmitButton({ pending }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full border border-black text-sm tracking-wider text-black uppercase disabled:opacity-40"
      aria-disabled={pending}
      title={'Add to cart'}
    >
      Add to cart
    </button>
  );
}

function SizeSelector() {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs tracking-wider text-gray-500 uppercase">Size</legend>
      <div className="flex gap-2">
        {SIZES.map((size) => (
          <label key={size} className="inline-flex items-center gap-2">
            <input type="radio" name="size" value={size} className="h-4 w-4 border-gray-300" />
            <span className="text-sm">{size}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function QuantitySelector() {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="quantity" className="text-xs tracking-wider text-gray-500 uppercase">
        Qty
      </label>
      <input
        id="quantity"
        name="quantity"
        type="number"
        min={1}
        max={10}
        defaultValue={1}
        className="h-10 w-20 border border-gray-200 px-3 text-sm"
      />
    </div>
  );
}

export function AddToCartPlaceholder({ productId, action }: Props) {
  const [, formAction, pending] = useActionState(async (_prev: null, formData: FormData) => {
    await action(formData);
    return null;
  }, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <SizeSelector />
      <QuantitySelector />
      <SubmitButton pending={pending} />
    </form>
  );
}
