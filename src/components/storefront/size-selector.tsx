'use client';

import React from 'react';

const SIZES = ['S', 'M', 'L'] as const;

export function SizeSelector() {
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
