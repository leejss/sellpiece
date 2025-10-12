import { db } from '@/lib/db';
import { carts, cartItems } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function clearCartItems(cartId: string) {
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

export async function findOrCreateUserCart(userId: string) {
  return db.transaction(async (tx) => {
    let cart = await tx.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });

    if (!cart) {
      const [newCart] = await tx.insert(carts).values({ userId }).returning();
      cart = newCart;
    }

    const items = await tx.query.cartItems.findMany({
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
  });
}

async function findCartIdByUserId(userId: string) {
  const result = await db.query.carts.findFirst({
    columns: {
      id: true,
    },
    where: eq(carts.userId, userId),
  });

  return result?.id ?? null;
}

export async function countCartItemsByUserId(userId: string) {
  const cartId = await findCartIdByUserId(userId);
  if (!cartId) {
    return 0;
  }

  const [row] = await db
    .select({
      totalProducts: sql<number>`coalesce(count(distinct ${cartItems.productId}), 0)`,
    })
    .from(cartItems)
    .where(eq(cartItems.cartId, cartId));

  return row?.totalProducts ?? 0;
}
