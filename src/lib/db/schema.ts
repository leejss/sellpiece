import {
  pgTable,
  serial,
  text,
  varchar,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  // Supabase Auth user id (uuid)
  authUserId: uuid("auth_user_id").notNull().unique(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

// Admin 전용 테이블 (일반 이커머스 관리자 모델)
// 로그인은 Supabase Auth의 email/password를 사용하고,
// 이 테이블은 관리자 메타데이터/활성 상태를 관리합니다.
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 120 }),
  role: varchar("role", { length: 32 }).$defaultFn(() => "admin"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
