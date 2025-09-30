"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/check-admin";

type UploadResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string };

/**
 * 상품 이미지 업로드 서버 액션
 */
export async function uploadProductImage(
  formData: FormData
): Promise<UploadResult> {
  try {
    // 1. 관리자 권한 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "인증이 필요합니다" };
    }

    await requireAdmin(user.id);

    // 2. 파일 추출
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "파일이 없습니다" };
    }

    // 3. 파일 검증
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: "파일 크기는 5MB를 초과할 수 없습니다" };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "지원하지 않는 파일 형식입니다 (JPG, PNG, WebP만 가능)",
      };
    }

    // 4. 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomStr}.${extension}`;
    const filePath = `products/${fileName}`;

    // 5. Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("이미지 업로드 실패:", error);
      return {
        success: false,
        error: `업로드 실패: ${error.message}`,
      };
    }

    // 6. 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("이미지 업로드 오류:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "이미지 업로드 중 오류가 발생했습니다",
    };
  }
}

/**
 * 상품 이미지 삭제 서버 액션
 */
export async function deleteProductImage(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. 관리자 권한 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "인증이 필요합니다" };
    }

    await requireAdmin(user.id);

    // 2. Supabase Storage에서 삭제
    const { error } = await supabase.storage
      .from("product-images")
      .remove([filePath]);

    if (error) {
      console.error("이미지 삭제 실패:", error);
      return {
        success: false,
        error: `삭제 실패: ${error.message}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("이미지 삭제 오류:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "이미지 삭제 중 오류가 발생했습니다",
    };
  }
}
