import Link from 'next/link';
import { getProducts, getProductStats } from '@/lib/db/queries/admin/product';
import { ProductsTable } from '@/components/admin/products-table';

type SearchParams = Promise<{
  page?: string;
  search?: string;
  status?: string;
  categoryId?: string;
}>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const search = params.search;
  const status = params.status;
  const categoryId = params.categoryId;

  const [{ products, pagination }, stats] = await Promise.all([
    getProducts({ page, search, status, categoryId }),
    getProductStats(),
  ]);

  return (
    <div className="p-4 pb-20 sm:p-6 lg:p-12 lg:pb-12">
      {/* Header - Mobile First */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-center">
        <div>
          <h1 className="typ-title mb-2 font-bold tracking-tight sm:mb-4">Products</h1>
          <p className="typ-caption text-gray-500">{stats.totalProducts} products registered</p>
        </div>
        <Link
          href="/admin/products/new"
          className="typ-cta w-full bg-black px-6 py-3 text-center text-white transition hover:bg-gray-800 sm:w-auto"
        >
          NEW PRODUCT
        </Link>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} pagination={pagination} />
    </div>
  );
}
