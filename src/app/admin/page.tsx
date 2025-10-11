import Link from "next/link";
import { getProductStats } from "@/lib/db/queries/admin/product";

export default async function AdminPage() {
  const stats = await getProductStats();

  return (
    <div className="p-4 sm:p-6 lg:p-12">
      {/* Header - Mobile First */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <h1 className="typ-title font-bold tracking-tight mb-2 sm:mb-4">
          dashboard
        </h1>
      </div>

      {/* Stats Grid - Mobile First */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
        <div className="border border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-gray-300 transition">
          <div className="typ-meta text-gray-500 mb-1 sm:mb-2">
            Total
          </div>
          <div className="typ-subtitle font-bold">
            {stats.totalProducts}
          </div>
        </div>
        <div className="border border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-gray-300 transition">
          <div className="typ-meta text-gray-500 mb-1 sm:mb-2">
            Published
          </div>
          <div className="typ-subtitle font-bold">
            {stats.publishedProducts}
          </div>
        </div>
        <div className="border border-gray-100 p-4 sm:py-6 lg:p-8 hover:border-gray-300 transition">
          <div className="typ-meta text-gray-500 mb-1 sm:mb-2">
            Draft
          </div>
          <div className="typ-subtitle font-bold">
            {stats.draftProducts}
          </div>
        </div>
        <div className="border border-gray-100 p-4 sm:p-6 lg:p-8 hover:border-gray-300 transition">
          <div className="typ-meta text-gray-500 mb-1 sm:mb-2">
            Low Stock
          </div>
          <div className="typ-subtitle font-bold">
            {stats.lowStockProducts}
          </div>
        </div>
      </div>
    </div>
  );
}
