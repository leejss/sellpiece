"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "./actions";
import { CategoryModal } from "./category-modal";
import type { productCategories } from "@/lib/db/schema";

type Category = typeof productCategories.$inferSelect;

type Props = {
  categories: Category[];
};

export function CategoriesTable({ categories }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
      alert("삭제 중 오류가 발생했습니다");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setIsCreateModalOpen(false);
  };

  const handleSuccess = () => {
    handleCloseModal();
    router.refresh();
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
        활성
      </span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
        비활성
      </span>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12 text-center">
        <p className="text-gray-500 mb-4">등록된 카테고리가 없습니다</p>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          첫 카테고리 등록하기
        </button>
        {isCreateModalOpen && (
          <CategoryModal onClose={handleCloseModal} onSuccess={handleSuccess} />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">카테고리 목록</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            + 카테고리 추가
          </button>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  슬러그
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  설명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {category.description || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(category.isActive)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deletingId === category.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deletingId === category.id ? "삭제 중..." : "삭제"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 */}
      {isCreateModalOpen && (
        <CategoryModal onClose={handleCloseModal} onSuccess={handleSuccess} />
      )}
      {editingCategory && (
        <CategoryModal
          category={editingCategory}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
