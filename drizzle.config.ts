import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts", // 스키마 파일 경로
  dialect: "postgresql",
  out: "./drizzle", // 마이그레이션 내보내기 디렉토리
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Supabase Postgres 연결 문자열 필요
  },
} satisfies Config;
