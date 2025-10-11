import Link from 'next/link';
import { CategoryForm } from '../category-form';

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Link href="/admin/products/categories" className="text-gray-500 hover:text-gray-700">
            ← 카테고리 관리
          </Link>
        </div>
        <h1 className="mb-2 text-3xl font-bold">카테고리 추가</h1>
        <p className="text-gray-600">새로운 카테고리를 등록합니다</p>
      </div>

      {/* 폼 */}
      <CategoryForm />
    </div>
  );
}
