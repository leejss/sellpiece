'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/actions/admin/auth';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 font-mono">
      <div className="w-full max-w-sm">
        <h1 className="typ-meta mb-8 text-center text-neutral-900">Admin</h1>
        <form action={formAction} className="space-y-5">
          <div>
            <label htmlFor="email" className="typ-meta mb-2 block text-neutral-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="block w-full rounded-none border border-neutral-300 bg-white px-3 py-3 text-[14px] placeholder:text-neutral-400 focus:border-black focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="typ-meta mb-2 block text-neutral-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="block w-full rounded-none border border-neutral-300 bg-white px-3 py-3 text-[14px] placeholder:text-neutral-400 focus:border-black focus:outline-none"
              required
            />
          </div>
          {state.error && <p className="typ-caption text-red-500">{state.error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="typ-cta w-full rounded-none border border-black bg-black py-3 text-white uppercase transition-colors duration-200 hover:bg-white hover:text-black disabled:opacity-60"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
