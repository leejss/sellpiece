import { db } from "@/lib/db";
import { productCategories } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * 모든 카테고리 조회
 */
export async function getCategories() {
  try {
    const categories = await db.query.productCategories.findMany({
      orderBy: desc(productCategories.createdAt),
    });

    return categories;
  } catch (error) {
    console.error("카테고리 조회 실패:", error);
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
    console.error("활성 카테고리 조회 실패:", error);
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
    console.error("카테고리 조회 실패:", error);
    return null;
  }
}
