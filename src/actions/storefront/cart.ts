'use server';

import { db } from '@/lib/db';
import { carts, cartItems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * 장바구니에 상품 추가
 * TODO: 실제 구현 시 세션/사용자 인증 추가 필요
 */
export async function addToCart(formData: FormData): Promise<void> {
  const productId = formData.get('productId') as string;
  const size = formData.get('size') as string | null;
  const quantity = Number(formData.get('quantity') ?? 1);

  // TODO: 실제 사용자 ID 가져오기 (세션/인증)
  const userId = 'temp-user-id'; // 임시

  try {
    // 사용자의 장바구니 찾기 또는 생성
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });

    if (!cart) {
      const [newCart] = await db.insert(carts).values({ userId }).returning();
      cart = newCart;
    }

    // 동일한 상품이 이미 장바구니에 있는지 확인
    const whereConditions = [eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)];

    if (size) {
      whereConditions.push(eq(cartItems.size, size));
    }

    const existingItem = await db.query.cartItems.findFirst({
      where: and(...whereConditions),
    });

    if (existingItem) {
      // 기존 아이템의 수량 증가
      await db
        .update(cartItems)
        .set({
          quantity: existingItem.quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // 새 아이템 추가
      await db.insert(cartItems).values({
        cartId: cart.id,
        productId,
        quantity,
        size,
      });
    }

    revalidatePath('/cart');
  } catch (error) {
    console.error('[addToCart] 실패:', error);
    throw new Error('장바구니 추가 실패');
  }
}

/**
 * 장바구니 아이템 수량 업데이트
 */
export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
  try {
    if (quantity <= 0) {
      throw new Error('수량은 1 이상이어야 합니다');
    }

    await db
      .update(cartItems)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, itemId));

    revalidatePath('/cart');
  } catch (error) {
    console.error('[updateCartItemQuantity] 실패:', error);
    throw new Error('수량 업데이트 실패');
  }
}

/**
 * 장바구니 아이템 삭제
 */
export async function removeCartItem(itemId: string): Promise<void> {
  try {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));

    revalidatePath('/cart');
  } catch (error) {
    console.error('[removeCartItem] 실패:', error);
    throw new Error('아이템 삭제 실패');
  }
}
