"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error?: string;
};

export type SignupState = {
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return { error: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요." };
  }

  redirect("/");
}

export async function signupAction(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  if (!email || !password || !confirmPassword) {
    return { error: "모든 필드를 입력해주세요." };
  }

  if (password !== confirmPassword) {
    return { error: "비밀번호가 일치하지 않습니다." };
  }

  if (password.length < 6) {
    return { error: "비밀번호는 최소 6자 이상이어야 합니다." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return { error: "회원가입에 실패했습니다. 다시 시도해주세요." };
  }

  redirect("/login");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
