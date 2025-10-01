"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategory, updateCategory } from "./actions";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@/lib/validations/product";
import type { productCategories } from "@/lib/db/schema";

type Category = typeof productCategories.$inferSelect;

type Props = {
  category?: Category;
};

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      isActive: category?.isActive !== undefined ? category.isActive : true,
    },
  });

  // 카테고리명에서 자동으로 슬러그 생성
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setValue("name", name);
    // 수정 모드가 아닐 때만 자동 생성
    if (!isEdit) {
      setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = async (data: CreateCategoryInput) => {
    try {
      const result = isEdit
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (result.success) {
        router.push("/admin/products/categories");
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 에러 메시지 */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="font-semibold mb-2">입력 오류가 있습니다:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.name && <li>{errors.name.message}</li>}
            {errors.slug && <li>{errors.slug.message}</li>}
          </ul>
        </div>
      )}

      {/* 기본 정보 섹션 */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">기본 정보</h2>

        {/* 카테고리명 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            <span className="inline-flex items-center gap-1">
              카테고리명
              <span className="text-red-500 text-lg leading-none">•</span>
            </span>
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              onChange: (e) => handleNameChange(e.target.value),
            })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 의류"
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* 슬러그 */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-2">
            <span className="inline-flex items-center gap-1">
              슬러그
              <span className="text-red-500 text-lg leading-none">•</span>
            </span>
          </label>
          <input
            type="text"
            id="slug"
            {...register("slug")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: clothing"
          />
          <p className="text-sm text-gray-500 mt-1">
            URL에 사용될 고유 식별자 (소문자, 숫자, 하이픈만 사용)
          </p>
          {errors.slug && (
            <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
          )}
        </div>

        {/* 설명 */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            설명 (선택)
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={5}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="카테고리에 대한 설명을 입력하세요"
          />
        </div>
      </section>

      {/* 상태 섹션 */}
      <section className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">상태</h2>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm font-medium">
            활성화
          </label>
          <p className="ml-2 text-sm text-gray-500">
            (비활성화 시 상품 등록 폼에 표시되지 않습니다)
          </p>
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
          {isSubmitting
            ? isEdit
              ? "수정 중..."
              : "추가 중..."
            : isEdit
            ? "수정"
            : "추가"}
        </button>
      </div>
    </form>
  );
}
