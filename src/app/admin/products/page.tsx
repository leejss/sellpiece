import Link from "next/link";
import { getProducts, getProductStats } from "@/lib/db/queries/admin/product";
import { ProductsTable } from "@/components/admin/products-table";

type SearchParams = Promise<{
  page?: string;
  search?: string;
  status?: string;
  categoryId?: string;
}>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search;
  const status = params.status;
  const categoryId = params.categoryId;

  const [{ products, pagination }, stats] = await Promise.all([
    getProducts({ page, search, status, categoryId }),
    getProductStats(),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-12 pb-20 lg:pb-12">
      {/* Header - Mobile First */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
        <div>
          <h1 className="typ-title font-bold tracking-tight mb-2 sm:mb-4">
            Products
          </h1>
          <p className="typ-caption text-gray-500">
            {stats.totalProducts} products registered
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="w-full sm:w-auto px-6 py-3 bg-black text-white hover:bg-gray-800 transition typ-cta text-center"
        >
          NEW PRODUCT
        </Link>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} pagination={pagination} />
    </div>
  );
}
