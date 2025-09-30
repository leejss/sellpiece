import {
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  authUserId: uuid("auth_user_id").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 120 }),
  role: varchar("role", { length: 32 }).$defaultFn(() => "manager"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
