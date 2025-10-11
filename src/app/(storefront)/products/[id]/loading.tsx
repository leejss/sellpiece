export default function LoadingProduct() {
  return (
    <div className="min-h-screen bg-white">
      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 animate-pulse lg:order-1">
            <div className="h-8 w-2/3 bg-gray-200" />
            <div className="mt-2 h-3 w-24 bg-gray-100" />
            <div className="mt-6 h-6 w-32 bg-gray-200" />
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full bg-gray-100" />
              <div className="h-4 w-5/6 bg-gray-100" />
              <div className="h-4 w-4/6 bg-gray-100" />
            </div>
            <div className="mt-10 h-12 w-full bg-gray-200" />
          </div>
          <div className="order-1 animate-pulse lg:order-2">
            <div className="aspect-square bg-gray-100" />
          </div>
        </div>
      </section>
    </div>
  );
}
