'use server';

import { db } from '@/lib/db';
import { productCategories } from '@/lib/db/schema';
import { createCategorySchema, type CreateCategoryInput } from '@/lib/validations/product';
import { requireAdmin } from '@/lib/auth/check-admin';
import { createClient } from '@/lib/supabase/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

/**
 * 카테고리 생성 서버 액션
 */
export async function createCategory(
  input: CreateCategoryInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. 관리자 권한 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: '인증이 필요합니다' };
    }

    await requireAdmin(user.id);

    // 2. 입력 데이터 검증
    const validatedData = createCategorySchema.parse(input);

    // 3. 카테고리 생성
    const [newCategory] = await db
      .insert(productCategories)
      .values(validatedData)
      .returning({ id: productCategories.id });

    // 4. 캐시 재검증
    revalidatePath('/admin/products');
    revalidatePath('/admin/products/categories');

    return {
      success: true,
      data: { id: newCategory.id },
    };
  } catch (error) {
    console.error('카테고리 생성 실패:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '카테고리 생성 중 오류가 발생했습니다',
    };
  }
}

/**
 * 카테고리 수정 서버 액션
 */
export async function updateCategory(
  categoryId: string,
  input: CreateCategoryInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. 관리자 권한 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: '인증이 필요합니다' };
    }

    await requireAdmin(user.id);

    // 2. 입력 데이터 검증
    const validatedData = createCategorySchema.parse(input);

    // 3. 카테고리 수정
    await db
      .update(productCategories)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(productCategories.id, categoryId));

    // 4. 캐시 재검증
    revalidatePath('/admin/products');
    revalidatePath('/admin/products/categories');

    return {
      success: true,
      data: { id: categoryId },
    };
  } catch (error) {
    console.error('카테고리 수정 실패:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '카테고리 수정 중 오류가 발생했습니다',
    };
  }
}

/**
 * 카테고리 삭제 서버 액션
 */
export async function deleteCategory(categoryId: string): Promise<ActionResult<void>> {
  try {
    // 1. 관리자 권한 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: '인증이 필요합니다' };
    }

    await requireAdmin(user.id);

    // 2. 카테고리 삭제
    await db.delete(productCategories).where(eq(productCategories.id, categoryId));

    // 3. 캐시 재검증
    revalidatePath('/admin/products');
    revalidatePath('/admin/products/categories');

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('카테고리 삭제 실패:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '카테고리 삭제 중 오류가 발생했습니다',
    };
  }
}
