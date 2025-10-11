import { getPublishedProducts } from '@/lib/db/queries/storefront/product';
import Image from 'next/image';
import Link from 'next/link';

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

export default async function ProductsServer() {
  const products = await getPublishedProducts(12);
  return <ProductGrid products={products} />;
}

function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm tracking-wider text-gray-400">no products</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-8">
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
    <Link href={`/products/${product.id}`} className="group block text-left" prefetch={false}>
      {/* Product Image */}
      <div className="mb-3 aspect-square overflow-hidden bg-gray-50">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.altText || product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white">
            <div className="text-[10px] text-gray-300 sm:text-xs">NO IMAGE</div>
          </div>
        )}
      </div>

      {/* Product Code - Yeezy Style */}
      <p className="text-center text-[10px] tracking-wider uppercase sm:text-xs">
        {product.sku || product.name}
      </p>
    </Link>
  );
}
