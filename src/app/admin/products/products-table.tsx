"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { deleteProduct, toggleProductStatus } from "./actions";
import type { ProductListItem } from "./queries";

type Props = {
  products: ProductListItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export function ProductsTable({ products, pagination }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`"${productName}" 상품을 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingId(productId);
    try {
      const result = await deleteProduct(productId);
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

  const handleToggleStatus = async (
    productId: string,
    currentStatus: boolean
  ) => {
    setTogglingId(productId);
    try {
      const result = await toggleProductStatus(productId, !currentStatus);
      if (result.success) {
        router.refresh();
      } else {
        alert(`상태 변경 실패: ${result.error}`);
      }
    } catch (error) {
      alert("상태 변경 중 오류가 발생했습니다");
    } finally {
      setTogglingId(null);
    }
  };

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800",
    };
    const labels = {
      draft: "임시저장",
      active: "활성",
      archived: "보관",
    };
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles] || styles.draft}`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-12 text-center">
        <p className="text-gray-500 mb-4">등록된 상품이 없습니다</p>
        <Link
          href="/admin/products/new"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          첫 상품 등록하기
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                재고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                공개
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {product.sku || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.categoryName || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₩{parseFloat(product.price).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={
                      product.stock < 10 ? "text-red-600 font-medium" : ""
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      handleToggleStatus(product.id, product.isPublished)
                    }
                    disabled={togglingId === product.id}
                    className={`px-3 py-1 text-xs rounded-full transition ${
                      product.isPublished
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    {togglingId === product.id
                      ? "..."
                      : product.isPublished
                        ? "공개"
                        : "비공개"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {deletingId === product.id ? "삭제 중..." : "삭제"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            전체 {pagination.totalCount}개 중 {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.totalCount)}개 표시
          </div>
          <div className="flex gap-2">
            {pagination.hasPrev && (
              <Link
                href={createPageUrl(pagination.page - 1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                이전
              </Link>
            )}
            <div className="flex items-center px-4 py-2 border rounded-lg bg-gray-50">
              {pagination.page} / {pagination.totalPages}
            </div>
            {pagination.hasNext && (
              <Link
                href={createPageUrl(pagination.page + 1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                다음
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
