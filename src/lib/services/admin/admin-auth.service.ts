import type { AdminRecord } from '@/lib/db/queries/admin/admin';
import {
  findAdminById,
  findActiveAdminById,
  updateAdminLastLoginAt,
} from '@/lib/db/queries/admin/admin';

type AdminRepository = {
  findById(adminId: string): Promise<AdminRecord | null>;
  findActiveById(adminId: string): Promise<AdminRecord | null>;
  touchLastLogin(adminId: string, lastLoginAt?: Date): Promise<void>;
};

const defaultRepository: AdminRepository = {
  findById: findAdminById,
  findActiveById: findActiveAdminById,
  touchLastLogin: updateAdminLastLoginAt,
};

export type AdminAuthService = {
  isActiveAdmin(adminId: string): Promise<boolean>;
  requireActiveAdmin(adminId: string): Promise<AdminRecord>;
  getAdminProfile(adminId: string): Promise<AdminRecord | null>;
  recordAdminLogin(adminId: string, at?: Date): Promise<void>;
};

export function createAdminAuthService(
  repository: AdminRepository = defaultRepository,
): AdminAuthService {
  return {
    async isActiveAdmin(adminId) {
      const admin = await repository.findActiveById(adminId);
      return admin?.isActive === true;
    },

    async requireActiveAdmin(adminId) {
      const admin = await repository.findActiveById(adminId);
      if (!admin) {
        throw new Error('Unauthorized: Admin access required');
      }
      return admin;
    },

    async getAdminProfile(adminId) {
      return repository.findById(adminId);
    },

    async recordAdminLogin(adminId, at = new Date()) {
      await repository.touchLastLogin(adminId, at);
    },
  };
}

export const adminAuthService = createAdminAuthService();
