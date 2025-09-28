import { z, prettifyError } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET_KEY: process.env.SECRET_KEY,
};

export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

const _serverEnv = serverEnvSchema.safeParse(serverEnv);
const _clientEnv = clientEnvSchema.safeParse(clientEnv);

if (!_serverEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    prettifyError(_serverEnv.error),
  );
  throw new Error("Invalid environment variables");
}

if (!_clientEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    prettifyError(_clientEnv.error),
  );
  throw new Error("Invalid environment variables");
}
export const env = {
  ..._serverEnv.data,
  ..._clientEnv.data,
};
