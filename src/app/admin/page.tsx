import Link from "next/link";
import { getProductStats } from "./products/queries";

export default async function AdminPage() {
  const stats = await getProductStats();

  return (
    <div className="p-4 sm:p-6 lg:p-12 pb-20 lg:pb-12">
      {/* Header - Mobile First */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-4">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500">관리자 대시보드</p>
      </div>

      {/* Stats Grid - Mobile First */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
        <div className="border border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-gray-300 transition">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 uppercase tracking-wide">
            Total
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {stats.totalProducts}
          </div>
        </div>
        <div className="border border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-gray-300 transition">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 uppercase tracking-wide">
            Published
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {stats.publishedProducts}
          </div>
        </div>
        <div className="border border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-gray-300 transition">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 uppercase tracking-wide">
            Draft
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {stats.draftProducts}
          </div>
        </div>
        <div className="border border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-gray-300 transition">
          <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 uppercase tracking-wide">
            Low Stock
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {stats.lowStockProducts}
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile First */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 sm:mb-6">
          Quick Actions
        </h2>
        <Link
          href="/admin/products/new"
          className="block border border-gray-200 p-4 sm:p-6 hover:border-black transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base sm:text-lg font-medium mb-0.5 sm:mb-1">
                New Product
              </div>
              <div className="text-xs sm:text-sm text-gray-500">상품 등록하기</div>
            </div>
            <div className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </Link>
        <Link
          href="/admin/products"
          className="block border border-gray-200 p-4 sm:p-6 hover:border-black transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base sm:text-lg font-medium mb-0.5 sm:mb-1">
                Manage Products
              </div>
              <div className="text-xs sm:text-sm text-gray-500">상품 관리하기</div>
            </div>
            <div className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </Link>
        <Link
          href="/admin/products/categories"
          className="block border border-gray-200 p-4 sm:p-6 hover:border-black transition group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base sm:text-lg font-medium mb-0.5 sm:mb-1">
                Categories
              </div>
              <div className="text-xs sm:text-sm text-gray-500">카테고리 관리하기</div>
            </div>
            <div className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
