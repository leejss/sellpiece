"use server";

// TODO: 실제 구현 시 세션/사용자 식별, 재고/가격 검증, cart 테이블 upsert 등을 수행하세요.
export async function addToCart(formData: FormData): Promise<void> {
  const productId = formData.get("productId");
  const size = formData.get("size");
  const quantity = Number(formData.get("quantity") ?? 1);

  // 임시 로깅 (서버 콘솔)
  console.log("[addToCart]", { productId, size, quantity });
  // TODO: DB 처리 후 리디렉트나 revalidateTag 등 추가
  return;
}
