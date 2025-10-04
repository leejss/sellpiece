"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ProductStatus, type ProductStatusType } from "@/lib/validations/product";
import { ImageUploader } from "@/app/admin/products/new/image-uploader";

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
};

/**
 * 상품 폼 공통 UI 컴포넌트
 * - Create/Update 폼에서 재사용
 * - 타입 안전성은 각 래퍼의 zod 스키마로 보장
 */
export function BaseProductForm({ submitLabel, categories, onCancel }: BaseProductFormProps) {
  const { register, control, formState } = useFormContext<ProductFormValuesBase>();
  const { errors, isSubmitting } = formState;
  return (
    <>
      {/* 에러 메시지 */}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-600 text-sm">
          <p className="font-semibold mb-2">입력 오류가 있습니다:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.name && <li>{errors.name.message as string}</li>}
            {errors.price && <li>{errors.price.message as string}</li>}
            {errors.stock && <li>{errors.stock.message as string}</li>}
            {errors.categoryId && <li>{errors.categoryId.message as string}</li>}
          </ul>
        </div>
      )}

      {/* 기본 정보 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">기본 정보</h2>

        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
            <span className="inline-flex items-center gap-1">
              상품명
              <span className="text-red-500 text-lg leading-none">•</span>
            </span>
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-colors"
            placeholder="예: 프리미엄 티셔츠"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
            상품 설명
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-colors"
            placeholder="상품에 대한 자세한 설명을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
            <span className="inline-flex items-center gap-1">
              카테고리
              <span className="text-red-500 text-lg leading-none">•</span>
            </span>
          </label>
          <select
            id="categoryId"
            {...register("categoryId")}
            className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-colors"
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red-600 mt-1">
              {errors.categoryId.message as string}
            </p>
          )}
        </div>
      </section>

      {/* 가격 정보 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">가격 정보</h2>

        <div>
          <label htmlFor="price" className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
            <span className="inline-flex items-center gap-1">
              판매가
              <span className="text-red-500 text-lg leading-none">•</span>
            </span>
          </label>
          <input
            type="number"
            id="price"
            {...register("price")}
            min="0"
            step="0.01"
            className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-colors"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-red-600 mt-1">{errors.price.message as string}</p>
          )}
        </div>
      </section>

      {/* 재고 정보 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">재고 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="stock" className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
              <span className="inline-flex items-center gap-1">
                재고 수량
                <span className="text-red-500 text-lg leading-none">•</span>
              </span>
            </label>
            <input
              type="number"
              id="stock"
              {...register("stock", { valueAsNumber: true })}
              min="0"
              className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-colors"
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-sm text-red-600 mt-1">
                {errors.stock.message as string}
              </p>
            )}
          </div>
          {/* sku, barcode는 서버에서 자동 생성되며 입력에서 제거되었습니다 */}
        </div>
      </section>

      {/* 이미지 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">이미지</h2>
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
      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">상태</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
              상품 상태
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black focus:outline-none transition-colors"
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
              {...register("isPublished")}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "처리 중..." : submitLabel}
        </button>
      </div>
    </>
  );
}
