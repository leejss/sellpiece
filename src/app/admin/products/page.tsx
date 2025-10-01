import Link from "next/link";
import { getProducts, getProductStats } from "./queries";
import { ProductsTable } from "./products-table";

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
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">상품 관리</h1>
          <p className="text-gray-600">
            총 {stats.totalProducts}개의 상품이 등록되어 있습니다
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/categories"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            📁 카테고리 관리
          </Link>
          <Link
            href="/admin/products/new"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + 상품 등록
          </Link>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">전체 상품</div>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">공개 상품</div>
          <div className="text-2xl font-bold text-green-600">
            {stats.publishedProducts}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">임시저장</div>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.draftProducts}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">재고 부족</div>
          <div className="text-2xl font-bold text-red-600">
            {stats.lowStockProducts}
          </div>
        </div>
      </div>

      {/* 상품 테이블 */}
      <ProductsTable products={products} pagination={pagination} />
    </div>
  );
}
