import Link from "next/link";

export default function NotFoundProduct() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl sm:text-3xl uppercase tracking-tight">Product not found</h1>
        <p className="mt-3 text-sm text-gray-500">요청하신 상품을 찾을 수 없습니다.</p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center justify-center h-10 px-5 border border-black text-black uppercase tracking-wider text-sm"
          >
            Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}
