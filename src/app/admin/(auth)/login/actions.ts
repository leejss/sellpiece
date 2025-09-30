"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/isAdmin";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해주세요." };
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

  // 로그인 성공 후, 관리자 여부를 확인 (admins.user_id & is_active)
  const user = data.user;
  if (!user) {
    console.error("User not found");
    return { error: "유저 정보를 불러오지 못했습니다." };
  }

  const userId = user.id;

  const allowed = await isAdmin(supabase, userId);
  if (!allowed) {
    await supabase.auth.signOut();
    return { error: "관리자 권한이 없습니다." };
  }

  // 관리자인 경우, last_login_at 갱신 및 user_metadata.role=admin 설정(UX용)
  const { error: updateError } = await supabase
    .from("admins")
    .update({ last_login_at: new Date().toISOString() })
    .eq("auth_user_id", userId);

  if (updateError) {
    console.error("Failed to update last_login_at:", updateError);
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { role: "admin" },
  });

  if (metadataError) {
    console.error("Failed to update user metadata:", metadataError);
  }

  redirect("/admin");
}
