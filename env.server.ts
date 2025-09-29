import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  // 필요한 경우 서버 전용 키를 여기에 추가하세요. 예: SECRET_KEY: z.string().min(1),
});

const serverEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  // SECRET_KEY: process.env.SECRET_KEY,
};

const parsed = serverEnvSchema.safeParse(serverEnv);
if (!parsed.success) {
  console.error("❌ Invalid environment variables[server]", parsed.error.flatten());
  throw new Error("Invalid server environment variables");
}

export const env = parsed.data;
