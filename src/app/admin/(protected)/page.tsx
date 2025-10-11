import { getProductStats } from '@/lib/db/queries/admin/product';

export default async function AdminPage() {
  const stats = await getProductStats();

  return (
    <div className="p-4 sm:p-6 lg:p-12">
      {/* Header - Mobile First */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <h1 className="typ-title mb-2 font-bold tracking-tight sm:mb-4">dashboard</h1>
      </div>

      {/* Stats Grid - Mobile First */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-12 sm:gap-4 lg:mb-16 lg:grid-cols-4 lg:gap-6">
        <div className="border border-gray-100 p-4 transition hover:border-gray-300 sm:p-6 lg:p-8">
          <div className="typ-meta mb-1 text-gray-500 sm:mb-2">Total</div>
          <div className="typ-subtitle font-bold">{stats.totalProducts}</div>
        </div>
        <div className="border border-gray-100 p-4 transition hover:border-gray-300 sm:p-6 lg:p-8">
          <div className="typ-meta mb-1 text-gray-500 sm:mb-2">Published</div>
          <div className="typ-subtitle font-bold">{stats.publishedProducts}</div>
        </div>
        <div className="border border-gray-100 p-4 transition hover:border-gray-300 sm:py-6 lg:p-8">
          <div className="typ-meta mb-1 text-gray-500 sm:mb-2">Draft</div>
          <div className="typ-subtitle font-bold">{stats.draftProducts}</div>
        </div>
        <div className="border border-gray-100 p-4 transition hover:border-gray-300 sm:p-6 lg:p-8">
          <div className="typ-meta mb-1 text-gray-500 sm:mb-2">Low Stock</div>
          <div className="typ-subtitle font-bold">{stats.lowStockProducts}</div>
        </div>
      </div>
    </div>
  );
}
