type AuthMode = "login" | "signup";

type AuthState = {
  error?: string;
};

type AuthFormProps<T extends AuthState> = {
  mode: AuthMode;
  state: T;
  action: (payload: FormData) => void;
  isPending: boolean;
};

const AUTH_CONFIG = {
  login: {
    title: "SIGN IN",
    submitText: "SIGN IN",
    submitPendingText: "SIGNING IN...",
    footerText: "DON'T HAVE AN ACCOUNT?",
    footerLinkText: "SIGN UP",
    footerLinkHref: "/signup",
    showConfirmPassword: false,
    passwordAutoComplete: "current-password",
  },
  signup: {
    title: "CREATE ACCOUNT",
    submitText: "CREATE ACCOUNT",
    submitPendingText: "CREATING ACCOUNT...",
    footerText: "ALREADY HAVE AN ACCOUNT?",
    footerLinkText: "SIGN IN",
    footerLinkHref: "/login",
    showConfirmPassword: true,
    passwordAutoComplete: "new-password",
  },
} as const;

export function AuthForm<T extends AuthState>({
  mode,
  state,
  action,
  isPending,
}: AuthFormProps<T>) {
  const config = AUTH_CONFIG[mode];

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        {/* Auth Form */}
        <form action={action} className="space-y-6">
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
              autoComplete={config.passwordAutoComplete}
              required
              className="w-full border border-black bg-white px-4 py-3 font-mono text-sm text-black transition-colors placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password Field (Signup only) */}
          {config.showConfirmPassword && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block font-mono text-xs uppercase tracking-wider text-black"
              >
                CONFIRM PASSWORD
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full border border-black bg-white px-4 py-3 font-mono text-sm text-black transition-colors placeholder:text-gray-400 focus:bg-gray-50 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          )}

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
            className="w-full border border-black bg-white px-4 py-3 font-mono text-sm uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
          >
            {isPending ? config.submitPendingText : config.submitText}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-gray-600">
            {config.footerText}{" "}
            <a
              href={config.footerLinkHref}
              className="text-black underline hover:no-underline"
            >
              {config.footerLinkText}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
