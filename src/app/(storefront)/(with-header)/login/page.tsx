'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/actions/auth';
import { AuthForm } from '@/components/storefront/auth-form';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(loginAction, {});

  return <AuthForm mode="login" state={state} action={formAction} isPending={isPending} />;
}
