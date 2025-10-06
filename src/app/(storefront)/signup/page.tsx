"use client";

import { useActionState } from "react";
import { signupAction, type SignupState } from "@/actions/auth";
import { AuthForm } from "@/components/storefront/auth-form";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    signupAction,
    {},
  );

  return (
    <AuthForm
      mode="signup"
      state={state}
      action={formAction}
      isPending={isPending}
    />
  );
}
