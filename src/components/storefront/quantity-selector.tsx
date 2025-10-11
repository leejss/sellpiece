'use client';

import React from 'react';

export function QuantitySelector() {
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
