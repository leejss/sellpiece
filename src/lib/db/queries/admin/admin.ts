import { db } from '@/lib/db';
import { admins } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export type AdminRecord = typeof admins.$inferSelect;

export type AdminIdentifier = {
  id: string;
};

const activeAdminCondition = (adminId: string) =>
  and(eq(admins.id, adminId), eq(admins.isActive, true));

export async function findAdminById(adminId: string): Promise<AdminRecord | null> {
  try {
    const admin = await db.query.admins.findFirst({
      where: eq(admins.id, adminId),
    });

    return admin ?? null;
  } catch (error) {
    console.error('findAdminById failed', { adminId, error });
    return null;
  }
}

export async function findActiveAdminById(adminId: string): Promise<AdminRecord | null> {
  try {
    const admin = await db.query.admins.findFirst({
      where: activeAdminCondition(adminId),
    });

    return admin ?? null;
  } catch (error) {
    console.error('findActiveAdminById failed', { adminId, error });
    return null;
  }
}

export async function updateAdminLastLoginAt(
  adminId: string,
  lastLoginAt: Date = new Date(),
): Promise<void> {
  try {
    await db
      .update(admins)
      .set({
        lastLoginAt,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, adminId));
  } catch (error) {
    console.error('updateAdminLastLoginAt failed', { adminId, error });
  }
}
