import { z } from "zod";

// 상품 상태 enum
export const ProductStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export type ProductStatusType = (typeof ProductStatus)[keyof typeof ProductStatus];

// 상품 이미지 스키마
export const productImageSchema = z.object({
  url: z.string().url("유효한 URL을 입력해주세요"),
  altText: z.string().optional(),
  position: z.number().int().min(0).optional().default(0),
});

export type ProductImage = z.infer<typeof productImageSchema>;

// 상품 등록 폼 스키마 (입력용)
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "상품명은 필수입니다")
    .max(255, "상품명은 255자를 초과할 수 없습니다"),
  slug: z
    .string()
    .min(1, "슬러그는 필수입니다")
    .max(255, "슬러그는 255자를 초과할 수 없습니다")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "슬러그는 소문자, 숫자, 하이픈(-)만 사용 가능합니다"
    ),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "가격은 필수입니다")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "가격은 0보다 커야 합니다",
    }),
  compareAtPrice: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      { message: "유효한 가격을 입력해주세요" }
    ),
  costPerItem: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      { message: "유효한 가격을 입력해주세요" }
    ),
  stock: z.number().int("재고는 정수여야 합니다").nonnegative("재고는 0 이상이어야 합니다").default(0),
  sku: z.string().max(100).optional(),
  barcode: z.string().max(100).optional(),
  categoryId: z.string().optional(),
  status: z
    .enum([ProductStatus.DRAFT, ProductStatus.ACTIVE, ProductStatus.ARCHIVED])
    .default(ProductStatus.DRAFT),
  isPublished: z.boolean().default(false),
  images: z.array(productImageSchema).default([]),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// 상품 수정 스키마 (id 포함)
export const updateProductSchema = createProductSchema.extend({
  id: z.string().uuid("유효한 상품 ID가 필요합니다"),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// 카테고리 생성 스키마
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "카테고리명은 필수입니다")
    .max(100, "카테고리명은 100자를 초과할 수 없습니다"),
  slug: z
    .string()
    .min(1, "슬러그는 필수입니다")
    .max(100, "슬러그는 100자를 초과할 수 없습니다")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "슬러그는 소문자, 숫자, 하이픈(-)만 사용 가능합니다"
    ),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
