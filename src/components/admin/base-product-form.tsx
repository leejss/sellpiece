'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { ProductStatus, type ProductStatusType } from '@/lib/validations/product';
import { ImageUploader } from './image-uploader';

type Category = {
  id: string;
  name: string;
  slug: string;
};

// 공통 폼 값 타입 (Create/Update가 공유하는 최소 필드 집합)
export type ProductFormValuesBase = {
  name: string;
  description?: string;
  price: string;
  stock: number;
  categoryId: string;
  status: ProductStatusType;
  isPublished: boolean;
  images: { url: string; altText?: string; position?: number }[];
  id?: string; // update에서만 필요
};

type BaseProductFormProps = {
  submitLabel: string;
  categories: Category[];
  onCancel: () => void;
  uploadProductImage?: (
    formData: FormData,
  ) => Promise<{ success: true; url: string; path: string } | { success: false; error: string }>;
  deleteProductImage?: (filePath: string) => Promise<{ success: boolean; error?: string }>;
};

/**
 * 상품 폼 공통 UI 컴포넌트
 * - Create/Update 폼에서 재사용
 * - 타입 안전성은 각 래퍼의 zod 스키마로 보장
 */
export function BaseProductForm({
  submitLabel,
  categories,
  onCancel,
  uploadProductImage,
  deleteProductImage,
}: BaseProductFormProps) {
  const { register, control, formState } = useFormContext<ProductFormValuesBase>();
  const { errors, isSubmitting } = formState;
  return (
    <>
      {/* 에러 메시지 */}
      {Object.keys(errors).length > 0 && (
        <div className="text-sm text-red-600">
          <p className="mb-2 font-semibold">입력 오류가 있습니다:</p>
          <ul className="list-inside list-disc space-y-1">
            {errors.name && <li>{errors.name.message as string}</li>}
            {errors.price && <li>{errors.price.message as string}</li>}
            {errors.stock && <li>{errors.stock.message as string}</li>}
            {errors.categoryId && <li>{errors.categoryId.message as string}</li>}
          </ul>
        </div>
      )}

      {/* 기본 정보 */}
      <section className="space-y-4">
        <h2 className="mb-2 text-lg font-semibold">기본 정보</h2>

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs tracking-wide text-gray-500 uppercase"
          >
            <span className="inline-flex items-center gap-1">
              상품명
              <span className="text-lg leading-none text-red-500">•</span>
            </span>
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full border-b border-gray-200 bg-transparent px-0 py-2 transition-colors focus:border-black focus:outline-none"
            placeholder="예: 프리미엄 티셔츠"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-xs tracking-wide text-gray-500 uppercase"
          >
            상품 설명
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full border-b border-gray-200 bg-transparent px-0 py-2 transition-colors focus:border-black focus:outline-none"
            placeholder="상품에 대한 자세한 설명을 입력하세요"
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="mb-2 block text-xs tracking-wide text-gray-500 uppercase"
          >
            <span className="inline-flex items-center gap-1">
              카테고리
              <span className="text-lg leading-none text-red-500">•</span>
            </span>
          </label>
          <select
            id="categoryId"
            {...register('categoryId')}
            className="w-full border-b border-gray-200 bg-transparent px-0 py-2 transition-colors focus:border-black focus:outline-none"
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message as string}</p>
          )}
        </div>
      </section>

      {/* 가격 정보 */}
      <section className="space-y-4">
        <h2 className="mb-2 text-lg font-semibold">가격 정보</h2>

        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-xs tracking-wide text-gray-500 uppercase"
          >
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
            className="w-full border-b border-gray-200 bg-transparent px-0 py-2 transition-colors focus:border-black focus:outline-none"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message as string}</p>
          )}
        </div>
      </section>

      {/* 재고 정보 */}
      <section className="space-y-4">
        <h2 className="mb-2 text-lg font-semibold">재고 정보</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="stock"
              className="mb-2 block text-xs tracking-wide text-gray-500 uppercase"
            >
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
              className="w-full border-b border-gray-200 bg-transparent px-0 py-2 transition-colors focus:border-black focus:outline-none"
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-600">{errors.stock.message as string}</p>
            )}
          </div>
          {/* sku, barcode는 서버에서 자동 생성되며 입력에서 제거되었습니다 */}
        </div>
      </section>

      {/* 이미지 */}
      <section className="space-y-4">
        <h2 className="mb-2 text-lg font-semibold">이미지</h2>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <ImageUploader
              images={field.value ?? []}
              onChange={(images) => field.onChange(images)}
              uploadProductImage={uploadProductImage}
              deleteProductImage={deleteProductImage}
            />
          )}
        />
      </section>

      {/* 상태 */}
      <section className="space-y-4">
        <h2 className="mb-2 text-lg font-semibold">상태</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-xs tracking-wide text-gray-500 uppercase"
            >
              상품 상태
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full border-b border-gray-200 bg-transparent px-0 py-2 transition-colors focus:border-black focus:outline-none"
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
          onClick={onCancel}
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
          {isSubmitting ? '처리 중...' : submitLabel}
        </button>
      </div>
    </>
  );
}
