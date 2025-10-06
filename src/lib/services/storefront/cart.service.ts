import { findOrCreateUserCart } from "@/lib/db/queries/storefront/cart";

export async function getOrCreateUserCart(userId: string) {
  try {
    const result = await findOrCreateUserCart(userId);
    return result;
  } catch (error) {
    console.error("Error:getOrCreateUserCart", error);
    // TODO: throw a custom error
    throw error;
  }
}
