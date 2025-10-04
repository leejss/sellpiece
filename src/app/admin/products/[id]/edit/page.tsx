import { notFound } from "next/navigation";
import { getProductById } from "../../queries";
import { getActiveCategories } from "../../categories/queries";
import { ProductUpdateForm } from "@/components/admin/products/product-update-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductById(id),
    getActiveCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">상품 수정</h1>
        <p className="text-gray-600">상품 정보를 수정합니다</p>
      </div>
      <ProductUpdateForm product={product} categories={categories} />
    </div>
  );
}
