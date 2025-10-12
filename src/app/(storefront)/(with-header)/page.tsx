import ProductsServer from '@/components/storefront/product-grid';

export default function StorefrontPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <ProductsServer />
        </div>
      </section>
    </div>
  );
}
