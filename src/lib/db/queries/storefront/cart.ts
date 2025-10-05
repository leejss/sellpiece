import { db } from "@/lib/db";
import { carts, cartItems, productImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * 사용자의 장바구니 조회
 */
export async function getUserCart(userId: string) {
  try {
    // 사용자의 장바구니 찾기 또는 생성
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });

    if (!cart) {
      // 장바구니가 없으면 생성
      const [newCart] = await db
        .insert(carts)
        .values({ userId })
        .returning();
      cart = newCart;
    }

    // 장바구니 아이템 조회 (상품 정보 포함)
    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, cart.id),
      with: {
        product: {
          with: {
            images: {
              orderBy: productImages.position,
              limit: 1,
            },
          },
        },
      },
    });

    return {
      cart,
      items,
    };
  } catch (error) {
    console.error("장바구니 조회 실패:", error);
    return {
      cart: null,
      items: [],
    };
  }
}
