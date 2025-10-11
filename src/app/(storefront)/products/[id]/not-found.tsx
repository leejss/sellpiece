import Link from 'next/link';

export default function NotFoundProduct() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl tracking-tight uppercase sm:text-3xl">Product not found</h1>
        <p className="mt-3 text-sm text-gray-500">요청하신 상품을 찾을 수 없습니다.</p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center border border-black px-5 text-sm tracking-wider text-black uppercase"
          >
            Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}
