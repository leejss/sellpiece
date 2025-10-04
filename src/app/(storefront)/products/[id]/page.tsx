import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedProductById } from "../../queries";
import { AddToCartPlaceholder } from "@/components/storefront/add-to-cart-placeholder";
import { addToCart } from "../../actions/cart";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getPublishedProductById(params.id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images?.[0]
        ? [{ url: product.images[0].url, alt: product.images[0].altText ?? product.name }]
        : undefined,
    },
  } as const;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getPublishedProductById(params.id);
  if (!product) return notFound();

  const cover = product.images?.[0] ?? null;

  return (
    <div className="min-h-screen bg-white">
      <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Info */}
          <div className="order-2 lg:order-1 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl tracking-tight leading-tight uppercase">{product.name}</h1>
              {product.sku && (
                <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-gray-400">{product.sku}</p>
              )}

              {typeof product.price === "number" && (
                <p className="mt-6 text-base sm:text-lg">${(product.price / 100).toFixed(2)}</p>
              )}

              {product.description && (
                <p className="mt-6 text-sm leading-6 text-gray-600 whitespace-pre-line">{product.description}</p>
              )}
            </div>

            <div className="mt-8 lg:mt-12">
              {/* Actions: keep minimal like yeezy.com */}
              <AddToCartPlaceholder productId={product.id} action={addToCart} />
            </div>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2">
            <div className="aspect-square bg-gray-50 overflow-hidden">
              {cover ? (
                <Image
                  src={cover.url}
                  alt={cover.altText ?? product.name}
                  width={1200}
                  height={1200}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white">
                  <span className="text-[10px] sm:text-xs text-gray-300">NO IMAGE</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
