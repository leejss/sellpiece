import type { SupabaseClient } from '@supabase/supabase-js';
import { adminAuthService } from '@/lib/services/admin/admin-auth.service';

/**
 * Supabase 세션과 함께 사용되지만, 관리자 여부 판별은 공용 서비스에 위임한다.
 * Supabase 인스턴스는 향후 세션 검증/캐싱에 활용할 수 있도록 인자로 유지한다.
 */
export async function isAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  void supabase;
  return adminAuthService.isActiveAdmin(userId);
}
