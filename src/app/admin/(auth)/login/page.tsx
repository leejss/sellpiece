"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
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
