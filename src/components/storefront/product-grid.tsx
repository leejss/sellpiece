"use client";

import Image from "next/image";
import Link from "next/link";

type ProductImage = {
  url: string;
  altText: string | null;
};

type Product = {
  id: string;
  name: string;
  sku: string | null;
  image: ProductImage | null;
};

type ProductGridProps = {
  products: Product[];
};

/**
 * Yeezy.com 스타일의 미니멀 프로덕트 그리드 컴포넌트
 * - 깔끔한 흰색 배경
 * - 제품 이미지 중심
 * - SKU 코드 하단 표시
 * - 반응형 그리드 (모바일 2열 → 데스크탑 5열)
 */
export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sm uppercase tracking-wider text-gray-400">
          No products
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block text-left"
      prefetch={false}
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
            loading="lazy"
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
    </Link>
  );
}
