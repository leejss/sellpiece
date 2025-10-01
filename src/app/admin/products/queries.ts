import { db } from "@/lib/db";
import { products, productImages, productCategories } from "@/lib/db/schema";
import { eq, desc, asc, like, and, or, sql } from "drizzle-orm";

export type ProductWithImages = typeof products.$inferSelect & {
  images: (typeof productImages.$inferSelect)[];
  category: typeof productCategories.$inferSelect | null;
};

export type ProductListItem = typeof products.$inferSelect & {
  imageCount: number;
  categoryName: string | null;
};

export type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  sortBy?: "createdAt" | "updatedAt" | "name" | "price";
  sortOrder?: "asc" | "desc";
};

/**
 * 상품 목록 조회 (페이지네이션, 검색, 필터링, 정렬 지원)
 */
export async function getProducts(params: GetProductsParams = {}) {
  const {
    page = 1,
    limit = 20,
    search,
    status,
    categoryId,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const offset = (page - 1) * limit;

  // WHERE 조건 구성
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(products.name, `%${search}%`),
        like(products.description, `%${search}%`),
        like(products.sku, `%${search}%`),
      ),
    );
  }

  if (status) {
    conditions.push(eq(products.status, status));
  }

  if (categoryId) {
    conditions.push(eq(products.categoryId, categoryId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 정렬 조건
  const orderByColumn = products[sortBy];
  const orderByClause =
    sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

  // 데이터 조회
  const [productList, totalCountResult] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        stock: products.stock,
        sku: products.sku,
        barcode: products.barcode,
        status: products.status,
        isPublished: products.isPublished,
        publishedAt: products.publishedAt,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryId: products.categoryId,
        categoryName: productCategories.name,
        imageCount: sql<number>`count(${productImages.id})::int`,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id),
      )
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(whereClause)
      .groupBy(products.id, productCategories.name)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(whereClause),
  ]);

  const totalCount = totalCountResult[0]?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    products: productList,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * 상품 상세 조회 (이미지 및 카테고리 포함)
 */
export async function getProductById(
  productId: string,
): Promise<ProductWithImages | null> {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        images: {
          orderBy: asc(productImages.position),
        },
        category: true,
      },
    });

    return product ?? null;
  } catch (error) {
    console.error("상품 조회 실패:", error);
    return null;
  }
}

/**
 * 카테고리별 상품 개수 조회
 */
export async function getProductCountByCategory() {
  try {
    const result = await db
      .select({
        categoryId: products.categoryId,
        categoryName: productCategories.name,
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.categoryId, productCategories.id),
      )
      .groupBy(products.categoryId, productCategories.name);

    return result;
  } catch (error) {
    console.error("카테고리별 상품 개수 조회 실패:", error);
    return [];
  }
}

/**
 * 상품 통계 조회
 */
export async function getProductStats() {
  try {
    const [stats] = await db
      .select({
        totalProducts: sql<number>`count(*)::int`,
        publishedProducts: sql<number>`count(*) filter (where ${products.isPublished} = true)::int`,
        draftProducts: sql<number>`count(*) filter (where ${products.status} = 'draft')::int`,
        lowStockProducts: sql<number>`count(*) filter (where ${products.stock} < 10)::int`,
      })
      .from(products);

    return stats;
  } catch (error) {
    console.error("상품 통계 조회 실패:", error);
    return {
      totalProducts: 0,
      publishedProducts: 0,
      draftProducts: 0,
      lowStockProducts: 0,
    };
  }
}
