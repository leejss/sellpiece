import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPublishedProductById } from '@/lib/db/queries/storefront/product';
import { AddToCartPlaceholder } from '@/components/storefront/add-to-cart-placeholder';
import { addToCart } from '@/actions/storefront/cart';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getPublishedProductById(params.id);
  if (!product) return { title: 'Product not found' };
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images?.[0]
        ? [
            {
              url: product.images[0].url,
              alt: product.images[0].altText ?? product.name,
            },
          ]
        : undefined,
    },
  } as const;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const product = await getPublishedProductById(id);
  if (!product) return notFound();
  const cover = product.images?.[0] ?? null;
  return (
    <div className="min-h-screen bg-white">
      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 border lg:grid-cols-2 lg:gap-16">
          {/* Left: Info */}
          <div className="order-2 flex flex-col justify-between lg:order-1">
            <div>
              <h1 className="typ-title tracking-tight uppercase">{product.name}</h1>
              {product.sku && <p className="typ-meta mt-2 text-gray-400">{product.sku}</p>}

              {typeof product.price === 'number' && (
                <p className="typ-subtitle mt-6">${(product.price / 100).toFixed(2)}</p>
              )}

              {product.description && (
                <p className="typ-body mt-6 leading-6 whitespace-pre-line text-gray-600">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2">
            <div className="aspect-square overflow-hidden bg-gray-50">
              {cover ? (
                <Image
                  src={cover.url}
                  alt={cover.altText ?? product.name}
                  width={1200}
                  height={1200}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white">
                  <span className="typ-caption text-gray-300">NO IMAGE</span>
                </div>
              )}
            </div>
            <AddToCartPlaceholder productId={product.id} action={addToCart} />
          </div>
        </div>
      </section>
    </div>
  );
}
