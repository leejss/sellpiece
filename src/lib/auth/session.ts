import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export async function getCurrentUserId() {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  return user?.id ?? null;
}

export async function requireUserId() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  return userId;
}
