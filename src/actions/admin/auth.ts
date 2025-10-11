'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { adminAuthService } from '@/lib/services/admin/admin-auth.service';

export type LoginState = {
  error?: string;
};

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' };
  }

  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  const user = data.user;
  if (!user) {
    console.error('User not found');
    return { error: '유저 정보를 불러오지 못했습니다.' };
  }

  const userId = user.id;
  const allowed = await adminAuthService.isActiveAdmin(userId);
  if (!allowed) {
    await supabase.auth.signOut();
    return { error: '관리자 권한이 없습니다.' };
  }

  await adminAuthService.recordAdminLogin(userId);

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { role: 'admin' },
  });

  if (metadataError) {
    console.error('Failed to update user metadata:', metadataError);
  }

  redirect('/admin');
}
