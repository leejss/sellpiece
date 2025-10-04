"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { deleteProduct, toggleProductStatus } from "@/actions/admin/product";
import type { ProductListItem } from "@/lib/db/queries/admin/product";

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
    currentStatus: boolean,
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
    const labels = {
      draft: "DRAFT",
      active: "ACTIVE",
      archived: "ARCHIVED",
    };
    return (
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (products.length === 0) {
    return (
      <div className="border border-gray-100 p-20 text-center">
        <p className="text-gray-400 mb-6 text-lg">No products yet</p>
        <Link
          href="/admin/products/new"
          className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition text-sm"
        >
          CREATE FIRST PRODUCT
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-gray-100">
      {/* Table - Mobile First */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs uppercase tracking-wide text-gray-500 font-normal">
                Product
              </th>
              <th className="hidden sm:table-cell px-4 lg:px-6 py-3 sm:py-4 text-left text-xs uppercase tracking-wide text-gray-500 font-normal">
                Category
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs uppercase tracking-wide text-gray-500 font-normal">
                Price
              </th>
              <th className="hidden md:table-cell px-4 lg:px-6 py-3 sm:py-4 text-left text-xs uppercase tracking-wide text-gray-500 font-normal">
                Stock
              </th>
              <th className="hidden lg:table-cell px-6 py-4 text-left text-xs uppercase tracking-wide text-gray-500 font-normal">
                Status
              </th>
              <th className="hidden md:table-cell px-4 lg:px-6 py-3 sm:py-4 text-left text-xs uppercase tracking-wide text-gray-500 font-normal">
                Published
              </th>
              <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs uppercase tracking-wide text-gray-500 font-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50 transition">
                <td className="px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
                  <div className="text-sm sm:text-base font-medium">
                    {product.name}
                  </div>
                  {product.sku && (
                    <div className="text-xs text-gray-400 mt-1">
                      {product.sku}
                    </div>
                  )}
                </td>
                <td className="hidden sm:table-cell px-4 lg:px-6 py-4 sm:py-5 text-xs sm:text-sm text-gray-500">
                  {product.categoryName || "—"}
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-4 sm:py-5 text-xs sm:text-sm font-medium">
                  ₩{parseFloat(product.price).toLocaleString()}
                </td>
                <td className="hidden md:table-cell px-4 lg:px-6 py-4 sm:py-5 text-xs sm:text-sm">
                  <span className={product.stock < 10 ? "text-red-500" : ""}>
                    {product.stock}
                  </span>
                </td>
                <td className="hidden lg:table-cell px-6 py-5">
                  {getStatusBadge(product.status)}
                </td>
                <td className="hidden md:table-cell px-4 lg:px-6 py-4 sm:py-5">
                  <button
                    onClick={() =>
                      handleToggleStatus(product.id, product.isPublished)
                    }
                    disabled={togglingId === product.id}
                    className={`text-xs uppercase tracking-wide transition disabled:opacity-50 ${
                      product.isPublished
                        ? "text-black hover:opacity-60"
                        : "text-gray-400 hover:text-black"
                    }`}
                  >
                    {togglingId === product.id
                      ? "..."
                      : product.isPublished
                      ? "YES"
                      : "NO"}
                  </button>
                </td>
                <td className="px-3 sm:px-4 lg:px-6 py-4 sm:py-5 text-right text-xs sm:text-sm space-x-2 sm:space-x-4">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-gray-500 hover:text-black transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="text-gray-500 hover:text-black transition disabled:opacity-50"
                  >
                    {deletingId === product.id ? "..." : "Del"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Mobile First */}
      {pagination.totalPages > 1 && (
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-500">
            {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(
              pagination.page * pagination.limit,
              pagination.totalCount,
            )}{" "}
            of {pagination.totalCount}
          </div>
          <div className="flex gap-2">
            {pagination.hasPrev && (
              <Link
                href={createPageUrl(pagination.page - 1)}
                className="px-3 sm:px-4 py-2 border border-gray-200 hover:border-black transition text-xs sm:text-sm"
              >
                ← Prev
              </Link>
            )}
            <div className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm">
              {pagination.page} / {pagination.totalPages}
            </div>
            {pagination.hasNext && (
              <Link
                href={createPageUrl(pagination.page + 1)}
                className="px-3 sm:px-4 py-2 border border-gray-200 hover:border-black transition text-xs sm:text-sm"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
