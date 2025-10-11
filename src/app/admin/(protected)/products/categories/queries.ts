import { db } from '@/lib/db';
import { productCategories, products } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export type CategoryWithProductCount = typeof productCategories.$inferSelect & {
  productCount: number;
};

/**
 * 모든 카테고리 조회 (상품 수 포함)
 */
export async function getCategories(): Promise<CategoryWithProductCount[]> {
  try {
    const categories = await db
      .select({
        id: productCategories.id,
        name: productCategories.name,
        slug: productCategories.slug,
        description: productCategories.description,
        isActive: productCategories.isActive,
        createdAt: productCategories.createdAt,
        updatedAt: productCategories.updatedAt,
        productCount: sql<number>`count(${products.id})::int`,
      })
      .from(productCategories)
      .leftJoin(products, eq(productCategories.id, products.categoryId))
      .groupBy(productCategories.id)
      .orderBy(desc(productCategories.createdAt));

    return categories;
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    return [];
  }
}

/**
 * 활성화된 카테고리만 조회
 */
export async function getActiveCategories() {
  try {
    const categories = await db.query.productCategories.findMany({
      where: eq(productCategories.isActive, true),
      orderBy: desc(productCategories.createdAt),
    });

    return categories;
  } catch (error) {
    console.error('활성 카테고리 조회 실패:', error);
    return [];
  }
}

/**
 * ID로 카테고리 조회
 */
export async function getCategoryById(categoryId: string) {
  try {
    const category = await db.query.productCategories.findFirst({
      where: eq(productCategories.id, categoryId),
    });

    return category ?? null;
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    return null;
  }
}
