"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LoginState = {
  error?: string;
};

async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  return {};
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    async (prevState, formData) => {
      const nextState = await loginAction(prevState, formData);
      if (!nextState.error) {
        router.push("/admin");
        router.refresh();
      }
      return nextState;
    },
    {},
  );

  return (
    <div className="mx-auto mt-12 w-full max-w-sm">
      <h1 className="mb-6 text-2xl font-semibold">Admin Login</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-60"
        >
          {isPending ? "로그인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}
