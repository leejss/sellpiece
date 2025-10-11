'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { deleteCategory } from './actions';
import type { CategoryWithProductCount } from './queries';

type Props = {
  categories: CategoryWithProductCount[];
};

export function CategoriesTable({ categories }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (
      !confirm(
        `"${categoryName}" 카테고리를 삭제하시겠습니까?\n\n연결된 상품의 카테고리는 "없음"으로 변경됩니다.`,
      )
    ) {
      return;
    }

    setDeletingId(categoryId);
    try {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        router.refresh();
      } else {
        alert(`삭제 실패: ${result.error}`);
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">활성</span>
    ) : (
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800">비활성</span>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center">
        <p className="mb-4 text-gray-500">등록된 카테고리가 없습니다</p>
        <Link
          href="/admin/products/categories/new"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          첫 카테고리 등록하기
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">카테고리 목록</h2>
          <Link
            href="/admin/products/categories/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
          >
            + 카테고리 추가
          </Link>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  카테고리명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  슬러그
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  설명
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                  상품 수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  생성일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                  <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {category.productCount > 0 ? (
                      <Link
                        href={`/admin/products?categoryId=${category.id}`}
                        className="inline-flex min-w-[2rem] items-center justify-center rounded px-2 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                      >
                        {category.productCount}
                      </Link>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(category.isActive)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="space-x-2 px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/products/categories/${category.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deletingId === category.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deletingId === category.id ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
