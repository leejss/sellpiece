import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@env";
import * as schema from "./schema";

declare global {
  var client: postgres.Sql | undefined;
}

let client: postgres.Sql | undefined;

// Disable prefetch as it is not supported for "Transaction" pool mode

if (process.env.NODE_ENV === "production") {
  client = postgres(env.DATABASE_URL, { prepare: false });
} else {
  if (!global.client) {
    global.client = postgres(env.DATABASE_URL, { prepare: false });
  }
  client = global.client;
}

export const db = drizzle(client, { schema });
