import { db } from '@/lib/db';
import { products, productImages, productCategories } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

/**
 * 공개된 상품 목록 조회 (스토어프론트용)
 */
export async function getPublishedProducts(limit: number = 20) {
  try {
    const productList = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        stock: products.stock,
        sku: products.sku,
        categoryId: products.categoryId,
        categoryName: productCategories.name,
        publishedAt: products.publishedAt,
      })
      .from(products)
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .where(and(eq(products.isPublished, true), eq(products.status, 'active')))
      .orderBy(desc(products.publishedAt))
      .limit(limit);

    // 각 상품의 첫 번째 이미지 조회
    const productsWithImages = await Promise.all(
      productList.map(async (product) => {
        const [firstImage] = await db
          .select({
            url: productImages.url,
            altText: productImages.altText,
          })
          .from(productImages)
          .where(eq(productImages.productId, product.id))
          .orderBy(productImages.position)
          .limit(1);

        return {
          ...product,
          image: firstImage ?? null,
        };
      }),
    );

    return productsWithImages;
  } catch (error) {
    console.error('공개 상품 조회 실패:', error);
    return [];
  }
}

/**
 * 상품 상세 조회 (스토어프론트용)
 */
export async function getPublishedProductById(id: string) {
  try {
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, id),
        eq(products.isPublished, true),
        eq(products.status, 'active'),
      ),
      with: {
        images: {
          orderBy: productImages.position,
        },
        category: true,
      },
    });

    return product ?? null;
  } catch (error) {
    console.error('상품 상세 조회 실패:', error);
    return null;
  }
}

/**
 * 카테고리별 공개 상품 조회
 */
export async function getPublishedProductsByCategory(categoryId: string, limit: number = 20) {
  try {
    const productList = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        stock: products.stock,
        sku: products.sku,
        categoryId: products.categoryId,
        categoryName: productCategories.name,
        publishedAt: products.publishedAt,
      })
      .from(products)
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .where(
        and(
          eq(products.categoryId, categoryId),
          eq(products.isPublished, true),
          eq(products.status, 'active'),
        ),
      )
      .orderBy(desc(products.publishedAt))
      .limit(limit);

    const productsWithImages = await Promise.all(
      productList.map(async (product) => {
        const [firstImage] = await db
          .select({
            url: productImages.url,
            altText: productImages.altText,
          })
          .from(productImages)
          .where(eq(productImages.productId, product.id))
          .orderBy(productImages.position)
          .limit(1);

        return {
          ...product,
          image: firstImage ?? null,
        };
      }),
    );

    return productsWithImages;
  } catch (error) {
    console.error('카테고리별 상품 조회 실패:', error);
    return [];
  }
}
