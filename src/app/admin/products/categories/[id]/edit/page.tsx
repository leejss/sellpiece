import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById } from "../../queries";
import { CategoryForm } from "../../category-form";

type Params = Promise<{ id: string }>;

export default async function EditCategoryPage({ params }: { params: Params }) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/admin/products/categories"
            className="typ-link text-gray-500 hover:text-gray-700"
          >
            ← 카테고리 관리
          </Link>
        </div>
        <h1 className="typ-title font-bold mb-2">카테고리 수정</h1>
        <p className="typ-caption text-gray-600">{category.name} 카테고리를 수정합니다</p>
      </div>

      {/* 폼 */}
      <CategoryForm category={category} />
    </div>
  );
}
