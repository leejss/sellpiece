'use client';

import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProduct } from '@/actions/admin/product';
import {
  createProductSchema,
  type CreateProductInput,
  ProductStatus,
} from '@/lib/validations/product';
import { BaseProductForm, type ProductFormValuesBase } from './base-product-form';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  categories: Category[];
};

/**
 * 상품 생성 폼 래퍼
 * - createProductSchema 사용
 * - createProduct 서버 액션 호출
 */
export function ProductCreateForm({ categories }: Props) {
  const router = useRouter();

  const methods = useForm<ProductFormValuesBase>({
    // zod & RHF 제네릭 호환을 위해 any 캐스팅 (런타임 검증은 zod가 수행)
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: 0,
      categoryId: '',
      status: ProductStatus.DRAFT,
      isPublished: false,
      images: [],
    },
  });

  const onSubmit: import('react-hook-form').SubmitHandler<ProductFormValuesBase> = async (data) => {
    try {
      const result = await createProduct(data as unknown as CreateProductInput);

      if (result.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert('상품 등록 중 오류가 발생했습니다');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <BaseProductForm submitLabel="상품 등록" categories={categories} onCancel={handleCancel} />
      </form>
    </FormProvider>
  );
}
