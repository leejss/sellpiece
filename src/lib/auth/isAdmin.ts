import type { SupabaseClient } from '@supabase/supabase-js';

export async function isAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admins')
    .select('auth_user_id, is_active')
    .eq('auth_user_id', userId)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('isAdmin query failed:', error);
    return false;
  }

  return !!data;
}
