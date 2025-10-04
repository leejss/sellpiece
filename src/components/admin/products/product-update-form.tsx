"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProduct } from "@/app/admin/products/actions";
import {
  updateProductSchema,
  type UpdateProductInput,
  ProductStatus,
} from "@/lib/validations/product";
import { BaseProductForm, type ProductFormValuesBase } from "./base-product-form";
import type { ProductWithImages } from "@/app/admin/products/queries";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  product: ProductWithImages;
  categories: Category[];
};

/**
 * 상품 수정 폼 래퍼
 * - updateProductSchema 사용
 * - updateProduct 서버 액션 호출
 */
export function ProductUpdateForm({ product, categories }: Props) {
  const router = useRouter();

  const methods = useForm<ProductFormValuesBase & { id: string }>({
    // zod & RHF 제네릭 호환을 위해 any 캐스팅 (런타임 검증은 zod가 수행)
    resolver: zodResolver(updateProductSchema) as any,
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: product.price as unknown as string,
      stock: product.stock,
      sku: product.sku ?? "",
      barcode: product.barcode ?? "",
      categoryId: product.categoryId ?? "",
      status: product.status as (typeof ProductStatus)[keyof typeof ProductStatus],
      isPublished: product.isPublished,
      images: product.images.map((img) => ({
        url: img.url,
        altText: img.altText ?? "",
        position: img.position,
      })),
    },
  });

  const onSubmit = async (data: ProductFormValuesBase & { id: string }) => {
    try {
      const result = await updateProduct(data as unknown as UpdateProductInput);

      if (result.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("상품 수정 중 오류가 발생했습니다");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <BaseProductForm
          submitLabel="상품 수정"
          categories={categories}
          onCancel={handleCancel}
        />
      </form>
    </FormProvider>
  );
}
