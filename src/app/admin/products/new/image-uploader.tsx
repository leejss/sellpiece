"use client";

import { useState } from "react";
import { uploadProductImage, deleteProductImage } from "../upload-actions";
import type { ProductImage } from "@/lib/validations/product";

type Props = {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
};

export function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadProductImage(formData);

        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          url: result.url,
          altText: file.name.split(".")[0],
          position: images.length,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
      // 파일 입력 초기화
      e.target.value = "";
    }
  };

  const handleRemove = async (index: number) => {
    const imageToRemove = images[index];
    
    // URL에서 파일 경로 추출
    const url = new URL(imageToRemove.url);
    const pathParts = url.pathname.split("/");
    const filePath = pathParts.slice(-2).join("/"); // products/filename.ext

    try {
      await deleteProductImage(filePath);
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } catch (err) {
      setError("이미지 삭제 실패");
    }
  };

  const handleAltTextChange = (index: number, altText: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], altText };
    onChange(newImages);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];

    // position 업데이트
    newImages.forEach((img, i) => {
      img.position = i;
    });

    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">상품 이미지</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer ${uploading ? "opacity-50" : ""}`}
          >
            <div className="text-gray-600">
              {uploading ? (
                <p>업로드 중...</p>
              ) : (
                <>
                  <p className="mb-2">
                    클릭하여 이미지를 선택하거나 드래그 앤 드롭
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, WebP (최대 5MB)
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      {/* 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">
            업로드된 이미지 ({images.length}개)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 bg-white"
              >
                <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.altText || `상품 이미지 ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      대표 이미지
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    이미지 설명
                  </label>
                  <input
                    type="text"
                    value={image.altText || ""}
                    onChange={(e) => handleAltTextChange(index, e.target.value)}
                    placeholder="이미지 설명 (선택사항)"
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1}
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
