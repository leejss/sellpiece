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
              className="text-gray-500 hover:text-gray-700"
            >
              ← 상품 관리
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">카테고리 관리</h1>
          <p className="text-gray-600">
            총 {categories.length}개의 카테고리가 등록되어 있습니다
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">전체 카테고리</div>
          <div className="text-2xl font-bold">{categories.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">활성 카테고리</div>
          <div className="text-2xl font-bold text-green-600">
            {categories.filter((c) => c.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <div className="text-sm text-gray-600 mb-1">비활성 카테고리</div>
          <div className="text-2xl font-bold text-gray-600">
            {categories.filter((c) => !c.isActive).length}
          </div>
        </div>
      </div>

      {/* 카테고리 테이블 */}
      <CategoriesTable categories={categories} />
    </div>
  );
}
