'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProduct } from '@/actions/admin/product';
import {
  updateProductSchema,
  type UpdateProductInput,
  ProductStatus,
} from '@/lib/validations/product';
import type { ProductWithImages } from '@/lib/db/queries/admin/product';
import { ImageUploader } from './image-uploader';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  product: ProductWithImages;
  categories: Category[];
};

export function ProductEditForm({ product, categories }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock: product.stock,
      sku: product.sku ?? '',
      barcode: product.barcode ?? '',
      categoryId: product.categoryId ?? '',
      status: product.status as (typeof ProductStatus)[keyof typeof ProductStatus],
      isPublished: product.isPublished,
      images: product.images.map((img) => ({
        url: img.url,
        altText: img.altText ?? '',
        position: img.position,
      })),
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: UpdateProductInput) => {
    try {
      const result = await updateProduct(data);

      if (result.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert('상품 수정 중 오류가 발생했습니다');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {Object.keys(errors).length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <p className="mb-2 font-semibold">입력 오류가 있습니다:</p>
          <ul className="list-inside list-disc space-y-1">
            {errors.name && <li>{errors.name.message}</li>}
            {errors.price && <li>{errors.price.message}</li>}
            {errors.stock && <li>{errors.stock.message}</li>}
            {errors.categoryId && <li>{errors.categoryId.message}</li>}
          </ul>
        </div>
      )}

      {/* 기본 정보 */}
      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">기본 정보</h2>

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            <span className="inline-flex items-center gap-1">
              상품명
              <span className="text-lg leading-none text-red-500">•</span>
            </span>
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="예: 프리미엄 티셔츠"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            상품 설명
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={5}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="상품에 대한 자세한 설명을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-2 block text-sm font-medium">
            <span className="inline-flex items-center gap-1">
              카테고리
              <span className="text-lg leading-none text-red-500">•</span>
            </span>
          </label>
          <select
            id="categoryId"
            {...register('categoryId')}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>
      </section>

      {/* 가격 정보 */}
      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">가격 정보</h2>

        <div>
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            <span className="inline-flex items-center gap-1">
              판매가
              <span className="text-lg leading-none text-red-500">•</span>
            </span>
          </label>
          <input
            type="number"
            id="price"
            {...register('price')}
            min="0"
            step="0.01"
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="0.00"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>
      </section>

      {/* 재고 정보 */}
      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">재고 정보</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="stock" className="mb-2 block text-sm font-medium">
              <span className="inline-flex items-center gap-1">
                재고 수량
                <span className="text-lg leading-none text-red-500">•</span>
              </span>
            </label>
            <input
              type="number"
              id="stock"
              {...register('stock', { valueAsNumber: true })}
              min="0"
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
          </div>

          <div>
            <label htmlFor="sku" className="mb-2 block text-sm font-medium">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              {...register('sku')}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="예: TSH-001"
            />
          </div>

          <div>
            <label htmlFor="barcode" className="mb-2 block text-sm font-medium">
              바코드
            </label>
            <input
              type="text"
              id="barcode"
              {...register('barcode')}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="예: 1234567890123"
            />
          </div>
        </div>
      </section>

      {/* 이미지 */}
      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">이미지</h2>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploader
              images={field.value ?? []}
              onChange={(images) => field.onChange(images)}
            />
          )}
        />
      </section>

      {/* 상태 */}
      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">상태</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium">
              상품 상태
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={ProductStatus.DRAFT}>임시저장</option>
              <option value={ProductStatus.ACTIVE}>활성</option>
              <option value={ProductStatus.ARCHIVED}>보관</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              {...register('isPublished')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="ml-2 text-sm font-medium">
              스토어프론트에 공개
            </label>
          </div>
        </div>
      </section>

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-6 py-2 transition hover:bg-gray-50"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '수정 중...' : '상품 수정'}
        </button>
      </div>
    </form>
  );
}
