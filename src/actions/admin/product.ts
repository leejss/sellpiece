'use server';

import { db } from '@/lib/db';
import { products, productImages, productCategories } from '@/lib/db/schema';
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from '@/lib/validations/product';
import { requireAdmin } from '@/lib/auth/check-admin';
import { createClient } from '@/lib/supabase/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateSku, generateEan13, toCodePrefix } from '@/lib/products/identifiers';

type ActionResult<T = unknown> = { success: true; data: T } | { success: false; error: string };

/**
 * 상품 등록 서버 액션
 */
export async function createProduct(
  input: CreateProductInput,
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
    const validatedData = createProductSchema.parse(input);

    // 3. 이미지 데이터 분리 및 가격 변환
    const { images, price, ...productData } = validatedData;

    // 문자열 가격을 숫자로 변환
    const processedData = {
      ...productData,
      price: parseFloat(price).toFixed(2),
    };

    // 4. SKU/바코드 자동 생성 (패턴 A)
    let prefix = 'GEN';
    if (validatedData.categoryId) {
      const cat = await db.query.productCategories.findFirst({
        where: eq(productCategories.id, validatedData.categoryId),
      });
      if (cat?.name) prefix = toCodePrefix(cat.name);
    } else if (validatedData.name) {
      prefix = toCodePrefix(validatedData.name);
    }

    // 고유성 보장 시도 (최대 5회)
    let sku = '';
    let barcode = '';
    for (let i = 0; i < 5; i++) {
      const candidateSku = generateSku(prefix);
      const candidateBarcode = generateEan13();
      const [skuExists] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.sku, candidateSku));
      const [barcodeExists] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.barcode, candidateBarcode));
      if (!skuExists && !barcodeExists) {
        sku = candidateSku;
        barcode = candidateBarcode;
        break;
      }
    }
    if (!sku || !barcode) {
      return {
        success: false,
        error: '식별자 생성 실패: 잠시 후 다시 시도해 주세요',
      };
    }

    // 5. 트랜잭션으로 상품 및 이미지 저장
    const result = await db.transaction(async (tx) => {
      // 상품 생성
      const [newProduct] = await tx
        .insert(products)
        .values({
          ...processedData,
          sku,
          barcode,
          publishedAt:
            validatedData.isPublished && validatedData.status === 'active' ? new Date() : null,
        })
        .returning({ id: products.id });

      // 이미지가 있으면 저장
      if (images && images.length > 0) {
        await tx.insert(productImages).values(
          images.map((img, index) => ({
            productId: newProduct.id,
            url: img.url,
            altText: img.altText,
            position: img.position ?? index,
          })),
        );
      }

      return newProduct;
    });

    // 6. 캐시 재검증
    revalidatePath('/admin/products');
    // 스토어프론트 홈 페이지 갱신
    revalidatePath('/');

    return {
      success: true,
      data: { id: result.id },
    };
  } catch (error) {
    console.error('상품 등록 실패:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '상품 등록 중 오류가 발생했습니다',
    };
  }
}

/**
 * 상품 수정 서버 액션
 */
export async function updateProduct(
  input: UpdateProductInput,
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
    const validatedData = updateProductSchema.parse(input);
    const { id, images, ...productData } = validatedData;

    // 3. 트랜잭션으로 상품 및 이미지 업데이트
    await db.transaction(async (tx) => {
      // 상품 업데이트
      // SKU/바코드는 서버 자동 부여 항목이므로 업데이트에서 제외
      const { sku: _sku, barcode: _barcode, ...rest } = productData as any;

      await tx
        .update(products)
        .set({
          ...rest,
          publishedAt:
            validatedData.isPublished && validatedData.status === 'active' ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id));

      // 기존 이미지 삭제 후 새로 추가
      if (images && images.length > 0) {
        await tx.delete(productImages).where(eq(productImages.productId, id));

        await tx.insert(productImages).values(
          images.map((img, index) => ({
            productId: id,
            url: img.url,
            altText: img.altText,
            position: img.position ?? index,
          })),
        );
      }
    });

    // 4. 캐시 재검증
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    // 스토어프론트 홈 페이지 갱신
    revalidatePath('/');
    // 스토어프론트 상세 페이지 갱신
    revalidatePath(`/products/${id}`);

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    console.error('상품 수정 실패:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '상품 수정 중 오류가 발생했습니다',
    };
  }
}

/**
 * 상품 삭제 서버 액션
 */
export async function deleteProduct(productId: string): Promise<ActionResult<void>> {
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

    // 2. 상품 삭제 (cascade로 이미지도 자동 삭제됨)
    await db.delete(products).where(eq(products.id, productId));

    // 3. 캐시 재검증
    revalidatePath('/admin/products');
    // 스토어프론트 홈 페이지 갱신
    revalidatePath('/');

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('상품 삭제 실패:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '상품 삭제 중 오류가 발생했습니다',
    };
  }
}

/**
 * 상품 상태 변경 서버 액션
 */
export async function toggleProductStatus(
  productId: string,
  isPublished: boolean,
): Promise<ActionResult<void>> {
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

    // 2. 상태 업데이트
    await db
      .update(products)
      .set({
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // 3. 캐시 재검증
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}`);
    // 스토어프론트 홈 페이지 갱신
    revalidatePath('/');
    // 스토어프론트 상세 페이지 갱신
    revalidatePath(`/products/${productId}`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('상품 상태 변경 실패:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '상품 상태 변경 중 오류가 발생했습니다',
    };
  }
}

type UploadResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string };

/**
 * 상품 이미지 업로드 서버 액션
 */
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
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

    // 2. 파일 추출
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: '파일이 없습니다' };
    }

    // 3. 파일 검증
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: '파일 크기는 5MB를 초과할 수 없습니다' };
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: '지원하지 않는 파일 형식입니다 (JPG, PNG, WebP만 가능)',
      };
    }

    // 4. 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomStr}.${extension}`;
    const filePath = `products/${fileName}`;

    // 5. Supabase Storage에 업로드
    const { data, error } = await supabase.storage.from('product-images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('이미지 업로드 실패:', error);
      return {
        success: false,
        error: `업로드 실패: ${error.message}`,
      };
    }

    // 6. 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('이미지 업로드 오류:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '이미지 업로드 중 오류가 발생했습니다',
    };
  }
}

/**
 * 상품 이미지 삭제 서버 액션
 */
export async function deleteProductImage(
  filePath: string,
): Promise<{ success: boolean; error?: string }> {
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

    // 2. Supabase Storage에서 삭제
    const { error } = await supabase.storage.from('product-images').remove([filePath]);

    if (error) {
      console.error('이미지 삭제 실패:', error);
      return {
        success: false,
        error: `삭제 실패: ${error.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('이미지 삭제 오류:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: '이미지 삭제 중 오류가 발생했습니다',
    };
  }
}
