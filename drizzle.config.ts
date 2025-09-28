import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts", // 스키마 파일 경로
  dialect: "postgresql",
} satisfies Config;
