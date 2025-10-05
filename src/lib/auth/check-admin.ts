import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * DB 조회로 정확한 관리자 체크
 * 서버 액션이나 API 라우트에서 사용
 */
export async function isAdminFromDB(userId: string): Promise<boolean> {
  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.id, userId),
      columns: {
        isActive: true,
      },
    });

    return admin?.isActive === true;
  } catch {
    return false;
  }
}

/**
 * 관리자 상세 정보 조회
 * 역할, 권한 등 추가 정보가 필요할 때 사용
 */
export async function getAdminInfo(userId: string) {
  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.id, userId),
    });

    return admin;
  } catch {
    return null;
  }
}

/**
 * 관리자 권한 확인 (throw 버전)
 * 권한이 없으면 에러를 던짐
 */
export async function requireAdmin(userId: string): Promise<void> {
  const isAdmin = await isAdminFromDB(userId);
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
}
