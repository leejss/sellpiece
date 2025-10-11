import Link from "next/link";
import { getCategories } from "./queries";
import { CategoriesTable } from "./categories-table";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin/products"
              className="typ-link text-gray-500 hover:text-gray-700"
            >
              ← 상품 관리
            </Link>
          </div>
          <h1 className="typ-title font-bold mb-2">카테고리 관리</h1>
          <p className="typ-caption text-gray-600">
            총 {categories.length}개의 카테고리가 등록되어 있습니다
          </p>
        </div>
        <Link
          href="/admin/products/categories/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition typ-cta"
        >
          + 카테고리 추가
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="typ-meta text-gray-600 mb-1">전체 카테고리</div>
          <div className="typ-subtitle font-bold">{categories.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="typ-meta text-gray-600 mb-1">활성 카테고리</div>
          <div className="typ-subtitle font-bold text-green-600">
            {categories.filter((c) => c.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="typ-meta text-gray-600 mb-1">상품이 있는 카테고리</div>
          <div className="typ-subtitle font-bold text-blue-600">
            {categories.filter((c) => c.productCount > 0).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="typ-meta text-gray-600 mb-1">빈 카테고리</div>
          <div className="typ-subtitle font-bold text-orange-600">
            {categories.filter((c) => c.productCount === 0).length}
          </div>
        </div>
      </div>

      {/* 카테고리 테이블 */}
      <CategoriesTable categories={categories} />
    </div>
  );
}
