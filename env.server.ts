import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ADMIN_PROVISION_SECRET: z.string().min(1),
});

const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_PROVISION_SECRET: process.env.ADMIN_PROVISION_SECRET,
};

const parsed = serverEnvSchema.safeParse(serverEnv);
if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables[server]",
    parsed.error.flatten(),
  );
  throw new Error("Invalid server environment variables");
}

export const env = parsed.data;
