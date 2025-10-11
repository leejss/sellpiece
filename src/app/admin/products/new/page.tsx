import { getActiveCategories } from '../categories/queries';
import { ProductCreateForm } from '@/components/admin/product-create-form';

export default async function NewProductPage() {
  const categories = await getActiveCategories();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="typ-title mb-2 font-bold">상품 등록</h1>
        <p className="typ-caption text-gray-600">새로운 상품을 등록합니다</p>
      </div>

      <ProductCreateForm categories={categories} />
    </div>
  );
}
