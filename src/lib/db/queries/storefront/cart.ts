import { db } from "@/lib/db";
import { carts, cartItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserCart(userId: string) {
  try {
    // 사용자의 장바구니 찾기 또는 생성
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });

    if (!cart) {
      // 장바구니가 없으면 생성
      const [newCart] = await db.insert(carts).values({ userId }).returning();

      cart = newCart;
    }

    // 장바구니 아이템 조회 (상품 정보 포함)
    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, cart.id),
      with: {
        product: {
          with: {
            images: {
              orderBy: (img, { asc }) => asc(img.position),
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
    console.error("Error:getUserCart", error);
    return {
      cart: null,
      items: [],
    };
  }
}

async function createUserCart(userId: string) {
  const [newCart] = await db.insert(carts).values({ userId }).returning();
  return newCart;
}

export async function getOrCreateUserCart(userId: string) {
  try {
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });

    if (!cart) {
      const newCart = await createUserCart(userId);
      cart = newCart;
    }

    const items = await getUserCartItems(cart.id);

    return {
      cart,
      items,
    };
  } catch (error) {
    console.error("Error:getOrCreateUserCart", error);
    return {
      cart: null,
      items: [],
    };
  }
}

async function getUserCartItems(cartId: string) {
  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    with: {
      product: {
        with: {
          images: {
            orderBy: (img, { asc }) => asc(img.position),
            limit: 1,
          },
        },
      },
    },
  });

  return items;
}
