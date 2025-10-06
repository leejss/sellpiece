"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        {/* Logo/Title */}
        <div className="mb-12 text-center">
          <h1 className="font-mono text-2xl font-bold uppercase tracking-wider text-black">
            SELLPIECE
          </h1>
        </div>

        {/* Login Form */}
        <form action={formAction} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-mono text-xs uppercase tracking-wider text-black"
            >
              EMAIL
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border border-black bg-white px-4 py-3 font-mono text-sm text-black transition-colors placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-mono text-xs uppercase tracking-wider text-black"
            >
              PASSWORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full border border-black bg-white px-4 py-3 font-mono text-sm text-black transition-colors placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="border border-black bg-black px-4 py-3">
              <p className="font-mono text-xs text-white">{state.error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full border border-black bg-black px-4 py-3 font-mono text-sm uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
          >
            {isPending ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-gray-600">
            DON&apos;T HAVE AN ACCOUNT?{" "}
            <a
              href="/signup"
              className="text-black underline hover:no-underline"
            >
              SIGN UP
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
