import { getActiveCategories } from "../categories/queries";
import { ProductForm } from "./product-form";

export default async function NewProductPage() {
  const categories = await getActiveCategories();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">상품 등록</h1>
        <p className="text-gray-600">새로운 상품을 등록합니다</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
