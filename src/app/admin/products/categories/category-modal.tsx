import { useState, useEffect } from "react";
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
  onClose: () => void;
  onSuccess: () => void;
};

export function CategoryModal({ category, onClose, onSuccess }: Props) {
  const isEdit = !!category;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
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
    setIsSubmitting(true);
    try {
      const result = isEdit
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (result.success) {
        onSuccess();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            {isEdit ? "카테고리 수정" : "카테고리 추가"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            type="button"
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="카테고리에 대한 설명을 입력하세요"
            />
          </div>

          {/* 활성화 상태 */}
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

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
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
      </div>
    </div>
  );
}
