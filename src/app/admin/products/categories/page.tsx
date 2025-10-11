import Link from 'next/link';
import { getCategories } from './queries';
import { CategoriesTable } from './categories-table';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Link href="/admin/products" className="typ-link text-gray-500 hover:text-gray-700">
              ← 상품 관리
            </Link>
          </div>
          <h1 className="typ-title mb-2 font-bold">카테고리 관리</h1>
          <p className="typ-caption text-gray-600">
            총 {categories.length}개의 카테고리가 등록되어 있습니다
          </p>
        </div>
        <Link
          href="/admin/products/categories/new"
          className="typ-cta rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          + 카테고리 추가
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-6">
          <div className="typ-meta mb-1 text-gray-600">전체 카테고리</div>
          <div className="typ-subtitle font-bold">{categories.length}</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="typ-meta mb-1 text-gray-600">활성 카테고리</div>
          <div className="typ-subtitle font-bold text-green-600">
            {categories.filter((c) => c.isActive).length}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="typ-meta mb-1 text-gray-600">상품이 있는 카테고리</div>
          <div className="typ-subtitle font-bold text-blue-600">
            {categories.filter((c) => c.productCount > 0).length}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="typ-meta mb-1 text-gray-600">빈 카테고리</div>
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
