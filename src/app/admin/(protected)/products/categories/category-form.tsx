'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategory, updateCategory } from './actions';
import { createCategorySchema, type CreateCategoryInput } from '@/lib/validations/product';
import type { productCategories } from '@/lib/db/schema';

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
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      isActive: category?.isActive !== undefined ? category.isActive : true,
    },
  });

  // 카테고리명에서 자동으로 슬러그 생성
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setValue('name', name);
    // 수정 모드가 아닐 때만 자동 생성
    if (!isEdit) {
      setValue('slug', generateSlug(name));
    }
  };

  const onSubmit = async (data: CreateCategoryInput) => {
    try {
      const result = isEdit ? await updateCategory(category.id, data) : await createCategory(data);

      if (result.success) {
        router.push('/admin/products/categories');
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 에러 메시지 */}
      {Object.keys(errors).length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <p className="mb-2 font-semibold">입력 오류가 있습니다:</p>
          <ul className="list-inside list-disc space-y-1">
            {errors.name && <li>{errors.name.message}</li>}
            {errors.slug && <li>{errors.slug.message}</li>}
          </ul>
        </div>
      )}

      {/* 기본 정보 섹션 */}
      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">기본 정보</h2>

        {/* 카테고리명 */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            <span className="inline-flex items-center gap-1">
              카테고리명
              <span className="text-lg leading-none text-red-500">•</span>
            </span>
          </label>
          <input
            type="text"
            id="name"
            {...register('name', {
              onChange: (e) => handleNameChange(e.target.value),
            })}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="예: 의류"
            autoFocus
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* 슬러그 */}
        <div>
          <label htmlFor="slug" className="mb-2 block text-sm font-medium">
            <span className="inline-flex items-center gap-1">
              슬러그
              <span className="text-lg leading-none text-red-500">•</span>
            </span>
          </label>
          <input
            type="text"
            id="slug"
            {...register('slug')}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="예: clothing"
          />
          <p className="mt-1 text-sm text-gray-500">
            URL에 사용될 고유 식별자 (소문자, 숫자, 하이픈만 사용)
          </p>
          {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
        </div>

        {/* 설명 */}
        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            설명 (선택)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={5}
            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="카테고리에 대한 설명을 입력하세요"
          />
        </div>
      </section>

      {/* 상태 섹션 */}
      <section className="space-y-4 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">상태</h2>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
          {isSubmitting ? (isEdit ? '수정 중...' : '추가 중...') : isEdit ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
}
