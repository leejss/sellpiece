"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from "../actions";
import {
  createProductSchema,
  type CreateProductInput,
  ProductStatus,
} from "@/lib/validations/product";
import { ImageUploader } from "./image-uploader";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  categories: Category[];
};

export function ProductForm({ categories }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: 0,
      sku: "",
      barcode: "",
      categoryId: "",
      status: ProductStatus.DRAFT,
      isPublished: false,
      images: [],
    } satisfies CreateProductInput,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = form;


  const onSubmit = async (data: CreateProductInput) => {
    try {
      const result = await createProduct(data);

      if (result.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("상품 등록 중 오류가 발생했습니다");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="font-semibold mb-2">입력 오류가 있습니다:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.name && <li>{errors.name.message}</li>}
            {errors.price && <li>{errors.price.message}</li>}
            {errors.stock && <li>{errors.stock.message}</li>}
            {errors.categoryId && <li>{errors.categoryId.message}</li>}
          </ul>
        </div>
      )}

      {/* 기본 정보 */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">기본 정보</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            <span className="inline-flex items-center gap-1">
              상품명
              <span className="text-red-500 text-lg leading-none">•</span>
            </span>
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 프리미엄 티셔츠"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            상품 설명
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={5}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="상품에 대한 자세한 설명을 입력하세요"
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium mb-2"
          >
            <span className="inline-flex items-center gap-1">
              카테고리
              <span className="text-red-500 text-lg leading-none">•</span>
            </span>
          </label>
          <select
            id="categoryId"
            {...register("categoryId")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {errors.categoryId.message}
            </p>
          )}
        </div>
      </section>

      {/* 가격 정보 */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">가격 정보</h2>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-red-600 mt-1">
              {errors.price.message}
            </p>
          )}
        </div>
      </section>

      {/* 재고 정보 */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">재고 정보</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-2">
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-sm text-red-600 mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium mb-2">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              {...register("sku")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: TSH-001"
            />
          </div>

          <div>
            <label htmlFor="barcode" className="block text-sm font-medium mb-2">
              바코드
            </label>
            <input
              type="text"
              id="barcode"
              {...register("barcode")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 1234567890123"
            />
          </div>
        </div>
      </section>

      {/* 이미지 */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">이미지</h2>
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
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">상태</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              상품 상태
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          onClick={() => router.back()}
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
          {isSubmitting ? "등록 중..." : "상품 등록"}
        </button>
      </div>
    </form>
  );
}
